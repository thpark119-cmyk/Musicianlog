import React, { useState, lazy, Suspense } from 'react';
import { Music, LayoutGrid, BookOpen, Users, FileMusic, Sparkles, LogIn, LogOut, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { signInWithGoogle, logout } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load components for performance optimization
const Dashboard = lazy(() => import('./components/Dashboard'));
const MyLessons = lazy(() => import('./components/MyLessons'));
const TeachingStudio = lazy(() => import('./components/TeachingStudio'));
const Repertoire = lazy(() => import('./components/Repertoire'));
const AITutor = lazy(() => import('./components/AITutor'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Reusable Loading Spinner for Suspense
const LoadingView = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <Loader2 className="text-brand animate-spin" size={32} />
    <span className="text-[10px] text-stone-600 uppercase font-bold tracking-widest">데이터 불러오는 중...</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading, error } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out after 10s");
        setTimedOut(true);
      }
    }, 10000); // 10 seconds timeout for better UX
    return () => clearTimeout(timer);
  }, [loading]);

  const isAdmin = user?.email === 'thpark119@gmail.com';

  const navItems = [
    { id: 'dashboard', label: '홈', icon: LayoutGrid },
    { id: 'mylessons', label: '학습', icon: BookOpen },
    { id: 'repertoire', label: '악보', icon: FileMusic },
    { id: 'studio', label: '교습', icon: Users },
    { id: 'tutor', label: 'AI', icon: Sparkles }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: '관리', icon: ShieldCheck });
  }

  if (loading && !timedOut) {
    return (
      <div className="min-h-screen bg-[#0F0D0C] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-brand">
            <Music size={18} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">MusicianLog</p>
          <p className="text-stone-600 text-[9px] font-mono">인증 및 데이터 동기화 중...</p>
        </div>
      </div>
    );
  }

  if (timedOut || error) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[32px] flex items-center justify-center">
          <AlertTriangle size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif italic text-white">서버 연결이 원활하지 않습니다</h3>
          <p className="text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
            네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요. {error && <span className="block text-[10px] text-stone-700 mt-2">Error: {error.message || String(error)}</span>}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-4 bg-white text-black font-bold rounded-2xl active:scale-95 transition-all shadow-xl"
        >
          페이지 새로고침
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-12"
        >
          <div className="space-y-4">
            <div className="bg-brand/10 w-24 h-24 rounded-[32px] flex items-center justify-center text-brand mx-auto shadow-2xl shadow-brand/20">
              <Music size={48} />
            </div>
            <h1 className="text-5xl font-serif italic text-white tracking-tighter">MusicianLog</h1>
            <p className="text-stone-500 font-medium leading-relaxed">
              당신의 연주와 교육의 모든 순간을<br/>
              가장 아름답고 간결하게 기록하세요.
            </p>
          </div>
          
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-white text-black h-16 rounded-[24px] font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl"
          >
            <LogIn size={20} />
            Google로 시작하기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-stone-200 font-sans selection:bg-brand/30 pb-24 md:pb-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto md:max-w-4xl px-4 pt-8 md:pt-16">
        <header className="flex justify-between items-center mb-10 px-2 sticky top-0 py-4 bg-bg-deep/80 backdrop-blur-md z-40 rounded-b-3xl">
          <div className="flex items-center gap-3">
             <div className="bg-brand h-10 w-10 rounded-2xl text-white shadow-xl shadow-brand/20 flex items-center justify-center">
               <Music size={20} />
             </div>
             <h1 className="text-2xl font-bold tracking-tight serif italic">MusicianLog</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={logout}
              className="p-3 text-stone-600 hover:text-red-400 transition-colors"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 ring-4 ring-white/5 bg-stone-900">
               <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <main className="transition-all duration-300 min-h-[60vh]">
          <Suspense fallback={<LoadingView />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
                {activeTab === 'mylessons' && <MyLessons />}
                {activeTab === 'repertoire' && <Repertoire />}
                {activeTab === 'studio' && <TeachingStudio />}
                {activeTab === 'tutor' && <AITutor />}
                {activeTab === 'admin' && isAdmin && <AdminPanel />}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[94%]">
        <div className="bg-stone-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-1.5 flex gap-1 items-center shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 relative ${
                  isActive ? 'text-brand' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand/5 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
