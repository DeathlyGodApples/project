# Resume Analyser

Resume Analyser is a tool that helps in analyzing resumes to extract meaningful information and provide insights. It leverages LLMs (Gemini API) to parse and understand the content of resumes, making it easier to assess and compare candidates.

## How It Works

1. **Upload Resumes**: Users can upload resumes in a PDF format only.
2. **Parsing and Analyzing**: The tool parses the resumes using the gemini API to extract key information such as contact details, work experience, education, skills, and more.
3. **Insights and Comparisons**: It provides insights and allows for comparisons between different candidates based on the extracted information.

## Prerequisites

- Node.js (version 14 or above)
- npm (version 6 or above)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DeathlyGodApples/Resume-Analyser.git
   cd Resume-Analyser

2. Install the dependencies:
   ```bash
   npm install

3. Create a .env file in the root directory and add your Gemini API Key:
   	```env
    VITE_GEMINI_API_KEY = *your API key*

4. Start the application:
   ```bash
   npm run dev


