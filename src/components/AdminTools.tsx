import React, { useState, useEffect } from 'react';
import { createStudent, createTeam, awardPoints, subscribeToStudents, subscribeToTeams } from '../services/dataService';
import { Student, Team, SkillPath, Grade } from '../types';
import { UserPlus, Star, Users, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminTools() {
  const [activeTab, setActiveTab] = useState<'award' | 'students' | 'teams'>('award');
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', grade: 7 as Grade, teamId: '' });
  const [newTeam, setNewTeam] = useState({ name: '', color: '#10b981' });

  useEffect(() => {
    const unsubStudents = subscribeToStudents(setStudents);
    const unsubTeams = subscribeToTeams(setTeams);
    return () => {
      unsubStudents();
      unsubTeams();
    };
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.teamId) return;
    await createStudent({
      name: newStudent.name,
      grade: newStudent.grade,
      teamId: newStudent.teamId,
      points: { grammar: 0, reading: 0, orthography: 0, expression: 0, recitation: 0, contribution: 0, discipline: 0, special: 0 },
      totalPoints: 0,
      level: 'Beginner',
      updatedAt: new Date().toISOString()
    });
    setNewStudent({ name: '', grade: 7, teamId: '' });
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) return;
    await createTeam(newTeam.name, newTeam.color);
    setNewTeam({ name: '', color: '#10b981' });
  };

  const filteredStudents = students.filter(s => s.name.includes(search));

  const pointCategories: { id: SkillPath, label: string, color: string, points: number }[] = [
    { id: 'grammar', label: 'نحو', color: 'bg-green-500', points: 5 },
    { id: 'reading', label: 'قراءة', color: 'bg-blue-500', points: 5 },
    { id: 'orthography', label: 'إملاء', color: 'bg-yellow-500', points: 5 },
    { id: 'expression', label: 'تعبير', color: 'bg-purple-500', points: 7 },
    { id: 'recitation', label: 'إلقاء', color: 'bg-red-500', points: 10 },
    { id: 'contribution', label: 'مساهمة', color: 'bg-indigo-500', points: 7 },
    { id: 'discipline', label: 'انضباط', color: 'bg-gray-500', points: 3 },
    { id: 'special', label: 'تميز', color: 'bg-pink-500', points: 10 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-2xl w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('award')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'award' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Star size={20} />
          <span>منح النقاط</span>
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'students' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <UserPlus size={20} />
          <span>الطلاب</span>
        </button>
        <button 
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'teams' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Users size={20} />
          <span>الفرق</span>
        </button>
      </div>

      {activeTab === 'award' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="relative mb-6">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder="ابحث عن الفارس..." 
                 className="w-full pr-12 pl-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredStudents.map(student => (
                <div key={student.id} className="p-4 rounded-2xl border border-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">{student.name}</h4>
                      <p className="text-xs text-gray-400">فريق {teams.find(t => t.id === student.teamId)?.name} • رصيد: {student.totalPoints}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                      {pointCategories.slice(0, 5).map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => awardPoints(student.id, cat.id, cat.points, `تميز في ${cat.label}`)}
                          className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition group-hover:border-transparent"
                        >
                          +{cat.points} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-emerald-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              أحدث النقاط الممنوحة
            </h3>
            <p className="text-emerald-300 text-sm italic">سيتم إضافة سجل سجلات النقاط هنا لاحقاً...</p>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">إضافة فارس جديد</h3>
          <form onSubmit={handleCreateStudent} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم الفارس</label>
              <input 
                type="text" 
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                value={newStudent.name}
                onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="أدخل الاسم الرباعي..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصف</label>
                <select 
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  value={newStudent.grade}
                  onChange={e => setNewStudent({...newStudent, grade: parseInt(e.target.value) as Grade})}
                >
                  <option value={7}>السابع</option>
                  <option value={8}>الثامن</option>
                  <option value={9}>التاسع</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الفريق</label>
                <select 
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  value={newStudent.teamId}
                  onChange={e => setNewStudent({...newStudent, teamId: e.target.value})}
                >
                  <option value="">اختر فريقاً...</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
              تسجيل الفارس في المنظومة
            </button>
          </form>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">إنشاء فريق جديد</h3>
          <form onSubmit={handleCreateTeam} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم الفريق</label>
              <input 
                type="text" 
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                value={newTeam.name}
                onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                placeholder="مثل: فريق النحو، فرسان الضاد..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">لون الفريق</label>
              <div className="flex gap-4 flex-wrap">
                {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setNewTeam({...newTeam, color: c})}
                    className={`h-12 w-12 rounded-full border-4 transition-transform ${newTeam.color === c ? 'scale-110 border-gray-300' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              إنشاء الفريق
            </button>
          </form>
          
          <div className="mt-12 grid grid-cols-2 gap-4">
             {teams.map(team => (
               <div key={team.id} className="p-4 rounded-2xl border flex items-center justify-between" style={{ borderColor: team.color + '20' }}>
                 <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }} />
                    <span className="font-bold">{team.name}</span>
                 </div>
                 <span className="text-sm text-gray-400">{students.filter(s => s.teamId === team.id).length} لاعب</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 14.75 15.3 3 12.1 9.75 20 9.25 8.7 21 11.9 14.25 4 14.75Z" />
    </svg>
  );
}
