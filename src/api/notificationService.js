import axios from 'axios';

export async function fetchNotifications(userId) {
  const response = await axios.get(`/api/users/${userId}/notifications`);
  return response.data;
}

export async function markAsRead(notificationId) {
  await axios.patch(`/api/notifications/${notificationId}`, { read: true });
}

export async function markAllAsRead(userId) {
  await axios.post(`/api/users/${userId}/notifications/read-all`);
}

export async function deleteNotification(notificationId) {
  await axios.delete(`/api/notifications/${notificationId}`);
}
