import { db, type Task, type EmotionalState, type Room } from '../database';

/**
 * Obtiene una tarea por su ID
 */
export async function getTaskById(taskId: string): Promise<Task | undefined> {
  return await db.tasks.get(taskId);
}

/**
 * Obtiene todas las tareas
 */
export async function getAllTasks(): Promise<Task[]> {
  return await db.tasks.toArray();
}

/**
 * Filtra tareas según el estado emocional del usuario
 */
export function filterTasksByEmotionalState(
  tasks: Task[],
  emotionalState: EmotionalState
): Task[] {
  switch (emotionalState) {
    case 'overwhelmed':
      // Solo micro-tareas, sin decisiones, mínimo movimiento
      return tasks.filter(
        (t) =>
          t.isMicroTask &&
          !t.requiresDecisions &&
          t.estimatedMinutes <= 3
      );

    case 'tired':
      // Micro-tareas + bajo esfuerzo
      return tasks.filter(
        (t) =>
          (t.isMicroTask || t.effortLevel === 'low') &&
          t.estimatedMinutes <= 10
      );

    case 'ok':
      // Excluir alto esfuerzo, priorizar medio impacto
      return tasks.filter(
        (t) =>
          t.effortLevel !== 'high' &&
          t.impactLevel !== 'low'
      );

    case 'good':
      // Todas las tareas disponibles
      return tasks;

    default:
      return tasks;
  }
}

/**
 * Prioriza tareas según habitaciones del usuario y progreso
 */
export function prioritizeTasks(
  tasks: Task[],
  userRooms: Room[],
  highImpactTasks: Array<{ taskId: string; avgMoodImprovement: number; timesCompleted: number }>
): Task[] {
  const scoredTasks = tasks.map((task) => {
    let score = 0;

    // Prioridad de habitación (0-30 puntos)
    const room = userRooms.find((r) => r.type === task.room);
    if (room?.priority === 'high') score += 30;
    else if (room?.priority === 'medium') score += 15;

    // Nivel de impacto (0-20 puntos)
    if (task.impactLevel === 'high') score += 20;
    else if (task.impactLevel === 'medium') score += 10;

    // Historial de high-impact (0-30 puntos)
    const historyData = highImpactTasks.find((h) => h.taskId === task.id);
    if (historyData && historyData.avgMoodImprovement > 0) {
      score += historyData.avgMoodImprovement * 10;
    }

    // Tiempo desde última limpieza (0-20 puntos)
    if (room?.lastCleaned) {
      const daysSince = Math.floor(
        (Date.now() - new Date(room.lastCleaned).getTime()) / (1000 * 60 * 60 * 24)
      );
      score += Math.min(daysSince * 2, 20);
    }

    return { task, score };
  });

  // Ordenar por score descendente
  scoredTasks.sort((a, b) => b.score - a.score);

  // Retornar top 8 tareas
  return scoredTasks.slice(0, 8).map((st) => st.task);
}

/**
 * Obtiene tareas recomendadas según estado emocional y contexto del usuario
 */
export async function getRecommendedTasks(
  emotionalState: EmotionalState,
  userId: string
): Promise<Task[]> {
  // Obtener todas las tareas
  const allTasks = await getAllTasks();

  // Obtener habitaciones del usuario
  const userRooms = await db.rooms.where('userId').equals(userId).toArray();

  // Obtener progreso del usuario
  const { getOrCreateUser } = await import('../database');
  const progress = await getOrCreateUser(userId);

  // Filtrar por estado emocional
  const filteredTasks = filterTasksByEmotionalState(allTasks, emotionalState);

  // Priorizar tareas
  const prioritizedTasks = prioritizeTasks(
    filteredTasks,
    userRooms,
    progress.highImpactTasks || []
  );

  return prioritizedTasks;
}
