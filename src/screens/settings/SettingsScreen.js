import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HabitsContext from '../../context/HabitsContext';
import CustomButton from '../../components/CustomButton';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const { 
    user, 
    habits, 
    updateUser, 
    clearAllData, 
    exportData, 
    importData,
    logout 
  } = useContext(HabitsContext);
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  const handleSaveProfile = () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    updateUser({
      ...user,
      name: editedName.trim(),
      email: editedEmail.trim()
    });
    
    setShowProfileModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleExportData = async () => {
    try {
      const exportedData = JSON.stringify({
        habits,
        user,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }, null, 2);
      
      await Share.share({
        message: exportedData,
        title: 'Habitify Data Export'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            clearAllData();
            Alert.alert('Success', 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        }
      ]
    );
  };

  const getHabitStats = () => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => 
      sum + (habit.completedDates?.length || 0), 0
    );
    const activeHabits = habits.filter(habit => 
      habit.completedDates?.some(date => {
        const completionDate = new Date(date);
        const daysDiff = Math.floor((new Date() - completionDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      })
    ).length;
    
    return { totalHabits, totalCompletions, activeHabits };
  };

  const stats = getHabitStats();

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showArrow = true,
    iconColor = '#3498DB' 
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Profile Section */}
      <SettingSection title="Profile">
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowProfileModal(true)}
          >
            <Ionicons name="create-outline" size={20} color="#3498DB" />
          </TouchableOpacity>
        </View>
      </SettingSection>

      {/* Statistics */}
      <SettingSection title="Your Progress">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Completions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.activeHabits}</Text>
            <Text style={styles.statLabel}>Active This Week</Text>
          </View>
        </View>
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences">
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Switch to dark theme"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E0E6ED', true: '#3498DB' }}
              thumbColor={darkMode ? '#FFF' : '#95A5A6'}
            />
          }
          showArrow={false}
          iconColor="#2C3E50"
        />
        
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Daily habit reminders"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E0E6ED', true: '#3498DB' }}
              thumbColor={notifications ? '#FFF' : '#95A5A6'}
            />
          }
          showArrow={false}
          iconColor="#E67E22"
        />
        
        <SettingItem
          icon="calendar-outline"
          title="Week Starts On"
          subtitle={weekStartsOnMonday ? "Monday" : "Sunday"}
          rightComponent={
            <Switch
              value={weekStartsOnMonday}
              onValueChange={setWeekStartsOnMonday}
              trackColor={{ false: '#E0E6ED', true: '#3498DB' }}
              thumbColor={weekStartsOnMonday ? '#FFF' : '#95A5A6'}
            />
          }
          showArrow={false}
          iconColor="#9B59B6"
        />
      </SettingSection>

      {/* Data Management */}
      <SettingSection title="Data">
        <SettingItem
          icon="download-outline"
          title="Export Data"
          subtitle="Share your habits data"
          onPress={handleExportData}
          iconColor="#27AE60"
        />
        
        <SettingItem
          icon="cloud-upload-outline"
          title="Import Data"
          subtitle="Restore from backup"
          onPress={() => setShowDataModal(true)}
          iconColor="#3498DB"
        />
        
        <SettingItem
          icon="trash-outline"
          title="Clear All Data"
          subtitle="Reset all habits and progress"
          onPress={handleClearAllData}
          iconColor="#E74C3C"
        />
      </SettingSection>

      {/* Support */}
      <SettingSection title="Support">
        <SettingItem
          icon="help-circle-outline"
          title="Help & FAQ"
          subtitle="Get help using Habitify"
          onPress={() => Alert.alert('Help', 'Help documentation coming soon!')}
          iconColor="#3498DB"
        />
        
        <SettingItem
          icon="mail-outline"
          title="Contact Support"
          subtitle="Get in touch with us"
          onPress={() => Alert.alert('Contact', 'Email: support@habitify.app')}
          iconColor="#E67E22"
        />
        
        <SettingItem
          icon="star-outline"
          title="Rate App"
          subtitle="Rate us on the app store"
          onPress={() => Alert.alert('Rate App', 'Thank you for your support!')}
          iconColor="#F39C12"
        />
      </SettingSection>

      {/* Account */}
      <SettingSection title="Account">
        <SettingItem
          icon="log-out-outline"
          title="Logout"
          subtitle="Sign out of your account"
          onPress={handleLogout}
          iconColor="#E74C3C"
        />
      </SettingSection>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Habitify</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appCopyright}>© 2025 Habitify. All rights reserved.</Text>
      </View>

      {/* Profile Edit Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleSaveProfile}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                  placeholderTextColor="#95A5A6"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#95A5A6"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Data Management Modal */}
      <Modal
        visible={showDataModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDataModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDataModal(false)}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Data Management</Text>
              <View style={{ width: 24 }} />
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Manage your Habitify data with these options:
              </Text>
              
              <CustomButton
                title="Export All Data"
                onPress={() => {
                  setShowDataModal(false);
                  handleExportData();
                }}
                style={styles.dataButton}
                icon="download-outline"
              />
              
              <CustomButton
                title="Import from File"
                onPress={() => {
                  setShowDataModal(false);
                  Alert.alert('Import', 'File import feature coming soon!');
                }}
                variant="outline"
                style={styles.dataButton}
                icon="cloud-upload-outline"
              />
              
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#E67E22" />
                <Text style={styles.warningText}>
                  Importing data will replace your current habits and progress.
                </Text>
              </View>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    paddingHorizontal: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  appCopyright: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498DB',
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  dataButton: {
    marginBottom: 12,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF5E7',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E67E22',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default SettingsScreen;