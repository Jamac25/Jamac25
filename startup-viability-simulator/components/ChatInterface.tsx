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
      content: `Hei! 👋 Olen AI-analyytikkosi.\n\nAloitetaan kategoria "${category.name}".\n\nKerro minulle liikeideastasi. Mitä ongelmaa se ratkaisee ja kenelle?`,
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
    <div className="bg-[#1a1a24] rounded-2xl border border-white/10 flex flex-col h-[600px] shadow-2xl">
      {/* Chat Header - Simple */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Analyytikko</h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Clean & Simple */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${message.role === 'ai'
                ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'}
            `}>
              <span className="text-sm">{message.role === 'ai' ? '🤖' : '👤'}</span>
            </div>

            {/* Message */}
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`
                inline-block px-4 py-3 rounded-2xl max-w-[80%]
                ${message.role === 'ai'
                  ? 'bg-white/5 text-white'
                  : 'bg-purple-600 text-white'}
              `}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <p className="text-xs text-white/30 mt-1 px-1">
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
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Clean */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kirjoita vastauksesi..."
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 resize-none outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2
              ${input.trim() && !isTyping
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-white/5 text-white/30 cursor-not-allowed'}
            `}
          >
            {isTyping ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <span>Lähetä</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-white/20 mt-2 text-center">
          Paina Enter lähettääksesi • Shift+Enter uudelle riville
        </p>
      </div>
    </div>
  );
}
