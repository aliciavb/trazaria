# 🔐 Seguridad y Privacidad - Trazaria

## 🛡️ Garantías de seguridad

### ✅ **Privacidad del usuario:**
- ✅ **Todos los datos se guardan localmente** (IndexedDB en tu navegador)
- ✅ **Sin conexión a backend** - no hay servidor
- ✅ **Sin tracking ni analytics**
- ✅ **Sin cookies de terceros**
- ✅ **Sin llamadas a APIs externas**
- ✅ **Open source auditable** - todo el código es visible

### ✅ **Arquitectura segura:**
- ✅ **Frontend-only** - archivos estáticos HTML/JS/CSS
- ✅ **Sin autenticación** - no hay cuentas ni login
- ✅ **Sin almacenamiento en nube**
- ✅ **Sin comunicación con servidores externos**

---

## 🔒 Qué NO está en el repositorio

### **Nunca se subirá:**
- Datos personales de usuarios
- Exports JSON con registros
- Configuración local del navegador
- IndexedDB (vive solo en tu navegador)
- Historial de comidas
- Configuración de objetivos personales

### **Arquitectura data-local:**

```
Tu móvil/PC
├── Navegador
│   └── IndexedDB (PRIVADO)
│       ├── FoodItems
│       ├── Entries
│       ├── Equivalences
│       └── UserProfile
└── Trazaria (código estático)
    └── No almacena NADA
```

**El código solo ejecuta lógica, nunca almacena datos fuera de tu dispositivo.**

---

## 🔐 Mejores prácticas para usuarios

### **1. Backups seguros:**

- ✅ Exporta tus datos regularmente: `Database → Export JSON`
- ✅ Guárdalos en Google Drive, iCloud, o pendrive cifrado
- ❌ NO los guardes en repositorios públicos

### **2. Privacidad del navegador:**

- ✅ **Modo normal recomendado** - los datos persisten
- ❌ **Modo incógnito** - los datos se borran al cerrar

---

## 🆘 Reportar vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO abras un issue público**
2. Contacta al mantenedor del proyecto
3. Describe el problema detalladamente
4. Espera confirmación antes de divulgar públicamente

**Responsible disclosure:** Se reconocerá tu contribución en el fix.

---

## 📜 Política de privacidad resumida

> **Trazaria no sabe quién eres, ni quiere saberlo.**

- Sin analytics
- Sin tracking
- Sin cookies de terceros
- Sin almacenamiento en servidores
- Sin cuentas ni login
- Sin compartir datos con nadie

**Tu dispositivo → Tu navegador → Tu IndexedDB → Tus datos.**

---

## ✨ ¿Por qué es seguro?

**Trazaria es inherentemente segura porque:**

1. No tiene backend (no hay servidor que hackear)
2. No almacena datos en la nube (todo es local)
3. No usa APIs externas con datos sensibles
4. Es open source (código auditable públicamente)
5. No tiene autenticación (no hay credenciales que robar)
6. Usa HTTPS (tránsito cifrado)

**Es imposible hackear datos que no existen en servidores.**

---

_Última actualización: 2025-10-27_
