export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: 'psychology' | 'habits' | 'science';
  readTime: number;
  icon: string;
  summary: string;
  content: ArticleSection[];
}

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'list' | 'highlight' | 'quote';
  content: string | string[];
}

export const articles: Article[] = [
  {
    id: 'behavioral-activation',
    title: 'Activación Conductual',
    subtitle: 'La ciencia detrás de actuar para sentirse mejor',
    category: 'psychology',
    readTime: 5,
    icon: '🧠',
    summary:
      'Descubre cómo pequeñas acciones pueden tener un gran impacto en tu bienestar emocional.',
    content: [
      {
        type: 'heading',
        content: '¿Qué es la Activación Conductual?',
      },
      {
        type: 'paragraph',
        content:
          'La activación conductual es una técnica de la Terapia Cognitivo-Conductual (TCC) que se basa en una idea simple pero poderosa: nuestras acciones influyen en cómo nos sentimos.',
      },
      {
        type: 'paragraph',
        content:
          'Cuando nos sentimos abrumados o con poca energía, tendemos a evitar actividades y responsabilidades. Paradójicamente, esta evitación nos hace sentir peor, creando un ciclo negativo.',
      },
      {
        type: 'heading',
        content: 'El Ciclo de la Inactividad',
      },
      {
        type: 'list',
        content: [
          'Me siento mal → Evito tareas',
          'Evito tareas → Las cosas se acumulan',
          'Las cosas se acumulan → Me siento peor',
          'Me siento peor → Evito más tareas',
        ],
      },
      {
        type: 'heading',
        content: 'Rompiendo el Ciclo',
      },
      {
        type: 'paragraph',
        content:
          'La activación conductual propone romper este ciclo a través de la acción. No esperamos a "sentirnos mejor" para actuar; actuamos para sentirnos mejor.',
      },
      {
        type: 'highlight',
        content:
          'La motivación no siempre precede a la acción. A menudo, la acción precede a la motivación.',
      },
      {
        type: 'heading',
        content: '¿Por qué funciona?',
      },
      {
        type: 'paragraph',
        content:
          'Cuando completamos una tarea, aunque sea pequeña, experimentamos varios beneficios psicológicos:',
      },
      {
        type: 'list',
        content: [
          'Sensación de logro y competencia',
          'Reducción de la ansiedad anticipatoria',
          'Mejora del entorno físico',
          'Aumento de la energía y motivación',
          'Refuerzo positivo que facilita la siguiente acción',
        ],
      },
      {
        type: 'heading',
        content: 'HomeFlow y la Activación Conductual',
      },
      {
        type: 'paragraph',
        content:
          'HomeFlow está diseñado siguiendo estos principios. Te ayudamos a:',
      },
      {
        type: 'list',
        content: [
          'Identificar tu estado emocional actual',
          'Seleccionar tareas apropiadas para ese estado',
          'Descomponer tareas en pasos manejables',
          'Medir el impacto de la acción en tu bienestar',
          'Construir momentum gradualmente',
        ],
      },
      {
        type: 'quote',
        content:
          '"No tienes que sentirte bien para empezar. Solo tienes que empezar para sentirte bien." - Principio de Activación Conductual',
      },
    ],
  },
  {
    id: 'micro-tasks',
    title: 'El Poder de las Micro-Tareas',
    subtitle: 'Cómo las acciones pequeñas generan grandes cambios',
    category: 'habits',
    readTime: 4,
    icon: '🌱',
    summary:
      'Entiende por qué empezar en pequeño es la estrategia más efectiva para crear cambios duraderos.',
    content: [
      {
        type: 'heading',
        content: '¿Qué son las Micro-Tareas?',
      },
      {
        type: 'paragraph',
        content:
          'Las micro-tareas son acciones tan pequeñas que resultan casi imposibles de evitar. Toman entre 2-5 minutos y requieren mínima energía mental o física.',
      },
      {
        type: 'paragraph',
        content:
          'Ejemplos: hacer la cama, lavar 5 platos, ordenar una superficie, doblar una prenda.',
      },
      {
        type: 'heading',
        content: 'La Barrera de Inicio',
      },
      {
        type: 'paragraph',
        content:
          'El mayor obstáculo para completar cualquier tarea no es la tarea en sí, sino empezarla. Nuestro cerebro tiende a sobreestimar el esfuerzo requerido y subestimar nuestra capacidad.',
      },
      {
        type: 'highlight',
        content:
          'Las micro-tareas son tan pequeñas que esquivan completamente esta barrera psicológica.',
      },
      {
        type: 'heading',
        content: 'El Efecto Zeigarnik Inverso',
      },
      {
        type: 'paragraph',
        content:
          'Una vez que empezamos una actividad, nuestro cerebro tiende a querer completarla. Esto se conoce como el Efecto Zeigarnik.',
      },
      {
        type: 'paragraph',
        content:
          'Las micro-tareas aprovechan este efecto: empiezas a lavar 5 platos y terminas lavando todos. Comienzas a ordenar una superficie y continúas con toda la habitación.',
      },
      {
        type: 'heading',
        content: 'Beneficios Neurológicos',
      },
      {
        type: 'paragraph',
        content: 'Cada micro-tarea completada genera:',
      },
      {
        type: 'list',
        content: [
          'Liberación de dopamina (neurotransmisor del placer)',
          'Sensación inmediata de logro',
          'Reducción del cortisol (hormona del estrés)',
          'Aumento de la confianza en tu capacidad',
          'Momentum para la siguiente acción',
        ],
      },
      {
        type: 'heading',
        content: 'Cuándo Usar Micro-Tareas',
      },
      {
        type: 'paragraph',
        content: 'Las micro-tareas son especialmente útiles cuando:',
      },
      {
        type: 'list',
        content: [
          'Te sientes abrumado/a',
          'Tienes poca energía',
          'Has estado evitando responsabilidades',
          'Necesitas un "empujón" inicial',
          'Quieres romper un ciclo de inactividad',
        ],
      },
      {
        type: 'heading',
        content: 'La Regla del 2 Minutos',
      },
      {
        type: 'paragraph',
        content:
          'Si una tarea toma menos de 2 minutos, hazla inmediatamente. Esta regla, popularizada por David Allen, se basa en que el esfuerzo de posponer la tarea es mayor que el de completarla.',
      },
      {
        type: 'quote',
        content:
          '"Un viaje de mil millas comienza con un solo paso." - Lao Tzu',
      },
      {
        type: 'paragraph',
        content:
          'HomeFlow identifica automáticamente micro-tareas y las prioriza cuando detecta que te sientes abrumado/a o con poca energía.',
      },
    ],
  },
  {
    id: 'consistency-over-intensity',
    title: 'Consistencia sobre Intensidad',
    subtitle: 'Por qué hacer poco cada día es mejor que mucho una vez',
    category: 'science',
    readTime: 6,
    icon: '📊',
    summary:
      'La investigación científica demuestra que la regularidad supera a la intensidad en la formación de hábitos.',
    content: [
      {
        type: 'heading',
        content: 'El Mito de la Motivación Intensa',
      },
      {
        type: 'paragraph',
        content:
          'Muchas personas intentan cambiar sus hábitos con grandes ráfagas de esfuerzo intenso: limpiar toda la casa en un día, reorganizar todo de golpe, hacer cambios dramáticos.',
      },
      {
        type: 'paragraph',
        content:
          'El problema es que estos esfuerzos intensos son insostenibles. Después de la limpieza maratónica, volvemos a los patrones anteriores, y a menudo nos sentimos peor por no poder mantener ese nivel de intensidad.',
      },
      {
        type: 'heading',
        content: 'La Ciencia de los Hábitos',
      },
      {
        type: 'paragraph',
        content:
          'Investigaciones en neurociencia han demostrado que los hábitos se forman a través de la repetición consistente, no de la intensidad ocasional.',
      },
      {
        type: 'highlight',
        content:
          'El cerebro crea nuevos caminos neuronales a través de la práctica repetida. Cada repetición fortalece la conexión.',
      },
      {
        type: 'paragraph',
        content:
          'Un estudio de la Universidad de Londres (Lally et al., 2010) encontró que toma un promedio de 66 días de práctica consistente para que un comportamiento se vuelva automático.',
      },
      {
        type: 'heading',
        content: 'La Curva de Formación de Hábitos',
      },
      {
        type: 'paragraph',
        content: 'La formación de hábitos sigue una curva predecible:',
      },
      {
        type: 'list',
        content: [
          'Días 1-10: Requiere esfuerzo consciente constante',
          'Días 11-30: Se vuelve un poco más fácil, pero aún requiere atención',
          'Días 31-66: Comienza a sentirse natural',
          'Día 66+: Se vuelve automático, parte de tu rutina',
        ],
      },
      {
        type: 'heading',
        content: 'Por Qué Funciona la Consistencia',
      },
      {
        type: 'list',
        content: [
          'Reduce la fatiga de decisión',
          'Construye identidad ("Soy alguien que mantiene su espacio ordenado")',
          'Crea expectativas y rutinas predecibles',
          'Es sostenible a largo plazo',
          'Genera momentum compuesto',
        ],
      },
      {
        type: 'heading',
        content: 'La Regla del 1% Mejor',
      },
      {
        type: 'paragraph',
        content:
          'James Clear, en "Atomic Habits", popularizó la idea de mejorar un 1% cada día. Matemáticamente, si mejoras 1% diario durante un año, terminas siendo 37 veces mejor.',
      },
      {
        type: 'paragraph',
        content:
          'Aplicado al hogar: es mejor ordenar 5 minutos diarios que hacer una limpieza de 2 horas una vez al mes.',
      },
      {
        type: 'heading',
        content: 'Cómo HomeFlow Facilita la Consistencia',
      },
      {
        type: 'list',
        content: [
          'Sistema de rachas que recompensa la práctica diaria',
          'Tareas adaptadas a tu energía de cada día',
          'Recordatorios sutiles sin presión',
          'Celebración de pequeños logros',
          'Seguimiento visual de tu progreso',
        ],
      },
      {
        type: 'heading',
        content: 'El Poder del "No Rompas la Cadena"',
      },
      {
        type: 'paragraph',
        content:
          'Jerry Seinfeld usaba un calendario donde marcaba con una X cada día que escribía chistes. Su única regla: "No rompas la cadena".',
      },
      {
        type: 'paragraph',
        content:
          'Esta técnica funciona porque crea un compromiso visual y hace que mantener la racha se vuelva su propia recompensa.',
      },
      {
        type: 'quote',
        content:
          '"No necesitas ser grandioso para empezar, pero necesitas empezar para ser grandioso." - Zig Ziglar',
      },
      {
        type: 'highlight',
        content:
          'Recuerda: La meta no es la perfección, es la práctica. Un hábito imperfecto pero consistente es infinitamente más valioso que la perfección ocasional.',
      },
    ],
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function getArticlesByCategory(category: Article['category']): Article[] {
  return articles.filter((article) => article.category === category);
}
