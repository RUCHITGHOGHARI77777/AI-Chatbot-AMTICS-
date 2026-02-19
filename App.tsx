
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
  SignalIcon
} from '@heroicons/react/24/outline';
import { Message, MessageRole } from './types';
import { gemini } from './services/geminiService';

const STUDENT_DB: Record<string, string> = {
  "20210310001": "Jay Patel",
  "20210310002": "Anjali Sharma",
  "20210310003": "Ruchit Patel",
  "20210310004": "Smit Shah",
  "20210310005": "Priya Mehta"
};

const resourceCategories = [
  { label: 'Courses & Admission', icon: AcademicCapIcon, color: 'text-blue-500', bg: 'bg-blue-50', query: 'Tell me about available courses and admission.' },
  { label: 'Fees & Scholarships', icon: CurrencyDollarIcon, color: 'text-emerald-500', bg: 'bg-emerald-50', query: 'Information about fees and scholarships.' },
  { label: 'Exam & Holidays', icon: CalendarIcon, color: 'text-orange-500', bg: 'bg-orange-50', query: 'Show academic calendar and exam schedule.' },
  { label: 'Facilities & Labs', icon: HomeModernIcon, color: 'text-purple-500', bg: 'bg-purple-50', query: 'What facilities and labs are available?' },
  { label: 'Events & Techfests', icon: BellAlertIcon, color: 'text-rose-500', bg: 'bg-rose-50', query: 'Latest events and TecXplore details.' },
  { label: 'Contact & Location', icon: MapPinIcon, color: 'text-indigo-500', bg: 'bg-indigo-50', query: 'Official contact and location info.' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'chat' | 'report' | 'contact'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: MessageRole.MODEL,
      content: "Liaison Terminal Active. Mainframe synchronized.",
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

  useEffect(() => {
    if (view === 'chat' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, view]);

  const handleSendMessage = async (q?: string) => {
    const text = q || input;
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: MessageRole.USER, content: text, timestamp: new Date() }]);
    if (!q) setInput('');
    setIsTyping(true);
    const result = await gemini.getChatResponse(text, messages.map(m => ({ role: m.role, parts: m.content })));
    setMessages(prev => [...prev, { 
      role: MessageRole.MODEL, 
      content: result.text, 
      timestamp: new Date(),
      metadata: { grounding: result.grounding }
    }]);
    setIsTyping(false);
  };

  const handleResourcesClick = () => {
    // PREVENT REPETITION: Check if last message is already resource menu
    if (messages[messages.length - 1]?.metadata?.isResourceMenu) return;

    setMessages(prev => [...prev, {
      role: MessageRole.MODEL,
      content: "Authorized Institutional Resource Portal initiated. Select a category below:",
      timestamp: new Date(),
      metadata: { source: 'Resource Core', isResourceMenu: true }
    }]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = STUDENT_DB[loginForm.id];
    if (name) {
      setUser({ name, enrollment: loginForm.id, isLoggedIn: true });
      setIsLoginModalOpen(false);
    }
  };

  const ContactView = () => (
    <div className="flex-1 bg-[#FDFDFF] overflow-y-auto p-6 md:p-16 animate-in fade-in duration-500 custom-scroll">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Institutional Contact</h1>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">AMTICS Liaison Center</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                 <BuildingOffice2Icon className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Campus Address</h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Asha M. Tarsadia Institute (AMTICS)<br/>
                Maliba Campus, Gopal Vidyanagar,<br/>
                Bardoli Mahuva Road, Tarsadi,<br/>
                Dist: Surat - 394 350, Gujarat (INDIA).
              </p>
           </div>

           <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                 <EnvelopeIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Director Liaison</h4>
              <p className="text-xs font-bold text-slate-900">director.amtics@utu.ac.in</p>
              <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">Official Support Channel</p>
           </div>

           <div className="md:col-span-2 group p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-100 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full">
                    <CheckBadgeIcon className="w-3 h-3 text-blue-500" />
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Authorized Liaison</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Dr. Vishvajit Bakrola</h3>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Head of Department / Administrative Contact</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-black text-slate-900 font-mono tracking-tight">+91 99096 78400</span>
                </div>
              </div>
           </div>
        </div>

        <button onClick={() => setView('chat')} className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
           <ArrowLeftIcon className="w-3 h-3" /> Return to Terminal
        </button>
      </div>
    </div>
  );

  const ReportView = () => (
    <div className="flex-1 bg-white overflow-y-auto p-10 md:p-32 font-serif text-slate-800 leading-[2.1] custom-scroll">
      <div className="max-w-3xl mx-auto space-y-20">
        <div className="text-center space-y-6 pb-20 border-b border-slate-100">
           <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Technical Project Report</h1>
           <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-sans">Institutional AI Framework v1.1</p>
           <div className="flex justify-center gap-2 pt-6 font-sans">
              <span className="px-3 py-1 bg-slate-900 text-white text-[7px] font-black uppercase rounded-full">Python Core</span>
              <span className="px-3 py-1 bg-slate-900 text-white text-[7px] font-black uppercase rounded-full">React 19</span>
              <span className="px-3 py-1 bg-slate-900 text-white text-[7px] font-black uppercase rounded-full">Firebase</span>
           </div>
        </div>
        <section className="space-y-6">
           <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 border-l-2 border-slate-900 pl-4 font-sans">Abstract</h2>
           <p className="text-sm text-justify leading-[2]">This project details the development of a cognitive institutional interface for AMTICS. Built with a React frontend and a Python-orchestrated backend, the system leverages Gemini 3 Pro for high-fidelity natural language reasoning.</p>
        </section>
        <div className="flex justify-center"><button onClick={() => setView('chat')} className="px-8 py-3 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest font-sans">Return to Hub</button></div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFDFF] text-slate-900 selection:bg-blue-50 overflow-hidden font-sans">
      
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Identify</h3>
                <button onClick={() => setIsLoginModalOpen(false)}><XMarkIcon className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input required value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} placeholder="Enrollment No" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs uppercase outline-none focus:border-blue-500" />
                <input required type="password" placeholder="Access Key" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:border-blue-500" />
                <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest">Connect</button>
              </form>
           </div>
        </div>
      )}

      {/* Sidebar - Thinner Design */}
      <aside className="w-60 bg-white border-r border-slate-50 flex flex-col hidden lg:flex z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><span className="text-white text-[9px] font-black">AI</span></div>
            <div>
              <h1 className="text-[10px] font-black tracking-widest uppercase">AMTICS HUB</h1>
              <p className="text-[6px] text-slate-400 font-bold uppercase tracking-widest">Institutional Liaison</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            <SidebarItem icon={<Squares2X2Icon className="w-4 h-4" />} label="Liaison Hub" active={view === 'chat'} onClick={() => setView('chat')} />
            <SidebarItem icon={<DocumentTextIcon className="w-4 h-4" />} label="Project Report" active={view === 'report'} onClick={() => setView('report')} />
            <SidebarItem icon={<MapPinIcon className="w-4 h-4" />} label="Contact Us" active={view === 'contact'} onClick={() => setView('contact')} />
            <SidebarItem icon={<BookOpenIcon className="w-4 h-4" />} label="Resources" onClick={handleResourcesClick} />
            <SidebarItem icon={<UsersIcon className="w-4 h-4" />} label="Registry" onClick={() => window.open('https://app.utu.ac.in/stud', '_blank')} />
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
             <div className="flex items-center gap-2 mb-1">
               <SignalIcon className="w-2.5 h-2.5 text-blue-500 animate-pulse" />
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Sync</span>
             </div>
             <p className="text-xl font-black text-slate-900 tracking-tighter">114</p>
             <p className="text-[7px] font-bold text-slate-400 uppercase">Scholars Active</p>
          </div>
          <div onClick={() => !user.isLoggedIn && setIsLoginModalOpen(true)} className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-blue-100 transition-all">
             <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black ${user.isLoggedIn ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300'}`}>
                {user.isLoggedIn ? user.name.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-black truncate">{user.name}</p>
                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">{user.isLoggedIn ? 'Verified' : 'Guest'}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col bg-white lg:rounded-l-[2rem] shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.02)] border-l border-slate-50 overflow-hidden">
        {view === 'report' ? <ReportView /> : view === 'contact' ? <ContactView /> : (
          <>
            <header className="h-12 border-b border-slate-50 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
               <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[7px] font-black text-emerald-700 uppercase tracking-widest">Mainframe: Sync</span>
               </div>
               <button onClick={() => setView('report')} className="text-[7px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">v1.1 Core</button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 custom-scroll bg-[#FCFCFD]">
              {messages.length === 1 && (
                <div className="max-w-xl mx-auto text-center py-24 md:py-32 space-y-8 animate-in fade-in zoom-in-95 duration-1000">
                   <div className="space-y-3">
                      <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">Welcome</h1>
                      <div className="h-1 w-20 bg-slate-900 mx-auto rounded-full"></div>
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.5em]">AMTICS Liaison Framework</h2>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Asha M. Tarsadia Institute of Computer Science</p>
                   </div>
                   <div className="flex justify-center gap-3 pt-4">
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Core Synchronized</span>
                      </div>
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2">
                         <SignalIcon className="w-3 h-3 text-blue-500" />
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Secure Link Active</span>
                      </div>
                   </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                   <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[8px] font-black shadow-sm ${msg.role === MessageRole.MODEL ? 'bg-white text-slate-900 border border-slate-100' : 'bg-slate-900 text-white'}`}>
                        {msg.role === MessageRole.MODEL ? 'AI' : user.isLoggedIn ? user.name.charAt(0) : 'G'}
                      </div>
                      <div className={`space-y-1 ${msg.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
                        <div className={`px-4 py-2.5 rounded-xl text-[12px] leading-relaxed shadow-sm ${msg.role === MessageRole.MODEL ? 'bg-white border border-slate-100 text-slate-600 rounded-tl-none font-medium' : 'bg-slate-900 text-white border-slate-900 rounded-tr-none'}`}>
                           {msg.content}
                           {msg.metadata?.grounding && (
                             <div className="mt-3 pt-3 border-t border-slate-50 space-y-2">
                               <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Sources</p>
                               <div className="flex flex-wrap gap-1.5">
                                 {msg.metadata.grounding.map((c: any, j: number) => c.web && (
                                   <a key={j} href={c.web.uri} target="_blank" className="text-[7px] font-bold text-blue-500 hover:underline bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{c.web.title}</a>
                                 ))}
                               </div>
                             </div>
                           )}
                           {msg.metadata?.isResourceMenu && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                               {resourceCategories.map((cat, i) => (
                                 <button key={i} onClick={() => handleSendMessage(cat.query)} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-blue-200 hover:bg-white transition-all text-left group">
                                   <div className={`w-6 h-6 ${cat.bg} rounded flex items-center justify-center border border-white transition-all`}><cat.icon className={`w-3 h-3 ${cat.color}`} /></div>
                                   <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight truncate">{cat.label}</span>
                                 </button>
                               ))}
                             </div>
                           )}
                        </div>
                        <p className="text-[6px] font-black text-slate-300 uppercase px-1.5">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                   </div>
                </div>
              ))}
              {isTyping && <div className="flex gap-2 items-center px-4"><div className="flex gap-1"><div className="w-0.5 h-0.5 bg-slate-300 rounded-full animate-bounce"></div><div className="w-0.5 h-0.5 bg-slate-300 rounded-full animate-bounce delay-75"></div><div className="w-0.5 h-0.5 bg-slate-300 rounded-full animate-bounce delay-150"></div></div></div>}
            </div>

            <footer className="p-4 md:p-8 bg-white border-t border-slate-50 z-20">
               <div className="max-w-2xl mx-auto relative group">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 group-focus-within:text-blue-500 transition-colors" />
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Search manuals, courses, or events..." className="w-full py-3.5 pl-10 pr-28 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-200 uppercase tracking-tight" />
                  <button onClick={() => handleSendMessage()} disabled={!input.trim()} className={`absolute right-1.5 top-1.5 px-5 py-2 rounded-lg flex items-center gap-2 transition-all ${input.trim() ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-200 cursor-not-allowed'}`}><span className="text-[8px] font-black uppercase tracking-widest">Query</span><PaperAirplaneIcon className="w-3 h-3 -rotate-45" /></button>
               </div>
               <div className="flex justify-between items-center max-w-2xl mx-auto mt-4">
                 <p className="text-[6px] text-slate-200 font-black uppercase tracking-[0.4em]">Liaison Portal v1.1</p>
                 <p className="text-[6px] text-slate-200 font-black uppercase tracking-widest">Python & Cloud Architecture</p>
               </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-slate-900 text-white shadow-sm font-black' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-bold'}`}>
    <div className={active ? 'text-blue-400' : 'text-slate-200'}>{icon}</div>
    <span className="text-[8px] uppercase tracking-[0.15em]">{label}</span>
  </div>
);

export default App;
