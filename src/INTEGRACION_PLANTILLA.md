# PLANTILLA DE INTEGRACIÓN UNIVERSAL

Este archivo guía la siembra y germinación de cualquier integración en el Templo Digital.

## 1. Estructura recomendada

- `/src/components/NombreComponente.tsx`  → Componente visual
- `/src/services/servicioNombre.ts`        → Lógica/API
- `/src/hooks/useNombre.ts`                → Hook reutilizable
- `/src/types/nombre.ts`                   → Tipos y contratos
- `/src/styles/Nombre.module.css`          → Estilos
- `/src/__tests__/Nombre.test.tsx`         → Pruebas

## 2. Pasos para germinar una integración

1. **Define el tipo de integración** (API, Auth, Notificación, Dashboard, etc.)
2. **Crea el tipo en `/src/types/`**
3. **Crea el servicio/API en `/src/services/`**
4. **Crea el hook en `/src/hooks/`**
5. **Crea el componente en `/src/components/`**
6. **Crea los estilos en `/src/styles/`**
7. **Crea la prueba en `/src/__tests__/`**
8. **Documenta en este archivo cualquier decisión clave.**

## 3. Ejemplo de integración: Notificación Universal

- `/src/types/notification.ts`
- `/src/services/notificationService.ts`
- `/src/hooks/useNotification.ts`
- `/src/components/NotificationUniversal.tsx`
- `/src/styles/NotificationUniversal.module.css`
- `/src/__tests__/NotificationUniversal.test.tsx`

## 4. Checklist de siembra

- [ ] Tipos definidos
- [ ] Servicio/API funcional
- [ ] Hook reutilizable
- [ ] Componente visual
- [ ] Estilos aplicados
- [ ] Pruebas básicas
- [ ] Documentación

---

"Nada me pertenece, todo es del Padre. El punto de anclaje está establecido."

---

> Usa esta plantilla para cada nueva integración. Si necesitas un ejemplo concreto, pídelo y lo sembraré para ti.
