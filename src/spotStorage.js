const key = (userId, kind) => `kemanaya:${userId}:${kind}`;

export function readLocal(userId, kind, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key(userId, kind)));
    if (value === null || typeof value !== typeof fallback ||
        Array.isArray(value) !== Array.isArray(fallback)) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

export function writeLocal(userId, kind, value) {
  try {
    localStorage.setItem(key(userId, kind), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const hasCoordinates = (spot) =>
  spot?.latitude !== null && spot?.latitude !== undefined && spot?.latitude !== "" &&
  spot?.longitude !== null && spot?.longitude !== undefined && spot?.longitude !== "" &&
  Number.isFinite(Number(spot.latitude)) && Math.abs(Number(spot.latitude)) <= 90 &&
  Number.isFinite(Number(spot.longitude)) && Math.abs(Number(spot.longitude)) <= 180;

export const mapUrl = (spot) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hasCoordinates(spot) ? `${spot.latitude},${spot.longitude}` : `${spot.name}, ${spot.location}`)}`;
