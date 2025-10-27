# Trazaria 🌿

> **"El espacio donde lo que haces deja forma."**

Trazaria es una aplicación **100% privada, ética y open source** para registrar comidas, recetas y actividad física de forma clara, libre y comprensible.

**Lo que haces deja traza. Trazaria te ayuda a verla con claridad.**

---

## 📱 **¡Ahora disponible como PWA!**

Trazaria puede instalarse en tu móvil como una app nativa. **Funciona offline** y guarda todos tus datos localmente (sin backend, sin nube).

### 🚀 **Usar en tu móvil:**

1. **Deploy la app** (ver [DEPLOY.md](./DEPLOY.md))
2. **Abre la URL en tu móvil** (Safari/Chrome)
3. **"Añadir a pantalla de inicio"**
4. ¡Listo! Ya tienes Trazaria instalada 🎉

**Tus datos se guardan en IndexedDB** (local en tu dispositivo). Usa Export/Import para backups.

---

## 🌿 Filosofía

El objetivo de Trazaria **no es cuantificar la salud**, sino dar al usuario **control total sobre sus datos**, ayudándole a ver patrones, mejorar hábitos y mantener un equilibrio entre cuerpo, mente y ritmo vital.

### Principios fundamentales

✨ **Privacidad absoluta**  
Sin cuentas, sin nube, sin rastreo, sin analíticas. Todos los datos se guardan localmente en el dispositivo del usuario.

🔍 **Transparencia radical**  
Cada valor mostrado indica su fuente (BEDCA, USDA, personal). Ningún cálculo se oculta ni se simplifica sin explicación.

🧭 **Autonomía total del usuario**  
Puedes editar, duplicar o eliminar cualquier alimento o registro. Puedes exportar y reimportar toda tu base de datos.

🎨 **Diseño accesible y humano**  
Interfaz comprensible incluso sin conocimientos nutricionales. Lenguaje sin jerga médica ni imperativos.

📖 **Open Source by design**  
Código abierto bajo licencia MIT. Arquitectura modular, documentada y auditable.

---

## 🚀 Estado actual

**Versión:** `0.6.0` (PWA Alpha)

✅ Onboarding con cálculo de objetivo calórico  
✅ Registro manual de comidas con autocompletado  
✅ Base de datos BEDCA (~50 alimentos españoles)  
✅ Vista "Hoy" con progreso diario  
✅ CRUD completo de alimentos  
✅ **PWA instalable en móvil** 📱  
✅ **Soporte offline completo** 🔌  
✅ Export/Import de base de datos (JSON)  
✅ Campo de azúcares en valores nutricionales  
🚧 Gráficas semanales (en desarrollo)  
🚧 Vista calendario (en desarrollo)  

---

## 🛠️ Stack tecnológico

- **Framework:** Vite + React + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Base de datos local:** Dexie.js (IndexedDB)
- **PWA:** vite-plugin-pwa + Workbox
- **Gráficas:** Recharts (render local)
- **Build:** Static PWA-ready

---

## 📦 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Trazaria.git
cd Trazaria

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:8080`

### 🔨 Build para producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

---

## 🌐 Deploy en producción

**Ver guía completa:** [DEPLOY.md](./DEPLOY.md)

### Deploy rápido en Netlify:

1. Sube el repo a GitHub
2. Conéctalo en [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. ¡Deploy automático! ✨

**Otras opciones:** Vercel, GitHub Pages, o cualquier hosting de archivos estáticos.

---

## 🧱 Estructura del proyecto

```
src/
├── components/      → UI reutilizable (botones, cards, modales)
│   ├── ui/          → shadcn/ui components
│   ├── BottomNav.tsx
│   └── CreateFoodDialog.tsx
├── hooks/           → hooks personalizados
│   ├── use-database.tsx
│   └── use-theme.tsx
├── lib/             → utilidades y lógica
│   ├── db.ts        → Dexie database schema
│   ├── db-seed.ts   → Base de datos BEDCA
│   ├── parser.ts    → Parser de valores nutricionales
│   └── calories.ts  → Cálculos de TMB y objetivos
├── pages/           → vistas principales
│   ├── Onboarding.tsx
│   ├── Today.tsx
│   ├── Register.tsx
│   ├── Database.tsx
│   ├── Calendar.tsx
│   ├── Week.tsx
│   └── Settings.tsx
└── main.tsx         → Entry point
```

---

## 🔐 Privacidad y seguridad

- **Ninguna API externa** (excepto BEDCA opcional para búsqueda)
- **Sin cookies ni analytics**
- **Sin tracking de ningún tipo**
- **Datos 100% locales** (IndexedDB en tu navegador)
- **Open source auditable**

### Política de privacidad resumida:
> _"Trazaria no sabe quién eres, ni quiere saberlo. Tus datos son tuyos y viven en tu dispositivo."_

---

## 🤝 Contribuir

Trazaria es un proyecto colaborativo. Si quieres contribuir:

1. Haz fork del repositorio
2. Crea una rama con tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

**Issues y sugerencias:** Usa la pestaña Issues de GitHub.

---

## 📜 Licencia

MIT © Trazaria

---

## 🌟 Frase de identidad

_"Trazaria es el espacio donde lo que haces deja forma.  
Donde los datos son tuyos, y la claridad también."_

---

## 📚 Documentación adicional

- **[DEPLOY.md](./DEPLOY.md)** - Guía completa de deploy y uso en móvil
- **Próximamente:** Documentación técnica detallada en `/docs`


Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a0200826-652d-494b-adce-5649e679db07) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
