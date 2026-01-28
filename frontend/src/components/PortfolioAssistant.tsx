'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Gopal's Portfolio Assistant. How can I help you?",
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'What projects have you worked on recently?',
    'What technologies do you specialize in?',
    "Can you summarize your work experience?",
    'How can I contact you for work?',
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'What projects have you worked on recently?':
          'I\'ve recently worked on several exciting projects including full-stack web applications, mobile apps, and AI-powered tools. Check out my portfolio for detailed case studies!',
        'What technologies do you specialize in?':
          'I specialize in MERN stack (MongoDB, Express, React, Node.js), TypeScript, Next.js, Tailwind CSS, and various modern web technologies. I also have experience with AI/ML and emerging tech.',
        "Can you summarize your work experience?":
          'I\'m a full-stack developer with expertise in building scalable web applications. I focus on clean code, performance optimization, and user experience.',
        'How can I contact you for work?':
          'You can reach me via email at gopalchouhan0310@gmail.com, LinkedIn, or GitHub. Feel free to check out my social links in the hero section!',
      };

      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: responses[question] || 'Great question! Feel free to explore my portfolio for more details.',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: "Thanks for your message! I'm here to help answer questions about Gopal's work and experience. Feel free to ask anything!",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 flex items-center justify-center text-white bg-blue-500 rounded-full shadow-2xl w-14 h-14 bottom-6 right-6 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label="Toggle portfolio assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-[60] flex flex-col w-[480px] max-w-[calc(100vw-32px)] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 shadow-2xl h-[480px]"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-slate-700 bg-slate-800/30">
              <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden border-2 border-green-500 rounded-full">
                <Image
                  src="/Logo.png"
                  alt="Gopal's Assistant"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Gopal's Assistant</h3>
                <p className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <span className="block mt-1 text-xs opacity-60">{message.timestamp}</span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.filter((m) => m.sender === 'user').length <= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-3 border-t border-slate-700 bg-slate-800/30"
              >
                <p className="mb-2 text-xs font-medium text-gray-400">Quick questions:</p>
                <div className="space-y-2">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full px-3 py-2 text-xs text-left text-gray-300 transition-all duration-200 border rounded-lg border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors border rounded-lg border-slate-600 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
