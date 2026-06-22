/**
 * 格式化工具函数集合
 */

// feature/refactor-formatter 分支：使用 dayjs 风格的简洁 API
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const map = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
  };
  return format.replace(/YYYY|MM|DD/g, (token) => map[token]);
}

export function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function truncate(str, maxLength = 50) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
