import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import clsx from 'clsx';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Send context (last 10 messages)
            const context = messages.slice(-10);
            context.push(userMessage);

            const response = await aiService.chat(context);

            if (response.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
            } else if (response.error) {
                setMessages(prev => [...prev, { role: 'system', content: `Erreur: ${response.error}` }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', content: "Désolé, je ne peux pas répondre pour le moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={clsx(
                    "mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right",
                    isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 h-0 w-0 mb-0"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6" />
                        <h3 className="font-bold">Tuteur Intelligent</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-white/20 p-1 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Information */}
                <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Bonjour ! Je suis ton tuteur IA. Pose-moi une question sur tes leçons ! 👋</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={clsx(
                                "max-w-[85%] p-3 rounded-2xl text-sm",
                                msg.role === 'user'
                                    ? "bg-blue-600 text-white self-end rounded-tr-none shadow-md"
                                    : msg.role === 'system'
                                        ? "bg-red-100 text-red-800 self-center text-xs"
                                        : "bg-white text-gray-800 self-start rounded-tl-none shadow-sm border border-gray-100"
                            )}
                        >
                            {msg.role !== 'system' && (
                                <div className="flex items-center gap-1 mb-1 opacity-70 text-[10px]">
                                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                    <span>{msg.role === 'user' ? 'Toi' : 'Tuteur'}</span>
                                </div>
                            )}
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="bg-white text-gray-800 self-start rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100 w-16">
                            <div className="flex gap-1 justify-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pose ta question..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                    isOpen ? "bg-gray-200 text-gray-600" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};
