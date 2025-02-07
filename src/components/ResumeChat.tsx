import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Loader2, MinusCircle, Bot } from 'lucide-react';
import { generateChatResponse } from '../services/gemini';
import type { ResumeAnalysis } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResumeChatProps {
  analysis: ResumeAnalysis;
}

export function ResumeChat({ analysis }: ResumeChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateChatResponse(userMessage, analysis, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an error. Please try asking your question again.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResizeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    setInput(textarea.value);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        style={{ 
          display: isOpen ? 'none' : 'block',
          zIndex: 9999
        }}
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              height: isMinimized ? '60px' : '85vh'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed right-6 w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200"
            style={{ 
              zIndex: 9999,
              bottom: '24px',
              maxHeight: 'calc(100vh - 48px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className="sticky top-0 p-4 bg-white flex items-center justify-between flex-shrink-0 z-50 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-neutral-900">
                  Resume Assistant {isMinimized && "(Minimized)"}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  <MinusCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-neutral-600 hover:text-red-600"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Chat Messages Container */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-neutral-50"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#CBD5E1 #F1F5F9'
                    }}
                  >
                    {messages.length === 0 && (
                      <div className="text-center text-neutral-600 mt-4 bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                        <Bot className="h-8 w-8 mx-auto mb-3 text-primary-600" />
                        <p className="font-medium mb-4 text-neutral-800">
                          Hi! I'm your Resume Assistant. Ask me anything about your resume analysis!
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-neutral-700">Try asking:</p>
                          {[
                            "How can I improve my skills section?",
                            "What are my strongest qualifications?",
                            "Can you suggest better action verbs?",
                            "What skills am I missing for this role?"
                          ].map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setInput(suggestion);
                                inputRef.current?.focus();
                              }}
                              className="block w-full p-2 text-left hover:bg-neutral-100 rounded-lg transition-colors duration-200 text-neutral-700"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                            message.role === 'user'
                              ? 'bg-primary-100 text-neutral-800 ml-4'
                              : 'bg-white border border-neutral-200 text-neutral-800 mr-4'
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
                          <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form 
                    onSubmit={handleSubmit} 
                    className="sticky bottom-0 p-4 bg-white border-t border-neutral-200 flex-shrink-0"
                  >
                    <div className="flex items-end space-x-2">
                      <div className="flex-1 relative">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={autoResizeTextArea}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-neutral-800"
                          style={{
                            minHeight: '44px',
                            maxHeight: '120px'
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}