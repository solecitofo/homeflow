import Dexie, { Table } from 'dexie';

// ============================================================================
// TIPOS
// ============================================================================

export type EmotionalState = 'overwhelmed' | 'tired' | 'ok' | 'good';

export interface OnboardingData {
  userId: string;
  emotionalState: EmotionalState;
  homeName: string;
  bedroomsCount: number;
  bathroomsCount: number;
  hasKitchen: boolean;
  hasLivingRoom: boolean;
  hasDiningRoom: boolean;
  additionalSpaces: string[];
  completedAt: Date;
}

export interface Room {
  id: string;
  userId: string;
  type: string;
  name: string;
  icon: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  lastCleaned?: Date;
  points: number;
}

export interface Task {
  id: string;
  category: 'cleaning' | 'organizing' | 'shopping' | 'maintenance';
  room?: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  effortLevel: 'micro' | 'low' | 'medium' | 'high';
  impactLevel: 'low' | 'medium' | 'high';
  isMicroTask: boolean;
  requiresDecisions: boolean;
  requiresMovement: boolean;
  steps?: string[];
  intensityLevels?: {
    basic: { description: string; minutes: number };
    standard: { description: string; minutes: number };
    deep: { description: string; minutes: number };
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  actualMinutes?: number;
  emotionalStateBefore: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';
  emotionalStateAfter?: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';
  moodImprovement?: number; // Calculado
  routeUsed: EmotionalState;
}

export interface UserProgress {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  totalTasksCompleted: number;
  weeklyPoints: number;
  weeklyGoal: number;
  highImpactTasks: {
    taskId: string;
    avgMoodImprovement: number;
    timesCompleted: number;
  }[];
}

// ============================================================================
// SHOPPING LIST
// ============================================================================

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'fresh' | 'pantry' | 'frozen' | 'cleaning' | 'hygiene' | 'other';
  addedAt: Date;
  addedBy: 'user' | 'suggestion';
  checked: boolean;
  quantity?: number;
  notes?: string;
}

export interface ShoppingList {
  userId: string;
  items: ShoppingItem[];
  lastModified: Date;
}

export interface FrequentItem {
  userId: string;
  name: string;
  category: 'fresh' | 'pantry' | 'frozen' | 'cleaning' | 'hygiene' | 'other';
  purchaseCount: number;
  averageDaysBetweenPurchases: number;
  lastPurchased?: Date;
}

// ============================================================================
// USER PATTERNS (Aprendizaje del sistema)
// ============================================================================

export interface UserPatterns {
  userId: string;
  bestTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  bestDayOfWeek?: string[];
  preferredTaskDuration?: number;
  successfulTimeSlots: Record<string, number>;
  taskDurations: number[];
  avoidsTasksWith?: string[];
  totalPointsEarned: number;
}

// ============================================================================
// BASE DE DATOS
// ============================================================================

export class HomeFlowDatabase extends Dexie {
  onboarding!: Table<OnboardingData, string>;
  rooms!: Table<Room, string>;
  tasks!: Table<Task, string>;
  activityLogs!: Table<ActivityLog, string>;
  userProgress!: Table<UserProgress, string>;
  shoppingLists!: Table<ShoppingList, string>;
  frequentItems!: Table<FrequentItem, [string, string]>;
  userPatterns!: Table<UserPatterns, string>;

  constructor() {
    super('HomeFlowDB');
    
    // Versión 1: Schema inicial
    this.version(1).stores({
      onboarding: 'userId, completedAt',
      rooms: 'id, userId, type, enabled',
      tasks: 'id, category, room, effortLevel, isMicroTask',
      activityLogs: 'id, userId, taskId, startTime, completed',
      userProgress: 'userId, lastActivityDate',
    });
    
    // Versión 2: Añadir shopping y patterns
    this.version(2).stores({
      onboarding: 'userId, completedAt',
      rooms: 'id, userId, type, enabled',
      tasks: 'id, category, room, effortLevel, isMicroTask',
      activityLogs: 'id, userId, taskId, startTime, completed',
      userProgress: 'userId, lastActivityDate',
      shoppingLists: 'userId, lastModified',
      frequentItems: '[userId+name], userId, category, lastPurchased',
      userPatterns: 'userId',
    });
  }
}

export const db = new HomeFlowDatabase();

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

export async function getOrCreateUser(userId: string = 'default-user'): Promise<UserProgress> {
  let progress = await db.userProgress.get(userId);
  
  if (!progress) {
    progress = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalTasksCompleted: 0,
      weeklyPoints: 0,
      weeklyGoal: 10,
      highImpactTasks: [],
    };
    await db.userProgress.add(progress);
  }
  
  return progress;
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  await db.onboarding.put(data);
}

export async function getOnboarding(userId: string): Promise<OnboardingData | undefined> {
  return await db.onboarding.get(userId);
}

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const data = await db.onboarding.get(userId);
  return !!data;
}

export async function saveActivityLog(log: ActivityLog): Promise<string> {
  return await db.activityLogs.add(log);
}

export async function updateActivityLog(id: string, updates: Partial<ActivityLog>): Promise<void> {
  await db.activityLogs.update(id, updates);
}

export async function getRecentLogs(userId: string, limit: number = 20): Promise<ActivityLog[]> {
  return await db.activityLogs
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('startTime')
    .then(logs => logs.slice(0, limit));
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}