import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { validateHabit } from '../utils/validation';

// Action types
const HABITS_ACTIONS = {
  LOAD_HABITS: 'LOAD_HABITS',
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  TOGGLE_HABIT: 'TOGGLE_HABIT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  UPDATE_STREAK: 'UPDATE_STREAK',
  RESET_DAILY_PROGRESS: 'RESET_DAILY_PROGRESS',
};

// Initial state
const initialState = {
  habits: [],
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastActiveDate: null,
  totalHabits: 0,
  completedToday: 0,
  currentStreak: 0,
};

// Reducer function
const habitsReducer = (state, action) => {
  switch (action.type) {
    case HABITS_ACTIONS.LOAD_HABITS:
      return {
        ...state,
        habits: action.payload.habits || [],
        lastActiveDate: action.payload.lastActiveDate,
        loading: false,
        error: null,
      };

    case HABITS_ACTIONS.ADD_HABIT:
      const newHabit = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCompleted: false,
        completedCount: 0,
        streak: 0,
        progress: 0,
        completionHistory: [],
      };
      return {
        ...state,
        habits: [...state.habits, newHabit],
        totalHabits: state.totalHabits + 1,
        error: null,
      };

    case HABITS_ACTIONS.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload, updatedAt: new Date().toISOString() }
            : habit
        ),
        error: null,
      };

    case HABITS_ACTIONS.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        totalHabits: Math.max(0, state.totalHabits - 1),
        error: null,
      };

    case HABITS_ACTIONS.TOGGLE_HABIT:
      const today = new Date().toDateString();
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id === action.payload) {
            const isCompleting = !habit.isCompleted;
            const newCompletionHistory = [...(habit.completionHistory || [])];
            
            if (isCompleting) {
              // Mark as completed
              if (!newCompletionHistory.includes(today)) {
                newCompletionHistory.push(today);
              }
              const newStreak = calculateStreak(newCompletionHistory);
              return {
                ...habit,
                isCompleted: true,
                completedCount: habit.completedCount + 1,
                completionHistory: newCompletionHistory,
                streak: newStreak,
                progress: Math.min(((habit.completedCount + 1) / (habit.targetCount || 1)) * 100, 100),
                lastCompletedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            } else {
              // Mark as incomplete
              const filteredHistory = newCompletionHistory.filter(date => date !== today);
              const newStreak = calculateStreak(filteredHistory);
              return {
                ...habit,
                isCompleted: false,
                completedCount: Math.max(0, habit.completedCount - 1),
                completionHistory: filteredHistory,
                streak: newStreak,
                progress: Math.max(0, ((habit.completedCount - 1) / (habit.targetCount || 1)) * 100),
                updatedAt: new Date().toISOString(),
              };
            }
          }
          return habit;
        }),
        completedToday: action.payload.isCompleting 
          ? state.completedToday + 1 
          : Math.max(0, state.completedToday - 1),
        error: null,
      };

    case HABITS_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case HABITS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case HABITS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case HABITS_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };

    case HABITS_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };

    case HABITS_ACTIONS.UPDATE_STREAK:
      return {
        ...state,
        currentStreak: action.payload,
      };

    case HABITS_ACTIONS.RESET_DAILY_PROGRESS:
      const resetDate = new Date().toDateString();
      return {
        ...state,
        habits: state.habits.map(habit => ({
          ...habit,
          isCompleted: false,
        })),
        completedToday: 0,
        lastActiveDate: resetDate,
      };

    default:
      return state;
  }
};

// Helper function to calculate streak
const calculateStreak = (completionHistory) => {
  if (!completionHistory || completionHistory.length === 0) return 0;
  
  const sortedDates = completionHistory
    .map(date => new Date(date))
    .sort((a, b) => b - a);
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    date.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (date.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Create context
const HabitsContext = createContext();

// Context provider component
export const HabitsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitsReducer, initialState);

  // Load data on app start
  useEffect(() => {
    loadHabitsFromStorage();
  }, []);

  // Save data whenever habits change
  useEffect(() => {
    if (state.habits.length > 0 || state.user) {
      saveHabitsToStorage();
    }
  }, [state.habits, state.user]);

  // Check if new day and reset daily progress
  useEffect(() => {
    checkAndResetDailyProgress();
  }, []);

  // Load habits from storage
  const loadHabitsFromStorage = async () => {
    try {
      dispatch({ type: HABITS_ACTIONS.SET_LOADING, payload: true });
      
      const data = await storageService.getHabits();
      const userData = await storageService.getUser();
      
      if (data) {
        dispatch({ type: HABITS_ACTIONS.LOAD_HABITS, payload: data });
        
        // Calculate today's completed habits
        const today = new Date().toDateString();
        const completedToday = data.habits?.filter(habit => 
          habit.completionHistory?.includes(today)
        ).length || 0;
        
        dispatch({ type: HABITS_ACTIONS.SET_LOADING, payload: false });
      }
      
      if (userData) {
        dispatch({ type: HABITS_ACTIONS.SET_USER, payload: userData });
      }
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Failed to load habits' });
    }
  };

  // Save habits to storage
  const saveHabitsToStorage = async () => {
    try {
      await storageService.saveHabits({
        habits: state.habits,
        lastActiveDate: new Date().toDateString(),
      });
      
      if (state.user) {
        await storageService.saveUser(state.user);
      }
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  };

  // Check and reset daily progress
  const checkAndResetDailyProgress = () => {
    const today = new Date().toDateString();
    const lastActive = state.lastActiveDate;
    
    if (lastActive && lastActive !== today) {
      dispatch({ type: HABITS_ACTIONS.RESET_DAILY_PROGRESS });
    }
  };

  // Action creators
  const addHabit = async (habitData) => {
    try {
      const validation = validateHabit(habitData);
      if (!validation.isValid) {
        dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: validation.errors.join(', ') });
        return false;
      }

      dispatch({ type: HABITS_ACTIONS.ADD_HABIT, payload: habitData });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Failed to add habit' });
      return false;
    }
  };

  const updateHabit = async (habitId, updates) => {
    try {
      const existingHabit = state.habits.find(h => h.id === habitId);
      if (!existingHabit) {
        dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Habit not found' });
        return false;
      }

      const updatedHabit = { ...existingHabit, ...updates };
      const validation = validateHabit(updatedHabit);
      
      if (!validation.isValid) {
        dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: validation.errors.join(', ') });
        return false;
      }

      dispatch({ type: HABITS_ACTIONS.UPDATE_HABIT, payload: { id: habitId, ...updates } });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Failed to update habit' });
      return false;
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      dispatch({ type: HABITS_ACTIONS.DELETE_HABIT, payload: habitId });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Failed to delete habit' });
      return false;
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      const habit = state.habits.find(h => h.id === habitId);
      if (!habit) {
        dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Habit not found' });
        return false;
      }

      dispatch({ 
        type: HABITS_ACTIONS.TOGGLE_HABIT, 
        payload: habitId,
        isCompleting: !habit.isCompleted 
      });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Failed to toggle habit' });
      return false;
    }
  };

  const signIn = async (credentials) => {
    try {
      dispatch({ type: HABITS_ACTIONS.SET_LOADING, payload: true });
      
      // Simulate authentication (replace with real auth)
      const user = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name || credentials.email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: HABITS_ACTIONS.SET_USER, payload: user });
      dispatch({ type: HABITS_ACTIONS.SET_LOADING, payload: false });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Authentication failed' });
      return false;
    }
  };

  const signUp = async (userData) => {
    try {
      dispatch({ type: HABITS_ACTIONS.SET_LOADING, payload: true });
      
      // Simulate user creation (replace with real auth)
      const user = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: HABITS_ACTIONS.SET_USER, payload: user });
      dispatch({ type: HABITS_ACTIONS.SET_LOADING, payload: false });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Registration failed' });
      return false;
    }
  };

  const logout = async () => {
    try {
      await storageService.clearAll();
      dispatch({ type: HABITS_ACTIONS.LOGOUT });
      return true;
    } catch (error) {
      dispatch({ type: HABITS_ACTIONS.SET_ERROR, payload: 'Logout failed' });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: HABITS_ACTIONS.CLEAR_ERROR });
  };

  // Get statistics
  const getStatistics = () => {
    const today = new Date().toDateString();
    const completedToday = state.habits.filter(habit => 
      habit.completionHistory?.includes(today)
    ).length;
    
    const totalHabits = state.habits.length;
    const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    
    const longestStreak = Math.max(0, ...state.habits.map(h => h.streak || 0));
    
    return {
      totalHabits,
      completedToday,
      completionRate: Math.round(completionRate),
      longestStreak,
      activeHabits: state.habits.filter(h => !h.isArchived).length,
    };
  };

  // Context value
  const value = {
    // State
    habits: state.habits,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    signIn,
    signUp,
    logout,
    clearError,
    getStatistics,
    
    // Computed values
    statistics: getStatistics(),
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};

// Custom hook to use the context
export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};

export default HabitsContext;