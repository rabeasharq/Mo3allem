import { useState, useEffect } from 'react';
import { subscribeToStudents, subscribeToTeams } from '../services/dataService';
import { Student, Team } from '../types';
import { Search, Medal, Target, Map, Award, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function StudentView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const unsubStudents = subscribeToStudents(setStudents);
    const unsubTeams = subscribeToTeams(setTeams);
    return () => {
      unsubStudents();
      unsubTeams();
    };
  }, []);

  const filtered = students.filter(s => s.name.includes(search)).slice(0, 5);

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'غير معروف';

  const levelInfo = {
    Beginner: { label: 'مبتدئ 🌱', msg: 'ابدأ بخطوات صحيحة', color: 'bg-gray-100 text-gray-600', next: 'Advanced', goal: 50 },
    Advanced: { label: 'متقدم 🚀', msg: 'أنت على الطريق', color: 'bg-emerald-100 text-emerald-700', next: 'Professional', goal: 120 },
    Professional: { label: 'محترف 🌟', msg: 'ثابت ومؤثر', color: 'bg-blue-100 text-blue-700', next: 'Expert', goal: 200 },
    Expert: { label: 'خبير 🧠', msg: 'تقود غيرك', color: 'bg-purple-100 text-purple-700', next: null, goal: 500 },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!selectedStudent ? (
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 text-center space-y-8">
          <BookOpen className="mx-auto text-emerald-600 h-16 w-16" />
          <h2 className="text-3xl font-extrabold text-gray-900">ابحث عن ملفك الشخصي</h2>
          <div className="relative max-w-md mx-auto">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
             <input 
               type="text" 
               placeholder="ادخل اسمك..." 
               className="w-full pr-14 pl-6 py-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/20 text-xl font-medium transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
            {search && filtered.map(student => (
              <button 
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="p-5 flex items-center justify-between bg-white border border-gray-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-right shadow-sm hover:shadow-md"
              >
                <div>
                   <h4 className="font-bold text-gray-800">{student.name}</h4>
                   <p className="text-sm text-gray-400 font-medium">الصف {student.grade} • {getTeamName(student.teamId)}</p>
                </div>
                <Medal size={24} className="text-yellow-500" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <button 
            onClick={() => setSelectedStudent(null)}
            className="text-emerald-600 font-bold hover:underline mb-4 block"
          >
            ← عودة للبحث
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Header Column */}
            <div className="md:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
               <div className="h-32 w-32 bg-emerald-100 text-emerald-700 mx-auto rounded-full flex items-center justify-center text-5xl font-black mb-6">
                  {selectedStudent.name.charAt(0)}
               </div>
               <h2 className="text-2xl font-black text-gray-900 mb-2">{selectedStudent.name}</h2>
               <p className="text-gray-400 font-bold mb-6">فريق {getTeamName(selectedStudent.teamId)}</p>
               
               <div className={`py-4 px-6 rounded-2xl font-black ${levelInfo[selectedStudent.level].color}`}>
                  {levelInfo[selectedStudent.level].label}
                  <div className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70">
                    {levelInfo[selectedStudent.level].msg}
                  </div>
               </div>
            </div>

            {/* Stats Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-emerald-800 p-10 rounded-[40px] text-white overflow-hidden relative">
                 <div className="relative z-10">
                    <div className="text-5xl font-black mb-1">{selectedStudent.totalPoints}</div>
                    <div className="text-lg font-bold text-emerald-300">إجمالي النقاط</div>
                    
                    <div className="mt-8 space-y-3">
                       <div className="flex justify-between text-sm font-bold">
                          <span>المستوى القادم: {levelInfo[selectedStudent.level].next || 'الحد الأقصى'}</span>
                          <span>{selectedStudent.totalPoints} / {levelInfo[selectedStudent.level].goal}</span>
                       </div>
                       <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden p-1">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${Math.min(100, (selectedStudent.totalPoints / levelInfo[selectedStudent.level].goal) * 100)}%` }}
                             className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                          />
                       </div>
                    </div>
                 </div>
                 <Target className="absolute -right-10 -bottom-10 h-64 w-64 text-emerald-700 opacity-30" />
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {[
                   { label: 'نحو', val: selectedStudent.points.grammar, color: 'border-green-100 bg-green-50 text-green-700' },
                   { label: 'قراءة', val: selectedStudent.points.reading, color: 'border-blue-100 bg-blue-50 text-blue-700' },
                   { label: 'إملاء', val: selectedStudent.points.orthography, color: 'border-yellow-100 bg-yellow-50 text-yellow-700' },
                   { label: 'تعبير', val: selectedStudent.points.expression, color: 'border-purple-100 bg-purple-50 text-purple-700' },
                   { label: 'إلقاء', val: selectedStudent.points.recitation, color: 'border-red-100 bg-red-50 text-red-700' },
                   { label: 'مساهمة', val: selectedStudent.points.contribution, color: 'border-indigo-100 bg-indigo-50 text-indigo-700' },
                 ].map(skill => (
                   <div key={skill.label} className={`p-5 rounded-3xl border-2 text-center transition-transform hover:-translate-y-1 cursor-default ${skill.color}`}>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2">{skill.label}</div>
                      <div className="text-3xl font-black">{skill.val}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
