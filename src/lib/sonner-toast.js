import { toast as baseToast } from "sonner";

// Equivalente al wrapper de react-toastify pero para sonner, que deduplica por
// la opción `id` (si ya existe un toast con ese id, lo actualiza en lugar de
// crear otro). Evita duplicados de los toasts disparados dentro de useEffect,
// que StrictMode ejecuta dos veces en desarrollo.
const deriveId = (message) =>
  typeof message === "string" || typeof message === "number"
    ? `toast:${message}`
    : undefined;

const wrap = (fn) => (message, options) =>
  fn(message, { id: deriveId(message), ...options });

export const toast = Object.assign(wrap(baseToast), baseToast, {
  success: wrap(baseToast.success),
  error: wrap(baseToast.error),
  info: wrap(baseToast.info),
  warning: wrap(baseToast.warning),
  loading: wrap(baseToast.loading),
  message: wrap(baseToast.message),
});

export default toast;
