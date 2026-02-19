import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { useLanguage } from '../../context/LanguageProvider'; 
import { User, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    isTyping?: boolean;
    children?: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isTyping, children }) => {
    const { theme } = useTheme();
    const { t } = useLanguage(); 
    const isUser = role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                <div className={`
          w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
          ${isUser
                        ? 'bg-indigo-600 text-white'
                        : theme === 'glass' ? 'bg-white/10 text-sky-400' : 'bg-gray-200 text-gray-600'}
        `}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className={`
          p-4 rounded-2xl text-sm leading-relaxed relative overflow-hidden group min-w-[200px]
          ${isUser
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : theme === 'glass'
                            ? 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-sm backdrop-blur-md'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}
        `}>

                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <div className="relative rounded-lg overflow-hidden my-4 border border-white/10 shadow-lg">
                                            <div className="flex justify-between items-center bg-[#1e1e1e] px-4 py-2 text-xs text-gray-400 border-b border-white/5">
                                                <span className="font-mono font-bold text-indigo-400">{match[1].toUpperCase()}</span>
                                                <button
                                                    onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                                                    className="hover:text-white transition flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10"
                                                >
                                                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                    {copied ? t('copied') : t('copy')}
                                                </button>
                                            </div>
                                            <div className="bg-[#0d1117] p-4 overflow-x-auto">
                                                <code className={className} {...props} style={{ background: 'transparent' }}>
                                                    {children}
                                                </code>
                                            </div>
                                        </div>
                                    ) : (
                                        <code className={`${theme === 'glass' ? 'bg-white/20 text-indigo-200' : 'bg-gray-200 text-indigo-700'} px-1.5 py-0.5 rounded font-mono text-xs`} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>

                    {children && <div className="mt-2 inline-block">{children}</div>}

                    {!isUser && isTyping && (
                        <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-sky-400 animate-pulse" />
                    )}
                </div>
            </div>
        </motion.div>
    );
};