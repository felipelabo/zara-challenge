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
