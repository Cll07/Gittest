import axios from 'axios';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

export async function login(username, password) {
  const response = await axios.post('/api/auth/login', { username, password });
  localStorage.setItem(TOKEN_KEY, response.data.token);
  localStorage.setItem(REFRESH_KEY, response.data.refreshToken);
  return response.data.user;
}

export async function logout() {
  await axios.post('/api/auth/logout');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function refreshToken() {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) throw new Error('无有效刷新令牌');
  const response = await axios.post('/api/auth/refresh', { refreshToken: refresh });
  localStorage.setItem(TOKEN_KEY, response.data.token);
  return response.data.token;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
