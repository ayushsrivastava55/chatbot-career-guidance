import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import config from '../config';

const CareerGuidanceChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending request with:', { message: input, sessionId });
      const response = await axios.post(`${config.apiUrl}/api/chat`, {
        message: input,
        sessionId: sessionId
      });
      console.log('Received response:', response.data);
      
      if (!response.data.message) {
        throw new Error('No message in response');
      }

      const botMessage = { role: 'assistant', content: response.data.message };
      console.log('Adding bot message:', botMessage);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Header */}
      <header className="py-6 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Career Guidance Assistant
          </h1>
          <p className="mt-2 text-gray-600">
            Get personalized advice about engineering branches and career paths
          </p>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto">
        <div className="space-y-4 pb-20">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Welcome to Career Guidance!
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                Ask me anything about engineering branches, career paths, or college choices.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4 max-w-[80%]",
                message.role === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  message.role === 'user'
                    ? "bg-purple-600 order-2"
                    : "bg-gray-600 order-1"
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2 shadow-sm",
                  message.role === 'user'
                    ? "bg-purple-600 text-white order-1"
                    : "bg-white text-gray-800 order-2"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-4 flex gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about engineering branches, career paths, or college choices..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "rounded-xl px-6 py-2 font-medium flex items-center gap-2",
              "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
              "hover:opacity-90 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerGuidanceChatbot;
