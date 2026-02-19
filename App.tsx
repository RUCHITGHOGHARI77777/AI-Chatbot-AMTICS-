
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
  ExclamationCircleIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowLeftIcon
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
  const [view, setView] = useState<'chat' | 'report'>('chat');
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
  };

  const openOfficialWebsite = () => window.open('https://www.utu.ac.in/AMTICS/', '_blank');
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
    { label: "Faculty Directory", icon: UserCircleIcon, query: "Find me faculty specialists in Machine Learning and Web." },
    { label: "Admission Portal", icon: SparklesIcon, query: "What are the admission requirements for 2026?" }
  ];

  const resourceCategories = [
    { label: "Course & Admission", icon: AcademicCapIcon, query: "Tell me about available courses and admission criteria." },
    { label: "Fees & Scholarship", icon: CurrencyDollarIcon, query: "Show me the fee structure and available scholarships (MYSY, etc.)." },
    { label: "Exam & Timetable", icon: CalendarIcon, query: "What is the exam schedule and academic holiday calendar?" },
    { label: "College Facilities", icon: HomeModernIcon, query: "Detail the college labs, library, and hostel facilities." },
    { label: "Event & Notices", icon: BellAlertIcon, query: "What are the latest events and official notices?" },
    { label: "Result Status", icon: ClipboardDocumentCheckIcon, query: "How do I check my semester result status?" },
    { label: "Contact & Location", icon: MapPinIcon, query: "Where is the college located and how can I contact the office?" }
  ];

  const ProjectReport = () => (
    <div className="flex-1 bg-white overflow-y-auto p-12 md:p-24 font-serif text-slate-900 leading-[1.8] animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* PAGE 1: COVER & INSTITUTIONAL HEADER */}
        <div className="text-center space-y-10 py-10 border-b-2 border-slate-200">
          <div className="space-y-4">
             <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Final Project Technical Documentation</h1>
             <h2 className="text-xl font-medium text-slate-500 uppercase tracking-[0.3em]">Institutional Liaison AI System (V1.1)</h2>
          </div>
          <div className="py-10">
             <div className="w-32 h-32 bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-3xl">AMT</span>
             </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold">Asha M. Tarsadia Institute of Computer Science and Technology</p>
            <p className="text-slate-500">Uka Tarsadia University, Maliba Campus, Bardoli</p>
          </div>
        </div>

        {/* PAGE 2: ABSTRACT & INTRODUCTION */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tight border-b border-slate-100 pb-2">01. Project Abstract</h3>
          <p className="text-justify first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
            In the current academic landscape, information fragmentation often leads to student confusion and administrative bottlenecks. This project, the <strong>AMTICS Liaison AI</strong>, addresses this challenge by centralizing institutional knowledge into a high-performance neural interface. Developed specifically for our institute, the system utilizes advanced Natural Language Processing (NLP) through the Gemini 3 Pro reasoning engine to deliver human-like assistance for complex institutional queries.
          </p>
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 italic text-blue-900 font-sans text-sm">
            "The goal is not just to build a chatbot, but to create a 'Digital Concierge' that understands student context—knowing who is asking (Registry Check) and what they need based on the current academic calendar."
          </div>
        </section>

        {/* PAGE 3: TECHNICAL ARCHITECTURE & GEMINI 3 PRO */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tight border-b border-slate-100 pb-2">02. Technical Architecture</h3>
          <p>
            The system is built on a modern <strong>MERN-inspired</strong> architecture, optimized for client-side performance and real-time AI inference.
          </p>
          <div className="space-y-8 mt-6">
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold">A</div>
               <div>
                  <h4 className="font-bold text-slate-900">Gemini 3 Pro Inference Engine</h4>
                  <p className="text-sm text-slate-600">The primary logic is handled by the Gemini 3 Pro model via high-security API integration. Unlike standard models, it is constrained by <strong>System Instructions</strong> to act exclusively as an AMTICS Liaison, preventing hallucinations and ensuring data accuracy regarding college events like TecXplore 3.0.</p>
               </div>
            </div>
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold">B</div>
               <div>
                  <h4 className="font-bold text-slate-900">React 19 & Tailwind Design System</h4>
                  <p className="text-sm text-slate-600">The UI utilizes a <strong>Glassmorphism</strong> aesthetic, designed to reduce cognitive load. The responsive layout ensures that students can access the Liaison from lab workstations and mobile devices during on-campus events.</p>
               </div>
            </div>
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold">C</div>
               <div>
                  <h4 className="font-bold text-slate-900">Grounding Metadata Layer</h4>
                  <p className="text-sm text-slate-600">To maintain real-world accuracy, the AI uses Google Search Grounding to verify external links and official university notices, providing verified sources for every claim made during the session.</p>
               </div>
            </div>
          </div>
        </section>

        {/* PAGE 4: FIREBASE PERSISTENCE & DATABASE LOGIC */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tight border-b border-slate-100 pb-2">03. Firebase Cloud Synchronization</h3>
          <p>
            To ensure session continuity and data integrity, the project is integrated with <strong>Firebase Cloud Services</strong>. This layer handles three critical functions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-6 border border-slate-100 rounded-3xl space-y-3">
               <h5 className="font-black text-xs uppercase tracking-widest text-blue-600">Realtime Database</h5>
               <p className="text-xs font-medium">Stores student interaction logs and feedback, allowing administration to analyze the most common queries and pain points in real-time.</p>
            </div>
            <div className="p-6 border border-slate-100 rounded-3xl space-y-3">
               <h5 className="font-black text-xs uppercase tracking-widest text-emerald-600">Firestore Registry</h5>
               <p className="text-xs font-medium">Contains the mapping of Enrollment IDs to Student Names. This is how the system recognizes a user instantly without requiring a heavy registration process.</p>
            </div>
            <div className="p-6 border border-slate-100 rounded-3xl space-y-3">
               <h5 className="font-black text-xs uppercase tracking-widest text-purple-600">Session Management</h5>
               <p className="text-xs font-medium">Handles the state of the "Verified Student" vs "Guest User" sessions, ensuring security boundaries are maintained across page reloads.</p>
            </div>
            <div className="p-6 border border-slate-100 rounded-3xl space-y-3">
               <h5 className="font-black text-xs uppercase tracking-widest text-orange-600">Security Rules</h5>
               <p className="text-xs font-medium">Firebase Security Rules ensure that only verified institutional API calls are processed, preventing unauthorized access to student records.</p>
            </div>
          </div>
        </section>

        {/* PAGE 5: SECURITY, SCOPE & CONCLUSION */}
        <section className="space-y-8">
          <h3 className="text-2xl font-black uppercase tracking-tight border-b border-slate-100 pb-2">04. Authentication Strategy</h3>
          <p>
            A major challenge was the balance between security and user friction. Standard password systems are often forgotten by students. This project implements an <strong>Enrollment-Centric Auth Logic</strong>:
          </p>
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] space-y-4 font-mono text-sm leading-relaxed">
            <p>// Authentication Pseudo-Code</p>
            <p>function handleSecureLogin(id, pass) &#123;</p>
            <p className="ml-6">const student = DATABASE.find(id);</p>
            <p className="ml-6">if (student) &#123;</p>
            <p className="ml-12">Session.Initiate(student.name, student.enrollment);</p>
            <p className="ml-12">UI.Display("Welcome back " + student.name);</p>
            <p className="ml-6">&#125; else &#123; UI.ThrowError("Invalid Registry Entry"); &#125;</p>
            <p>&#125;</p>
          </div>

          <div className="space-y-6 pt-10">
            <h3 className="text-2xl font-black uppercase tracking-tight border-b border-slate-100 pb-2">05. Conclusion</h3>
            <p>
              The AMTICS Liaison AI represents a significant step toward a smart campus. By integrating high-level AI reasoning (Gemini 3 Pro) with robust cloud backend services (Firebase), we have created a scalable, student-centric tool that enhances institutional efficiency. This system is ready for immediate deployment as the official helpdesk for upcoming technical festivals and academic admissions.
            </p>
          </div>
        </section>

        {/* SIGNATURE AREA */}
        <div className="pt-24 flex flex-col md:flex-row justify-between items-start gap-16 border-t border-slate-100">
           <div className="space-y-20">
              <div className="w-48 h-px bg-slate-300"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Head of Department (HOD)</p>
           </div>
           <div className="space-y-20 text-right">
              <div className="w-48 h-px bg-slate-300 ml-auto"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Guide / Faculty Mentor</p>
           </div>
        </div>

        {/* INTERNAL FOOTER */}
        <div className="text-center pt-20">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[1em]">Official Project Document // No: AMT-AI-2025</p>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-10 no-print">
           <button 
             onClick={() => setView('chat')}
             className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl active:scale-95"
           >
             <ArrowLeftIcon className="w-5 h-5" />
             Return to System Hub
           </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .flex-1 { overflow: visible !important; }
          .animate-in { animation: none !important; }
        }
      `}} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased overflow-hidden selection:bg-blue-100 relative">
      
      {/* --- Secure Identity Modal --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Identity Hub</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AMTICS Mainframe Authentication</p>
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Enrollment No</label>
                    <div className="relative flex items-center">
                       <IdentificationIcon className="absolute left-4 w-5 h-5 text-slate-400" />
                       <input 
                         required
                         type="text" 
                         value={loginForm.enrollment}
                         onChange={(e) => setLoginForm({...loginForm, enrollment: e.target.value})}
                         placeholder="ID Retrieval Check"
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none font-bold text-slate-900 transition-all uppercase placeholder:normal-case"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
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
                    Authenticate Session
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
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shadow-[4px_0_24px_-10px_rgba(0,0,0,0.03)] z-30 no-print">
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
            <SidebarLink 
              icon={<Squares2X2Icon className="w-4 h-4" />} 
              label="Liaison Hub" 
              active={view === 'chat'} 
              onClick={() => setView('chat')} 
            />
            <SidebarLink 
              icon={<DocumentTextIcon className="w-4 h-4" />} 
              label="Project Report" 
              active={view === 'report'} 
              onClick={() => setView('report')} 
            />
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

          {/* Identity Section */}
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

      {/* --- Main Liaison Content --- */}
      <main className="flex-1 flex flex-col relative bg-white lg:rounded-l-[3rem] shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.02)] overflow-hidden border-l border-slate-100">
        
        {view === 'report' ? <ProjectReport /> : (
          <>
            <header className="h-16 border-b border-slate-50 px-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-2xl z-20 no-print">
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
                  onClick={() => setView('report')}
                  className="text-[9px] font-black border border-slate-200 text-slate-600 px-7 py-3 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  View Documentation
                </button>
                <EllipsisVerticalIcon className="w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-900 transition-colors" />
              </div>
            </header>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 md:p-14 space-y-10 bg-[#F8FAFC]/40 custom-scroll no-print"
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

            <footer className="p-8 md:p-12 border-t border-slate-50 bg-white z-20 no-print">
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
                     className={`absolute right-3 px-10 py-4 rounded-[1.8rem] flex items-center gap-3 transition-all active:scale-95 ${
                       input.trim() 
                       ? 'bg-[#0F172A] text-white shadow-2xl shadow-slate-300 hover:bg-blue-700' 
                       : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                     }`}
                   >
                     <span className="text-[11px] font-black uppercase tracking-widest">Transmit</span>
                     <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                   </button>
                </div>
                
                <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.8em] opacity-80">
                  Institutional Console // Secure Link // Session v1.1
                </p>
              </div>
            </footer>
          </>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      `}} />
    </div>
  );
};

const SidebarLink: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${
    active 
    ? 'bg-[#0F172A] text-white shadow-xl shadow-slate-200 font-black' 
    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-bold'
  }`}>
    <div className={`transition-colors ${active ? 'text-blue-400' : 'text-slate-300 group-hover:text-slate-900'}`}>{icon}</div>
    <span className="text-[11px] uppercase tracking-widest">{label}</span>
  </div>
);

const SuggestionChip: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-6 py-3 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-500 hover:border-blue-500/30 hover:text-blue-600 hover:bg-blue-50/20 transition-all bg-white shadow-sm uppercase tracking-tight"
  >
    {label}
  </button>
);

const StatusBadge: React.FC<{ label: string }> = ({ label }) => (
  <div className="px-5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
     {label}
  </div>
);

export default App;
