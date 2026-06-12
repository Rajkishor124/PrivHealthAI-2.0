import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { chatbotService } from '../../services/chatbotService';
import { getApiError } from '../../utils';
import type { ChatStructured } from '../../types';
import MedicalResponseCard from '../../components/chatbot/MedicalResponseCard';
import FormattedText from '../../components/chatbot/FormattedText';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  structured?: ChatStructured | null;
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'bot',
  text: "Hello! I'm your PrivHealthAI assistant. Ask me about symptoms, medications, finding doctors, or general health advice. For emergencies, always call 112.",
};

const TypingIndicator = () => (
  <div className="flex gap-1 items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm w-fit">
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
);

const Bubble = ({ message }: { message: Message }) => {
  // Symptom replies render as a stack of medical cards instead of a chat bubble.
  if (message.role === 'bot' && message.structured?.type === 'symptom') {
    return (
      <div className="flex justify-start">
        <MedicalResponseCard data={message.structured} />
      </div>
    );
  }

  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm'
        }`}
      >
        {!isUser && message.structured?.type === 'info'
          ? <FormattedText text={message.structured.reply || message.text} />
          : message.text}
      </div>
    </div>
  );
};

const Chatbot = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Health Chatbot</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to chat with your AI healthcare assistant.</p>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await chatbotService.sendMessage(text);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: res.data.response,
        structured: res.data.structured ?? null,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      toast.error(getApiError(err, 'Failed to get response'));
      const errMsg: Message = {
        id: `e-${Date.now()}`,
        role: 'bot',
        text: "Sorry, I couldn't process your message. Please try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Health Chatbot</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ask about symptoms, medications, or find doctors</p>
      </div>

      <div
        className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => <Bubble key={msg.id} message={msg} />)}
          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a health question... (Enter to send)"
            rows={1}
            className="flex-1 resize-none border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="h-11 w-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
