import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Dashboard } from './components/Dashboard';
import { AdminTools } from './components/AdminTools';
import { StudentView } from './components/StudentView';
import { LogIn, LogOut, LayoutDashboard, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'admin' | 'student'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => signOut(auth);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f5f5f0] text-[#5A5A40]">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="h-12 w-12 border-4 border-[#5A5A40] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a]" dir="rtl font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-black/10 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xl">ض</div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-900">فرسان الضاد</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-gray-100'}`}
          >
            <LayoutDashboard size={18} />
            <span>اللوحة</span>
          </button>
          
          {user && (
            <>
              <button 
                onClick={() => setView('admin')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === 'admin' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-gray-100'}`}
              >
                <Settings size={18} />
                <span>الإدارة</span>
              </button>
              <button 
                onClick={() => setView('student')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === 'student' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-gray-100'}`}
              >
                <User size={18} />
                <span>ملفي</span>
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>خروج</span>
              </button>
            </>
          )}

          {!user && (
            <button 
              onClick={login}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              <LogIn size={18} />
              <span>دخول المعلم</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto pt-24 pb-12 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'dashboard' && <Dashboard />}
            {view === 'admin' && (user ? <AdminTools /> : <div className="text-center py-20 text-gray-400">يرجى تسجيل الدخول للوصول إلى أدوات الإدارة</div>)}
            {view === 'student' && (user ? <StudentView /> : <div className="text-center py-20 text-gray-400">يرجى تسجيل الدخول لعرض الملف الشخصي</div>)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
