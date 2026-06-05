import { toast as baseToast } from "react-toastify";

// Deriva un id estable a partir del contenido del mensaje. Al pasarle un
// `toastId` fijo, react-toastify deduplica automáticamente: si ya hay un toast
// activo con ese id, no crea uno nuevo. Esto evita los toasts duplicados que
// aparecen cuando un toast se dispara dentro de un useEffect, ya que en modo
// desarrollo StrictMode ejecuta los efectos dos veces (y, en general, ante
// cualquier re-ejecución del efecto).
const deriveId = (content) =>
  typeof content === "string" || typeof content === "number"
    ? `toast:${content}`
    : undefined;

const wrap = (fn) => (content, options) =>
  fn(content, { toastId: deriveId(content), ...options });

// Mantiene toda la API original (dismiss, update, promise, isActive, etc.) y
// sólo envuelve los métodos que crean toasts para inyectarles el id derivado.
export const toast = Object.assign(wrap(baseToast), baseToast, {
  success: wrap(baseToast.success),
  error: wrap(baseToast.error),
  info: wrap(baseToast.info),
  warn: wrap(baseToast.warn),
  warning: wrap(baseToast.warning),
  loading: wrap(baseToast.loading),
});

export default toast;
