# 📚 Guía de Componentes UI - Sofia Dashboard

## Estructura de Carpetas

```
src/
├── components/
│   ├── SofiaDashboard.tsx          # Dashboard principal mejorado
│   └── ui/
│       ├── Card.tsx                 # Componente base de tarjetas
│       ├── SectionTitle.tsx          # Títulos de secciones
│       ├── Recommendation.tsx        # Recomendaciones con badges
│       └── Alert.tsx                 # Alertas con severidad
├── services/
│   └── queries.ts                   # Queries de React Query
│   └── mockData.ts                  # Datos de prueba
└── utils/
    └── mockData.ts                  # Mock data helpers
```

## Componentes Reutilizables

### 1. **Card** - Componente Base

El componente más versátil para mostrar información.

```tsx
import Card from './ui/Card';

<Card 
  icon={TrendingUp}           // Icono de lucide-react (opcional)
  title="Mi Título"            // Título (opcional)
  color="blue"                 // blue|green|red|yellow|purple|indigo
  variant="default"            // default|subtle|bordered
  className=""                 // Clases adicionales
>
  <p>Contenido personalizado</p>
</Card>
```

**Variantes:**
- `default`: Fondo suave con border
- `subtle`: Muy discreto, ideal para datos secundarios
- `bordered`: Border más prominente, ideal para alertas

**Colores:**
- `blue`, `green`, `red`, `yellow`, `purple`, `indigo`

---

### 2. **SectionTitle** - Títulos de Sección

Crea títulos visualmente consistentes con underline.

```tsx
import SectionTitle from './ui/SectionTitle';

<SectionTitle
  icon={TrendingUp}           // Icono (opcional)
  title="Título Principal"
  subtitle="Descripción"       // Subtitle opcional
  className=""
/>
```

---

### 3. **Recommendation** - Recomendaciones

Muestra recomendaciones inteligentes con badges de tipo.

```tsx
import { Recommendation } from './ui/Recommendation';

interface RecommendationItem {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'critical' | 'info';
}

<Recommendation 
  title="🎯 Oportunidad"
  message="Tu negocio crece..."
  type="success"
  className=""
/>
```

**Tipos:**
- `success` (verde) - Buenas noticias
- `warning` (amarillo) - Requiere atención
- `critical` (rojo) - Urgente
- `info` (azul) - Información

---

### 4. **Alert** - Alertas

Sistema de alertas con severidad y opción de cerrar.

```tsx
import { Alert } from './ui/Alert';

interface AlertItem {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
}

<Alert 
  title="🔴 ALERTA"
  message="Contenido..."
  severity="critical"
  dismissible={true}           // Mostrar botón cerrar
  onDismiss={() => {}}         // Callback al cerrar
  className=""
/>
```

---

## Sistema de Colores Tailwind

Nuestro dashboard usa esta paleta:

```css
/* Fondos de gradient */
bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900

/* Tarjetas por tipo */
Card (Green):    bg-green-50,  border-green-200
Card (Red):      bg-red-50,    border-red-200
Card (Blue):     bg-blue-50,   border-blue-200
Card (Purple):   bg-purple-50, border-purple-200
Card (Yellow):   bg-yellow-50, border-yellow-200

/* Textos */
Títulos:      text-gray-900 (oscuro)
Cuerpo:       text-gray-700
Secundario:   text-gray-600
Gris claro:   text-gray-400
```

---

## Responsive Design

Todos los componentes incluyen breakpoints:

```tsx
// Grid responsivo
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Padding responsive
px-4 sm:px-6 lg:px-8

// Texto responsivo
text-sm md:text-base lg:text-lg
```

---

## Ejemplos de Layout Práctico

### Dashboard Principal

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-900 ...">
  <div className="max-w-7xl mx-auto px-4 py-12">
    {/* Reemplazable con tu contenido */}
  </div>
</div>
```

### Sección de Tarjetas

```tsx
<SectionTitle 
  icon={TrendingUp}
  title="Métricas Principales"
  subtitle="Estado actual"
/>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card icon={BarChart} title="Ingresos" color="green">
    <p className="text-4xl font-bold text-green-100">$12,000</p>
  </Card>
  {/* ... más cards */}
</div>
```

### Sistema de Alertas

```tsx
{alerts.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {alerts.map((alert, idx) => (
      <Alert key={idx} {...alert} dismissible />
    ))}
  </div>
)}
```

---

## Iconos Disponibles

Usamos **lucide-react** para iconos consistentes:

```tsx
import {
  Activity,        // Actividad
  AlertCircle,     // Alerta
  Calendar,        // Calendario
  ShieldCheck,     // Protección
  Sparkles,        // Magia
  Target,          // Objetivo
  TrendingUp,      // Tendencia arriba
  Zap,             // Rayo/energía
  BarChart,        // Gráfico de barras
  LineChart,       // Gráfico de línea
  PieChart,        // Gráfico circular
  // ... muchos más
} from 'lucide-react';
```

---

## Mock Data para Desarrollo

El archivo `src/utils/mockData.ts` contiene datos de ejemplo:

```tsx
import mockDashboardData from '../utils/mockData';

// Usar en desarrollo:
const { stats, metrics, prediction, insight, alerts, recommendations } = mockDashboardData;

// Simular queries con delays:
const { mockQueryFunctions } = mockDashboardData;
await mockQueryFunctions.fetchUnifiedDashboard(2, 2026);
```

---

## Tipado TypeScript

Todas las interfaces están bien tipadas:

```tsx
// Recomendaciones
interface RecommendationItem {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'critical' | 'info';
}

// Alertas
interface AlertItem {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
}

// Análisis del agente
interface AgentAnalysis {
  recommendations: RecommendationItem[];
  alerts: AlertItem[];
  health: string;
  riskScore: number;
  seasonality: string;
  patterns: string[];
}
```

---

## Temas de Animación

Nuestros componentes incluyen transiciones suaves:

```css
transition-all duration-200    /* Cambios general */
hover:shadow-md                /* Sombra al pasar */
hover:bg-{color}-100           /* Color al pasar */
animate-spin                   /* Spinner de carga */
animate-blob                   /* Burbujas de fondo */
```

---

## Personalización

### Añadir Nueva Variante de Color

En `src/components/ui/Card.tsx`:

```tsx
const colorClasses = {
  blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
  // ... agregar aquí
  custom: 'border-custom-200 bg-custom-50 hover:bg-custom-100',
};
```

### Añadir Nuevo Tipo de Alerta

En `src/components/ui/Alert.tsx`:

```tsx
const severityConfig = {
  critical: { /* ... */ },
  // ... agregar aquí
  custom: {
    color: 'purple',
    icon: CustomIcon,
    bgClass: 'bg-custom-50 border-custom-300',
    badgeClass: 'bg-custom-100 text-custom-900',
    labelClass: 'text-custom-700 font-bold',
  },
};
```

---

## Rendimiento

✅ **Componentes Optimizados:**
- Memozación de componentes pesados
- Lazy loading de secciones
- Queries cacheadas (React Query)
- CSS crítico inlined
- Animaciones GPU aceleradas

---

## Accesibilidad

✅ **Características de A11y:**
- Contraste de colores WCAG AAA
- Semántica HTML correcta
- Prop `alt` en imágenes
- Navegación por teclado
- ARIA labels donde necesario

---

## Guía Rápida para Usar en tu App

### 1. Importar el Dashboard

```tsx
import SofiaDashboard from './components/SofiaDashboard';

function App() {
  return <SofiaDashboard />;
}
```

### 2. Usar Componentes Individuales

```tsx
import Card from './components/ui/Card';
import SectionTitle from './components/ui/SectionTitle';
import { Alert } from './components/ui/Alert';
import { Recommendation } from './components/ui/Recommendation';

export default function MyPage() {
  return (
    <>
      <SectionTitle title="Mis Datos" />
      <div className="grid gap-6">
        <Card color="blue" title="Info">Contenido</Card>
        <Alert severity="warning" title="Aviso" message="..." />
        <Recommendation type="success" title="Tip" message="..." />
      </div>
    </>
  );
}
```

### 3. Extender con Datos Reales

```tsx
// En tu componente
const { data: stats } = useQuery({
  queryKey: ['myStats'],
  queryFn: fetchMyStats,
});

// Pasar al dashboard
<SofiaDashboard initialData={stats} />
```

---

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| Colores no aparecen | Verifica que `tailwind.config.cjs` incluya la carpeta `src` |
| Iconos no se ven | Instala: `npm install lucide-react` |
| TypeScript errores | Ejecuta: `npm run build` para ver errores completos |
| Cambios no se refrescan | Limpia: `rm -rf node_modules/.vite` |

---

## Recursos Útiles

- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **React Query**: https://tanstack.com/query
- **TypeScript**: https://www.typescriptlang.org

---

**Última Actualización**: Febrero 2026 ✨
