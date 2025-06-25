import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HabitCard = ({
  habit,
  onPress,
  onToggle,
  showProgress = true,
  showStreak = true,
  style,
}) => {
  const {
    id,
    name,
    description,
    category,
    color = '#007AFF',
    frequency,
    isCompleted = false,
    streak = 0,
    progress = 0,
    targetCount = 1,
    completedCount = 0,
  } = habit;

  const getCategoryIcon = (category) => {
    const icons = {
      health: '🏃',
      productivity: '📝',
      mindfulness: '🧘',
      learning: '📚',
      fitness: '💪',
      creativity: '🎨',
      social: '👥',
      habits: '⭐',
      default: '📌',
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  const getProgressPercentage = () => {
    if (targetCount === 0) return 0;
    return Math.min((completedCount / targetCount) * 100, 100);
  };

  const getFrequencyText = (frequency) => {
    const frequencyMap = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
    };
    return frequencyMap[frequency] || frequency;
  };

  const getStreakText = () => {
    if (streak === 0) return 'No streak';
    if (streak === 1) return '1 day';
    return `${streak} days`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.icon}>{getCategoryIcon(category)}</Text>
          <View style={styles.titleContent}>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            {description && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.checkButton,
            { backgroundColor: color },
            isCompleted && styles.checkButton_completed,
          ]}
          onPress={() => onToggle && onToggle(id)}
        >
          <Text style={styles.checkIcon}>
            {isCompleted ? '✓' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metaSection}>
        <View style={styles.leftMeta}>
          <Text style={styles.frequency}>
            {getFrequencyText(frequency)}
          </Text>
          {category && (
            <Text style={styles.category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          )}
        </View>

        {showStreak && (
          <View style={styles.streak}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        )}
      </View>

      {showProgress && targetCount > 1 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {completedCount}/{targetCount} completed
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(getProgressPercentage())}%
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        </View>
      )}

      {isCompleted && (
        <View style={styles.completedOverlay}>
          <View style={[styles.completedBadge, { backgroundColor: color }]}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  
  icon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  
  titleContent: {
    flex: 1,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  
  checkButton_completed: {
    opacity: 1,
  },
  
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  frequency: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  
  category: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  
  streak: {
    alignItems: 'center',
  },
  
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  
  streakLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: -2,
  },
  
  progressSection: {
    marginTop: 8,
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  
  progressPercentage: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  
  completedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  completedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default HabitCard;