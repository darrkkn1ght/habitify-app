/**
 * Dummy data for testing and development
 * This file contains sample habits, users, and progress data
 */

// Sample user data
export const dummyUsers = [
  {
    id: 'user_1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    avatar: null,
    createdAt: '2024-01-15T08:00:00Z',
    preferences: {
      theme: 'light',
      notifications: true,
      weekStartsOn: 'monday',
      reminderTime: '09:00',
    },
    statistics: {
      totalHabits: 8,
      completedToday: 5,
      currentStreak: 12,
      longestStreak: 45,
      completionRate: 0.78,
    },
  },
  {
    id: 'user_2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    avatar: null,
    createdAt: '2024-02-01T10:30:00Z',
    preferences: {
      theme: 'dark',
      notifications: false,
      weekStartsOn: 'sunday',
      reminderTime: '07:30',
    },
    statistics: {
      totalHabits: 6,
      completedToday: 4,
      currentStreak: 8,
      longestStreak: 23,
      completionRate: 0.85,
    },
  },
];

// Sample habit categories
export const habitCategories = [
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '💪',
    color: '#4CAF50',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: '🧘',
    color: '#9C27B0',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    color: '#FF9800',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: '📚',
    color: '#2196F3',
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    color: '#E91E63',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    icon: '🎨',
    color: '#FF5722',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    color: '#4CAF50',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: '🌟',
    color: '#FFC107',
  },
];

// Sample habits data
export const dummyHabits = [
  {
    id: 'habit_1',
    userId: 'user_1',
    name: 'Morning Workout',
    description: 'Complete a 30-minute workout session every morning',
    category: 'health',
    frequency: 'daily',
    target: 1,
    unit: 'session',
    color: '#4CAF50',
    icon: '🏃',
    reminderTime: '07:00',
    reminderEnabled: true,
    createdAt: '2024-01-20T08:00:00Z',
    isActive: true,
    priority: 'high',
    notes: 'Focus on cardio and strength training',
    streak: {
      current: 12,
      longest: 25,
    },
    statistics: {
      totalCompletions: 45,
      completionRate: 0.82,
      averagePerWeek: 5.8,
    },
  },
  {
    id: 'habit_2',
    userId: 'user_1',
    name: 'Read for 30 minutes',
    description: 'Read books or articles for personal development',
    category: 'learning',
    frequency: 'daily',
    target: 30,
    unit: 'minutes',
    color: '#2196F3',
    icon: '📖',
    reminderTime: '20:00',
    reminderEnabled: true,
    createdAt: '2024-01-22T10:15:00Z',
    isActive: true,
    priority: 'medium',
    notes: 'Currently reading "Atomic Habits"',
    streak: {
      current: 8,
      longest: 18,
    },
    statistics: {
      totalCompletions: 38,
      completionRate: 0.75,
      averagePerWeek: 5.2,
    },
  },
  {
    id: 'habit_3',
    userId: 'user_1',
    name: 'Meditate',
    description: 'Practice mindfulness meditation',
    category: 'mindfulness',
    frequency: 'daily',
    target: 10,
    unit: 'minutes',
    color: '#9C27B0',
    icon: '🧘',
    reminderTime: '06:30',
    reminderEnabled: true,
    createdAt: '2024-01-25T07:30:00Z',
    isActive: true,
    priority: 'high',
    notes: 'Using Headspace app for guided meditation',
    streak: {
      current: 15,
      longest: 22,
    },
    statistics: {
      totalCompletions: 42,
      completionRate: 0.88,
      averagePerWeek: 6.1,
    },
  },
  {
    id: 'habit_4',
    userId: 'user_1',
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    frequency: 'daily',
    target: 8,
    unit: 'glasses',
    color: '#03DAC6',
    icon: '💧',
    reminderTime: null,
    reminderEnabled: false,
    createdAt: '2024-01-28T12:00:00Z',
    isActive: true,
    priority: 'medium',
    notes: 'Track using water bottle marks',
    streak: {
      current: 6,
      longest: 14,
    },
    statistics: {
      totalCompletions: 28,
      completionRate: 0.70,
      averagePerWeek: 4.8,
    },
  },
  {
    id: 'habit_5',
    userId: 'user_1',
    name: 'Write in journal',
    description: 'Reflect on the day and write thoughts',
    category: 'mindfulness',
    frequency: 'daily',
    target: 1,
    unit: 'entry',
    color: '#FF6B6B',
    icon: '📝',
    reminderTime: '21:30',
    reminderEnabled: true,
    createdAt: '2024-02-01T09:45:00Z',
    isActive: true,
    priority: 'medium',
    notes: 'Gratitude and reflection',
    streak: {
      current: 4,
      longest: 11,
    },
    statistics: {
      totalCompletions: 18,
      completionRate: 0.65,
      averagePerWeek: 4.2,
    },
  },
  {
    id: 'habit_6',
    userId: 'user_1',
    name: 'Learn Spanish',
    description: 'Practice Spanish using language learning app',
    category: 'learning',
    frequency: 'daily',
    target: 20,
    unit: 'minutes',
    color: '#FFD54F',
    icon: '🇪🇸',
    reminderTime: '19:00',
    reminderEnabled: true,
    createdAt: '2024-02-05T14:20:00Z',
    isActive: true,
    priority: 'low',
    notes: 'Using Duolingo and conversation practice',
    streak: {
      current: 3,
      longest: 7,
    },
    statistics: {
      totalCompletions: 12,
      completionRate: 0.60,
      averagePerWeek: 3.8,
    },
  },
  {
    id: 'habit_7',
    userId: 'user_1',
    name: 'No social media before noon',
    description: 'Avoid checking social media in the morning',
    category: 'productivity',
    frequency: 'daily',
    target: 1,
    unit: 'day',
    color: '#FF7043',
    icon: '📱',
    reminderTime: null,
    reminderEnabled: false,
    createdAt: '2024-02-08T11:10:00Z',
    isActive: true,
    priority: 'high',
    notes: 'Better focus in the morning',
    streak: {
      current: 2,
      longest: 5,
    },
    statistics: {
      totalCompletions: 8,
      completionRate: 0.53,
      averagePerWeek: 3.2,
    },
  },
  {
    id: 'habit_8',
    userId: 'user_1',
    name: 'Call family',
    description: 'Stay connected with family members',
    category: 'social',
    frequency: 'weekly',
    target: 2,
    unit: 'calls',
    color: '#E91E63',
    icon: '📞',
    reminderTime: null,
    reminderEnabled: false,
    createdAt: '2024-02-10T16:30:00Z',
    isActive: true,
    priority: 'medium',
    notes: 'Parents and siblings',
    streak: {
      current: 1,
      longest: 3,
    },
    statistics: {
      totalCompletions: 5,
      completionRate: 0.71,
      averagePerWeek: 1.8,
    },
  },
];

// Sample habit completion data (last 30 days)
export const generateHabitCompletions = (habitId, days = 30) => {
  const completions = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random completion data (simulate realistic patterns)
    const isCompleted = Math.random() > 0.25; // 75% completion rate
    const progress = isCompleted ? 1 : Math.random() > 0.5 ? Math.random() : 0;
    
    completions.push({
      id: `completion_${habitId}_${i}`,
      habitId,
      date: date.toISOString().split('T')[0],
      completed: isCompleted,
      progress: progress,
      notes: isCompleted && Math.random() > 0.8 ? 'Great session today!' : null,
      completedAt: isCompleted ? new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : null,
    });
  }
  
  return completions.reverse(); // Return in chronological order
};

// Sample motivational quotes
export const motivationalQuotes = [
  {
    id: 'quote_1',
    text: 'Success is the sum of small efforts repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    id: 'quote_2',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
  },
  {
    id: 'quote_3',
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    id: 'quote_4',
    text: 'Your net worth to the network is your daily work.',
    author: 'Porter Gale',
  },
  {
    id: 'quote_5',
    text: 'Small daily improvements over time lead to stunning results.',
    author: 'Robin Sharma',
  },
  {
    id: 'quote_6',
    text: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
  },
  {
    id: 'quote_7',
    text: 'The groundwork for all happiness is good health.',
    author: 'Leigh Hunt',
  },
  {
    id: 'quote_8',
    text: 'Motivation is what gets you started. Habit is what keeps you going.',
    author: 'Jim Ryun',
  },
];

// Sample onboarding content
export const onboardingData = [
  {
    id: 'slide_1',
    title: 'Welcome to Habitify',
    subtitle: 'Build better habits, one day at a time',
    description: 'Transform your life with consistent daily actions. Track your progress and stay motivated.',
    image: 'onboarding1.png',
    backgroundColor: '#667eea',
  },
  {
    id: 'slide_2',
    title: 'Track Your Progress',
    subtitle: 'Visualize your journey',
    description: 'See your streaks, completion rates, and progress over time with beautiful charts and insights.',
    image: 'onboarding2.png',
    backgroundColor: '#764ba2',
  },
  {
    id: 'slide_3',
    title: 'Stay Motivated',
    subtitle: 'Never miss a day',
    description: 'Get reminders, celebrate milestones, and build lasting habits that stick.',
    image: 'onboarding3.png',
    backgroundColor: '#f093fb',
  },
];

// Sample app settings/preferences
export const defaultAppSettings = {
  theme: 'light', // 'light', 'dark', 'auto'
  language: 'en',
  weekStartsOn: 'monday', // 'sunday', 'monday'
  timeFormat: '24h', // '12h', '24h'
  notifications: {
    enabled: true,
    reminders: true,
    achievements: true,
    dailySummary: true,
    weeklyReview: true,
  },
  privacy: {
    analytics: true,
    crashReports: true,
  },
  backup: {
    autoBackup: false,
    lastBackup: null,
  },
};

// Helper functions for working with dummy data
export const getDummyHabitsByUser = (userId) => {
  return dummyHabits.filter(habit => habit.userId === userId);
};

export const getDummyHabitsByCategory = (category) => {
  return dummyHabits.filter(habit => habit.category === category);
};

export const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

export const getTodaysHabits = (userId) => {
  const userHabits = getDummyHabitsByUser(userId);
  const today = new Date().getDay();
  
  // For daily habits, return all active habits
  // For weekly/monthly, add logic based on frequency
  return userHabits.filter(habit => habit.isActive && habit.frequency === 'daily');
};

export const getHabitStatistics = (habitId) => {
  const habit = dummyHabits.find(h => h.id === habitId);
  if (!habit) return null;
  
  const completions = generateHabitCompletions(habitId, 30);
  const completedDays = completions.filter(c => c.completed).length;
  const totalDays = completions.length;
  
  return {
    ...habit.statistics,
    last30Days: {
      completed: completedDays,
      total: totalDays,
      rate: completedDays / totalDays,
    },
    completions,
  };
};

// Export everything as default for easy importing
export default {
  users: dummyUsers,
  habits: dummyHabits,
  categories: habitCategories,
  quotes: motivationalQuotes,
  onboarding: onboardingData,
  settings: defaultAppSettings,
  generateHabitCompletions,
  getDummyHabitsByUser,
  getDummyHabitsByCategory,
  getRandomQuote,
  getTodaysHabits,
  getHabitStatistics,
};