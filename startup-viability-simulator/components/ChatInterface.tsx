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
  onCategoryComplete: () => void;
}

export default function ChatInterface({ category, onCategoryComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hei! Olen AI-analyytikkosi. Aloitetaan kategoria "${category.name}". \n\nKerro minulle liikeideastasi. Mitä ongelmaa se ratkaisee ja kenelle?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: getAIResponse(input, messages.length),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Temporary function - will be replaced with actual AI
  const getAIResponse = (userInput: string, messageCount: number): string => {
    // Simulate smart follow-up questions
    if (messageCount < 4) {
      return `Kiitos vastauksesta! Kerro lisää: Kuinka suuri on kohderyhmäsi? Onko sinulla jo asiakkaita?`;
    } else if (messageCount < 6) {
      return `Hyvä! Vielä muutama kysymys: Mikä on arvioi hintasi? Mitkä ovat suurimmat kilpailijasi?`;
    } else {
      // Complete category
      setTimeout(() => {
        onCategoryComplete();
      }, 2000);
      return `✅ Loistavaa! Sain riittävästi tietoa kategoriasta "${category.name}". Siirrytään seuraavaan!`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-strong rounded-2xl h-[calc(100vh-20rem)] flex flex-col overflow-hidden shadow-glass">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Analyytikko</h3>
            <p className="text-xs text-green-400 flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Online</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full glass text-xs text-white/60">
            {messages.length} viestit
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`
              flex items-start space-x-3 chat-bubble
              ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}
            `}
          >
            {/* Avatar */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${
                  message.role === 'ai'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }
              `}
            >
              <span className="text-sm">{message.role === 'ai' ? '🤖' : '👤'}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`
                max-w-[75%] rounded-2xl px-4 py-3 shadow-lg
                ${
                  message.role === 'ai'
                    ? 'glass-strong border border-white/10'
                    : 'bg-gradient-to-br from-blue-600 to-purple-600'
                }
              `}
            >
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p className="text-xs text-white/40 mt-2">
                {message.timestamp.toLocaleTimeString('fi-FI', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3 chat-bubble">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div className="glass-strong rounded-2xl px-4 py-3 border border-white/10">
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

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-end space-x-3">
          <div className="flex-1 glass rounded-2xl p-3 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Kirjoita vastauksesi..."
              rows={1}
              className="w-full bg-transparent text-white placeholder-white/40 resize-none outline-none text-sm"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 btn-premium
              ${
                input.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-glow'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }
            `}
          >
            {isTyping ? (
              <div className="w-5 h-5">
                <div className="spinner w-5 h-5"></div>
              </div>
            ) : (
              <span>Lähetä →</span>
            )}
          </button>
        </div>

        <p className="text-xs text-white/30 mt-2 text-center">
          Paina Enter lähettääksesi • Shift+Enter uudelle riville
        </p>
      </div>
    </div>
  );
}
