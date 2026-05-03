import { useState, useEffect } from 'react';
import { subscribeToStudents, subscribeToTeams } from '../services/dataService';
import { Student, Team } from '../types';
import { Trophy, Users, TrendingUp, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const unsubStudents = subscribeToStudents(setStudents);
    const unsubTeams = subscribeToTeams(setTeams);
    return () => {
      unsubStudents();
      unsubTeams();
    };
  }, []);

  const topStudents = students.slice(0, 5);
  
  const skillData = [
    { name: 'نحو', value: students.reduce((acc, s) => acc + (s.points.grammar || 0), 0) },
    { name: 'قراءة', value: students.reduce((acc, s) => acc + (s.points.reading || 0), 0) },
    { name: 'إملاء', value: students.reduce((acc, s) => acc + (s.points.orthography || 0), 0) },
    { name: 'تعبير', value: students.reduce((acc, s) => acc + (s.points.expression || 0), 0) },
    { name: 'إلقاء', value: students.reduce((acc, s) => acc + (s.points.recitation || 0), 0) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Leaderboard - Main Focus */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between bg-emerald-900 text-white p-6 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="text-yellow-400" size={32} />
              فرسان الصف
            </h2>
            <p className="text-emerald-200 mt-2">ترتيب الطلاب الأكثر تميزاً هذا الأسبوع</p>
          </div>
          <Zap className="absolute -right-8 -bottom-8 text-emerald-800 opacity-20 w-48 h-48" />
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          {topStudents.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {topStudents.map((student, index) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={student.id} 
                  className="flex items-center justify-between p-5 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg ${index === 0 ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-100' : 'bg-gray-100 text-gray-600'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          student.level === 'Expert' ? 'bg-purple-100 text-purple-700' :
                          student.level === 'Professional' ? 'bg-blue-100 text-blue-700' :
                          student.level === 'Advanced' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {student.level === 'Expert' ? 'خبير 🧠' : 
                           student.level === 'Professional' ? 'محترف 🌟' : 
                           student.level === 'Advanced' ? 'متقدم 🚀' : 'مبتدئ 🌱'}
                        </span>
                        <span className="text-xs text-gray-400">الصف {student.grade}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 leading-none">{student.totalPoints}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">نقطة</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 font-medium font-serif italic">في انتظار تسجيل الفرسان...</div>
          )}
        </div>

        {/* Skill Analytics Chart */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
            <TrendingUp size={20} className="text-emerald-500" />
            تحليل المهارات التراكمي
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical" margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 14, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f0fdf4' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
                  {skillData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sidebar: Teams & Stats */}
      <div className="space-y-8">
        {/* Teams Dashboard */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
            <Users size={20} className="text-blue-500" />
            نقاط الفرق
          </h3>
          <div className="space-y-4">
            {teams.map((team, index) => (
              <div key={team.id} className="relative">
                <div className="flex justify-between mb-2 items-center">
                  <span className="font-bold text-gray-700">{team.name}</span>
                  <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded-lg text-gray-500">{team.totalPoints}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (team.totalPoints / (teams[0]?.totalPoints || 1)) * 100)}%` }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: team.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white overflow-hidden relative">
          <div className="relative z-10">
             <Star className="text-yellow-300 mb-4" fill="currentColor" />
             <h4 className="text-xl font-bold mb-2">تحدي اليوم</h4>
             <p className="text-indigo-100 text-sm leading-relaxed">
               أول طالب يكتشف الخطأ النحوي في جملة السبورة يحصل على <span className="font-bold text-white underline">10 نقاط</span> إضافية!
             </p>
             <button className="mt-6 w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-3 rounded-xl font-bold transition">بدء التحدي ⚡</button>
          </div>
          <Zap className="absolute -left-12 -bottom-12 text-white/10 w-48 h-48 rotate-12" />
        </div>
      </div>
    </div>
  );
}
