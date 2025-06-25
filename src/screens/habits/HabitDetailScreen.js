import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitsContext } from '../../context/HabitsContext';
import ProgressBar from '../../components/ProgressBar';

const { width } = Dimensions.get('window');

const HabitDetailScreen = ({ route, navigation }) => {
  const { habitId } = route.params;
  const { habits, toggleHabitCompletion, deleteHabit } = useContext(HabitsContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>Habit not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const calculateStreak = () => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const sortedDates = habit.completedDates.sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateMonthlyProgress = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    const completedThisMonth = habit.completedDates?.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= startOfMonth && date <= now;
    }).length || 0;
    
    const daysSoFar = now.getDate();
    const expectedCompletions = Math.min(daysSoFar, daysInMonth);
    
    return {
      completed: completedThisMonth,
      expected: expectedCompletions,
      total: daysInMonth,
      percentage: expectedCompletions > 0 ? (completedThisMonth / expectedCompletions) * 100 : 0
    };
  };

  const getWeeklyData = () => {
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      weekData.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        date: dateStr,
        completed: habit.completedDates?.includes(dateStr) || false
      });
    }
    
    return weekData;
  };

  const handleToggleCompletion = (date) => {
    toggleHabitCompletion(habit.id, date);
  };

  const handleDeleteHabit = () => {
    deleteHabit(habit.id);
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDeleteHabit }
      ]
    );
  };

  const handleEditHabit = () => {
    navigation.navigate('CreateHabit', { 
      mode: 'edit', 
      habitData: habit 
    });
  };

  const streak = calculateStreak();
  const monthlyProgress = calculateMonthlyProgress();
  const weekData = getWeeklyData();
  const totalCompletions = habit.completedDates?.length || 0;

  const getCategoryColor = (category) => {
    const colors = {
      Health: '#4ECDC4',
      Fitness: '#45B7D1',
      Learning: '#96CEB4',
      Productivity: '#FFEAA7',
      Mindfulness: '#DDA0DD',
      Social: '#98D8C8',
      Other: '#95A5A6'
    };
    return colors[category] || colors.Other;
  };

  const categoryColor = getCategoryColor(habit.category);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEditHabit}
          >
            <Ionicons name="create-outline" size={24} color="#2C3E50" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Habit Info */}
      <View style={styles.habitInfo}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{habit.category}</Text>
        </View>
        
        <Text style={styles.habitName}>{habit.name}</Text>
        
        {habit.description && (
          <Text style={styles.habitDescription}>{habit.description}</Text>
        )}
        
        <Text style={styles.frequency}>
          {habit.frequency === 'daily' ? 'Daily' : `${habit.frequency} times per week`}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Ionicons name="flame" size={24} color="#E74C3C" />
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCompletions}</Text>
          <Text style={styles.statLabel}>Total Completions</Text>
          <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Math.round(monthlyProgress.percentage)}%</Text>
          <Text style={styles.statLabel}>This Month</Text>
          <Ionicons name="trending-up" size={24} color="#3498DB" />
        </View>
      </View>

      {/* Monthly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Progress</Text>
        <View style={styles.progressSection}>
          <ProgressBar 
            progress={monthlyProgress.percentage / 100}
            height={12}
            color={categoryColor}
          />
          <Text style={styles.progressText}>
            {monthlyProgress.completed} of {monthlyProgress.expected} days completed
          </Text>
        </View>
      </View>

      {/* Weekly View */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekContainer}>
          {weekData.map((day, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.dayCard,
                day.completed && { backgroundColor: categoryColor }
              ]}
              onPress={() => handleToggleCompletion(day.date)}
            >
              <Text style={[
                styles.dayLabel,
                day.completed && styles.dayLabelCompleted
              ]}>
                {day.day}
              </Text>
              <View style={[
                styles.dayIndicator,
                day.completed && styles.dayIndicatorCompleted
              ]}>
                {day.completed && (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: categoryColor + '20' }]}
          onPress={() => handleToggleCompletion(new Date().toISOString().split('T')[0])}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color={categoryColor} />
          <Text style={[styles.actionText, { color: categoryColor }]}>
            Mark as {habit.completedDates?.includes(new Date().toISOString().split('T')[0]) ? 'Incomplete' : 'Complete'} Today
          </Text>
          <Ionicons name="chevron-forward" size={20} color={categoryColor} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleEditHabit}
        >
          <Ionicons name="create-outline" size={24} color="#2C3E50" />
          <Text style={styles.actionText}>Edit Habit</Text>
          <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>
      </View>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color="#E74C3C" />
            <Text style={styles.modalTitle}>Delete Habit</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteHabit}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#2C3E50',
    marginVertical: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backIcon: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  habitInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  habitName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  habitDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  frequency: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  progressSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 12,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
    fontWeight: '600',
  },
  dayLabelCompleted: {
    color: '#FFF',
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E6ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayIndicatorCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#E0E6ED',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default HabitDetailScreen;