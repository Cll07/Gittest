export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value) {
  return /^1[3-9]\d{9}$/.test(value);
}

export function isNonEmpty(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function isInRange(value, min, max) {
  return value >= min && value <= max;
}
