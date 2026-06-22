import { defineStore } from 'pinia';
import { fetchUserProfile, updateUserSettings } from '../api/userService';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    settings: {},
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.profile,
    displayName: (state) => state.profile?.name ?? '游客',
  },

  actions: {
    async loadProfile(userId) {
      this.loading = true;
      this.error = null;
      try {
        this.profile = await fetchUserProfile(userId);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async saveSettings(newSettings) {
      await updateUserSettings(this.profile.id, newSettings);
      this.settings = { ...this.settings, ...newSettings };
    },

    logout() {
      this.profile = null;
      this.settings = {};
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
});
