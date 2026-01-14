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
    intensityLevels: {
      basic: {
        description: 'Solo estirar la sábana superior',
        minutes: 1,
      },
      standard: {
        description: 'Hacer la cama completa',
        minutes: 2,
      },
      deep: {
        description: 'Hacer cama + cambiar fundas de almohadas',
        minutes: 5,
      },
    },
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
    intensityLevels: {
      basic: {
        description: 'Solo retirar basura visible',
        minutes: 1,
      },
      standard: {
        description: 'Ordenar + limpiar superficie',
        minutes: 3,
      },
      deep: {
        description: 'Ordenar + limpiar + organizar cajón',
        minutes: 8,
      },
    },
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
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: ['Retira pelos y residuos', 'Limpia con producto', 'Seca con toalla'],
    intensityLevels: {
      basic: {
        description: 'Solo enjuague rápido',
        minutes: 1,
      },
      standard: {
        description: 'Limpiar con producto + secar',
        minutes: 3,
      },
      deep: {
        description: 'Limpiar + pulir grifo + desagüe',
        minutes: 7,
      },
    },
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
    intensityLevels: {
      basic: {
        description: 'Solo retirar productos vacíos',
        minutes: 1,
      },
      standard: {
        description: 'Ordenar por categorías',
        minutes: 3,
      },
      deep: {
        description: 'Ordenar + limpiar encimera + organizar cajones',
        minutes: 10,
      },
    },
  },
  {
    id: 'task_bathroom_mirror',
    category: 'cleaning',
    room: 'bathroom',
    title: 'Limpiar espejo',
    description: 'Limpia el espejo del baño para que brille sin marcas',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Rocía limpiacristales',
      'Pasa un paño o papel',
      'Repasa con papel seco para evitar marcas',
    ],
    intensityLevels: {
      basic: {
        description: 'Pasar paño húmedo rápido',
        minutes: 1,
      },
      standard: {
        description: 'Limpiar con producto + secar',
        minutes: 2,
      },
      deep: {
        description: 'Limpiar espejo + marco + apliques',
        minutes: 5,
      },
    },
  },
  {
    id: 'task_bathroom_toilet',
    category: 'cleaning',
    room: 'bathroom',
    title: 'Limpiar WC',
    description: 'Limpieza completa del inodoro',
    estimatedMinutes: 5,
    effortLevel: 'low',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Aplicar producto en el interior',
      'Dejar actuar 2-3 minutos',
      'Frotar con escobilla',
      'Limpiar el exterior con bayeta',
      'Desinfectar tapa y botón',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo interior con escobilla',
        minutes: 2,
      },
      standard: {
        description: 'Interior + exterior',
        minutes: 5,
      },
      deep: {
        description: 'Interior + exterior + detrás + juntas',
        minutes: 10,
      },
    },
  },
  {
    id: 'task_bathroom_towels',
    category: 'organizing',
    room: 'bathroom',
    title: 'Ordenar toallas',
    description: 'Dobla y organiza las toallas del baño',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'low',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Recoge toallas usadas',
      'Dobla toallas limpias',
      'Colócalas en el toallero o estante',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo colgar toallas en toallero',
        minutes: 1,
      },
      standard: {
        description: 'Doblar y organizar',
        minutes: 2,
      },
      deep: {
        description: 'Reorganizar armario de toallas completo',
        minutes: 8,
      },
    },
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
    title: 'Fregar platos',
    description: 'Lava los platos que están acumulados en el fregadero',
    estimatedMinutes: 10,
    effortLevel: 'low',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: false,
    steps: ['Enjuaga los platos', 'Lava con jabón', 'Aclara bien', 'Coloca en escurridor'],
    intensityLevels: {
      basic: {
        description: 'Solo lo imprescindible (1-2 platos)',
        minutes: 3,
      },
      standard: {
        description: 'Todo lo acumulado',
        minutes: 10,
      },
      deep: {
        description: 'Todo + secar + guardar',
        minutes: 20,
      },
    },
  },
  {
    id: 'task_kitchen_counter',
    category: 'cleaning',
    room: 'kitchen',
    title: 'Limpiar encimera',
    description: 'Limpia la encimera de la cocina retirando objetos y pasando bayeta',
    estimatedMinutes: 5,
    effortLevel: 'micro',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira objetos de la encimera',
      'Pasa bayeta húmeda con producto',
      'Seca con paño limpio',
      'Vuelve a colocar lo necesario',
    ],
    intensityLevels: {
      basic: {
        description: 'Pasar bayeta rápida',
        minutes: 2,
      },
      standard: {
        description: 'Limpiar encimera completa',
        minutes: 5,
      },
      deep: {
        description: 'Limpiar + desinfectar + organizar',
        minutes: 12,
      },
    },
  },
  {
    id: 'task_kitchen_stove',
    category: 'cleaning',
    room: 'kitchen',
    title: 'Limpiar vitro',
    description: 'Limpieza de la vitrocerámica o fuegos de la cocina',
    estimatedMinutes: 8,
    effortLevel: 'low',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Retira restos sólidos con papel',
      'Aplica producto específico para vitro',
      'Deja actuar 1-2 minutos',
      'Frota con esponja o rasqueta',
      'Aclara y seca con paño',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo pasar bayeta húmeda',
        minutes: 3,
      },
      standard: {
        description: 'Limpiar con producto específico',
        minutes: 8,
      },
      deep: {
        description: 'Limpiar + rasqueta + pulir',
        minutes: 15,
      },
    },
  },
  {
    id: 'task_kitchen_floor',
    category: 'cleaning',
    room: 'kitchen',
    title: 'Barrer suelo',
    description: 'Barre el suelo de la cocina recogiendo migas y suciedad',
    estimatedMinutes: 5,
    effortLevel: 'low',
    impactLevel: 'medium',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira obstáculos del suelo',
      'Barre esquinas y rincones',
      'Barre el centro',
      'Recoge con recogedor',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo zona más visible',
        minutes: 2,
      },
      standard: {
        description: 'Barrer toda la cocina',
        minutes: 5,
      },
      deep: {
        description: 'Barrer + fregar con fregona',
        minutes: 15,
      },
    },
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
    title: 'Colocar cojines',
    description: 'Acomoda los cojines del sofá y dobla las mantas',
    estimatedMinutes: 2,
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
    intensityLevels: {
      basic: {
        description: 'Solo acomodar cojines',
        minutes: 1,
      },
      standard: {
        description: 'Cojines + doblar mantas',
        minutes: 2,
      },
      deep: {
        description: 'Todo + estirar funda + sacudir',
        minutes: 5,
      },
    },
  },
  {
    id: 'task_living_objects',
    category: 'organizing',
    room: 'living_room',
    title: 'Recoger objetos sueltos',
    description: 'Recoge y guarda objetos que están fuera de lugar en el salón',
    estimatedMinutes: 5,
    effortLevel: 'low',
    impactLevel: 'high',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Recorre el salón identificando objetos',
      'Lleva cada cosa a su lugar',
      'Organiza mandos y revistas',
      'Retira vasos y platos a la cocina',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo lo más visible (3-5 objetos)',
        minutes: 2,
      },
      standard: {
        description: 'Recoger todo lo suelto',
        minutes: 5,
      },
      deep: {
        description: 'Recoger + organizar estantes',
        minutes: 15,
      },
    },
  },
  {
    id: 'task_living_dust',
    category: 'cleaning',
    room: 'living_room',
    title: 'Pasar plumero',
    description: 'Quita el polvo de muebles y superficies del salón',
    estimatedMinutes: 5,
    effortLevel: 'low',
    impactLevel: 'medium',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Pasa plumero por estantes',
      'Limpia mesa de centro',
      'Quita polvo de TV y muebles',
      'Limpia marcos y decoración',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo superficies principales',
        minutes: 3,
      },
      standard: {
        description: 'Todo el salón',
        minutes: 5,
      },
      deep: {
        description: 'Plumero + bayeta húmeda + rincones',
        minutes: 12,
      },
    },
  },
  {
    id: 'task_living_blankets',
    category: 'organizing',
    room: 'living_room',
    title: 'Doblar mantas',
    description: 'Dobla y organiza las mantas del salón',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'low',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Recoge mantas del sofá',
      'Dóblalas ordenadamente',
      'Colócalas en el sofá o cesta',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo doblar por la mitad',
        minutes: 1,
      },
      standard: {
        description: 'Doblar correctamente',
        minutes: 3,
      },
      deep: {
        description: 'Doblar + guardar en armario',
        minutes: 8,
      },
    },
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
  // ENTRANCE - 3 tareas
  // ========================================
  {
    id: 'task_entrance_shoes',
    category: 'organizing',
    room: 'entrance',
    title: 'Ordenar zapatos',
    description: 'Organiza los zapatos de la entrada en el zapatero',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Recoge zapatos del suelo',
      'Coloca cada par junto',
      'Organiza en el zapatero',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo apartar del paso',
        minutes: 1,
      },
      standard: {
        description: 'Ordenar en zapatero',
        minutes: 3,
      },
      deep: {
        description: 'Ordenar + limpiar zapatos + reorganizar zapatero',
        minutes: 10,
      },
    },
  },
  {
    id: 'task_entrance_coats',
    category: 'organizing',
    room: 'entrance',
    title: 'Colgar abrigos',
    description: 'Cuelga abrigos y chaquetas en el perchero',
    estimatedMinutes: 2,
    effortLevel: 'micro',
    impactLevel: 'low',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: false,
    steps: [
      'Recoge abrigos de sillas/sofá',
      'Cuélgalos en el perchero',
      'Organiza bufandas y accesorios',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo colgar lo visible',
        minutes: 1,
      },
      standard: {
        description: 'Colgar todo correctamente',
        minutes: 2,
      },
      deep: {
        description: 'Colgar + organizar armario de entrada',
        minutes: 8,
      },
    },
  },
  {
    id: 'task_entrance_sweep',
    category: 'cleaning',
    room: 'entrance',
    title: 'Barrer entrada',
    description: 'Barre el suelo de la entrada retirando tierra y polvo',
    estimatedMinutes: 3,
    effortLevel: 'micro',
    impactLevel: 'medium',
    isMicroTask: true,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Retira zapatos del paso',
      'Barre el suelo',
      'Recoge con recogedor',
      'Sacude felpudo (opcional)',
    ],
    intensityLevels: {
      basic: {
        description: 'Barrido rápido',
        minutes: 2,
      },
      standard: {
        description: 'Barrer bien + felpudo',
        minutes: 3,
      },
      deep: {
        description: 'Barrer + fregar + limpiar puertas',
        minutes: 10,
      },
    },
  },

  // ========================================
  // LAUNDRY - 4 tareas
  // ========================================
  {
    id: 'task_laundry_wash',
    category: 'organizing',
    room: 'laundry',
    title: 'Poner lavadora',
    description: 'Selecciona ropa, carga la lavadora y ponla en marcha',
    estimatedMinutes: 5,
    effortLevel: 'low',
    impactLevel: 'medium',
    isMicroTask: false,
    requiresDecisions: true,
    requiresMovement: true,
    steps: [
      'Separa ropa por colores',
      'Carga la lavadora',
      'Añade detergente',
      'Selecciona programa',
      'Ponla en marcha',
    ],
    intensityLevels: {
      basic: {
        description: 'Poner lo urgente',
        minutes: 3,
      },
      standard: {
        description: 'Una carga completa',
        minutes: 5,
      },
      deep: {
        description: 'Múltiples cargas + pretratar manchas',
        minutes: 15,
      },
    },
  },
  {
    id: 'task_laundry_hang',
    category: 'organizing',
    room: 'laundry',
    title: 'Tender ropa',
    description: 'Tiende la ropa limpia en el tendedero',
    estimatedMinutes: 10,
    effortLevel: 'low',
    impactLevel: 'medium',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Saca ropa de la lavadora',
      'Sacude cada prenda',
      'Tiéndela con pinzas',
      'Organiza para que se seque bien',
    ],
    intensityLevels: {
      basic: {
        description: 'Tender sin mucho cuidado',
        minutes: 5,
      },
      standard: {
        description: 'Tender bien para evitar arrugas',
        minutes: 10,
      },
      deep: {
        description: 'Tender perfectamente + organizar por tipo',
        minutes: 15,
      },
    },
  },
  {
    id: 'task_laundry_fold',
    category: 'organizing',
    room: 'laundry',
    title: 'Doblar ropa seca',
    description: 'Dobla la ropa seca del tendedero',
    estimatedMinutes: 15,
    effortLevel: 'medium',
    impactLevel: 'medium',
    isMicroTask: false,
    requiresDecisions: false,
    requiresMovement: true,
    steps: [
      'Recoge ropa del tendedero',
      'Dobla cada prenda',
      'Organiza por categorías',
      'Coloca en cestas o lleva a armarios',
    ],
    intensityLevels: {
      basic: {
        description: 'Doblar lo básico',
        minutes: 8,
      },
      standard: {
        description: 'Doblar toda la ropa',
        minutes: 15,
      },
      deep: {
        description: 'Doblar + guardar en armarios',
        minutes: 30,
      },
    },
  },
  {
    id: 'task_laundry_iron',
    category: 'organizing',
    room: 'laundry',
    title: 'Planchar básico',
    description: 'Plancha prendas que lo necesiten',
    estimatedMinutes: 20,
    effortLevel: 'medium',
    impactLevel: 'low',
    isMicroTask: false,
    requiresDecisions: true,
    requiresMovement: false,
    steps: [
      'Prepara tabla de planchar',
      'Calienta la plancha',
      'Plancha prenda por prenda',
      'Cuelga o dobla según corresponda',
    ],
    intensityLevels: {
      basic: {
        description: 'Solo lo imprescindible (2-3 prendas)',
        minutes: 10,
      },
      standard: {
        description: 'Planchar lo necesario',
        minutes: 20,
      },
      deep: {
        description: 'Planchar todo + almidón + perfecto',
        minutes: 40,
      },
    },
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
