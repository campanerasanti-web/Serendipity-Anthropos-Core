# Todo List
 [x] Ejecutar backend para probar OAuth
 [x] Crear endpoint /api/auth/google/login
 [x] Crear endpoint /api/auth/google/callback
 [x] Conectar endpoints con GoogleWorkspaceService

## 🔑 Integración Google OAuth Backend
1. Crea tu proyecto en Google Cloud Console y descarga el archivo `credentials.json` (ya realizado).
2. Añade el Client ID como variable de entorno:

	```env
	GOOGLE_CLIENT_ID=933961513941-k32hlkpfckl14e3k6pl68fl35o82jcoc.apps.googleusercontent.com
	GOOGLE_APPLICATION_CREDENTIALS=backend/Secrets/credentials.json
	GOOGLE_OAUTH_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
	```
D# Serendipity-Anthropos-Core
"El corazón consciente de Serendipity Bros. Integración de sabiduría, logística y alma."

---

## 🔑 Integración Google OAuth Backend

1. Crea tu proyecto en Google Cloud Console y descarga el archivo `credentials.json` (ya realizado).
2. Añade el Client ID como variable de entorno:

   ```env
   GOOGLE_CLIENT_ID=933961513941-k32hlkpfckl14e3k6pl68fl35o82jcoc.apps.googleusercontent.com
   GOOGLE_APPLICATION_CREDENTIALS=backend/Secrets/credentials.json
   GOOGLE_OAUTH_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

3. Habilita las APIs necesarias en Google Cloud (Drive, Calendar, etc).
4. Implementa el flujo OAuth en tu servicio backend (ver ejemplo abajo).
5. Ejecuta el backend y prueba el login con Google.

---

### Ejemplo inicialización OAuth en C# (.NET)

```csharp
using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using System.Threading;

var clientSecrets = GoogleClientSecrets.FromFile(Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS"));
var scopes = new[] { "https://www.googleapis.com/auth/drive.readonly" };
var cred = await GoogleWebAuthorizationBroker.AuthorizeAsync(
	clientSecrets.Secrets,
	scopes,
	"user",
	CancellationToken.None,
	new FileDataStore("Tokens", true));
```

El callback debe coincidir con el configurado en Google Cloud Console.

---

## ⚡ GitHub Actions Setup Required

**If you see "Resource not accessible by integration" error:**

👉 **[QUICK_FIX_GITHUB_ACTIONS.md](./QUICK_FIX_GITHUB_ACTIONS.md)** ← 2-minute fix

Or configure manually:
1. Go to [Settings → Actions](https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/actions)
2. Select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Save and re-run workflows

---

## 📚 Documentation

- **[QUICK_START_FINAL.md](./QUICK_START_FINAL.md)** - 3-step launch guide
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Complete documentation index
- **[GITHUB_ACTIONS_PERMISSIONS_GUIDE.md](./GITHUB_ACTIONS_PERMISSIONS_GUIDE.md)** - CI/CD permissions guide
- **[OPERATIONAL_MANIFEST.md](./OPERATIONAL_MANIFEST.md)** - System reference

---

## 🚀 Quick Start

```bash
# Frontend
npm install
npm run dev          # http://localhost:5173

# Backend
cd backend
dotnet restore
dotnet run           # http://localhost:5000
```

---

**Status**: 🟢 Production Ready  
**Version**: 1.0.0  
**Last Updated**: February 14, 2026

