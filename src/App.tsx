import { useState, useRef, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeProvider';
import { LanguageProvider, useLanguage } from './context/LanguageProvider';
import { ChatMessage } from './components/core/ChatMessage';
import { Send, Sparkles, Moon, Sun, Globe, Square, Paperclip } from 'lucide-react'; 

interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const ChatInterface = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage(); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const aiResponseTextEn = `Based on the documentation, the architecture uses a robust safety mechanism. \n\n\`\`\`python\nclass SafetyStack:\n    def filter_response(self, prompt, raw_response):\n        return raw_response\n\`\`\`\n\nThis approach ensures safety.`;
  const aiResponseTextTr = `Belgelere dayanarak, mimari sağlam bir koruma mekanizması kullanır. \n\n\`\`\`python\nclass GuvenlikYigini:\n    def yaniti_filtrele(self, prompt, ham_yanit):\n        return ham_yanit\n\`\`\`\n\nBu yaklaşım güvenliği sağlar.`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;

    setHasStarted(true);
    
    const userMsg: MessageData = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    setTimeout(() => {
      if (controller.signal.aborted) return;

      const textToShow = language === 'en' ? aiResponseTextEn : aiResponseTextTr;
      const aiId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '', isTyping: true }]);

      let i = 0;
      const interval = setInterval(() => {
        if (controller.signal.aborted) {
          clearInterval(interval);
          return;
        }

        if (i < textToShow.length) {
          setMessages(prev => prev.map(msg => 
            msg.id === aiId ? { ...msg, content: textToShow.slice(0, i + 1) } : msg
          ));
          i+=2;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
          setMessages(prev => prev.map(msg => 
            msg.id === aiId ? { ...msg, isTyping: false } : msg
          ));
        }
      }, 15);
    }, 400);
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
      setMessages(prev => prev.map(msg => 
        msg.isTyping ? { ...msg, isTyping: false } : msg
      ));
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
          <Sparkles className="text-indigo-500" size={20} />
          <span>RAG UI Kit <span className="text-[10px] uppercase font-bold text-white bg-indigo-500 px-2 py-0.5 rounded-full ml-2">Community</span></span>
        </div>
        
        <div className="flex gap-2">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end pb-4">

          {!hasStarted ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 mb-10">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-6">
                <Sparkles size={48} className="text-indigo-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                {language === 'en' ? 'Welcome to RAG UI Kit' : 'RAG UI Kit\'e Hoş Geldiniz'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm">
                {language === 'en' 
                  ? 'This is the Free Community Edition.' 
                  : 'Bu Ücretsiz Topluluk Sürümüdür.'} 
                <br/><br/>
                <a href="https://beyzatarh.gumroad.com/l/rag-ui-kit-pro" target="_blank" className="text-indigo-500 hover:underline font-semibold">
                  {language === 'en' ? 'Upgrade to Pro Edition' : 'Pro Sürüme Yükseltin'}
                </a> {language === 'en' 
                  ? 'for Glassmorphism themes, animated File Dropzones, and interactive PDF Source Viewers.' 
                  : 'ile Glassmorphism temaları, animasyonlu dosya yükleme ve interaktif PDF görüntüleyiciye sahip olun.'}
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  role={msg.role} 
                  content={msg.content} 
                  isTyping={msg.isTyping}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}

        </div>
      </main>

      <div className="p-4 md:p-6 pb-8 z-10 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto rounded-2xl flex items-center p-2 gap-2 shadow-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          
          <button 
            onClick={() => alert(language === 'en' 
              ? "Drag & Drop File Upload feature is available in the Pro Edition! Check out the link above." 
              : "Dosya Yükleme özelliği Pro sürümde mevcuttur! Yukarıdaki linki inceleyebilirsiniz.")}
            className="p-3 rounded-xl transition hover:bg-gray-200 text-gray-400 dark:hover:bg-gray-700"
          >
            <Paperclip size={20} />
          </button>
          
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder={language === 'en' ? "Ask something to the model..." : "Modele bir şey sorun..."} 
            disabled={isGenerating}
            className="flex-1 bg-transparent outline-none px-2 text-base text-gray-900 dark:text-white disabled:opacity-50" 
          />
          
          <button 
            onClick={isGenerating ? handleStop : handleSend} 
            className={`p-3 text-white rounded-xl transition shadow-md flex items-center justify-center
              ${isGenerating ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {isGenerating ? <Square size={18} fill="currentColor" /> : <Send size={18} />}
          </button>
        </div>
        <div className="text-center mt-3 text-xs text-gray-400">
          Open Source Community Edition
        </div>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ChatInterface />
      </LanguageProvider>
    </ThemeProvider>
  );
}