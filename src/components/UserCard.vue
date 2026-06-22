<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <div class="info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span class="role-badge" :class="user.role">{{ user.role }}</span>
    </div>
    <button @click="$emit('edit', user.id)">编辑</button>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['edit'],
};
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.role-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.role-badge.admin { background: #fee2e2; color: #dc2626; }
.role-badge.user  { background: #dbeafe; color: #2563eb; }
</style>
