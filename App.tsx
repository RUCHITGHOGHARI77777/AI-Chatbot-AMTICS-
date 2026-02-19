
import React, { useState, useEffect, useRef } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  Squares2X2Icon, 
  BookOpenIcon, 
  ChevronRightIcon, 
  TrophyIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  HomeModernIcon,
  BellAlertIcon,
  MapPinIcon,
  XMarkIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  SignalIcon,
  ArrowRightOnRectangleIcon,
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
  CommandLineIcon,
  BriefcaseIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { Message, MessageRole } from './types';
import { gemini } from './services/geminiService';

const resourceCategories = [
  { label: 'Courses & Admission', icon: AcademicCapIcon, color: 'text-blue-500', bg: 'bg-blue-50', query: 'Tell me about available courses and admission.' },
  { label: 'Fees & Scholarships', icon: CurrencyDollarIcon, color: 'text-emerald-500', bg: 'bg-emerald-50', query: 'Information about fees and scholarships.' },
  { label: 'Placement Records', icon: BriefcaseIcon, color: 'text-amber-500', bg: 'bg-amber-50', query: 'Show placement statistics, packages, and top companies.' },
  { label: 'Faculty Directory', icon: IdentificationIcon, color: 'text-cyan-500', bg: 'bg-cyan-50', query: 'Provide details about the faculty members and their expertise.' },
  { label: 'Exam & Holidays', icon: CalendarIcon, color: 'text-orange-500', bg: 'bg-orange-50', query: 'Show academic calendar and exam schedule.' },
  { label: 'Facilities & Labs', icon: HomeModernIcon, color: 'text-purple-500', bg: 'bg-purple-50', query: 'What facilities and labs are available?' },
  { label: 'Events & Techfests', icon: BellAlertIcon, color: 'text-rose-500', bg: 'bg-rose-50', query: 'Latest events and TecXplore details.' },
  { label: 'Contact & Location', icon: MapPinIcon, color: 'text-indigo-500', bg: 'bg-indigo-50', query: 'Official contact and location info.' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'chat' | 'report' | 'contact'>('chat');
  const [reportPage, setReportPage] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: MessageRole.MODEL,
      content: "Liaison Terminal Active. Human connection established.",
      timestamp: new Date(),
      metadata: { source: 'System' }
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState({ name: 'Guest', enrollment: 'PUBLIC', isLoggedIn: false });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: '', pass: '' });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const reportScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'chat' && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, view]);

  const handleSendMessage = async (q?: string) => {
    const text = q || input;
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: MessageRole.USER, content: text, timestamp: new Date() }]);
    if (!q) setInput('');
    setIsTyping(true);
    
    // Fast simulated thinking for human-like rhythm
    const result = await gemini.getChatResponse(text, messages.map(m => ({ role: m.role, parts: m.content })));
    
    setMessages(prev => [...prev, { 
      role: MessageRole.MODEL, 
      content: result.text, 
      timestamp: new Date(),
      metadata: { grounding: result.grounding }
    }]);
    setIsTyping(false);
  };

  const handleGuestEnter = () => {
    setMessages(prev => [...prev, {
      role: MessageRole.MODEL,
      content: "Welcome, Scholar. I've enabled Guest Access for you. Ask me anything about AMTICS.",
      timestamp: new Date(),
      metadata: { source: 'System' }
    }]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.id.trim()) return;

    // Universal login logic: If it contains 'ruchit' or is a specific number, use 'Ruchit Patel'
    let finalName = `Scholar ${loginForm.id}`;
    const searchStr = loginForm.id.toLowerCase();
    if (searchStr.includes('ruchit') || searchStr === '20210310003') {
      finalName = "Ruchit Patel";
    }

    setUser({ name: finalName, enrollment: loginForm.id, isLoggedIn: true });
    setIsLoginModalOpen(false);
    
    setMessages(prev => [...prev, {
      role: MessageRole.MODEL,
      content: `Access granted. Good to see you, ${finalName}. How can I help you today?`,
      timestamp: new Date(),
      metadata: { source: 'Auth' }
    }]);
  };

  const ReportView = () => {
    const pages = [
      {
        title: "Executive Summary & Project Vision",
        subtitle: "Chapter 01: Defining the Digital Liaison",
        content: (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl">
              <p className="text-sm italic text-slate-500 mb-6">"Bridging the communication gap between institutional administration and student success through advanced cognitive reasoning."</p>
              <p className="text-sm leading-[1.8] text-slate-700 first-letter:text-3xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-1">
                The AMTICS Liaison Framework is a strategic digital transformation initiative designed to centralize information flow within the Asha M. Tarsadia Institute. In an era of information overflow, students often struggle to find verified, real-time administrative data. This project conceptualizes a high-fidelity AI agent that acts as a 24/7 technical and administrative mentor.
              </p>
            </div>
          </div>
        )
      },
      {
        title: "UX Design & Figma Workflow",
        subtitle: "Chapter 04: The Human Interface",
        content: (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-8">
               <div className="flex-1 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aesthetics & Design Tools</h4>
                  <p className="text-xs text-slate-500 leading-[1.8]">The visual architecture of the AMTICS Liaison Hub was meticulously crafted using **Figma**. By leveraging Figma’s powerful prototyping and component systems, we achieved a perfect balance between institutional authority and modern digital clarity.</p>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-slate-900 border border-slate-800 shadow-sm"></div>
                    <div className="w-6 h-6 rounded bg-blue-500 border border-blue-400 shadow-sm"></div>
                    <div className="w-6 h-6 rounded bg-slate-50 border border-slate-100 shadow-sm"></div>
                  </div>
               </div>
               <div className="flex-1 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Figma Integration</h4>
                  <p className="text-[11px] text-slate-400 italic">"The use of Figma allowed for iterative testing of the 'Two-Line Institutional Branding' and ensured that the mobile response remains pixel-perfect across all student devices."</p>
               </div>
            </div>
          </div>
        )
      }
    ];
    const currentPage = pages[reportPage - 1] || pages[0];

    return (
      <div className="flex-1 bg-white overflow-y-auto custom-scroll flex flex-col" ref={reportScrollRef}>
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-8 py-4 border-b border-slate-50 flex items-center justify-between">
           <button onClick={() => setView('chat')} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                <ArrowLeftIcon className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Console</span>
           </button>
           <div className="flex items-center gap-4">
              <span className="text-[9px] font-black text-slate-900 font-mono">Report Mode Active</span>
           </div>
        </div>
        <div className="flex-1 max-w-4xl mx-auto w-full p-8 md:p-20 space-y-16">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">{currentPage.subtitle}</p>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{currentPage.title}</h1>
           </div>
           <div className="font-serif">{currentPage.content}</div>
           <div className="pt-20 flex justify-between items-center border-t border-slate-50">
              <button disabled={reportPage === 1} onClick={() => setReportPage(prev => Math.max(1, prev - 1))} className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${reportPage === 1 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900'}`}><ArrowLongLeftIcon className="w-5 h-5" /> Previous</button>
              <button onClick={() => setReportPage(prev => Math.min(pages.length, prev + 1))} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:gap-5 transition-all">Next <ArrowLongRightIcon className="w-5 h-5" /></button>
           </div>
        </div>
      </div>
    );
  };

  const ContactView = () => (
    <div className="flex-1 bg-[#FDFDFF] overflow-y-auto p-6 md:p-16 animate-in fade-in duration-500 custom-scroll">
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Institutional Contact</h1>
        <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xl font-black text-slate-900">Dr. Vishvajit Bakrola</h3>
          <p className="text-lg font-black text-blue-600 font-mono">+91 99096 78400</p>
        </div>
        <button onClick={() => setView('chat')} className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2"><ArrowLeftIcon className="w-3 h-3" /> Return to Terminal</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFDFF] text-slate-900 selection:bg-blue-50 overflow-hidden font-sans">
      
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
           <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 transform transition-all">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Institutional Portal</h3>
                <button onClick={() => setIsLoginModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><XMarkIcon className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <input required value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} placeholder="ENROLLMENT NUMBER" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] tracking-widest outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300" />
                <input required type="password" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})} placeholder="SECURE KEY" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] tracking-widest outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300" />
                <button className="w-full py-5 bg-slate-900 text-white rounded-[1.4rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95">Open Terminal Access</button>
              </form>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-50 flex flex-col hidden lg:flex z-30 transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-100"><CommandLineIcon className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-[11px] font-black tracking-widest uppercase text-slate-900">AMTICS LIAISON</h1>
              <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Human Context AI</p>
            </div>
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={<Squares2X2Icon className="w-4 h-4" />} label="Liaison Hub" active={view === 'chat'} onClick={() => setView('chat')} />
            <SidebarItem icon={<DocumentTextIcon className="w-4 h-4" />} label="Project Report" active={view === 'report'} onClick={() => { setView('report'); setReportPage(1); }} />
            <SidebarItem icon={<MapPinIcon className="w-4 h-4" />} label="Contact Center" active={view === 'contact'} onClick={() => setView('contact')} />
          </nav>
        </div>
        <div className="mt-auto p-8">
          <div onClick={() => !user.isLoggedIn && setIsLoginModalOpen(true)} className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all border ${user.isLoggedIn ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-slate-900 border-slate-900 shadow-xl group hover:scale-[1.02]'}`}>
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${user.isLoggedIn ? 'bg-white text-slate-900 border border-slate-100' : 'bg-white text-slate-900'}`}>{user.isLoggedIn ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}</div>
             <div className="flex-1 overflow-hidden">
                <p className={`text-[10px] font-black truncate ${user.isLoggedIn ? 'text-slate-900' : 'text-white'}`}>{user.isLoggedIn ? user.name : 'Sign In'}</p>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{user.isLoggedIn ? 'Active' : 'Guest Mode'}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col bg-white lg:rounded-l-[3rem] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.03)] border-l border-slate-50 overflow-hidden relative">
        {view === 'report' ? <ReportView /> : view === 'contact' ? <ContactView /> : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 custom-scroll bg-[#FCFCFD]">
              {messages.length === 1 && (
                <div className="max-w-5xl mx-auto text-center py-20 space-y-16 animate-in fade-in zoom-in-95 duration-1000 slide-in-from-bottom-10">
                   <div className="space-y-10">
                      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7.5rem] font-black text-slate-900 tracking-tighter uppercase leading-[0.85] md:leading-[0.9] drop-shadow-md select-none transition-all hover:tracking-[-0.05em] duration-500">
                        Asha M. Tarsadia Institute of <br className="hidden sm:block"/> Computer Science and Technology
                      </h1>
                      <div className="h-3 w-80 bg-slate-900 mx-auto rounded-full shadow-lg shadow-slate-100"></div>
                   </div>
                   <div className="space-y-6">
                      <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none opacity-20 select-none animate-pulse">Welcome</h2>
                   </div>
                   <div className="space-y-12">
                      <div className="inline-flex flex-col items-center">
                        <div className={`flex items-center gap-5 px-14 py-6 rounded-full shadow-2xl transition-all duration-500 ${user.isLoggedIn ? 'bg-white border-2 border-emerald-100 shadow-emerald-50' : 'bg-white border border-slate-100 shadow-slate-100'}`}>
                           {user.isLoggedIn ? <CheckBadgeIcon className="w-7 h-7 text-emerald-500 animate-bounce" /> : <UserIcon className="w-7 h-7 text-slate-200" />}
                           <span className="text-sm md:text-base font-black text-slate-900 uppercase tracking-[0.3em]">
                             {user.isLoggedIn ? `Verified: ${user.name}` : 'Identity: Guest scholar'}
                           </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        {!user.isLoggedIn && (
                          <button onClick={() => setIsLoginModalOpen(true)} className="inline-flex items-center gap-5 px-16 py-7 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-[0_25px_60px_rgba(15,23,42,0.25)] hover:scale-110 hover:-rotate-1 transition-all active:scale-95 group">Authenticate Access <ArrowRightOnRectangleIcon className="w-6 h-6 group-hover:translate-x-4 transition-transform" /></button>
                        )}
                        <button onClick={handleGuestEnter} className="inline-flex items-center gap-5 px-16 py-7 bg-white border-2 border-slate-100 text-slate-400 rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95">Guest Terminal <CommandLineIcon className="w-6 h-6" /></button>
                      </div>
                   </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500 ${msg.role === MessageRole.USER ? 'slide-in-from-right-8' : 'slide-in-from-left-8'}`}>
                   <div className={`flex gap-4 max-w-[90%] md:max-w-[75%] ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center text-[10px] font-black shadow-lg transition-transform hover:scale-110 ${msg.role === MessageRole.MODEL ? 'bg-white text-slate-900 border border-slate-100' : 'bg-slate-900 text-white'}`}>
                        {msg.role === MessageRole.MODEL ? <SignalIcon className="w-4 h-4 text-blue-500" /> : user.isLoggedIn ? user.name.charAt(0) : 'G'}
                      </div>
                      <div className={`space-y-1.5 ${msg.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
                        <div className={`px-6 py-4 rounded-[1.8rem] text-[13px] shadow-sm transition-all ${msg.role === MessageRole.MODEL ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium leading-[1.7]' : 'bg-slate-900 text-white border-slate-900 rounded-tr-none font-semibold shadow-xl shadow-slate-200/50'}`}>
                           {msg.content}
                           {msg.metadata?.grounding && (
                             <div className="mt-5 pt-5 border-t border-slate-50 space-y-3">
                               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Verified Citations</p>
                               <div className="flex flex-wrap gap-2">
                                 {msg.metadata.grounding.map((c: any, j: number) => c.web && (
                                   <a key={j} href={c.web.uri} target="_blank" className="text-[8px] font-bold text-blue-500 hover:text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 transition-all hover:bg-white">{c.web.title}</a>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                        <p className="text-[7px] font-black text-slate-300 uppercase px-3 tracking-widest">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                   </div>
                </div>
              ))}
              {isTyping && <div className="flex gap-4 items-center px-12 animate-in fade-in duration-300"><div className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div></div><span className="text-[9px] font-black text-slate-200 uppercase tracking-widest italic">Mainframe thinking...</span></div>}
            </div>

            <footer className="p-6 md:p-10 bg-white border-t border-slate-50 z-20">
               <div className="max-w-3xl mx-auto relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-200 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="ASK ME ANYTHING... (TYPOS OK)" className="w-full py-6 pl-16 pr-36 bg-slate-50 border-2 border-slate-50 rounded-[2rem] text-xs font-black text-slate-900 focus:outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-200 uppercase tracking-widest shadow-inner" />
                  <button onClick={() => handleSendMessage()} disabled={!input.trim()} className={`absolute right-2 top-2 px-8 py-4 rounded-[1.6rem] flex items-center gap-3 transition-all ${input.trim() ? 'bg-slate-900 text-white shadow-2xl hover:scale-105 active:scale-95' : 'bg-slate-50 text-slate-200 cursor-not-allowed'}`}><span className="text-[10px] font-black uppercase tracking-widest">SEND</span><PaperAirplaneIcon className="w-4 h-4 -rotate-45" /></button>
               </div>
               <div className="flex justify-between items-center max-w-3xl mx-auto mt-6">
                 <p className="text-[7px] text-slate-200 font-black uppercase tracking-[0.5em]">Liaison Terminal v1.1.5</p>
                 <div className="flex gap-4 items-center">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    <p className="text-[7px] text-slate-300 font-black uppercase tracking-widest">Secure Uplink Verified</p>
                 </div>
               </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-slate-900 text-white shadow-xl shadow-slate-100 font-black scale-[1.05]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-bold'}`}>
    <div className={active ? 'text-blue-400' : 'text-slate-200'}>{icon}</div>
    <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default App;
