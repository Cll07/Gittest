import axios from 'axios';

const BASE_URL = '/api/users';

export async function fetchUserProfile(userId) {
  const response = await axios.get(`${BASE_URL}/${userId}`);
  return response.data;
}

export async function updateUserSettings(userId, settings) {
  const response = await axios.patch(`${BASE_URL}/${userId}/settings`, settings);
  return response.data;
}

export async function deleteUser(userId) {
  await axios.delete(`${BASE_URL}/${userId}`);
}
