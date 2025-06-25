import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  HABITS: '@habitify_habits',
  USER: '@habitify_user',
  SETTINGS: '@habitify_settings',
  ONBOARDING: '@habitify_onboarding',
  THEME: '@habitify_theme',
  NOTIFICATIONS: '@habitify_notifications',
};

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'light',
  notifications: {
    enabled: true,
    reminderTime: '09:00',
    weeklyReport: true,
  },
  language: 'en',
  firstDayOfWeek: 'monday',
  dateFormat: 'MM/dd/yyyy',
};

class StorageService {
  /**
   * Generic storage methods
   */
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      throw new Error(`Failed to load ${key}`);
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  /**
   * Habits storage methods
   */
  async saveHabits(habitsData) {
    try {
      const dataToSave = {
        ...habitsData,
        lastSaved: new Date().toISOString(),
        version: '1.0',
      };
      return await this.setItem(STORAGE_KEYS.HABITS, dataToSave);
    } catch (error) {
      throw new Error('Failed to save habits data');
    }
  }

  async getHabits() {
    try {
      const data = await this.getItem(STORAGE_KEYS.HABITS);
      if (!data) return null;

      // Migrate old data format if necessary
      if (data.version !== '1.0') {
        return this.migrateHabitsData(data);
      }

      return data;
    } catch (error) {
      throw new Error('Failed to load habits data');
    }
  }

  async deleteHabits() {
    try {
      return await this.removeItem(STORAGE_KEYS.HABITS);
    } catch (error) {
      throw new Error('Failed to delete habits data');
    }
  }

  /**
   * User storage methods
   */
  async saveUser(userData) {
    try {
      const userToSave = {
        ...userData,
        lastUpdated: new Date().toISOString(),
      };
      return await this.setItem(STORAGE_KEYS.USER, userToSave);
    } catch (error) {
      throw new Error('Failed to save user data');
    }
  }

  async getUser() {
    try {
      return await this.getItem(STORAGE_KEYS.USER);
    } catch (error) {
      throw new Error('Failed to load user data');
    }
  }

  async deleteUser() {
    try {
      return await this.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      throw new Error('Failed to delete user data');
    }
  }

  /**
   * Settings storage methods
   */
  async saveSettings(settings) {
    try {
      const settingsToSave = {
        ...DEFAULT_SETTINGS,
        ...settings,
        lastUpdated: new Date().toISOString(),
      };
      return await this.setItem(STORAGE_KEYS.SETTINGS, settingsToSave);
    } catch (error) {
      throw new Error('Failed to save settings');
    }
  }

  async getSettings() {
    try {
      const settings = await this.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
    } catch (error) {
      console.warn('Failed to load settings, using defaults');
      return DEFAULT_SETTINGS;
    }
  }

  async resetSettings() {
    try {
      return await this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    } catch (error) {
      throw new Error('Failed to reset settings');
    }
  }

  /**
   * Onboarding storage methods
   */
  async setOnboardingCompleted(completed = true) {
    try {
      const onboardingData = {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      };
      return await this.setItem(STORAGE_KEYS.ONBOARDING, onboardingData);
    } catch (error) {
      throw new Error('Failed to save onboarding status');
    }
  }

  async isOnboardingCompleted() {
    try {
      const data = await this.getItem(STORAGE_KEYS.ONBOARDING);
      return data?.completed || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Theme storage methods
   */
  async saveTheme(theme) {
    try {
      return await this.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      throw new Error('Failed to save theme');
    }
  }

  async getTheme() {
    try {
      const theme = await this.getItem(STORAGE_KEYS.THEME);
      return theme || 'light';
    } catch (error) {
      return 'light';
    }
  }

  /**
   * Notification settings storage methods
   */
  async saveNotificationSettings(settings) {
    try {
      return await this.setItem(STORAGE_KEYS.NOTIFICATIONS, settings);
    } catch (error) {
      throw new Error('Failed to save notification settings');
    }
  }

  async getNotificationSettings() {
    try {
      const settings = await this.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return settings || DEFAULT_SETTINGS.notifications;
    } catch (error) {
      return DEFAULT_SETTINGS.notifications;
    }
  }

  /**
   * Backup and restore methods
   */
  async createBackup() {
    try {
      const backup = {
        habits: await this.getHabits(),
        user: await this.getUser(),
        settings: await this.getSettings(),
        createdAt: new Date().toISOString(),
        version: '1.0',
      };
      return backup;
    } catch (error) {
      throw new Error('Failed to create backup');
    }
  }

  async restoreFromBackup(backupData) {
    try {
      if (!backupData || !backupData.version) {
        throw new Error('Invalid backup data');
      }

      // Clear existing data
      await this.clearAll();

      // Restore data
      if (backupData.habits) {
        await this.saveHabits(backupData.habits);
      }
      if (backupData.user) {
        await this.saveUser(backupData.user);
      }
      if (backupData.settings) {
        await this.saveSettings(backupData.settings);
      }

      return true;
    } catch (error) {
      throw new Error('Failed to restore from backup');
    }
  }

  async exportData() {
    try {
      const exportData = await this.createBackup();
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error('Failed to export data');
    }
  }

  async importData(jsonString) {
    try {
      const importData = JSON.parse(jsonString);
      return await this.restoreFromBackup(importData);
    } catch (error) {
      throw new Error('Failed to import data - invalid format');
    }
  }

  /**
   * Utility methods
   */
  async clearAll() {
    try {
      await Promise.all([
        this.removeItem(STORAGE_KEYS.HABITS),
        this.removeItem(STORAGE_KEYS.USER),
        this.removeItem(STORAGE_KEYS.SETTINGS),
        this.removeItem(STORAGE_KEYS.ONBOARDING),
        this.removeItem(STORAGE_KEYS.THEME),
        this.removeItem(STORAGE_KEYS.NOTIFICATIONS),
      ]);
      return true;
    } catch (error) {
      throw new Error('Failed to clear all data');
    }
  }

  async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('@habitify_'));
      
      const info = {
        totalKeys: appKeys.length,
        keys: appKeys,
        estimatedSize: 0,
      };

      // Calculate estimated size
      for (const key of appKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            info.estimatedSize += value.length;
          }
        } catch (error) {
          console.warn(`Error reading ${key}:`, error);
        }
      }

      return info;
    } catch (error) {
      throw new Error('Failed to get storage info');
    }
  }

  /**
   * Data migration methods
   */
  migrateHabitsData(oldData) {
    try {
      // Handle migration from older versions
      const migratedData = {
        habits: oldData.habits || [],
        lastActiveDate: oldData.lastActiveDate || null,
        version: '1.0',
        migratedAt: new Date().toISOString(),
      };

      // Ensure all habits have required fields
      migratedData.habits = migratedData.habits.map(habit => ({
        id: habit.id || Date.now().toString(),
        name: habit.name || 'Unnamed Habit',
        description: habit.description || '',
        category: habit.category || 'habits',
        color: habit.color || '#007AFF',
        frequency: habit.frequency || 'daily',
        targetCount: habit.targetCount || 1,
        isCompleted: habit.isCompleted || false,
        completedCount: habit.completedCount || 0,
        streak: habit.streak || 0,
        progress: habit.progress || 0,
        completionHistory: habit.completionHistory || [],
        createdAt: habit.createdAt || new Date().toISOString(),
        updatedAt: habit.updatedAt || new Date().toISOString(),
        ...habit,
      }));

      // Save migrated data
      this.saveHabits(migratedData);
      
      return migratedData;
    } catch (error) {
      throw new Error('Failed to migrate habits data');
    }
  }
}

// Create and export singleton instance
export const storageService = new StorageService();

// Export storage keys for external use
export { STORAGE_KEYS };

// Export default for convenience
export default storageService;