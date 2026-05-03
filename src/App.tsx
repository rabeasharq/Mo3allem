import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Dashboard } from './components/Dashboard';
import { AdminTools } from './components/AdminTools';
import { StudentView } from './components/StudentView';
import { LogIn, LogOut, LayoutDashboard, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [view, setView] = useState<'dashboard' | 'admin' | 'student'>('dashboard');
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pin, setPin] = useState('');

  const loginAsTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple teacher PIN: 2026 (can be changed)
    if (pin === '2026') {
      setIsAdminMode(true);
      setPinPrompt(false);
      setView('admin');
      setPin('');
    } else {
      alert('الرمز السري غير صحيح');
    }
  };

  const logout = () => {
    setIsAdminMode(false);
    setView('dashboard');
  };

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
          
          <button 
            onClick={() => setView('student')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === 'student' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-gray-100'}`}
          >
            <User size={18} />
            <span>ملفي</span>
          </button>

          {isAdminMode ? (
            <>
              <button 
                onClick={() => setView('admin')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === 'admin' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-gray-100'}`}
              >
                <Settings size={18} />
                <span>الإدارة</span>
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>خروج المعلم</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setPinPrompt(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              <LogIn size={18} />
              <span>دخول المعلم</span>
            </button>
          )}
        </div>
      </nav>

      {/* PIN Prompt Modal */}
      <AnimatePresence>
        {pinPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <Settings className="mx-auto text-emerald-600 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">منطقة المعلم</h3>
              <p className="text-gray-500 text-sm mb-6">يرجى إدخال الرمز السري للوصول لأدوات التحكم</p>
              <form onSubmit={loginAsTeacher} className="space-y-4">
                <input 
                  autoFocus
                  type="password" 
                  placeholder="الرمز السري..." 
                  className="w-full text-center py-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:outline-none text-2xl tracking-[1em]"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="submit"
                    className="py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                  >
                    دخول
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPinPrompt(false)}
                    className="py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            {view === 'admin' && <AdminTools />}
            {view === 'student' && <StudentView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
