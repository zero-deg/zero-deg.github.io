/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, Zap, Globe, Cpu, ArrowRight, 
  Brain, Smartphone, AppWindow, Layers,
  MessageSquare, ChevronRight, ChevronLeft, ChevronDown, X, LayoutTemplate, 
  Lock, Settings, Clock, Link as LinkIcon, Github,
  Briefcase, GraduationCap, Scale, HeartPulse, Landmark, Laptop, Terminal, Mail, Rocket
} from 'lucide-react';
import { PlasticButton } from './components/ui/PlasticButton';
import { GradientBackground } from './components/ui/paper-design-shader-background';
import GradientBars from './components/ui/gradient-bars-bg';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { GetStartedButton } from '@/components/ui/GetStartedButton';
import { LiquidMetalButton } from "./components/ui/liquid-metal-button";
import Strands from './components/Strands';
import { CustomCursor } from '@/components/ui/CustomCursor';

export default function App() {
  const [name, setName] = useState('ZERO°');
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111] overflow-hidden">
      <CustomCursor />
      <Navbar name={name} setName={setName} onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      
      <main className="flex flex-col gap-3 pb-3">
        {/* <HeroSection name={name} setName={setName} onOpenWaitlist={() => setIsWaitlistOpen(true)} /> */}
        <FeaturesGrid name={name} />
        <div className="flex flex-col gap-3 w-full">
          <MarqueeSection />
          <CrystalsSection name={name} onOpenWaitlist={() => setIsWaitlistOpen(true)} />
        </div>
        <PowerUpSection name={name} />
      </main>
      
      <Footer name={name} />
    </div>
  );
}

function NameInput({ name, setName, children }: { name: string, setName: (name: string) => void, children: ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isVisible) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div 
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[60] pointer-events-none"
            style={{ 
              left: mousePos.x + 10, 
              top: mousePos.y + 10 
            }}
          >
            <input 
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name..."
              className="w-40 px-3 py-2 rounded-lg bg-white border border-black/10 outline-none text-xs shadow-lg pointer-events-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar({ name, setName, onOpenWaitlist }: { name: string, setName: (name: string) => void, onOpenWaitlist: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-[#151515]/30 backdrop-blur-[20px] border-b border-b-white/10'
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-12 md:px-28 h-[44px] flex items-center relative">
        <div className="flex items-center gap-6 flex-1">
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <img src="/logo.png" alt="ZERO°" className="h-[44px] w-auto object-contain py-1.5" />
        </div>

        <div className="flex items-center gap-4 h-full flex-1 justify-end">
          <LiquidMetalButton label="Join Beta" onClick={onOpenWaitlist} shadow={false} />
        </div>
      </div>
    </nav>
  );
}

function WaitlistModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formName, setFormName] = useState<string>('');
  const [formContact, setFormContact] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const waitlistData = {
      name: formName,
      contact: formContact,
    };
    
    try {
      await fetch('https://formspree.io/f/mjgqwlev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(waitlistData),
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
    
    // Save to localStorage as a reliable backup
    const existingWaitlist = JSON.parse(localStorage.getItem('waitlist_responses') || '[]');
    existingWaitlist.push({ ...waitlistData, type: 'waitlist', timestamp: new Date().toISOString() });
    localStorage.setItem('waitlist_responses', JSON.stringify(existingWaitlist));
    
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[90]"
          />
          {/* Center Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', x: '-50%', y: '-50%' }}
            exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-1/2 top-1/2 w-full max-w-[360px] bg-white border border-black/5 z-[100] p-8 rounded-[32px] flex flex-col shadow-2xl shadow-black/10"
          >
            
            <div className="mt-2" />
            {isSubmitted ? (
              /* Submission Success State */
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  >
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </div>
                <h3 className="text-xl text-black font-medium">Thank you</h3>
              </motion.div>
            ) : (
              /* Form Entry State */
              <motion.form 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleWaitlistSubmit}
                action="https://formspree.io/f/mjgqwlev"
                method="POST"
                className="flex flex-col gap-3"
              >
                {/* Name Input */}
                <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      name="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Full name or first name"
                      className="w-full bg-black/5 border border-black/5 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all" 
                    />
                  </div>
                </motion.div>
            
                {/* Contact Input */}
                <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                  <div className="relative w-full">
                    <textarea 
                      rows={2}
                      name="contact"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="Email, WhatsApp/Phone or Social links (separated by commas)"
                      className="w-full bg-black/5 border border-black/5 rounded-[18px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all resize-none" 
                    />
                  </div>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div variants={itemVariants} className="mt-0.5 flex justify-center">
                  <button 
                    type="submit"
                    disabled={!formName.trim() || !formContact.trim()}
                    className="px-8 py-2.5 bg-black text-white rounded-full text-sm hover:bg-black/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 font-medium"
                  >
                    Join waitlist
                  </button>
                </motion.div>
              </motion.form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



function DeviceShowcasePlain({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <h2 className="text-2xl font-semibold tracking-tight mb-1 text-[#111] whitespace-nowrap flex items-center justify-center gap-2">
        <img src="/crystallogo.png" alt="Crystal" className="h-[28px] w-auto object-contain" />
        <span className="font-light text-black/50 uppercase">Portals</span>
      </h2>
      <p className="text-sm md:text-base text-black/60 font-light leading-relaxed font-helvetica">
        <span className="font-light text-black">Universal Interaction. </span>
        Access any app or website from anywhere. App Store, Play Store, GitHub, Any OS. No lock-in. Every app. One companion.
      </p>
    </div>
  );
}

function CrystalFusionItemPlain() {
  return (
    <div className="relative w-full h-[400px] flex flex-col items-center justify-start overflow-hidden">
      <div className="absolute inset-0 top-12 w-full h-[calc(100%+3rem)] z-0 pointer-events-none transform translate-y-4">
        <Strands
          colors={["#F97316","#7C3AED","#06B6D4"]}
          count={3}
          speed={0.5}
          amplitude={1}
          waviness={1}
          thickness={0.7}
          glow={2.6}
          taper={3}
          spread={1}
          intensity={0.6}
          saturation={2}
          opacity={1}
          scale={1.5}
          glass={false}
          refraction={1}
          dispersion={1}
          glassSize={1}
          hueShift={0}
        />
      </div>
      <div className="relative z-10 p-6 flex flex-col items-center text-center gap-2 pointer-events-none">
        <h3 className="text-2xl font-semibold tracking-tight text-white whitespace-nowrap flex items-center justify-center gap-2">
          <img src="/crystallogo.png" alt="Crystal" className="h-[28px] w-auto object-contain invert" />
          <span className="font-light text-white/50 uppercase">Fusion</span>
        </h3>
        <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm font-helvetica">
          <span className="font-light text-white">Infinite Processes Simplified. </span>
          Combine Instincts × Portals into powerful workflows. One Fusion = hours of saved work.
        </p>
      </div>
    </div>
  );
}

function CrystalAutonsItemPlain() {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <h3 className="text-2xl font-semibold tracking-tight text-[#111] whitespace-nowrap flex items-center justify-center gap-2">
        <img src="/crystallogo.png" alt="Crystal" className="h-[28px] w-auto object-contain" />
        <span className="font-light text-black/50 uppercase">Autons</span>
      </h3>
      <p className="text-sm md:text-base text-black/60 font-light leading-relaxed font-helvetica">
        <span className="font-light text-black">Autonomous Experts. </span>
        Combine Instincts × Portals × Fusion into powerful autons. Run hundreds of autons at once. Parallel. 24/7. Either in the background or simultaneously.
      </p>
    </div>
  );
}

function AIModelsItemPlain() {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <h3 className="text-2xl font-semibold tracking-tight text-[#111]">AI Models</h3>
      <p className="text-sm md:text-base text-black/60 font-light leading-relaxed font-helvetica">
        <span className="font-light text-black">Ultimate Brainpower. Download and run any AI model privately & for free. </span>
        Connect and use any AI model seamlessly. Switch between the world's best models instantly. GPT-4, Claude 3, Gemini, and open-source models ready to go.
      </p>
    </div>
  );
}

function PromptsItemPlain() {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <h3 className="text-2xl font-semibold tracking-tight text-[#111]">Prompts</h3>
      <p className="text-sm md:text-base text-black/60 font-light leading-relaxed font-helvetica">
        <span className="font-light text-black">Master the art of instruction. A library of powerful prompts. </span>
        Save, share, and organize your prompts. Turn plain text into powerful, repeatable actions. Your personal library of intent.
      </p>
    </div>
  );
}

function FeaturesGrid({ name }: { name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const AUTOPLAY_TIME = 6000; // 6 seconds auto-play
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  interface FeatureItem {
    icon: ReactNode;
    title: string;
    desc: string;
    content?: ReactNode;
  }

  const features: FeatureItem[] = [
    {
      icon: <Smartphone size={24} />,
      title: "Control via any device",
      desc: "Phone, laptop, tablet, or smartwatch. Access your companion's memory and capabilities from any screen, perfectly synced in real-time."
    },
    {
      icon: <Brain size={24} />,
      title: "Intelligence",
      desc: "Knows everything about you. Understands intent instantly. No prompts. Just talk naturally. Full memory — never forgets complex tasks from months ago."
    },
    {
      icon: <Shield size={24} />,
      title: "Privacy & Security",
      desc: "Runs fully on your device. No cloud. No data harvesting. No selling your data. On-device first — your data never leaves. You're the customer, not the product."
    },
    {
      icon: <Settings size={24} />,
      title: "Action & Control",
      desc: "Opens apps, edits files, manages tasks. Sends emails, texts, schedules events. Books rides, orders food, pays bills. Your device, fully under your control."
    },
    {
      icon: <Clock size={24} />,
      title: "Behavior",
      desc: "Remembers your preferences locally. Respects your time — no unnecessary noise. Calm, patient, never pushy."
    },
    {
      icon: <Mail size={24} />,
      title: "Personal Digital Identity",
      desc: "Has its own payment wallet, email, and phone number. Seamlessly connects and controls all your digital services, acting as a true proxy for your digital life."
    },
    {
      icon: <Zap size={24} />,
      title: "Always Running",
      desc: "Works offline. Runs across all your apps. Active in the background — even while you sleep."
    },
    {
      icon: <MessageSquare size={24} />,
      title: `Message ${name || 'them'} Anywhere`,
      desc: "WhatsApp, Telegram, Discord, iMessage. Signal, email, CLI. One companion, every channel."
    },
    {
      icon: <LayoutTemplate size={24} />,
      title: "Automations",
      desc: "Scheduled, recurring, trigger-based. Set it and forget it."
    },
    {
      icon: <LinkIcon size={24} />,
      title: "Already works with all your favorite apps.",
      desc: `${name || 'ZERO°'} integrates deeply with the tools you use every day, making your workflow seamless and automated. No extra steps. No friction.`
    },
    {
      icon: <Globe size={24} />,
      title: "Full Internet Access",
      desc: "Searches, summarizes, compares. Real-time info. Privacy-first browsing."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Your 2nd Device, Virtual",
      desc: "Spin up any Device, any OS. Have a personal, fully functional second device. Do anything on it – test, run apps, browse, compute."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Smart. Efficient. Nice.",
      desc: "Smart – Understands intent. Efficient – Does in seconds what takes minutes. Nice – Friendly, patient, respectful."
    },
    {
      icon: <Cpu size={24} />,
      title: "Built to improve itself",
      desc: "Sleep Learning: Practices on simulated scenarios. Bayesian Logic: Refines decisions. Private Brain: Learns without sending data."
    },
    {
      icon: <AppWindow size={24} />,
      title: `${name || 'They'} as your OS`,
      desc: `Switch to ${name || 'ZERO°'} -minimalist and simple. Or keep your OS and let ${name || 'them'} sit on top. One companion, deep integration.`
    },
    {
      icon: <Layers size={24} />,
      title: "Truly Multimodal",
      desc: "Processes text, voice, images, and video natively. Understands context across formats—show it a screen, talk about it, and get text back seamlessly."
    },
    {
      icon: <Github size={24} />,
      title: "Connected to GitHub, Install on localhost with one click.",
      desc: "Pull live updates, tools, scripts, and repos instantly!"
    }
  ];

  // Sync scroll position when index changes
  useEffect(() => {
    if (containerRef.current) {
      const card = containerRef.current.children[activeIndex] as HTMLElement;
      if (card) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = card.offsetWidth;
        const scrollLeft = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
        
        containerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Set a timeout to update the index after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const scrollLeft = containerRef.current.scrollLeft;
      const containerWidth = containerRef.current.offsetWidth;
      const center = scrollLeft + containerWidth / 2;
      
      const cards = Array.from(containerRef.current.children) as HTMLElement[];
      let closestIndex = activeIndex;
      let minDistance = Infinity;
      
      cards.forEach((card, i) => {
        if (i >= features.length) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });
      
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }, 150); // Debounce scroll detection
  };

  // Autoplay timing engine
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Update progress smoothly every 50ms
    const increment = (intervalTime / AUTOPLAY_TIME) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((curr) => (curr + 1) % features.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [isPaused, features.length]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
    setIsPaused(true);
    setProgress(0);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    setIsPaused(true);
    setProgress(0);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 bg-neutral-100 border border-black/5 overflow-hidden mx-3 relative" id="os">
      <div className="w-full max-w-none">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">One companion. Your entire life.</h2>
          <p className="text-lg text-black/50 font-medium">Everything you need, handled quietly in the background.</p>
        </div>
      </div>

      <div className="relative group">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-4 sm:px-6 md:px-8 xl:px-12 cursor-grab active:cursor-grabbing"
        >
          {features.map((feat, i) => (
            <div 
              key={i} 
              className="flex-none w-[85vw] sm:w-[340px] md:w-[380px] snap-center p-8 rounded-none bg-white border border-black/5 transition-colors whitespace-normal select-none relative h-[280px] overflow-hidden"
            >
              <div className="absolute top-6 left-6 p-2 text-white" style={{ backgroundColor: ['#86efac', '#c084fc', '#fbbf24', '#60a5fa', '#f87171', '#fb923c', '#d3d3d3', '#e879f9', '#4ade80', '#22d3ee', '#facc15', '#f472b6'][i % 12] }}>
                {feat.icon}
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                 <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {Array.from({ length: 64 }).map((_, idx) => {
                       const colors = ['#86efac', '#c084fc', '#fbbf24', '#60a5fa', '#f87171', '#fb923c', '#d3d3d3', '#e879f9', '#4ade80', '#22d3ee', '#facc15', '#f472b6'];
                       // Deterministic pseudo-random value based on card index (i) and cell index (idx)
                       // to keep the layout absolutely stable across re-renders and hover actions.
                       const hash = Math.abs(Math.sin((i + 1) * 12.9898 + (idx + 1) * 78.233) * 43758.5453) % 1;
                       return (
                         <div key={idx} style={{ backgroundColor: hash > 0.7 ? colors[i % colors.length] : 'transparent' }} />
                       );
                    })}
                 </div>
              </div>

              <div className="mt-20">
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feat.title}</h3>
                {feat.content ? (
                  <div className="mb-2">{feat.content}</div>
                ) : null}
                <p className="text-black/60 leading-relaxed text-sm">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center relative mt-8 px-4 sm:px-6 md:px-8 xl:px-12">
        <div className="absolute right-4 sm:right-6 md:right-8 xl:right-12 flex items-center gap-3 bg-gray-100 p-1.5 px-3 rounded-full border border-black/5 text-xs text-black/50 font-mono">
          <div className="flex items-center gap-1.5 select-none">
            {/* Smooth SVG Circular Progress Indicator */}
            <svg className="w-4 h-4 transform -rotate-90">
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1.5"
                fill="transparent"
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke={isPaused ? "#888888" : "#0071e3"}
                strokeWidth="1.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 6}
                strokeDashoffset={2 * Math.PI * 6 * (1 - progress / 100)}
                className="transition-all duration-75 ease-linear"
              />
            </svg>
            <span className="min-w-[32px] text-right">
              {isPaused ? "PAUSED" : `${Math.max(0, ((AUTOPLAY_TIME * (1 - progress / 100)) / 1000)).toFixed(1)}s`}
            </span>
          </div>
          <div className="h-4 w-px bg-black/10" />
          <div className="flex items-center gap-0.5">
            <button 
              onClick={prevSlide}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white hover:shadow-sm active:scale-95 text-black"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white hover:shadow-sm active:scale-95 text-black"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CrystalsSection({ name, onOpenWaitlist }: { name: string, onOpenWaitlist: () => void }) {
  return (
    <div id="crystals" className="py-12 px-8 bg-neutral-50 border border-black/5 flex flex-col justify-center mx-3">
      <div className="w-full">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <img src="/crystallogo.png" alt="Crystal Logo" className="h-[44px] w-auto object-contain" />
            <div className="text-lg font-bold tracking-widest text-[#0071e3] uppercase">Crystals</div>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-balance text-[#111]">
            Everything else flows from {name || 'them'}.
          </h2>
          <p className="text-sm text-black/50 font-medium max-w-sm mx-auto">
            Every Crystal is a superpower. Just tell. Your {name || 'companion'} handles the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div id="portals" className="bg-white p-6 rounded-none border border-black/5 flex flex-col justify-center sm:h-[196px] h-auto sm:col-start-1 sm:row-start-1">
            <DeviceShowcasePlain name={name} />
          </div>
          <div id="fusion" className="bg-black rounded-none border border-white/10 flex flex-col justify-between overflow-hidden relative sm:col-start-2 sm:row-start-1 sm:row-span-2 h-auto sm:h-[400px]">
            <CrystalFusionItemPlain />
          </div>
          <div id="autons" className="bg-white p-6 rounded-none border border-black/5 flex flex-col justify-center sm:h-[196px] h-auto sm:col-start-1 sm:row-start-2 relative overflow-hidden group">
            <div className="relative z-10 w-full h-full flex flex-col justify-center">
              <CrystalAutonsItemPlain />
            </div>
          </div>
          <div id="ai-models" className="bg-white p-6 rounded-none border border-black/5 flex flex-col justify-center sm:h-[196px] h-auto sm:col-start-1 sm:row-start-3">
            <AIModelsItemPlain />
          </div>
          <div id="prompts" className="bg-white p-6 rounded-none border border-black/5 flex flex-col justify-center sm:h-[196px] h-auto sm:col-start-2 sm:row-start-3">
            <PromptsItemPlain />
          </div>
        </div>
      </div>
    </div>
  );
}

const asteriskPath = "M12 2v20M2 12h20m-3.07-7.07L5.07 19.07M19.07 19.07L5.07 4.93";

function MindMap({ name }: { name: string }) {
  const mindMapData = [
    {
      category: "Studies",
      x: 20, y: 35,
    },
    {
      category: "Business",
      x: 58, y: 22,
    },
    {
      category: "Daily Life",
      x: 74, y: 55,
    },
    {
      category: "Health & Finance",
      x: 55, y: 86,
    },
    {
      category: "Creative & Truth",
      x: 22, y: 78,
    }
  ];

  return (
    <div className="relative w-full aspect-[4/3] mx-auto py-10 overflow-visible select-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">

        {/* Cross-branch connections */}
        <motion.line initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} x1="20%" y1="35%" x2="22%" y2="78%" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        <motion.line initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} x1="20%" y1="35%" x2="58%" y2="22%" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        <motion.line initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} x1="58%" y1="22%" x2="74%" y2="55%" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        <motion.line initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} x1="74%" y1="55%" x2="55%" y2="86%" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        <motion.line initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} x1="55%" y1="86%" x2="22%" y2="78%" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
      </svg>

      <div className="absolute inset-0">
        {mindMapData.map((group) => (
          <div key={group.category}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ left: `${group.x}%`, top: `${group.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <span className="text-lg font-serif font-medium text-black/80 whitespace-nowrap">{group.category}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScatteredDiagram() {
  const nodes = [
    { label: "Studies", x: 20, y: 25 },
    { label: "Business", x: 80, y: 20 },
    { label: "Daily Life", x: 85, y: 55 },
    { label: "Health & Finance", x: 60, y: 80 },
    { label: "Creative & Truth", x: 15, y: 65 },
  ];

  return (
    <div className="relative w-full aspect-[4/3] mx-auto py-10 overflow-visible select-none">
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {nodes.map((n1, i) => 
            nodes.map((n2, j) => {
              if (i >= j) return null;
              return (
                <motion.line
                  key={`${i}-${j}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.4 }}
                  viewport={{ once: true }}
                  x1={`${n1.x}%`} y1={`${n1.y}%`}
                  x2={`${n2.x}%`} y2={`${n2.y}%`}
                  stroke="#ff6b6b"
                  strokeWidth="0.8"
                />
              );
            })
          )}
        </svg>
        {nodes.map((node, i) => (
          <div 
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b] shadow-[0_0_8px_rgba(255,107,107,0.3)]" />
            <span className="text-lg font-serif font-medium text-black/80 whitespace-nowrap">
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PowerUpSection({ name }: { name: string }) {
  return (
    <section className="py-16 px-12 md:px-28 bg-white text-black relative overflow-hidden mx-3 border border-black/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Power up your life. Every part of it.</h2>
          <p className="text-lg text-black/50 font-medium mb-8">
            {name || 'ZERO°'} isn't just for one thing. It's for everything.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="z-30"
          >
            <span className="text-2xl md:text-5xl font-serif font-medium tracking-tight text-black/95 drop-shadow-[0_0_30px_rgba(0,0,0,0.05)]">
              Unscattered.
            </span>
          </motion.div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScatteredDiagram />
            <MindMap name={name} />
          </div>
        </div>
      </div>
    </section>
  );
}


const COMMANDS_1 = [
  "Remind me to take out the trash tomorrow morning at 7am",
  "Add milk, eggs, and bread to my shopping list",
  "What's the weather like this weekend?",
  "Set an alarm for 6:30am tomorrow",
  "Turn off all lights and lock the front door",
  "Order a pizza from the usual place",
  "Cancel my subscription to that app I never use",
  "Summarize the last 10 emails from my boss",
  "Convert this Google Doc to PDF and email it to client",
  "What did my friend say in our group chat last night?",
  "Track my water intake today",
  "Explain quantum physics like I'm 12",
  "Find the cheapest flight to New York"
];

const COMMANDS_2 = [
  "Draft a professional reply to this email",
  "Wish my dad happy birthday via text",
  "Mute Slack notifications until noon",
  "Find a hotel near the airport under $150",
  "Add 'buy birthday gift' to my to-do list",
  "Find a plumber near me",
  "Order more dog food from Chewy",
  "Suggest a movie to watch tonight",
  "Share my location with my sister",
  "Send \"on my way\" to Papa on WhatsApp"
];

function MarqueeSection() {
  return (
    <div className="py-12 overflow-hidden bg-neutral-50 border border-black/5 flex flex-col justify-center mx-3">
      <div className="text-center mb-8 px-12 md:px-28">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111]">Daily Interactions</h3>
        <p className="text-sm text-black/50 font-medium">Just speak your mind.</p>
      </div>

      <div className="relative flex overflow-x-hidden group gap-3 mb-3 py-1" style={{ contain: 'content' }}>
        <div 
          className="flex whitespace-nowrap gap-3 px-2 animate-marquee"
          style={{ 
            '--duration': '30s',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          } as any}
        >
          {[...COMMANDS_1, ...COMMANDS_1].map((cmd, i) => (
             <div key={i} className="bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm text-xs font-medium text-black/80 flex-shrink-0">
               {cmd}
             </div>
          ))}
        </div>
      </div>

       <div className="relative flex overflow-x-hidden group gap-3 py-1" style={{ contain: 'content' }}>
        <div 
          className="flex whitespace-nowrap gap-3 px-2 animate-marquee-reverse"
          style={{ 
            '--duration': '35s',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          } as any}
        >
          {[...COMMANDS_2, ...COMMANDS_2].map((cmd, i) => (
             <div key={i} className="bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm text-xs font-medium text-black/80 flex-shrink-0">
               {cmd}
             </div>
          ))}
        </div>
      </div>
      
      <div className="relative flex overflow-x-hidden group gap-3 mt-3 py-1" style={{ contain: 'content' }}>
        <div 
          className="flex whitespace-nowrap gap-3 px-2 animate-marquee"
          style={{ 
            '--duration': '40s',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          } as any}
        >
          {[...COMMANDS_1, ...COMMANDS_1].reverse().map((cmd, i) => (
             <div key={i} className="bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm text-xs font-medium text-black/80 flex-shrink-0">
               {cmd}
             </div>
          ))}
        </div>
       </div>
    </div>
  );
}

function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-gray-100 text-[#111] pb-12 pt-8 px-12 md:px-28">
      <div className="max-w-5xl mx-auto border-t border-black/5 pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8 text-left">
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Business
          </div>
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Students
          </div>
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Educators
          </div>
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Healthcare
          </div>
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Government
          </div>
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Nonprofits
          </div>
          <div className="text-xs font-normal text-black/60 font-sans cursor-pointer hover:underline">
            For Veterans
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-black/40 mt-8">
          <div>&copy; {new Date().getFullYear()} {name || 'ZERO°'}. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

