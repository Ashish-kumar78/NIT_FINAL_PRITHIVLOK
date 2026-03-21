import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! I am your EcoHack Assistant. Ask me anything about sustainability or the app!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('https://ecohack-chatbot.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer || "Sorry, I received an empty response." }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error connecting to the EcoHack Brain. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--brand-gradient)', color: '#000', border: 'none',
          boxShadow: '0 8px 32px var(--brand-glow)',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseOver={e=>e.currentTarget.style.transform='scale(1.1) translateY(-4px)'}
        onMouseOut={e=>e.currentTarget.style.transform='scale(1) translateY(0)'}
      >
        <MessageSquare size={28} style={{color: '#000'}} fill="currentColor" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="card-glass"
            style={{
              position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
              width: '400px', height: '650px', maxHeight: '85vh',
              display: 'flex', flexDirection: 'column',
              padding: 0, overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.2)',
              border: '1px solid var(--brand-solid)'
            }}
          >
            {/* Header */}
            <div style={{ background: 'var(--brand-gradient)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                     <Bot size={24} color="#000" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#000', margin: 0, letterSpacing: '0.02em' }}>EcoHack AI</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.7)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block'}} /> Online
                    </p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(0,0,0,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(0,0,0,0.1)'}>
                  <X size={20} />
               </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,20,35,0.95))' }}>
               {messages.map((m, i) => (
                 <div key={i} style={{ 
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%', flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
                 }}>
                    <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: m.sender === 'user' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: m.sender === 'user' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(16,185,129,0.3)' }}>
                      {m.sender === 'user' ? <User size={18} color="#3b82f6" /> : <Bot size={18} color="#10b981" />}
                    </div>
                    <div style={{ 
                       padding: '14px 18px', borderRadius: '18px', fontSize: '15px', lineHeight: 1.6,
                       background: m.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.05)',
                       color: '#fff', border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                       borderTopRightRadius: m.sender === 'user' ? 4 : 18,
                       borderTopLeftRadius: m.sender === 'bot' ? 4 : 18,
                       boxShadow: m.sender === 'user' ? '0 8px 24px rgba(59,130,246,0.3)' : '0 4px 12px rgba(0,0,0,0.2)'
                     }}>
                       {m.text}
                     </div>
                 </div>
               ))}
               {isLoading && (
                 <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <Bot size={18} color="#10b981" />
                    </div>
                    <div style={{ padding: '16px 20px', borderRadius: '18px', borderTopLeftRadius: 4, background: 'rgba(255,255,255,0.05)', display: 'flex', gap: 6, alignItems: 'center' }}>
                       <motion.div animate={{ y: [0,-6,0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981'}} />
                       <motion.div animate={{ y: [0,-6,0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981'}} />
                       <motion.div animate={{ y: [0,-6,0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981'}} />
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ display: 'flex', padding: '24px', gap: 16, background: 'rgba(2,6,23,0.9)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
               <input 
                 value={input} onChange={e=>setInput(e.target.value)}
                 placeholder="Type your message..."
                 style={{ flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '0 24px', color: '#fff', fontSize: '15px', outline: 'none', transition: 'border 0.3s' }}
                 onFocus={e=>e.target.style.borderColor='rgba(16,185,129,0.5)'}
                 onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
               />
               <button type="submit" disabled={!input.trim() || isLoading} style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--brand-gradient)', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: !input.trim() || isLoading ? 0.5 : 1, transition: 'transform 0.2s', padding: 0 }} onMouseOver={e=>{if(input.trim()&&!isLoading)e.currentTarget.style.transform='scale(1.1)'}} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                  <Send size={20} style={{ marginLeft: 3 }} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
