import axios from 'axios';

const TOKEN_KEY = 'auth_token';

export async function login(username, password) {
  const response = await axios.post('/api/auth/login', { username, password });
  localStorage.setItem(TOKEN_KEY, response.data.token);
  return response.data.user;
}

export async function logout() {
  await axios.post('/api/auth/logout');
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
