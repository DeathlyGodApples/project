import { GoogleGenerativeAI } from '@google/generative-ai';
import { pdfjs } from 'react-pdf';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { jsonrepair } from 'jsonrepair';
import type { ResumeAnalysis, SectionFeedback, CareerPath, Highlight } from '../types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
];

const PROMPT_TEMPLATE = `
You are a strategic resume optimization expert, skilled in both Applicant Tracking Systems (ATS) and human recruiter perspectives. Your goal is to analyze a resume for a {JOB_TITLE} position at {COMPANY} and provide feedback that maximizes its chances of success with both ATS and human reviewers.

Required experience level: {JOB_LEVEL}

Job Description:
{JOB_DESCRIPTION}

Provide a detailed analysis in JSON format with:

1. Scoring (based on concrete ATS metrics):
- originalScore: 0-100 (calculated based on: 
      - Keyword Match (50% weight): Exact and related keyword presence and density from job description.
      - Format Compliance (30% weight): Adherence to ATS-friendly formatting (section headers, bullet points, file type, etc.).
      - Content Relevance & Impact (20% weight):  Relevance of experience to job duties and quantifiable achievements mentioned in resume sections.))
      
- optimizedScore: 0-100 (projected score after implementing all suggestions)

2. Section-by-Section Analysis:
- sectionFeedback: [{
  section: string (e.g., "Professional Experience", "Skills", etc.)
  matches: string[] (list of strong matches with job requirements)
  misses: string[] (list of missing or weak elements)
  suggestions: string (including suggestions to add quantifiable achievements and stronger action verbs)
  sources: string[] (explanation of ATS principle or best practice behind the suggestion)
}]

3. Skills Gap Analysis:
- missingSkills: [{
    skill: string
    category: "Technical" | "Soft Skill" | "Industry Specific" | "Other"
    priority: "High" | "Medium" | "Low" (based on job description emphasis)
    reason: string (why this skill is important for the job)
  }]

4. Career Trajectory:
- careerPaths: [{
  title: string (specific role title)
  description: string (role overview and alignment with candidate's background)
  requiredSkills: string[] (key skills needed)
  potentialEmployers: string[] (companies known for these roles)
}]

5. Optimized Content:
- optimizedResume: string (complete resume text with all improvements applied)
- highlights: [{
  type: "removed" | "modified" | "retained"
  content: string (exact text from original resume)
  reason: string (specific reason for change/approval)
  requirement: string (related job requirement)
  impact: string (how this affects ATS scoring)
  recommendations?: string (specific improvement suggestions)
}]

Format requirements:
- Use Markdown for optimizedResume with proper headers (##), bullet points (*), and sections
- Escape special characters properly
- Maintain consistent JSON structure
- Include concrete examples from the resume
- Reference specific job requirements in suggestions
`.trim();

async function extractPDFText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  if (pdf.numPages > 50) {
    throw new Error('PDF exceeds 50 page limit');
  }

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => ('str' in item) ? item.str : '').join(' ') + '\n';
  }
  return text;
}

function deepGet(obj: any, paths: (string | string[])[]): any {
  for (const path of paths) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    if (value !== undefined) return value;
  }
  return undefined;
}

export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobLevel: string,
  company: string,
  jobDescription: string
): Promise<ResumeAnalysis> {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing VITE_GEMINI_KEY environment variable');
    }

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.45,
        topP: 0.84,
        topK: 72,
        maxOutputTokens: 12000
      }
    });

    const resumeText = await extractPDFText(file);
    const prompt = PROMPT_TEMPLATE
      .replace('{JOB_TITLE}', jobTitle)
      .replace('{JOB_LEVEL}', jobLevel)
      .replace('{COMPANY}', company)
      .replace('{JOB_DESCRIPTION}', jobDescription);

    try {
      const result = await model.generateContent(prompt + '\n\nResume Content:\n' + resumeText);
      const response = await result.response;
      const rawText = response.text();

      let parsedResponse;
      try {
        // First, clean up the raw text to remove any markdown or code block markers
        let cleanedText = rawText
          .replace(/```json\s*/g, '')     // Remove JSON code block start
          .replace(/```\s*/g, '')         // Remove code block end
          .replace(/^JSON:\s*/gim, '')    // Remove "JSON:" prefix
          .replace(/`/g, '')              // Remove any remaining backticks
          .replace(/\n/g, ' ')            // Replace newlines with spaces
          .replace(/\r/g, '')             // Remove carriage returns
          .replace(/\t/g, ' ')            // Replace tabs with spaces
          .replace(/\s+/g, ' ')           // Collapse multiple spaces
          .trim();                        // Trim whitespace

        // Try to find JSON content between curly braces
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }

        // Additional character replacements
        cleanedText = cleanedText
          .replace(/\\+'(?=\w)/g, "'")    // Fix escaped single quotes
          .replace(/\u2022/g, '•')        // Replace bullet points
          .replace(/\u2013|\u2014/g, '-') // Replace em/en dashes
          .replace(/[\u201C\u201D]/g, '"') // Replace curly quotes
          .replace(/[\u2018\u2019]/g, "'"); // Replace curly single quotes

        try {
          // First try direct parsing
          parsedResponse = JSON.parse(cleanedText);
        } catch (directParseError) {
          // If direct parsing fails, try with jsonrepair
          try {
            parsedResponse = JSON.parse(jsonrepair(cleanedText));
          } catch (repairError) {
            console.error('JSON repair failed:', repairError);
            console.log('Raw response:', rawText);
            throw new Error('Failed to parse API response after repair attempt');
          }
        }
      } catch (parseError) {
        console.error('JSON parsing failed. Raw text:', rawText);
        throw new Error(`Response parsing failed: ${(parseError as Error).message}`);
      }

      const transformedAnalysis: ResumeAnalysis = {
        originalScore: Math.min(100, Math.max(0,
          deepGet(parsedResponse, ['scoring.originalScore', 'originalScore']) || 0
        )),
        optimizedScore: Math.min(100, Math.max(0,
          deepGet(parsedResponse, ['scoring.optimizedScore', 'optimizedScore']) || 0
        )),
        sectionFeedback: [
          ...(deepGet(parsedResponse, ['sectionFeedback', 'sectionBySectionAnalysis', 'sections']) || []),
          ...(Array.isArray(parsedResponse.analysis) ? parsedResponse.analysis : [])
        ].map((section: any) => ({
          section: section.section || 'General Feedback',
          matches: section.matches || section.strongPoints || [],
          misses: section.misses || section.weakPoints || [],
          suggestions: [section.suggestions].flat()
            .filter(Boolean)
            .join('\n') || 'No specific suggestions provided',
          sources: section.sources || ['ATS Analysis Standards']
        })),
        missingSkills: [
          ...new Set([
            ...(deepGet(parsedResponse, ['skillsGapAnalysis', 'missingSkills', 'skillGaps']) || []),
            ...(parsedResponse.improvementAreas || [])
          ])
        ],
        careerPaths: (deepGet(parsedResponse, ['careerPaths', 'careerOptions']) || []).map((path: any) => ({
          title: path.title || 'Recommended Career Path',
          description: path.description || '',
          requiredSkills: path.requiredSkills || path.skills || [],
          potentialEmployers: path.potentialEmployers || path.companies || []
        })),
        optimizedResume: [
          deepGet(parsedResponse, ['optimizedResume', 'optimizedContent.optimizedResume']),
          parsedResponse.enhancedResume,
          parsedResponse.improvedContent,
          resumeText
        ].find(t => typeof t === 'string' && t.trim()) || '',
        highlights: (deepGet(parsedResponse, ['highlights', 'optimizedContent.highlights']) || []).map((hl: any) => {
          const content = hl.content || '';
          const escapedContent = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

          return {
            type: hl.changeType === 'remove' ? 'removed' : 
                  hl.changeType === 'modify' ? 'modified' : 'retained',
            content: escapedContent,
            reason: hl.reason?.replace(/"/g, '&quot;') || 'Improvement suggestion',
            requirement: hl.relatedRequirement?.replace(/"/g, '&quot;') || 'Job requirement alignment',
            impact: hl.expectedImpact?.replace(/"/g, '&quot;') || 'Improved hiring potential',
            recommendations: hl.suggestions?.replace(/"/g, '&quot;') || (hl.changeType === 'modify' ? 
              'Consider rephrasing for clarity and impact' : undefined)
          };
        }),
        originalText: resumeText
      };

      if (!transformedAnalysis.optimizedResume.trim()) {
        transformedAnalysis.optimizedResume = resumeText;
        console.warn('Using original resume as optimized version was missing');
      }

      if (transformedAnalysis.sectionFeedback.length === 0) {
        transformedAnalysis.sectionFeedback.push({
          section: 'System Generated Feedback',
          matches: ['Basic resume structure detected'],
          misses: ['Detailed analysis unavailable'],
          suggestions: 'The analysis system encountered limitations processing this resume. ' +
                     'Please verify:\n1. Resume text is selectable\n2. Proper section headers\n3. Relevant content',
          sources: ['Analysis System']
        });
      }

      transformedAnalysis.optimizedResume = DOMPurify.sanitize(
        marked.parse(transformedAnalysis.optimizedResume, {
          breaks: true,
          gfm: true,
          headerIds: false,
          silent: true
        }),
        { ALLOWED_TAGS: ['p', 'span', 'ul', 'ol', 'li', 'strong', 'em', 'h1', 'h2', 'h3', 'br'] }
      );

      return {
        ...transformedAnalysis,
        _groundingMetadata: {
          queries: response.candidates?.[0].groundingMetadata?.webSearchQueries,
          sources: response.candidates?.[0].groundingMetadata?.retrievalResults?.map(r => r.document?.uri)
        }
      };

    } catch (error) {
      console.error('Analysis pipeline error:', error);
      let message = 'Analysis failed: ';
      if (error instanceof Error) {
        message += error.message;
        if (message.includes('429')) message = 'API request limit exceeded - please try again later';
        if (message.includes('500')) message = 'Internal server error - please try a smaller document';
        if (message.includes('blocked')) message = 'Content blocked by safety filters';
        if (message.includes('parse')) message = 'Failed to parse analysis response';
      }
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Add chat function
export async function generateChatResponse(
  userMessage: string,
  analysis: ResumeAnalysis,
  previousMessages: { role: string; content: string }[]
): Promise<string> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Missing VITE_GEMINI_KEY environment variable');
  }

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro-latest',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8000
    }
  });

  const context = `
You are an expert resume consultant with deep knowledge of ATS systems and hiring practices. You have analyzed this resume and provided feedback. Here's the context:

Original Score: ${analysis.originalScore}
Optimized Score: ${analysis.optimizedScore}

Section Feedback:
${analysis.sectionFeedback.map(section => `
${section.section}:
- Strengths: ${section.matches.join(', ')}
- Areas for Improvement: ${section.misses.join(', ')}
- Suggestions: ${section.suggestions}
`).join('\n')}

Missing Skills:
${analysis.missingSkills.join(', ')}

Previous conversation context:
${previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user message: ${userMessage}

Provide a helpful, specific response that:
1. Directly addresses the user's question
2. References relevant parts of the analysis
3. Gives actionable, specific advice
4. Uses a professional but friendly tone
5. Keeps responses concise but informative
6. Includes specific examples where appropriate

Remember to:
- Stay focused on resume improvement
- Provide evidence-based recommendations
- Be encouraging while honest
- Suggest specific changes when relevant
`.trim();

  try {
    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat generation error:', error);
    throw new Error('Failed to generate chat response');
  }
}