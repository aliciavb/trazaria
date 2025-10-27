# 🚀 Quick Start - Trazaria PWA

## Para empezar a usar Trazaria en tu móvil HOY:

### Opción 1: Deploy en Netlify (más rápido) ⚡

1. **Sube tu código a GitHub** (si no lo has hecho):
   ```bash
   git add .
   git commit -m "Setup PWA"
   git push
   ```

2. **Ve a [netlify.com](https://netlify.com)** y haz login con GitHub

3. **"Add new site" → "Import existing project"**

4. **Selecciona tu repo de Trazaria**

5. **Deploy settings** (auto-detectados gracias a `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy"

6. **¡Listo!** 🎉 En 2-3 minutos tendrás una URL tipo:
   ```
   https://trazaria-xyz123.netlify.app
   ```

### Opción 2: Netlify CLI (desde tu terminal) 💻

```bash
# 1. Instalar Netlify CLI (solo una vez)
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build + Deploy
npm run deploy:netlify
```

---

## 📱 Instalar en tu móvil

### iOS (Safari):
1. Abre la URL de tu app en Safari
2. Toca el botón "Compartir" (📤)
3. Desliza y toca "Añadir a pantalla de inicio"
4. Toca "Añadir"

### Android (Chrome):
1. Abre la URL en Chrome
2. Menú (⋮) → "Instalar aplicación"
3. Confirma

**¡Ya está!** Trazaria aparecerá como una app normal en tu móvil.

---

## ✅ Checklist de verificación

Después de instalar, verifica que:

- [ ] La app se abre sin barra del navegador (pantalla completa)
- [ ] Puedes usarla sin internet (modo offline)
- [ ] Los datos persisten al cerrar la app
- [ ] Export/Import funciona correctamente
- [ ] El icono verde de Trazaria se ve bien

---

## 💾 Backup de tus datos

**IMPORTANTE:** Haz backup regularmente:

1. Abre Trazaria
2. Ve a "Database" (pestaña inferior)
3. Toca "Export JSON"
4. Guarda el archivo en Google Drive / iCloud / Dropbox

**Para restaurar:**
1. "Import JSON" → selecciona el archivo guardado

---

## 🔧 Testing local antes de deploy

Si quieres probar la PWA en tu móvil antes de deployar:

```bash
# En tu PC:
npm run dev

# Encuentra tu IP local:
ipconfig  # Windows
# Busca "IPv4 Address", ej: 192.168.1.100

# En tu móvil (misma red WiFi):
# Abre: http://192.168.1.100:8080
```

---

## 🎨 Personalización

### Cambiar colores de la PWA:

Edita `vite.config.ts`:

```typescript
theme_color: '#8FAE9D',        // Color de barra superior
background_color: '#F8FAF9',   // Color de splash screen
```

### Cambiar nombre de la app:

Edita `vite.config.ts`:

```typescript
name: 'Trazaria',
short_name: 'Trazaria',
```

---

## 🐛 Troubleshooting común

### "No aparece la opción de instalar"
- Verifica que estés en HTTPS (Netlify lo hace automático)
- Recarga la página (Ctrl+R / Cmd+R)
- Limpia caché del navegador

### "Los datos desaparecen"
- No uses modo incógnito
- Haz backup con Export JSON regularmente

### "La app no funciona offline"
- El Service Worker tarda ~30s en instalarse la primera vez
- Visita la app 2 veces para que se active offline

---

## 📊 Próximos pasos

Una vez deployada y instalada:

1. ✅ Completa el onboarding
2. ✅ Registra tu primera comida
3. ✅ Explora la base de datos BEDCA
4. ✅ Haz tu primer backup JSON
5. ✅ Prueba el modo offline (activa modo avión)

---

## 🆘 Ayuda

- **Documentación completa:** [DEPLOY.md](./DEPLOY.md)
- **Issues:** GitHub Issues
- **PWA Debug:** Chrome DevTools → Application → Service Workers

---

**¡Disfruta de Trazaria! 🌿**
