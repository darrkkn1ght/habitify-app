import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  RefreshControl,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HabitsContext from '../../context/HabitsContext';
import HabitCard from '../../components/HabitCard';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';

const AllHabitsScreen = ({ navigation }) => {
  const { 
    habits, 
    deleteHabit, 
    completeHabit, 
    undoHabitCompletion,
    refreshData,
    categories,
    getHabitsByCategory 
  } = useContext(HabitsContext);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('created'); // created, name, progress, streak
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  // Component mount animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Search animation
  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: searchQuery ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [searchQuery]);

  // Filter and sort habits
  const getFilteredAndSortedHabits = () => {
    let filteredHabits = habits;

    // Filter by search query
    if (searchQuery) {
      filteredHabits = filteredHabits.filter(habit =>
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filteredHabits = filteredHabits.filter(habit => habit.category === selectedCategory);
    }

    // Sort habits
    switch (sortBy) {
      case 'name':
        filteredHabits.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'progress':
        filteredHabits.sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0));
        break;
      case 'streak':
        filteredHabits.sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0));
        break;
      case 'created':
      default:
        filteredHabits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filteredHabits;
  };

  const filteredHabits = getFilteredAndSortedHabits();

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh habits');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle habit toggle
  const handleHabitToggle = async (habitId) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (habit.completedToday) {
        await undoHabitCompletion(habitId);
      } else {
        await completeHabit(habitId);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  // Handle habit long press (selection mode)
  const handleHabitLongPress = (habitId) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedHabits(new Set([habitId]));
    } else {
      toggleHabitSelection(habitId);
    }
  };

  // Toggle habit selection
  const toggleHabitSelection = (habitId) => {
    const newSelected = new Set(selectedHabits);
    if (newSelected.has(habitId)) {
      newSelected.delete(habitId);
    } else {
      newSelected.add(habitId);
    }
    setSelectedHabits(newSelected);
    
    if (newSelected.size === 0) {
      setIsSelectionMode(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    Alert.alert(
      'Delete Habits',
      `Are you sure you want to delete ${selectedHabits.size} habit${selectedHabits.size > 1 ? 's' : ''}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const habitId of selectedHabits) {
                await deleteHabit(habitId);
              }
              setSelectedHabits(new Set());
              setIsSelectionMode(false);
              Alert.alert('Success', 'Habits deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete some habits');
            }
          },
        },
      ]
    );
  };

  // Exit selection mode
  const exitSelectionMode = () => {
    setSelectedHabits(new Set());
    setIsSelectionMode(false);
  };

  // Get category count
  const getCategoryCount = (category) => {
    if (category === 'All') return habits.length;
    return habits.filter(habit => habit.category === category).length;
  };

  // Render search bar
  const renderSearchBar = () => (
    <Animated.View 
      style={[
        styles.searchContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#FFFFFF60" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor="#FFFFFF60"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#FFFFFF60" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={showFilters ? "filter" : "filter-outline"} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </Animated.View>
  );

  // Render filters
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Animated.View
        style={[
          styles.filtersContainer,
          {
            opacity: fadeAnim,
            maxHeight: searchAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
          },
        ]}
      >
        {/* Categories */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {['All', ...categories].map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextSelected,
                ]}>
                  {category} ({getCategoryCount(category)})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Sort By</Text>
          <View style={styles.sortContainer}>
            {[
              { key: 'created', label: 'Recently Added', icon: 'time-outline' },
              { key: 'name', label: 'Name', icon: 'text-outline' },
              { key: 'progress', label: 'Progress', icon: 'trending-up-outline' },
              { key: 'streak', label: 'Streak', icon: 'flame-outline' },
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionSelected,
                ]}
                onPress={() => setSortBy(option.key)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={option.icon} 
                  size={18} 
                  color={sortBy === option.key ? '#667eea' : '#FFFFFF80'} 
                />
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.sortOptionTextSelected,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  // Render selection toolbar
  const renderSelectionToolbar = () => {
    if (!isSelectionMode) return null;

    return (
      <View style={styles.selectionToolbar}>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={exitSelectionMode}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.selectionCount}>
          {selectedHabits.size} selected
        </Text>
        
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleBulkDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render habit item
  const renderHabitItem = ({ item: habit, index }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20 * (index + 1), 0],
              }),
            },
          ],
        },
      ]}
    >
      <HabitCard
        habit={habit}
        onToggle={() => handleHabitToggle(habit.id)}
        onPress={() => {
          if (isSelectionMode) {
            toggleHabitSelection(habit.id);
          } else {
            navigation.navigate('HabitDetail', { habitId: habit.id });
          }
        }}
        onLongPress={() => handleHabitLongPress(habit.id)}
        isSelected={selectedHabits.has(habit.id)}
        isSelectionMode={isSelectionMode}
        showProgress={true}
        showStreak={true}
        showCategory={true}
        style={[
          styles.habitCard,
          selectedHabits.has(habit.id) && styles.habitCardSelected,
        ]}
      />
    </Animated.View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.emptyStateEmoji}>
        {searchQuery ? '🔍' : selectedCategory !== 'All' ? '📂' : '📝'}
      </Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery 
          ? 'No habits found' 
          : selectedCategory !== 'All' 
            ? `No habits in ${selectedCategory}` 
            : 'No habits yet'
        }
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : selectedCategory !== 'All'
            ? 'Create a habit in this category to get started'
            : 'Start your journey by creating your first habit!'
        }
      </Text>
      
      {!searchQuery && (
        <CustomButton
          title="Create Your First Habit"
          onPress={() => navigation.navigate('CreateHabit')}
          style={styles.createButton}
          textStyle={styles.createButtonText}
        />
      )}
    </Animated.View>
  );

  // Render stats summary
  const renderStatsSummary = () => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedToday).length;
    const avgCompletionRate = totalHabits > 0 
      ? habits.reduce((sum, habit) => sum + (habit.completionRate || 0), 0) / totalHabits 
      : 0;

    return (
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalHabits}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedToday}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.round(avgCompletionRate)}%</Text>
          <Text style={styles.statLabel}>Avg. Completion</Text>
        </View>
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
        <Header
          title="All Habits"
          onBack={() => navigation.goBack()}
          rightComponent={
            !isSelectionMode ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateHabit')}
                style={styles.addButton}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : null
          }
        />

        {renderSelectionToolbar()}
        {renderSearchBar()}
        {renderFilters()}
        {habits.length > 0 && renderStatsSummary()}

        <FlatList
          data={filteredHabits}
          keyExtractor={item => item.id}
          renderItem={renderHabitItem}
          contentContainerStyle={[
            styles.listContainer,
            filteredHabits.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
          ListEmptyComponent={renderEmptyState}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    height: 50,
  },
  clearButton: {
    padding: 5,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryChipSelected: {
    backgroundColor: '#FFFFFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  sortOptionSelected: {
    backgroundColor: '#FFFFFF',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#FFFFFF80',
    marginLeft: 6,
    fontWeight: '500',
  },
  sortOptionTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  habitCard: {
    marginBottom: 12,
  },
  habitCardSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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

export default AllHabitsScreen;