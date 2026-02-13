/**
 * ============================================================================
 * RECOMENDACIONES DE ESTILOS TAILWIND - SOFIA DASHBOARD
 * ============================================================================
 * 
 * Guía completa de clases Tailwind CSS utilizadas en el dashboard
 * para mantener consistencia visual y permitir personalizaciones
 */

// ============================================================================
// FONDOS Y GRADIENTES
// ============================================================================

export const BACKGROUNDS = {
  // Dashboard principal
  mainGradient:
    'bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900',

  // Tarjetas por color
  cards: {
    green: 'bg-green-50 hover:bg-green-100 border-green-200',
    red: 'bg-red-50 hover:bg-red-100 border-red-200',
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
  },

  // Variantes
  subtle: 'bg-gray-50 hover:bg-gray-100 border-gray-100',
  bordered: 'border-2',

  // Decorativos
  blobTop: 'bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20',
  blobBottom: 'bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20',
};

// ============================================================================
// TEXTOS
// ============================================================================

export const TEXT = {
  // Tamaños
  sizes: {
    xs: 'text-xs',        // 12px
    sm: 'text-sm',        // 14px
    base: 'text-base',    // 16px
    lg: 'text-lg',        // 18px
    xl: 'text-xl',        // 20px
    '2xl': 'text-2xl',    // 24px
    '3xl': 'text-3xl',    // 30px
    '4xl': 'text-4xl',    // 36px
    '5xl': 'text-5xl',    // 48px
  },

  // Pesos
  weights: {
    thin: 'font-thin',       // 100
    light: 'font-light',     // 300
    normal: 'font-normal',   // 400
    semibold: 'font-semibold', // 600
    bold: 'font-bold',       // 700
  },

  // Colores por contexto
  titles: 'text-gray-900 font-bold',
  subtitle: 'text-gray-600 text-sm',
  body: 'text-gray-700',
  secondary: 'text-gray-500',
  muted: 'text-gray-400',

  // Colores en tarjetas de color
  colored: {
    green: 'text-green-100 text-green-300 text-green-600 text-green-700',
    red: 'text-red-100 text-red-300 text-red-600 text-red-700',
    blue: 'text-blue-100 text-blue-300 text-blue-600 text-blue-700',
    yellow: 'text-yellow-100 text-yellow-300 text-yellow-600 text-yellow-700',
    purple: 'text-purple-100 text-purple-300 text-purple-600 text-purple-700',
  },
};

// ============================================================================
// ESPACIADO (Padding, Margin)
// ============================================================================

export const SPACING = {
  // Padding estándar
  cardPadding: 'p-4 md:p-6', // Interno de tarjetas
  sectionPadding: 'px-4 sm:px-6 lg:px-8 py-12', // Secciones
  pagePadding: 'p-6 md:p-8 lg:p-12', // Página completa

  // Gaps en grids
  gap: {
    tight: 'gap-2 md:gap-3',
    normal: 'gap-4 md:gap-6',
    loose: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-12',
  },

  // Márgenes
  margins: {
    small: 'mb-4',
    medium: 'mb-6 md:mb-8',
    large: 'mb-12',
  },
};

// ============================================================================
// BORDES Y ESQUINAS
// ============================================================================

export const BORDERS = {
  // Radio de bordes
  radius: {
    sm: 'rounded',      // 4px
    md: 'rounded-lg',   // 8px
    lg: 'rounded-xl',   // 12px
    full: 'rounded-full', // 9999px
  },

  // Estilos de borde
  standard: 'border-2',
  subtle: 'border',

  // Divisores
  divider: 'border-t border-gray-200',
  dividerDark: 'border-t border-gray-700',
};

// ============================================================================
// SOMBRAS
// ============================================================================

export const SHADOWS = {
  sm: 'shadow-sm',       // Muy suave
  md: 'shadow-md',       // Medio
  lg: 'shadow-lg',       // Grande
  xl: 'shadow-xl',       // Extra grande

  // Con hover
  hover: 'hover:shadow-md transition-shadow',
  hoverLg: 'hover:shadow-lg transition-shadow',

  // Coloreadas
  green: 'shadow-green-500/20',
  red: 'shadow-red-500/20',
  blue: 'shadow-blue-500/20',
  purple: 'shadow-purple-500/20',
};

// ============================================================================
// TRANSICIONES Y ANIMACIONES
// ============================================================================

export const ANIMATIONS = {
  // Transiciones
  transition: 'transition-all duration-200',
  transitionFast: 'transition-all duration-100',
  transitionSlow: 'transition-all duration-500',

  // Hover states
  hoverScale: 'hover:scale-105 transition-transform',
  hoverGrow: 'hover:shadow-lg transition-all',
  hoverUp: 'hover:-translate-y-1 transition-transform',

  // Animaciones
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  blob: 'animate-blob',

  // Transiciones suaves
  smooth: 'ease-in-out',
  gentle: 'ease-out',
};

// ============================================================================
// LAYOUTS RESPONSIVOS
// ============================================================================

export const LAYOUTS = {
  // Grids
  grid: {
    '1col': 'grid grid-cols-1',
    '2col': 'grid grid-cols-1 md:grid-cols-2',
    '3col': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4col': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },

  // Flexbox
  flex: {
    row: 'flex flex-row',
    col: 'flex flex-col',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-start',
  },

  // Alineación
  align: {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  },
};

// ============================================================================
// COMPOSICIONES DE ESTILOS COMUNES
// ============================================================================

export const COMPONENTS = {
  // Card estándar
  card: `
    rounded-xl 
    border 
    shadow-sm 
    hover:shadow-md 
    transition-all 
    duration-200 
    p-4
  `,

  // Card sin hover
  cardStatic: `
    rounded-xl 
    border 
    shadow-sm 
    p-4
  `,

  // Botón primario
  buttonPrimary: `
    px-4 py-2 
    bg-indigo-600 
    text-white 
    rounded-lg 
    hover:bg-indigo-700 
    transition-colors 
    disabled:opacity-50
  `,

  // Botón secundario
  buttonSecondary: `
    px-4 py-2 
    border border-gray-300 
    text-gray-700 
    rounded-lg 
    hover:bg-gray-50 
    transition-colors
  `,

  // Input standard
  input: `
    w-full 
    px-4 py-2 
    border 
    border-gray-300 
    rounded-lg 
    focus:ring-2 
    focus:ring-indigo-500 
    focus:border-transparent
  `,

  // Badge
  badge: `
    inline-block 
    px-2.5 py-1 
    text-xs 
    font-bold 
    rounded-full
  `,

  // Tag
  tag: `
    inline-block 
    px-3 py-1 
    text-sm 
    rounded-full 
    bg-gray-100 
    text-gray-800
  `,

  // Alert
  alert: `
    p-4 
    rounded-lg 
    border 
    border-l-4
  `,

  // Header
  header: `
    text-4xl 
    md:text-5xl 
    font-bold 
    text-transparent 
    bg-clip-text 
    bg-gradient-to-r 
    from-white 
    via-purple-200 
    to-indigo-300
  `,
};

// ============================================================================
// COLORES ESPECIALES
// ============================================================================

export const COLORS = {
  // Estados
  success: 'text-green-600 bg-green-50',
  warning: 'text-yellow-600 bg-yellow-50',
  error: 'text-red-600 bg-red-50',
  info: 'text-blue-600 bg-blue-50',

  // Escala de grises
  dark: 'text-gray-900 bg-gray-900',
  light: 'text-gray-100 bg-gray-100',

  // Badge colors
  badges: {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  },
};

// ============================================================================
// MEDIA QUERIES Y BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  sm: '640px',  // md: en Tailwind
  md: '768px',  // md: en Tailwind
  lg: '1024px', // lg: en Tailwind
  xl: '1280px', // xl: en Tailwind
  '2xl': '1536px', // 2xl: en Tailwind

  // Clases de ejemplo
  mobile: 'block md:hidden',      // Solo en móvil
  tablet: 'hidden md:block lg:hidden', // Solo tablet
  desktop: 'hidden lg:block',     // Solo desktop
  notMobile: 'hidden md:block',   // Tablet + desktop
};

// ============================================================================
// EJEMPLOS DE COMPOSICIÓN
// ============================================================================

export const EXAMPLES = {
  // Dashboard container
  dashboardContainer: `
    min-h-screen 
    bg-gradient-to-br 
    from-slate-900 
    via-slate-900 
    to-purple-900
  `,

  // Main content
  mainContent: `
    relative 
    z-10 
    max-w-7xl 
    mx-auto 
    px-4 
    sm:px-6 
    lg:px-8 
    py-12
  `,

  // Card grid
  cardGrid: `
    grid 
    grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    gap-6
  `,

  // Center section
  centerSection: `
    flex 
    items-center 
    justify-center 
    min-h-screen
  `,

  // Info box
  infoBox: `
    p-6 
    bg-blue-50 
    border 
    border-blue-300 
    rounded-lg 
    text-blue-900
  `,

  // Success message
  successMessage: `
    p-4 
    bg-green-100 
    border-l-4 
    border-green-600 
    text-green-800 
    rounded
  `,

  // Error message
  errorMessage: `
    p-4 
    bg-red-100 
    border-l-4 
    border-red-600 
    text-red-800 
    rounded
  `,
};

// ============================================================================
// RECOMENDACIONES
// ============================================================================

export const TAILWIND_RECOMMENDATIONS = `
📌 RECOMENDACIONES DE BUENAS PRÁCTICAS:

1. CONSISTENCIA
   ✓ Usa la misma escala de colores en todo
   ✓ Mantén tamaños de fuente consistentes (xs, sm, base, lg, xl, 2xl, etc.)
   ✓ Aplica espaciado uniforme (gap-4, gap-6, gap-8)

2. RESPONSIVE FIRST
   ✓ Empieza con estilos mobile (sin prefijo)
   ✓ Añade md:, lg:, xl: para tamaños más grandes
   ✓ Evita px (no hay responsive en Tailwind)

3. COMPOSICIÓN
   ✓ Agrupa clases relacionadas
   ✓ Usa const para clases reutilizables
   ✓ Evita más de 20 clases en un elemento

4. PERFORMANCE
   ✓ Tailwind hace purging automático
   ✓ Solo incluye clases que uses
   ✓ Prefiere clases utility a CSS personalizado

5. ACCESIBILIDAD
   ✓ Contraste suficiente (WCAG AAA)
   ✓ focus: states para navegación
   ✓ Mensajes claros en colores (no solo color)

6. MANTENIBILIDAD
   ✓ Documenta clases complejas
   ✓ Crea componentes para patrones repetidos
   ✓ Revisa tailwind.config.cjs regularmente

📚 RECURSOS ÚTILES:
- https://tailwindcss.com/docs
- https://ui.shadcn.com/
- https://headlessui.com/
- https://tailwindcomponents.com/
`;

export default {
  BACKGROUNDS,
  TEXT,
  SPACING,
  BORDERS,
  SHADOWS,
  ANIMATIONS,
  LAYOUTS,
  COMPONENTS,
  COLORS,
  BREAKPOINTS,
  EXAMPLES,
  TAILWIND_RECOMMENDATIONS,
};
