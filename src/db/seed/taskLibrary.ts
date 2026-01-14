import { db, type Task } from '../database';

/**
 * Biblioteca inicial de tareas de HomeFlow
 * 14 tareas distribuidas por habitaciones principales
 */
export const INITIAL_TASKS: Task[] = [
  // ========================================
  // BEDROOM - 3 tareas
  // ========================================
  {
    id: 'task_bedroom_make_bed',
    category: 'organizing',
    room: 'bedroom',
    title: 'Hacer la cama',
    description: 'Estira las sábanas y acomoda las almohadas. Una cama hecha marca la diferencia visual.',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'high',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Estira las sábanas',
      'Acomoda las almohadas',
      'Coloca la manta o edredón',
    ],
  },
  {
    id: 'task_bedroom_nightstand',
    category: 'organizing',
    room: 'bedroom',
    title: 'Ordenar mesita de noche',
    description: 'Retira objetos que no pertenecen y limpia la superficie',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira vasos, platos o basura',
      'Guarda objetos en su lugar',
      'Limpia la superficie con un paño',
    ],
  },
  {
    id: 'task_bedroom_closet',
    category: 'organizing',
    room: 'bedroom',
    title: 'Organizar armario',
    description: 'Ordena la ropa por categorías y retira lo que esté fuera de lugar',
    estimatedMinutes: 15,
    effortLevel: 'medium',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: true,
    requiresMovement: true,
    steps: [
      'Colgar ropa que está fuera del armario',
      'Agrupar por tipo de prenda',
      'Doblar ropa interior y accesorios',
      'Identificar prendas para donar (opcional)',
    ],
    intensityLevels: {
      basic: {
        description: 'Colgar ropa que está en sillas o cama',
        minutes: 5,
      },
      standard: {
        description: 'Ordenar por categorías (camisas, pantalones, etc.)',
        minutes: 15,
      },
      deep: {
        description: 'Reorganizar completamente + revisar qué donar',
        minutes: 30,
      },
    },
  },

  // ========================================
  // BATHROOM - 3 tareas
  // ========================================
  {
    id: 'task_bathroom_sink',
    category: 'cleaning',
    room: 'bathroom',
    title: 'Limpiar lavabo',
    description: 'Limpieza rápida del lavabo y grifo para que brille',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: ['Retira pelos y residuos', 'Limpia con producto', 'Seca con toalla'],
  },
  {
    id: 'task_bathroom_counter',
    category: 'organizing',
    room: 'bathroom',
    title: 'Ordenar encimera del baño',
    description: 'Organiza productos de higiene y guarda lo que no uses diariamente',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira productos vacíos',
      'Agrupa por categoría (cuidado facial, cabello, etc.)',
      'Guarda lo que no uses a diario',
    ],
  },
  {
    id: 'task_bathroom_shower',
    category: 'cleaning',
    room: 'bathroom',
    title: 'Limpiar ducha/bañera',
    description: 'Limpieza de la ducha incluyendo mampara y azulejos',
    estimatedMinutes: 12,
    effortLevel: 'medium',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Aplicar producto limpiador',
      'Dejar actuar 2-3 minutos',
      'Fregar azulejos y mampara',
      'Enjuagar completamente',
      'Secar con toalla',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo enjuague rápido',
        minutes: 5,
      },
      standard: {
        description: 'Limpieza con producto + enjuague',
        minutes: 12,
      },
      deep: {
        description: 'Fregar juntas + descalcificar grifo',
        minutes: 25,
      },
    },
  },

  // ========================================
  // KITCHEN - 3 tareas
  // ========================================
  {
    id: 'task_kitchen_dishes',
    category: 'cleaning',
    room: 'kitchen',
    title: 'Lavar platos del fregadero',
    description: 'Lava los platos que están acumulados en el fregadero',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'high',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: ['Enjuaga los platos', 'Lava con jabón', 'Coloca en escurridor'],
  },
  {
    id: 'task_kitchen_counter',
    category: 'organizing',
    room: 'kitchen',
    title: 'Despejar encimera',
    description: 'Retira objetos y guarda cada cosa en su lugar',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira platos/vasos sucios',
      'Guarda alimentos en su lugar',
      'Organiza utensilios',
    ],
  },
  {
    id: 'task_kitchen_fridge',
    category: 'organizing',
    room: 'kitchen',
    title: 'Organizar nevera',
    description: 'Revisa caducidades, organiza por zonas y limpia estantes',
    estimatedMinutes: 15,
    effortLevel: 'medium',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: true,
    requiresMovement: true,
    steps: [
      'Revisa fechas de caducidad',
      'Retira alimentos caducados',
      'Agrupa por categorías',
      'Limpia estantes si es necesario',
      'Reorganiza por zonas (lácteos, verduras, etc.)',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo revisar caducidades y descartar',
        minutes: 8,
      },
      standard: {
        description: 'Revisar + organizar por zonas',
        minutes: 15,
      },
      deep: {
        description: 'Vaciar, limpiar estantes + organizar completamente',
        minutes: 30,
      },
    },
  },

  // ========================================
  // LIVING ROOM - 3 tareas
  // ========================================
  {
    id: 'task_living_cushions',
    category: 'organizing',
    room: 'living_room',
    title: 'Arreglar cojines del sofá',
    description: 'Acomoda los cojines del sofá y dobla las mantas',
    estimatedMinutes: 1,
    effortLevel: 'micro',
    impactLevel: 'low',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Acomoda los cojines',
      'Dobla mantas',
      'Estira si hay funda del sofá',
    ],
  },
  {
    id: 'task_living_table',
    category: 'organizing',
    room: 'living_room',
    title: 'Ordenar mesa de centro',
    description: 'Retira vasos, platos, revistas y otros objetos',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Lleva vasos y platos a la cocina',
      'Organiza mandos a distancia',
      'Apila revistas/libros ordenadamente',
    ],
  },
  {
    id: 'task_living_vacuum',
    category: 'cleaning',
    room: 'living_room',
    title: 'Aspirar salón',
    description: 'Pasa la aspiradora por todo el salón',
    estimatedMinutes: 10,
    effortLevel: 'medium',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira objetos grandes del suelo',
      'Aspira el perímetro',
      'Aspira el centro',
      'Pasa debajo de muebles accesibles',
      'Vacía el depósito si está lleno',
    ],
  },

  // ========================================
  // GENERAL - 2 tareas (sin habitación específica)
  // ========================================
  {
    id: 'task_general_trash',
    category: 'organizing',
    title: 'Vaciar papeleras',
    description: 'Recoge las papeleras de todas las habitaciones y saca la basura',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'low',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Recoge papeleras de cada habitación',
      'Coloca bolsa nueva en cada una',
      'Lleva la bolsa al contenedor',
    ],
  },
  {
    id: 'task_general_pickup_3',
    category: 'organizing',
    title: 'Recoge 3 objetos',
    description: 'Encuentra 3 objetos fuera de lugar y guárdalos donde corresponden',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Encuentra el primer objeto fuera de lugar',
      'Encuentra el segundo objeto',
      'Encuentra el tercer objeto',
      'Guárdalos en su lugar correcto',
    ],
  },
];

/**
 * Seedea las tareas iniciales en la base de datos si no existen
 */
export async function seedTasksIfNeeded(): Promise<void> {
  try {
    const taskCount = await db.tasks.count();

    if (taskCount === 0) {
      await db.tasks.bulkAdd(INITIAL_TASKS);
      console.log(`✅ Seeded ${INITIAL_TASKS.length} initial tasks to database`);
    } else {
      console.log(`ℹ️  Tasks already exist (${taskCount} tasks), skipping seed`);
    }
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
  }
}
