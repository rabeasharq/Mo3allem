export type Grade = 7 | 8 | 9;

export type SkillPath = 'grammar' | 'reading' | 'orthography' | 'expression' | 'recitation' | 'contribution' | 'discipline' | 'special';

export type StudentLevel = 'Beginner' | 'Advanced' | 'Professional' | 'Expert';

export interface StudentPoints {
  grammar: number;
  reading: number;
  orthography: number;
  expression: number;
  recitation: number;
  contribution: number;
  discipline: number;
  special: number;
}

export interface Student {
  id: string;
  name: string;
  teamId: string;
  grade: Grade;
  points: StudentPoints;
  totalPoints: number;
  level: StudentLevel;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  totalPoints: number;
  color: string;
}

export interface PointLog {
  id: string;
  studentId: string;
  skill: SkillPath;
  points: number;
  reason: string;
  timestamp: any;
}

export interface SessionState {
  activeTaskId: string | null;
  currentChallenge: any;
  lastUpdated: string;
}
