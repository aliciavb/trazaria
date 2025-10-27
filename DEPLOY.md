# 📱 Guía de Deploy y Uso en Móvil - Trazaria

## 🚀 Opción 1: Deploy en Netlify (Recomendado)

### Pasos rápidos (5 minutos):

1. **Crear cuenta gratuita en Netlify**
   - Ve a https://www.netlify.com/
   - Sign up con GitHub (más fácil para conectar el repo)

2. **Conectar tu repositorio**
   - Click en "Add new site" → "Import an existing project"
   - Selecciona GitHub y autoriza
   - Elige el repositorio `Trazaria`

3. **Configurar el build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click en "Deploy site"

4. **¡Listo!**
   - Netlify te dará una URL: `https://random-name-12345.netlify.app`
   - Puedes cambiar el nombre en Site settings → Domain management
   - Ejemplo: `https://trazaria.netlify.app`

### Deploy manual (si prefieres):

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build del proyecto
npm run build

# 4. Deploy
netlify deploy --prod --dir=dist
```

---

## 🌐 Opción 2: Deploy en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# Sigue las instrucciones en pantalla
# Te dará una URL automáticamente
```

---

## 🌍 Opción 3: GitHub Pages (Gratis pero manual)

1. **Actualizar `package.json`:**

```json
{
  "homepage": "https://TU-USUARIO.github.io/Trazaria",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. **Instalar gh-pages:**

```bash
npm install --save-dev gh-pages
```

3. **Deploy:**

```bash
npm run deploy
```

4. **Configurar GitHub Pages:**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Save

---

## 📱 Instalar Trazaria en tu móvil

### En iOS (Safari):

1. Abre la URL de tu app en Safari
2. Toca el icono de "Compartir" (cuadrado con flecha hacia arriba)
3. Desliza hacia abajo y toca "Añadir a pantalla de inicio"
4. Personaliza el nombre si quieres
5. Toca "Añadir"
6. ¡Ya tienes Trazaria como app nativa! 🎉

### En Android (Chrome):

1. Abre la URL en Chrome
2. Toca el menú (⋮) → "Instalar aplicación" o "Añadir a pantalla de inicio"
3. Confirma
4. ¡Listo! La app aparecerá en tu cajón de apps

---

## 💾 Sobre tus datos

### ✅ **Privacidad total:**
- Tus datos se guardan **solo en tu móvil** (IndexedDB)
- No hay servidor backend
- No hay tracking ni analytics
- No se envía nada a internet

### 📦 **Backup manual:**
1. Ve a la pestaña "Database"
2. Toca "Export JSON"
3. Guarda el archivo en Google Drive, iCloud, etc.
4. Para restaurar: "Import JSON" y selecciona el archivo

### ⚠️ **Importante:**
- Si borras los datos del navegador, pierdes todo
- Si cambias de móvil, usa Export/Import
- Recomiendo hacer backup semanal

---

## 🔧 Testing local en móvil

Si quieres probar antes de deployar:

1. **Asegúrate de estar en la misma red WiFi** (PC y móvil)

2. **Arranca el servidor de desarrollo:**
```bash
npm run dev
```

3. **Encuentra tu IP local:**
   - Windows: `ipconfig` → busca "IPv4 Address"
   - Ejemplo: `192.168.1.100`

4. **Abre en tu móvil:**
   - `http://192.168.1.100:8080`

5. **Instala como PWA** (funcionará incluso en desarrollo)

---

## 🎨 Personalizar iconos (opcional)

Los iconos actuales son SVG simples. Para crear PNG profesionales:

1. Ve a https://realfavicongenerator.net/
2. Sube `public/icon.svg`
3. Personaliza colores y estilo
4. Descarga el pack generado
5. Reemplaza los archivos en `public/`

---

## 🐛 Troubleshooting

### "La app no se instala en móvil"
- Verifica que esté servida en HTTPS (Netlify/Vercel lo hacen automático)
- Comprueba que el manifest esté correctamente configurado

### "Los datos desaparecen"
- Verifica que no estés en modo incógnito
- Asegúrate de no borrar datos del navegador

### "La app no funciona offline"
- Service Worker tarda unos segundos en instalarse
- Recarga la página una vez después de la primera visita

---

## 📊 URLs de ejemplo

- **Netlify**: https://trazaria.netlify.app
- **Vercel**: https://trazaria.vercel.app
- **GitHub Pages**: https://TU-USUARIO.github.io/Trazaria

---

## ✨ Próximos pasos

Una vez deployed:

1. ✅ Instala la app en tu móvil
2. ✅ Registra tus primeras comidas
3. ✅ Crea algunos alimentos custom
4. ✅ Exporta un backup JSON
5. ✅ Prueba el modo offline

---

¿Preguntas? Abre un issue en el repo o consulta la documentación de:
- PWA: https://web.dev/progressive-web-apps/
- Netlify: https://docs.netlify.com/
- Vercel: https://vercel.com/docs
