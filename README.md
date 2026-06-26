# ZARA Challenge - Catálogo de Smartphones

Aplicación web moderna para explorar, buscar y comprar smartphones. Desarrollada con React 19, TypeScript y Vite.

## Características

- **Catálogo responsivo** - Mobile-first 
- **Búsqueda en tiempo real** - Filtro con debounce de 350ms
- **Detalles del producto** - Imágenes, especificaciones y similares
- **Carrito persistente** - localStorage + Context API

## Stack

- **React 19** + **TypeScript** - Tipado
- **Vite** - Build tool
- **Vitest** + **React Testing Library** - Tests
- **SCSS Modules** - Estilos modulares
- **Context API** - State management global

## Quick Start

```bash
# Instalar
npm install

# Desarrollo
npm run dev

# Tests
npm run test

# Build
npm run build

# Lint
npm run lint
```

## Variables de Entorno

El proyecto requiere configuración de variables de entorno. Sigue estos pasos:

### 1. Copiar archivo de ejemplo
```bash
cp .env.example .env
```

### 2. Completar con tus valores

```env
# API Configuration
VITE_BASE_URL=https://api.example.com/api
VITE_API_KEY=your-api-key-here

# Storage Configuration  
VITE_STORAGE_KEY=zara_cart
```

**Variables disponibles:**
| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_BASE_URL` | URL base de la API | `http://localhost:3000` |
| `VITE_API_KEY` | API Key para autenticación | (vacío) |
| `VITE_STORAGE_KEY` | Clave para localStorage del carrito | `zara_cart` |

**Notas:**
- El archivo `.env` NO debe commiterse (está en `.gitignore`)
- Siempre usar `.env.example` como plantilla
- En producción, configurar variables en la plataforma de deploy

## Estructura

```
src/
├── api/             # API config
├── routes/          # Enrutado
├── components/      # Componentes reutilizables
├── context/         # React Context (CartContext)
├── hooks/           # Custom hooks (useDashboard, useDetails)
├── pages/           # Páginas (Dashboard, Details, Cart)
├── services/        # Servicios
├── styles/          # SCSS con responsive mixins
├── types/           # TypeScript types
├── utils/           # Funciona de utilidad
└── __tests__/       # Tests
```

## Arquitectura

### Gestión de Estado

La aplicación usa una arquitectura clara de capas para manejar el estado:

**Estado Global (Context API)**
- CartContext: Carrito compartido entre páginas
- Accesible desde cualquier componente con useCart()
- Sincroniza automáticamente con localStorage

**Estado Local (useState)**
- Componentes mantienen su UI state local
- Loading states, errores, valores de formularios
- No se propaga a menos que sea necesario

**Persistencia**
- localStorage: Carrito se mantiene entre sesiones
- Recuperación automática al cargar la aplicación

### Flujo de Datos

El flujo de datos sigue un patrón unidireccional:

1. Usuario interactúa con componente
2. Componente llama método del hook
3. Hook ejecuta async operation (API call)
4. Respuesta actualiza estado (setState)
5. Re-render automático del componente
6. Si es estado global, Context notifica a otros componentes

Ejemplo: Agregar al carrito
```
DetailsPage → handleAddToCart() → useDetails hook 
→ useCart.addToCart() → CartContext → localStorage → Navbar refleja cambios
```

### Patrones de Diseño

**MVVM (Model-View-ViewModel)**

La aplicación implementa el patrón MVVM para separar la UI de la lógica:

- **Vista** (src/components, src/pages): Componentes React puros
  - Solo reciben datos y callbacks
  - No contienen lógica de negocio
  - Renderizan interfaz basado en props
  - Totalmente independientes

- **Modelo de Vista** (src/hooks): Custom hooks que contienen la lógica
  - useDashboard: Maneja productos, búsqueda, debounce
  - useDetails: Maneja detalles, selecciones de color/almacenamiento
  - Abstracción de estado y efectos
  - Exponen métodos y estado a la Vista
  - Testeable sin montar componentes

- **Modelo** (src/services, src/types): Datos y comunicación
  - ProductsService: Contrato con API
  - Types: Estructura de datos tipada
  - cartStorage: Persistencia

Ventaja: El componente no conoce cómo obtiene los datos, solo usa el ViewModel.

```
Componente(Vista) → Hook(Modelo de Vista) → Servicio(Modelo)
   (renderiza)          (contiene lógica)      (obtiene datos)
```

**Custom Hooks**
- useDashboard: Lógica de listado y búsqueda
- useDetails: Lógica de página de detalles
- useCart: Acceso a estado global del carrito
- Encapsulan lógica de negocio reutilizable

**Separación de Responsabilidades**
- Componentes: Solo renderizado
- Hooks: Lógica de negocio
- Servicios: Comunicación con API
- Types: Contratos de datos


## Responsive Design

Mobile-first con 3 breakpoints:

```scss
@include mobile  { } // Base: < 640px
@include tablet  { } // 640px+
@include desktop { } // 1024px+
```

## Puntos Fuertes

1. **Testing Comprehensivo** - 104 tests con descripciones en español
2. **Arquitectura Escalable** - Separación clara de capas
3. **TypeScript Strict** - Tipado fuerte sin excepciones
4. **Mobile-First** - Responsivo desde el inicio
5. **Código Limpio** - Sin console.log en producción
6. **Performance** - Build optimizado con Vite

## Troubleshooting

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Tests con problemas
npm run test -- --clearCache
```

---

**Prueba técnica** 
