import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Leaf, Droplet, Bug, Sun, Thermometer, Wind, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { usePlantContext } from '../../context/PlantContext';
import { parseISO, differenceInDays, format, addDays } from 'date-fns';
import { diagnosePlant, getWateringAdvice } from './botanistEngine';

const SUGGESTIONS = [
  { icon: <Bug className="w-4 h-4" />, text: "My plant has yellow leaves" },
  { icon: <Droplet className="w-4 h-4" />, text: "When should I water my Monstera?" },
  { icon: <Sun className="w-4 h-4" />, text: "Brown tips on my fern" },
  { icon: <Leaf className="w-4 h-4" />, text: "Drooping leaves after repotting" },
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent-gold)', animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1" style={{ background: 'var(--glow-gold)' }}>
          <Leaf className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${isBot ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
        style={isBot ? {
          background: 'rgba(255,255,255,0.06)',
          border: '0.5px solid var(--glass-border)',
          color: 'var(--text-primary)',
        } : {
          background: 'linear-gradient(135deg, var(--accent-forest), var(--accent-forest-light))',
          color: 'white',
        }}
      >
        {isBot ? (
          <div className="botanist-response" dangerouslySetInnerHTML={{ __html: msg.html || msg.text }} />
        ) : msg.html ? (
          <div dangerouslySetInnerHTML={{ __html: msg.html }} />
        ) : (
          <span>{msg.text}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function BotanistChat({ isOpen, onClose }) {
  const { state } = usePlantContext();
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Hi! I'm Flora 🌿, your AI botanist. Describe symptoms or ask about watering — I'll help your plants thrive!", html: "Hi! I'm <strong>Flora</strong> 🌿, your AI botanist.<br/><br/>Describe any symptoms you see, or ask about watering schedules — I'll analyze your plants and give personalized advice!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg, state.plants);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', ...response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setUploadPreview(dataUrl);
      // Add user message with photo
      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: '📷 Uploaded a photo for diagnosis',
        html: `<div style="display:flex;flex-direction:column;gap:6px;"><span>📷 Uploaded a photo for diagnosis</span><img src="${dataUrl}" style="width:100%;max-height:160px;object-fit:cover;border-radius:10px;" /></div>`,
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setUploadPreview(null);

      setTimeout(() => {
        const response = generatePhotoResponse(state.plants);
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', ...response }]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed right-4 bottom-4 top-4 w-[380px] z-[200] flex flex-col overflow-hidden"
          style={{
            background: 'rgba(12, 20, 8, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '0.5px solid var(--glass-border)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,83,0.08)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, var(--accent-forest), var(--accent-gold))' }}>
                <Sparkles className="w-5 h-5 text-white" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: '#4ADE80', borderColor: 'rgba(12,20,8,0.85)' }} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-heading)' }}>Flora AI</h3>
                <p className="text-[11px]" style={{ color: 'var(--accent-gold)' }}>Botanist Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1" style={{ background: 'var(--glow-gold)' }}>
                  <Leaf className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                </div>
                <div className="rounded-2xl rounded-tl-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)' }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions (only if few messages) */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSend(s.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors hover:bg-white/8"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  {s.icon} {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 shrink-0">
            {/* Photo Preview */}
            {uploadPreview && (
              <div className="mb-2 relative inline-block">
                <img src={uploadPreview} alt="" className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: 'var(--glass-border)' }} />
                <button onClick={() => setUploadPreview(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'var(--danger-bg)', color: '#F87171' }}>&times;</button>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl px-4 py-2" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)' }}>
              <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10 shrink-0"
                style={{ color: 'var(--accent-gold)' }}
                title="Upload plant photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe symptoms or upload a photo..."
                className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[rgba(245,237,224,0.3)]"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 rounded-xl transition-all disabled:opacity-30"
                style={{ background: input.trim() ? 'var(--accent-forest)' : 'transparent', color: 'white' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Response Generator ───
function generateResponse(query, plants) {
  const q = query.toLowerCase();

  // Check if asking about watering a specific plant
  const wateringMatch = plants.find(p => q.includes(p.name.toLowerCase()));
  if (wateringMatch && (q.includes('water') || q.includes('when') || q.includes('schedule'))) {
    return getWateringAdvice(wateringMatch);
  }

  // Otherwise treat as diagnosis
  return diagnosePlant(q, plants);
}

// ─── Photo Upload Response ───
function generatePhotoResponse(plants) {
  const issues = [
    { name: 'Possible Overwatering', confidence: 'Medium', urgency: '🟡 Monitor', detail: 'The leaves appear slightly yellowed at the base which can indicate excess moisture in the soil.', action: 'Let the soil dry out completely before next watering. Check drainage holes are clear.', watchFor: 'New growth appearing green and firm within 2 weeks.' },
    { name: 'Healthy Growth Pattern', confidence: 'High', urgency: '🟢 Preventive', detail: 'The plant looks healthy overall! Good leaf color and structure. Minor cosmetic imperfections are normal.', action: 'Continue your current care routine. Consider rotating the pot for even growth.', watchFor: 'Continued new leaf production and even coloring.' },
    { name: 'Early Pest Signs', confidence: 'Low', urgency: '🟡 Monitor', detail: 'I notice some minor discoloration that could indicate early pest activity or just environmental stress.', action: 'Inspect the undersides of leaves carefully. Wipe down with neem oil solution as a preventive measure.', watchFor: 'Any sticky residue, webbing, or moving specks on leaves within 7 days.' },
    { name: 'Light Stress Detected', confidence: 'Medium', urgency: '🟢 Preventive', detail: 'The leaf spacing and slight leaning suggest the plant may not be getting optimal light in its current position.', action: 'Move closer to a bright window with indirect light, or add a grow light.', watchFor: 'New growth appearing compact and evenly spaced within 2-3 weeks.' },
  ];
  const issue = issues[Math.floor(Math.random() * issues.length)];

  const html = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong style="color:var(--accent-gold-light);">📸 Photo Analysis</strong>
        <span style="font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(255,255,255,0.06);color:var(--text-muted);">${issue.confidence} confidence</span>
      </div>
      <div style="font-size:12px;padding:6px 10px;border-radius:8px;background:rgba(255,255,255,0.04);">
        ${issue.urgency} — <strong>${issue.name}</strong>
      </div>
      <p style="color:var(--text-secondary);margin:0;font-size:12px;">${issue.detail}</p>
      <div style="padding:8px 12px;border-radius:10px;border-left:3px solid var(--accent-gold);background:rgba(212,168,83,0.08);">
        <strong style="font-size:11px;color:var(--accent-gold);">⚡ Recommended Action</strong>
        <p style="margin:4px 0 0;color:var(--text-primary);font-size:12px;">${issue.action}</p>
      </div>
      <div style="font-size:12px;padding:6px 10px;border-radius:8px;background:rgba(90,154,47,0.1);border:0.5px solid rgba(90,154,47,0.2);">
        <strong style="color:#86EFAC;">👀 Watch for:</strong> <span style="color:var(--text-secondary);">${issue.watchFor}</span>
      </div>
    </div>
  `.trim();

  return { text: issue.name, html };
}
