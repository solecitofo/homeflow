// Tipos para el nuevo flujo adaptativo basado en estado

export type UserIntention =
  | 'overwhelmed'      // 🤯 Estoy abrumado/a, no sé ni por dónde empezar
  | 'have_energy'      // ⚡ Tengo algo de energía, ¿qué puedo hacer?
  | 'need_planning'    // 📝 Necesito planificar/organizar
  | 'need_shopping'    // 🛒 Necesito hacer la compra
  | 'hard_to_start'    // 😓 Me cuesta ponerme en marcha
  | 'see_progress'     // ✅ Quiero ver mi progreso
  | 'see_home'         // 🏠 Ver estado de mi hogar
  | 'learn'            // 📚 Aprender estrategias
  | 'my_tasks';        // ⭐ Mis tareas personalizadas

export type Barrier = 
  | 'no_energy'        // 😴 No tengo energía
  | 'dont_know_first'  // 🤔 No sé qué hacer primero
  | 'not_perfect_time' // ⏰ No es el momento "perfecto"
  | 'too_much'         // 🎯 Me parece demasiado
  | 'anxiety';         // 😰 Me da ansiedad empezar

export type TimeAvailable = 
  | '5min'   // 5-10 minutos
  | '15min'  // 15-20 minutos
  | '30min'  // 30+ minutos
  | '1hour'; // 1 hora o más / No estoy seguro

export type PostTaskFeeling = 
  | 'better'   // Mejor
  | 'same'     // Igual
  | 'worse'    // Peor
  | 'tired'    // Cansado/a
  | 'relieved' // Aliviado/a
  | 'proud';   // Orgulloso/a

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  smallerVersion?: MicroTask; // Versión más pequeña si pide reducir
}

export interface SuggestedTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  wellbeingImpact: 1 | 2 | 3 | 4 | 5;
  steps: string[];
  reason?: string; // Por qué se recomienda esta tarea
}

export interface RouteState {
  intention: UserIntention | null;
  barrier?: Barrier;
  timeAvailable?: TimeAvailable;
  currentMicroTask?: MicroTask;
  suggestedTask?: SuggestedTask;
  postTaskFeeling?: PostTaskFeeling;
  wantsContinue?: boolean;
}
