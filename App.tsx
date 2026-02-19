
import React, { useState, useEffect, useRef } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  ShieldCheckIcon, 
  Squares2X2Icon, 
  BookOpenIcon, 
  ChevronRightIcon, 
  GlobeAltIcon,
  EllipsisVerticalIcon,
  ArrowRightIcon,
  TrophyIcon,
  BoltIcon,
  CpuChipIcon,
  SparklesIcon,
  CheckBadgeIcon,
  SignalIcon,
  UserCircleIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  HomeModernIcon,
  BellAlertIcon,
  IdentificationIcon,
  ClipboardDocumentCheckIcon,
  MapPinIcon,
  CommandLineIcon,
  XMarkIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Message, MessageRole } from './types';
import { gemini } from './services/geminiService';

// Institutional Student Database (Master Records)
const STUDENT_DB: Record<string, string> = {
  "20210310001": "Jay Patel",
  "20210310002": "Anjali Sharma",
  "20210310003": "Ruchit Patel",
  "20210310004": "Smit Shah",
  "20210310005": "Priya Mehta",
  "20210310006": "Karan Varma",
  "20210310007": "Meera Joshi",
  "20210310008": "Deepika Amin",
  "20210310009": "Harshil Desani",
  "20210310010": "Vishwa Goti"
};

interface UserProfile {
  name: string;
  enrollment: string;
  role: 'Verified Student' | 'Guest User';
  isLoggedIn: boolean;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: MessageRole.MODEL,
      content: "Institutional Liaison Terminal Active.\n\n[ACCESS GRANTED]: Secure synchronization with the AMTICS Mainframe completed. I am ready to facilitate your academic mission.",
      timestamp: new Date(),
      metadata: { source: 'Liaison Core' }
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(114);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ enrollment: '', password: '' });
  const [user, setUser] = useState<UserProfile>({
    name: 'Guest User',
    enrollment: 'PUBLIC_ACCESS',
    role: 'Guest User',
    isLoggedIn: false
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const handleSendMessage = async (queryOverride?: string) => {
    const textToSend = queryOverride || input;
    if (!textToSend.trim()) return;
    
    const userMsg: Message = { 
        role: MessageRole.USER, 
        content: textToSend, 
        timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    if (!queryOverride) setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, parts: m.content }));
    const result = await gemini.getChatResponse(
      `[USER_CONTEXT: ${user.role} | ID: ${user.enrollment} | NAME: ${user.name}] ${textToSend}`, 
      history
    );
    
    const modelMsg: Message = { 
        role: MessageRole.MODEL, 
        content: cleanText(result.text || "System link interrupted. Re-authenticating with the AMTICS Mainframe..."), 
        timestamp: new Date(),
        metadata: { 
            grounding: result.grounding,
            source: user.isLoggedIn ? 'Institutional DB' : 'Public Index'
        }
    };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const enrollment = loginForm.enrollment.trim();
    const resolvedName = STUDENT_DB[enrollment];

    // Logic: Enrollment must exist in DB. Password is required but any value is accepted.
    if (resolvedName) {
      setUser({
        name: resolvedName,
        enrollment: enrollment,
        role: 'Verified Student',
        isLoggedIn: true
      });
      setIsLoginModalOpen(false);
      setMessages(prev => [...prev, {
        role: MessageRole.MODEL,
        content: `Mainframe Protocol: Secure Session Initiated.\n\nWelcome back, ${resolvedName}. Authentication successful for Enrollment ID [${enrollment}]. Your personalized dashboard and internal records are now accessible.`,
        timestamp: new Date(),
        metadata: { source: 'Auth Core' }
      }]);
      // Clear form
      setLoginForm({ enrollment: '', password: '' });
    } else {
      setLoginError('Enrollment ID not recognized. Access to the Institutional Mainframe is restricted to registered students only.');
    }
  };

  const logout = () => {
    setUser({
      name: 'Guest User',
      enrollment: 'PUBLIC_ACCESS',
      role: 'Guest User',
      isLoggedIn: false
    });
    setMessages(prev => [...prev, {
      role: MessageRole.MODEL,
      content: "Mainframe Session Terminated. Reverting to Public Mode. Secure student links have been disabled.",
      timestamp: new Date(),
      metadata: { source: 'Auth Core' }
    }]);
  };

  const openOfficialWebsite = () => window.open('https://www.utu.ac.in/AMTICS/', '_blank');
  const openSupportDesk = () => window.open('https://www.utu.ac.in/AMTICS/ContactUs.html', '_blank');
  const openStudentRegistry = () => window.open('https://app.utu.ac.in/stud', '_blank');

  const handleResourcesClick = () => {
    const resourcePortalMsg: Message = {
      role: MessageRole.MODEL,
      content: "Authorized Institutional Resource Portal initiated. Select a category below for real-time mainframe data retrieval:",
      timestamp: new Date(),
      metadata: { 
        source: 'Resource Core',
        isResourceMenu: true 
      }
    };
    setMessages(prev => [...prev, resourcePortalMsg]);
  };

  const quickActions = [
    { label: "TecXplore Events", icon: TrophyIcon, query: "Show me all events, rules and fees for TecXplore 3.0." },
    { label: "Robo Soccer Rules", icon: CpuChipIcon, query: "What are the rules and team requirements for Robo Soccer?" },
    { label: "Faculty Directory", icon: UserCircleIcon, query: "Find me faculty specialists in Machine Learning and Web." },
    { label: "Admission Portal", icon: SparklesIcon, query: "What are the admission requirements for 2026?" }
  ];

  const resourceCategories = [
    { label: "Course & Admission", icon: AcademicCapIcon, query: "Tell me about available courses and admission criteria." },
    { label: "Fees & Scholarship", icon: CurrencyDollarIcon, query: "Show me the fee structure and available scholarships (MYSY, etc.)." },
    { label: "Exam & Timetable", icon: CalendarIcon, query: "What is the exam schedule and academic holiday calendar?" },
    { label: "College Facilities", icon: HomeModernIcon, query: "Detail the college labs, library, and hostel facilities." },
    { label: "Event & Notices", icon: BellAlertIcon, query: "What are the latest events and official notices?" },
    { label: "Roll No Check", icon: IdentificationIcon, query: "How can I verify a student roll number in the registry?" },
    { label: "Result Status", icon: ClipboardDocumentCheckIcon, query: "How do I check my semester result status?" },
    { label: "Contact & Location", icon: MapPinIcon, query: "Where is the college located and how can I contact the office?" }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased overflow-hidden selection:bg-blue-100 relative">
      
      {/* --- Secure Identity Modal --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Identity Auth</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Mainframe Portal</p>
                  </div>
                  <button onClick={() => { setIsLoginModalOpen(false); setLoginError(''); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {loginError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                       <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
                       <p className="text-[11px] font-bold text-red-800 tracking-tight">{loginError}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enrollment Number</label>
                    <div className="relative flex items-center">
                       <IdentificationIcon className="absolute left-4 w-5 h-5 text-slate-400" />
                       <input 
                         required
                         type="text" 
                         value={loginForm.enrollment}
                         onChange={(e) => setLoginForm({...loginForm, enrollment: e.target.value})}
                         placeholder="e.g. 20210310003"
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none font-bold text-slate-900 transition-all uppercase placeholder:normal-case"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password (Any will work)</label>
                    <div className="relative flex items-center">
                       <LockClosedIcon className="absolute left-4 w-5 h-5 text-slate-400" />
                       <input 
                         required
                         type="password" 
                         value={loginForm.password}
                         onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                         placeholder="••••••••"
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none font-bold text-slate-900 transition-all"
                       />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#0F172A] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-slate-200 transition-all active:scale-95"
                  >
                    Authenticate & Access
                  </button>

                  <div className="text-center pt-4">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       Not a student? <button type="button" onClick={() => { setIsLoginModalOpen(false); setLoginError(''); }} className="text-blue-600 hover:underline">Continue as Visitor</button>
                     </p>
                  </div>
                </form>
              </div>
           </div>
        </div>
      )}

      {/* --- Desktop Sidebar --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shadow-[4px_0_24px_-10px_rgba(0,0,0,0.03)] z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={openOfficialWebsite}>
            <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
              <span className="text-white text-[11px] font-black tracking-widest uppercase">AI</span>
            </div>
            <div>
              <h1 className="text-xs font-black tracking-widest uppercase text-slate-900">AMTICS LIAISON</h1>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">v1.1</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <SidebarLink icon={<Squares2X2Icon className="w-4 h-4" />} label="Liaison Hub" active />
            <SidebarLink icon={<UsersIcon className="w-4 h-4" />} label="Student Registry" onClick={openStudentRegistry} />
            <SidebarLink icon={<BookOpenIcon className="w-4 h-4" />} label="Resources" onClick={handleResourcesClick} />
            <SidebarLink icon={<GlobeAltIcon className="w-4 h-4" />} label="UTU Portal" onClick={openOfficialWebsite} />
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-6">
          <div className="bg-[#F1F5F9]/50 p-5 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <SignalIcon className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Pulse</span>
            </div>
            <p className="text-3xl font-black tracking-tighter text-slate-900">{onlineCount}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Scholars Active</p>
          </div>

          {/* Identity Section: Resolved Name & Enrollment Display */}
          <div 
            onClick={() => user.isLoggedIn ? logout() : setIsLoginModalOpen(true)}
            className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-500/20 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-[12px] border relative group-hover:rotate-3 transition-transform ${
              user.isLoggedIn ? 'bg-[#0F172A] text-white border-slate-200 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              {user.isLoggedIn ? user.name.charAt(0) : <UserIcon className="w-5 h-5" />}
              {user.isLoggedIn && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                   <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{user.isLoggedIn ? `ID: ${user.enrollment}` : "Guest Access"}</p>
            </div>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-all" />
          </div>
        </div>
      </aside>

      {/* --- Main Liaison Console --- */}
      <main className="flex-1 flex flex-col relative bg-white lg:rounded-l-[3rem] shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.02)] overflow-hidden border-l border-slate-100">
        
        <header className="h-16 border-b border-slate-50 px-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-2xl z-20">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100/50 shadow-sm group cursor-default hover:bg-emerald-100 transition-all">
               <div className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </div>
               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Neural Link: Optimal</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100/50 shadow-sm group cursor-default hover:bg-white transition-all">
               <CommandLineIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mainframe Protocol v1.1</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={openSupportDesk}
              className="text-[9px] font-black bg-[#0F172A] text-white px-7 py-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              Support Desk
            </button>
            <EllipsisVerticalIcon className="w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-900 transition-colors" />
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-14 space-y-10 bg-[#F8FAFC]/40 custom-scroll"
        >
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto text-center space-y-10 py-16 animate-in fade-in slide-in-from-top-4 duration-1000">
               <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-slate-50 group hover:-rotate-3 transition-transform relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-[2.5rem] animate-pulse"></div>
                  <TrophyIcon className="w-10 h-10 text-blue-600 relative z-10" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Institutional Intelligence</h3>
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                     <StatusBadge label="TecXplore 3.0" />
                     <StatusBadge label="Sem 4 registry" />
                     <StatusBadge label="Vidwan Sync" />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                  {quickActions.map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(action.query)}
                      className="group flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors shadow-sm">
                        <action.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-black text-slate-900 block truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{action.label}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Institutional Sync</span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
              <div className={`flex gap-5 max-w-[94%] md:max-w-[82%] ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-[10px] shadow-md border ${
                  msg.role === MessageRole.MODEL ? 'bg-white border-slate-100 text-[#0F172A]' : 'bg-[#0F172A] border-[#0F172A] text-white'
                }`}>
                  {msg.role === MessageRole.MODEL ? 'AI' : user.isLoggedIn ? user.name.charAt(0) : 'GS'}
                </div>

                <div className={`space-y-2 ${msg.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
                  <div className={`px-6 py-5 rounded-[2rem] shadow-sm border ${
                    msg.role === MessageRole.MODEL 
                    ? 'bg-white border-slate-100 text-slate-800 rounded-tl-none font-medium' 
                    : 'bg-[#0F172A] text-white border-[#0F172A] rounded-tr-none shadow-xl shadow-slate-200 font-semibold'
                  }`}>
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.metadata?.isResourceMenu && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                        {resourceCategories.map((cat, i) => (
                          <button 
                            key={i}
                            onClick={() => handleSendMessage(cat.query)}
                            className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl hover:border-blue-500/40 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group"
                          >
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-all">
                              <cat.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors truncate">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.metadata?.grounding && (
                      <div className={`mt-6 pt-4 border-t ${msg.role === MessageRole.USER ? 'border-white/10' : 'border-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <GlobeAltIcon className={`w-3.5 h-3.5 ${msg.role === MessageRole.USER ? 'text-blue-200' : 'text-blue-600'}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${msg.role === MessageRole.USER ? 'text-blue-200' : 'text-slate-400'}`}>Institutional Source Link</span>
                        </div>
                        <div 
                          dangerouslySetInnerHTML={{ __html: msg.metadata.grounding }} 
                          className={`text-[11px] font-bold underline decoration-dotted underline-offset-4 ${msg.role === MessageRole.USER ? 'text-white/80' : 'text-blue-700'}`}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-2.5 px-2 ${msg.role === MessageRole.USER ? 'justify-end' : ''}`}>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.metadata?.source && (
                      <>
                        <span className="text-[9px] text-slate-200">|</span>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{msg.metadata.source}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-50 shadow-sm flex items-center justify-center">
                <div className="flex gap-1.5">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] animate-pulse">Querying Mainframe...</span>
            </div>
          )}
        </div>

        <footer className="p-8 md:p-12 border-t border-slate-50 bg-white z-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <SuggestionChip label="TecXplore Rules" onClick={() => handleSendMessage("What are the official rules for TecXplore 3.0?")} />
              <SuggestionChip label="Admissions 2026" onClick={() => handleSendMessage("Detail the B.Tech admission process for 2026.")} />
              <SuggestionChip label="Robo War Details" onClick={() => handleSendMessage("Show me rules and fees for Robo War (Robo Clash).")} />
            </div>

            <div className="relative flex items-center group">
               <div className="absolute left-6 text-slate-400 group-focus-within:text-blue-600 transition-all duration-300">
                  <MagnifyingGlassIcon className="w-6 h-6" />
               </div>
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder={user.isLoggedIn ? `Secure link active: How can I help, ${user.name.split(' ')[0]}?` : "Search manuals, courses, or events..."}
                 className="w-full py-6 pl-16 pr-44 bg-[#F8FAFC] border border-slate-200 rounded-[2.5rem] text-[15px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-500/20 transition-all placeholder:text-slate-400 uppercase tracking-tight"
               />
               <button 
                 onClick={() => handleSendMessage()}
                 disabled={!input.trim()}
                 className={`absolute right-3 px-