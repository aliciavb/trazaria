# Changelog - Trazaria

## [0.6.0] - 2025-10-27 🌿

### ✨ Nueva funcionalidad principal: PWA

**Trazaria ahora es una Progressive Web App instalable en móvil!**

#### Añadido
- **PWA completa** con soporte offline
  - Service Worker con Workbox
  - Manifest configurado
  - Cacheo automático de assets
  - Funciona completamente offline
  
- **Campo de azúcares** en valores nutricionales
  - Añadido a formulario de alimentos
  - Parser actualizado para extracción automática
  - Base de datos BEDCA actualizada

- **Documentación de deploy**
  - Guía completa de deployment
  - Configuración para Netlify/Vercel
  - Instrucciones de instalación en móvil

#### Actualizado
- Configuración PWA en `vite.config.ts`
- Meta tags PWA en `index.html`
- README con instrucciones PWA

### 🔧 Mejoras técnicas
- Build optimizado (189 KB gzipped)
- Soporte offline completo
- Iconos SVG personalizados

---

## [0.5.0] - Anteriores

### ✨ Funcionalidades base
- Onboarding con cálculo de TMB
- Registro de comidas
- Base de datos BEDCA (~50 alimentos)
- Vista "Hoy" con progreso diario
- CRUD de alimentos
- Export/Import de base de datos
- Temas claro/oscuro

---

## Roadmap

### v0.7.0 (próximo)
- Gráficas semanales
- Vista calendario
- Recetas personalizadas

### v1.0.0 (objetivo)
- Funcionalidades core completas
- Tests unitarios
- Accesibilidad AA
