const LOCAL_STATES = new Set(["telangana", "andhra pradesh", "ts", "ap"]);

export const SHIPPING_LOCAL = 70;
export const SHIPPING_OTHER = 80;

const DELIVERY_DAYS_LOCAL = [3, 5];
const DELIVERY_DAYS_OTHER = [6, 8];

function isLocalState(state) {
  return !!state && LOCAL_STATES.has(state.trim().toLowerCase());
}

export function calculateShipping(state) {
  if (!state) return null;
  return isLocalState(state) ? SHIPPING_LOCAL : SHIPPING_OTHER;
}

export function estimatedDeliveryText(state, fromDate) {
  const [minDays, maxDays] = isLocalState(state) ? DELIVERY_DAYS_LOCAL : DELIVERY_DAYS_OTHER;
  const base = fromDate ? new Date(fromDate) : new Date();
  const start = new Date(base); start.setDate(start.getDate() + minDays);
  const end = new Date(base); end.setDate(end.getDate() + maxDays);
  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${fmt(start)} – ${fmt(end)}`;
}
