'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  category: {
    id: string;
    name: string;
    icon: string;
  };
  onCategoryComplete: (data: any) => void;
}

export default function ChatInterface({ category, onCategoryComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hei! Olen AI-analyytikkosi 👋\n\nAloitetaan kategoria "${category.name}". \n\nKerro minulle liikeideastasi. Mitä ongelmaa se ratkaisee ja kenelle?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [collectedData, setCollectedData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          category: category.id,
          conversationHistory: updatedMessages,
          collectedData: collectedData,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.extractedData) {
        setCollectedData(data.extractedData);
      }

      if (data.isComplete) {
        setTimeout(() => {
          onCategoryComplete(data.extractedData);
        }, 2000);
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Error calling AI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Pahoittelut, tapahtui virhe. Yritä uudelleen.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-strong rounded-3xl h-[calc(100vh-16rem)] flex flex-col overflow-hidden shadow-glow-hover border border-white/10 animate-scale-in">
      {/* Premium Chat Header */}
      <div className="px-8 py-5 border-b border-white/10 glass flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-60 animate-pulse-slow"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight">AI Analyytikko</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </div>
              <p className="text-xs text-emerald-400 font-medium">Online & Ready</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="badge-glow text-xs">
            {messages.length} {messages.length === 1 ? 'viesti' : 'viestit'}
          </div>
        </div>
      </div>

      {/* Messages Container - Premium Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`
              flex items-end gap-3 chat-bubble
              ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Avatar with Glow */}
            <div className={`
              relative flex-shrink-0
              ${message.role === 'user' ? 'order-1' : 'order-0'}
            `}>
              <div className={`
                absolute -inset-1 rounded-2xl blur opacity-50
                ${message.role === 'ai'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'}
              `}></div>
              <div
                className={`
                  relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-glow
                  ${
                    message.role === 'ai'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  }
                `}
              >
                <span className="text-lg">{message.role === 'ai' ? '🤖' : '👤'}</span>
              </div>
            </div>

            {/* Message Bubble - Modern Style */}
            <div className={`
              flex flex-col gap-1 max-w-[75%]
              ${message.role === 'user' ? 'items-end' : 'items-start'}
            `}>
              <div
                className={`
                  px-5 py-4 rounded-3xl shadow-lg transition-all hover:shadow-xl
                  ${
                    message.role === 'ai'
                      ? 'message-ai'
                      : 'message-user'
                  }
                `}
              >
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {message.content}
                </p>
              </div>
              <p className={`
                text-xs text-white/30 px-2
                ${message.role === 'user' ? 'text-right' : 'text-left'}
              `}>
                {message.timestamp.toLocaleTimeString('fi-FI', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Premium Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-3 chat-bubble">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-lg">🤖</span>
              </div>
            </div>
            <div className="message-ai px-6 py-4">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Area */}
      <div className="px-8 py-5 border-t border-white/10 glass backdrop-blur-xl">
        <div className="flex items-end gap-4">
          {/* Input Field - Modern Design */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition"></div>
            <div className="relative input-premium rounded-2xl p-4 focus-within:border-purple-500/50 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Kirjoita vastauksesi..."
                rows={1}
                className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none text-sm font-medium leading-relaxed"
                style={{
                  minHeight: '24px',
                  maxHeight: '120px',
                  overflow: 'auto'
                }}
                disabled={isTyping}
              />
            </div>
          </div>

          {/* Premium Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              relative px-7 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 btn-premium overflow-hidden group
              ${
                input.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:shadow-glow text-white shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            {isTyping ? (
              <div className="flex items-center gap-2">
                <div className="spinner w-5 h-5 border-2"></div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Lähetä</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="flex items-center justify-center mt-3 gap-4">
          <div className="flex items-center gap-2 text-xs text-white/20">
            <kbd className="px-2 py-1 bg-white/5 rounded-lg border border-white/10 font-mono">Enter</kbd>
            <span>lähettää</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10"></div>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <kbd className="px-2 py-1 bg-white/5 rounded-lg border border-white/10 font-mono">Shift + Enter</kbd>
            <span>uusi rivi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
