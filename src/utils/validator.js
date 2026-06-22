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

export function isURL(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isStrongPassword(value) {
  return value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value);
}

export function isChineseID(value) {
  return /^\d{17}[\dXx]$/.test(value);
}
