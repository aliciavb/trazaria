# Changelog - Trazaria

## [0.6.0] - 2025-10-27 🌿

### ✨ Nueva funcionalidad principal: PWA

**Trazaria ahora es una Progressive Web App instalable en móvil!**

#### Añadido
- **PWA completa** con soporte offline
  - Service Worker generado con Workbox
  - Manifest configurado con iconos SVG
  - Cacheo automático de assets estáticos
  - Funciona completamente offline después de la primera carga
  
- **Iconos personalizados**
  - Icono SVG con diseño de hoja verde (símbolo de trazabilidad)
  - Soporte para iOS y Android
  - Meta tags para Apple touch icon
  
- **Campo de azúcares** en valores nutricionales
  - Añadido input en `CreateFoodDialog`
  - Parser actualizado para extraer azúcares de texto en español
  - ~50 alimentos BEDCA actualizados con valores de azúcar
  - Regex pattern: `/(?:de los cuales\s+)?az[úu]cares?[^:]*:[^\d]*(\d+(?:[,.]\d+)?)\s*g/i`

- **Documentación de deploy**
  - `DEPLOY.md` - Guía completa de deployment
  - `QUICKSTART.md` - Guía rápida para empezar
  - `netlify.toml` - Configuración automática para Netlify
  - Scripts NPM para deploy: `deploy:netlify` y `deploy:vercel`

#### Actualizado
- `vite.config.ts` - Añadido plugin `vite-plugin-pwa` con configuración completa
- `index.html` - Meta tags PWA para iOS y Android
- `package.json` - Versión 0.6.0, scripts de deploy
- `README.md` - Documentación actualizada con instrucciones PWA

#### Archivos técnicos
- `public/icon.svg` - Icono principal de la app
- `scripts/generate-icons.js` - Utilidad para generar iconos PNG

### 🔧 Mejoras técnicas
- Build optimizado para PWA (624 KB minified, 189 KB gzipped)
- Precache de 12 archivos críticos
- Cache strategy para Google Fonts
- Soporte para testing PWA en desarrollo (`devOptions.enabled`)

### 📱 Experiencia móvil
- **Instalable** como app nativa en iOS y Android
- **Modo standalone** sin barra del navegador
- **Splash screen** personalizado con colores de Trazaria
- **Orientación portrait** por defecto

### 🔐 Privacidad
- Datos 100% locales (IndexedDB)
- Sin backend, sin tracking
- Funciona completamente offline
- Export/Import para backups manuales

---

## [0.5.0] - Anteriores

### ✨ Funcionalidades base
- Onboarding con cálculo de TMB
- Registro de comidas con autocompletado
- Base de datos BEDCA (~50 alimentos españoles)
- Vista "Hoy" con progreso diario
- CRUD completo de alimentos
- Export/Import de base de datos
- Temas claro/oscuro
- Sistema de equivalencias personalizadas

### 🎨 UI/UX
- Diseño responsive con Tailwind CSS
- Componentes shadcn/ui
- Navegación inferior para móvil
- Tooltips informativos
- Toasts para feedback

### 🛠️ Stack técnico inicial
- Vite + React + TypeScript
- Dexie.js (IndexedDB wrapper)
- React Router para navegación
- Recharts para gráficas
- date-fns para manejo de fechas

---

## Roadmap futuro

### v0.7.0 (planeado)
- [ ] Gráficas semanales completas
- [ ] Vista calendario interactiva
- [ ] Recetas personalizadas
- [ ] Modo oscuro automático por horario

### v0.8.0 (planeado)
- [ ] Registro de actividad física
- [ ] Objetivos personalizables
- [ ] Notificaciones PWA (opcional)
- [ ] Sincronización P2P local (sin nube)

### v1.0.0 (objetivo)
- [ ] Todas las funcionalidades core completas
- [ ] Documentación completa
- [ ] Tests unitarios y E2E
- [ ] Accesibilidad AA completa
- [ ] Traducciones (ES, EN, PT)

---

**Notas de versión:**
- Cada versión mantiene compatibilidad con bases de datos anteriores
- Se recomienda hacer backup antes de actualizar
- Changelog completo en GitHub Releases
