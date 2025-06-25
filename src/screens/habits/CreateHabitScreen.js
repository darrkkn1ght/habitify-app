import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HabitsContext } from '../../context/HabitsContext';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';

const CreateHabitScreen = ({ navigation }) => {
  const { addHabit } = useContext(HabitsContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    frequency: 'daily',
    reminderEnabled: false,
    reminderTime: '09:00',
    color: '#4CAF50',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'health', name: 'Health & Fitness', icon: 'fitness-outline', color: '#FF6B6B' },
    { id: 'productivity', name: 'Productivity', icon: 'briefcase-outline', color: '#4ECDC4' },
    { id: 'personal', name: 'Personal Growth', icon: 'person-outline', color: '#45B7D1' },
    { id: 'social', name: 'Social', icon: 'people-outline', color: '#FFA726' },
    { id: 'creative', name: 'Creative', icon: 'brush-outline', color: '#AB47BC' },
    { id: 'learning', name: 'Learning', icon: 'book-outline', color: '#66BB6A' },
    { id: 'spiritual', name: 'Spiritual', icon: 'leaf-outline', color: '#8D6E63' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#78909C' },
  ];

  const frequencies = [
    { id: 'daily', name: 'Daily', description: 'Every day' },
    { id: 'weekly', name: 'Weekly', description: 'Once a week' },
    { id: 'weekdays', name: 'Weekdays', description: 'Monday to Friday' },
    { id: 'weekends', name: 'Weekends', description: 'Saturday and Sunday' },
    { id: 'custom', name: 'Custom', description: 'Choose specific days' },
  ];

  const habitColors = [
    '#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0',
    '#607D8B', '#795548', '#FF5722', '#3F51B5', '#009688',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Habit name is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Habit name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newHabit = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        frequency: formData.frequency,
        reminderEnabled: formData.reminderEnabled,
        reminderTime: formData.reminderTime,
        color: formData.color,
        createdAt: new Date().toISOString(),
        streak: 0,
        completions: [],
        totalCompletions: 0,
        isActive: true,
      };

      await addHabit(newHabit);
      
      Alert.alert(
        'Success!',
        'Your new habit has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : 'help-outline';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#78909C';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Habit</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Habit Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Name</Text>
          <InputField
            placeholder="Enter habit name (e.g., Drink 8 glasses of water)"
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            error={errors.title}
            maxLength={50}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <InputField
            placeholder="Add a brief description..."
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            error={errors.description}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
          <Text style={styles.characterCount}>
            {formData.description.length}/200
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  formData.category === category.id && styles.selectedCategory,
                  formData.category === category.id && { borderColor: category.color },
                ]}
                onPress={() => updateFormData('category', category.id)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={category.color}
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <View style={styles.frequencyList}>
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq.id}
                style={[
                  styles.frequencyItem,
                  formData.frequency === freq.id && styles.selectedFrequency,
                ]}
                onPress={() => updateFormData('frequency', freq.id)}
              >
                <View style={styles.frequencyContent}>
                  <Text style={styles.frequencyName}>{freq.name}</Text>
                  <Text style={styles.frequencyDescription}>{freq.description}</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    formData.frequency === freq.id && styles.selectedRadio,
                  ]}
                >
                  {formData.frequency === freq.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Theme</Text>
          <View style={styles.colorsGrid}>
            {habitColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorItem,
                  { backgroundColor: color },
                  formData.color === color && styles.selectedColor,
                ]}
                onPress={() => updateFormData('color', color)}
              >
                {formData.color === color && (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewIconContainer}>
                <View
                  style={[
                    styles.previewIcon,
                    { backgroundColor: formData.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(formData.category)}
                    size={24}
                    color={formData.color}
                  />
                </View>
              </View>
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>
                  {formData.title || 'Your habit name'}
                </Text>
                <Text style={styles.previewCategory}>
                  {formData.category
                    ? categories.find(cat => cat.id === formData.category)?.name
                    : 'Select a category'
                  }
                </Text>
              </View>
            </View>
            {formData.description && (
              <Text style={styles.previewDescription}>{formData.description}</Text>
            )}
            <View style={styles.previewFooter}>
              <Text style={styles.previewFrequency}>
                {frequencies.find(freq => freq.id === formData.frequency)?.name}
              </Text>
              <View style={[styles.previewColorDot, { backgroundColor: formData.color }]} />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <CustomButton
            title="Create Habit"
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, { backgroundColor: formData.color }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginRight: 34, // Compensate for back button
  },
  headerSpacer: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedCategory: {
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  frequencyList: {
    gap: 8,
  },
  frequencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFrequency: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#3B82F6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  previewCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIconContainer: {
    marginRight: 12,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  previewCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewFrequency: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  submitSection: {
    marginBottom: 30,
  },
  submitButton: {
    minHeight: 50,
  },
});

export default CreateHabitScreen;