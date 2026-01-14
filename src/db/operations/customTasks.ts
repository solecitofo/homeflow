import { db, generateId, type Task } from '../database';

/**
 * Crea una tarea personalizada del usuario
 */
export async function createCustomTask(
  userId: string,
  taskData: {
    title: string;
    description: string;
    room?: string;
    category: 'cleaning' | 'organizing' | 'shopping' | 'maintenance';
    estimatedMinutes: number;
    steps?: string[];
    intensityLevels?: Task['intensityLevels'];
  }
): Promise<string> {
  const taskId = generateId();

  // Auto-inferir características usando reglas
  const inferredData = inferTaskCharacteristics(taskData);

  const customTask: Task = {
    id: taskId,
    category: taskData.category,
    room: taskData.room,
    title: taskData.title,
    description: taskData.description,
    estimatedMinutes: taskData.estimatedMinutes,
    steps: taskData.steps,
    intensityLevels: taskData.intensityLevels,
    isCustom: true,
    createdByUser: userId,
    customMetadata: {
      createdAt: new Date(),
      lastModified: new Date(),
      usageCount: 0,
    },
    // Campos inferidos con valores por defecto
    effortLevel: inferredData.effortLevel || 'medium',
    impactLevel: inferredData.impactLevel || 'medium',
    isMicroTask: inferredData.isMicroTask || false,
    requiresDecisions: inferredData.requiresDecisions || false,
    requiresMovement: inferredData.requiresMovement || false,
  };

  await db.tasks.add(customTask);
  return taskId;
}

/**
 * Infiere características de la tarea basándose en el título y descripción
 */
function inferTaskCharacteristics(taskData: {
  title: string;
  description: string;
  estimatedMinutes: number;
}): Partial<Task> {
  const title = taskData.title.toLowerCase();
  const desc = taskData.description.toLowerCase();
  const combined = `${title} ${desc}`;

  return {
    // Micro-tarea si dura poco y no requiere decisiones
    isMicroTask: taskData.estimatedMinutes <= 5,

    // Requiere decisiones si menciona "seleccionar", "elegir", "decidir"
    requiresDecisions: /selecciona|elige|decide|ordena por|separa|clasifica/.test(combined),

    // Requiere movimiento si menciona caminar, llevar, trasladar
    requiresMovement: /camina|lleva|traslada|mueve|recorre|va a|ve a|sube|baja/.test(combined),

    // Nivel de esfuerzo basado en duración
    effortLevel:
      taskData.estimatedMinutes <= 3 ? 'micro' :
      taskData.estimatedMinutes <= 10 ? 'low' :
      taskData.estimatedMinutes <= 20 ? 'medium' : 'high',

    // Impacto basado en palabras clave
    impactLevel:
      /importante|esencial|crítico|muy|fundamental|necesario/.test(combined) ? 'high' :
      /mejora|ayuda|útil|recomendable/.test(combined) ? 'medium' : 'low',
  };
}

/**
 * Obtiene todas las tareas personalizadas del usuario
 */
export async function getUserCustomTasks(userId: string): Promise<Task[]> {
  return await db.tasks
    .where('createdByUser')
    .equals(userId)
    .toArray();
}

/**
 * Actualiza una tarea personalizada
 */
export async function updateCustomTask(
  taskId: string,
  userId: string,
  updates: Partial<Task>
): Promise<void> {
  const task = await db.tasks.get(taskId);
  if (!task || !task.isCustom || task.createdByUser !== userId) {
    throw new Error('Task not found or not authorized');
  }

  await db.tasks.update(taskId, {
    ...updates,
    customMetadata: {
      ...task.customMetadata!,
      lastModified: new Date(),
    },
  });
}

/**
 * Incrementa el contador de uso de una tarea personalizada
 */
export async function incrementCustomTaskUsage(
  taskId: string,
  actualMinutes: number
): Promise<void> {
  const task = await db.tasks.get(taskId);
  if (!task || !task.isCustom || !task.customMetadata) return;

  const { usageCount, avgCompletionTime } = task.customMetadata;
  const newUsageCount = usageCount + 1;

  // Calcular nuevo promedio de tiempo
  const newAvg = avgCompletionTime
    ? (avgCompletionTime * usageCount + actualMinutes) / newUsageCount
    : actualMinutes;

  // Si hay suficientes datos (3+ usos), actualizar estimación
  const shouldUpdateEstimate = newUsageCount >= 3;

  await db.tasks.update(taskId, {
    customMetadata: {
      ...task.customMetadata,
      usageCount: newUsageCount,
      avgCompletionTime: Math.round(newAvg),
    },
    // Actualizar estimatedMinutes basándose en la realidad
    ...(shouldUpdateEstimate && { estimatedMinutes: Math.round(newAvg) }),
  });
}

/**
 * Elimina una tarea personalizada
 */
export async function deleteCustomTask(taskId: string, userId: string): Promise<void> {
  const task = await db.tasks.get(taskId);
  if (!task || !task.isCustom || task.createdByUser !== userId) {
    throw new Error('Cannot delete this task');
  }

  await db.tasks.delete(taskId);
}

/**
 * Sugiere intensityLevels automáticamente basándose en la tarea base
 */
export function suggestIntensityLevels(
  baseMinutes: number
): Task['intensityLevels'] {
  return {
    basic: {
      description: 'Versión rápida',
      minutes: Math.max(1, Math.round(baseMinutes * 0.4)),
    },
    standard: {
      description: 'Versión completa',
      minutes: baseMinutes,
    },
    deep: {
      description: 'Versión exhaustiva',
      minutes: Math.round(baseMinutes * 2),
    },
  };
}
