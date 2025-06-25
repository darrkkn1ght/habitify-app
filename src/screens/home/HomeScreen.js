import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HabitsContext } from '../../context/HabitsContext';
import HabitCard from '../../components/HabitCard';
import ProgressBar from '../../components/ProgressBar';
import CustomButton from '../../components/CustomButton';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { 
    user, 
    habits, 
    todaysProgress, 
    getTodaysHabits, 
    completeHabit, 
    undoHabitCompletion,
    getStreakCount,
    getCompletionRate,
    refreshData 
  } = useContext(HabitsContext);

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Motivational quotes
  const quotes = [
    "Every small step counts! 🌟",
    "Consistency is the key to success! 💪",
    "You're building a better you! 🚀",
    "Progress, not perfection! ✨",
    "Keep going, you've got this! 🔥",
    "Small habits, big changes! 🌱",
    "Today is a new opportunity! 🌅",
    "Your future self will thank you! 💝",
  ];

  // Get today's data
  const todaysHabits = getTodaysHabits();
  const completedToday = todaysHabits.filter(habit => habit.completedToday).length;
  const totalToday = todaysHabits.length;
  const completionPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
  const currentStreak = getStreakCount();
  const overallCompletionRate = getCompletionRate();

  // Component mount animation
  useEffect(() => {
    // Set random motivational quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(randomQuote);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for stats
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (completionPercentage === 100 && totalToday > 0) {
      pulseAnimation.start();
    }

    return () => pulseAnimation.stop();
  }, [completionPercentage, totalToday]);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      // Set new motivational quote
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setMotivationalQuote(randomQuote);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle habit completion toggle
  const handleHabitToggle = async (habitId) => {
    try {
      const habit = todaysHabits.find(h => h.id === habitId);
      if (habit.completedToday) {
        await undoHabitCompletion(habitId);
      } else {
        await completeHabit(habitId);
        // Show celebration for 100% completion
        if (completedToday + 1 === totalToday && totalToday > 0) {
          setTimeout(() => {
            Alert.alert(
              '🎉 Amazing!',
              'You\'ve completed all your habits for today! Keep up the great work!',
              [{ text: 'Awesome!', style: 'default' }]
            );
          }, 500);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get today's date formatted
  const getTodaysDate = () => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  // Render header
  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerTop}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name || 'User'}! 👋</Text>
          <Text style={styles.date}>{getTodaysDate()}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.motivationalQuote}>{motivationalQuote}</Text>
    </Animated.View>
  );

  // Render progress summary
  const renderProgressSummary = () => (
    <Animated.View 
      style={[
        styles.progressContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressStats}>
            {completedToday}/{totalToday} habits
          </Text>
        </View>
        
        <ProgressBar 
          progress={completionPercentage}
          height={12}
          backgroundColor="rgba(255, 255, 255, 0.2)"
          progressColor={completionPercentage === 100 ? '#4CAF50' : '#667eea'}
          animated={true}
        />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(completionPercentage)}%</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(overallCompletionRate)}%</Text>
            <Text style={styles.statLabel}>Overall</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  // Render habits list
  const renderHabits = () => {
    if (todaysHabits.length === 0) {
      return (
        <Animated.View 
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.emptyStateEmoji}>📝</Text>
          <Text style={styles.emptyStateTitle}>No Habits for Today</Text>
          <Text style={styles.emptyStateText}>
            Start building better habits by creating your first one!
          </Text>
          <CustomButton
            title="Create Your First Habit"
            onPress={() => navigation.navigate('CreateHabit')}
            style={styles.createButton}
            textStyle={styles.createButtonText}
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.habitsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.habitsHeader}>
          <Text style={styles.habitsTitle}>Today's Habits</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllHabits')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {todaysHabits.map((habit, index) => (
          <Animated.View
            key={habit.id}
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20 * (index + 1), 0],
                  }),
                },
              ],
            }}
          >
            <HabitCard
              habit={habit}
              onToggle={() => handleHabitToggle(habit.id)}
              onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
              showProgress={true}
              style={styles.habitCard}
            />
          </Animated.View>
        ))}
        
        <TouchableOpacity
          style={styles.addHabitButton}
          onPress={() => navigation.navigate('CreateHabit')}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={24} color="#667eea" />
          <Text style={styles.addHabitText}>Add New Habit</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#764ba2" />
      
      <LinearGradient
        colors={['#764ba2', '#667eea']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        >
          {renderHeader()}
          {renderProgressSummary()}
          {renderHabits()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF80',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF60',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationalQuote: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressStats: {
    fontSize: 16,
    color: '#FFFFFF80',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF80',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  habitsContainer: {
    paddingHorizontal: 20,
  },
  habitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  habitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  habitCard: {
    marginBottom: 12,
  },
  addHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  addHabitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#FFFFFF80',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: '#764ba2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;