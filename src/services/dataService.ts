import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  setDoc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  orderBy,
  runTransaction,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Student, Team, PointLog, SkillPath } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToStudents = (callback: (students: Student[]) => void) => {
  const q = query(collection(db, 'students'), orderBy('totalPoints', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    callback(students);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'students'));
};

export const subscribeToTeams = (callback: (teams: Team[]) => void) => {
  const q = query(collection(db, 'teams'), orderBy('totalPoints', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    callback(teams);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'teams'));
};

export const awardPoints = async (studentId: string, skill: SkillPath, points: number, reason: string) => {
  try {
    await runTransaction(db, async (transaction) => {
      const studentRef = doc(db, 'students', studentId);
      const studentDoc = await transaction.get(studentRef);
      if (!studentDoc.exists()) throw new Error("Student not found");

      const studentData = studentDoc.data() as Student;
      const newPoints = { ...studentData.points, [skill]: (studentData.points[skill] || 0) + points };
      const newTotal = Object.values(newPoints).reduce((a, b) => a + (b as number), 0);

      // Determine level
      let level: Student['level'] = 'Beginner';
      if (newTotal > 200) level = 'Expert';
      else if (newTotal > 120) level = 'Professional';
      else if (newTotal > 50) level = 'Advanced';

      transaction.update(studentRef, {
        points: newPoints,
        totalPoints: newTotal,
        level,
        updatedAt: new Date().toISOString()
      });

      // Update team points
      const teamRef = doc(db, 'teams', studentData.teamId);
      const teamDoc = await transaction.get(teamRef);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data() as Team;
        transaction.update(teamRef, {
          totalPoints: (teamData.totalPoints || 0) + points
        });
      }

      // Add log
      const logRef = doc(collection(db, 'pointLogs'));
      transaction.set(logRef, {
        studentId,
        skill,
        points,
        reason,
        timestamp: serverTimestamp()
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `students/${studentId}/points`);
  }
};

export const createStudent = async (student: Omit<Student, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...student,
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'students');
  }
};

export const createTeam = async (name: string, color: string) => {
  try {
    await addDoc(collection(db, 'teams'), {
      name,
      color,
      totalPoints: 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'teams');
  }
};
