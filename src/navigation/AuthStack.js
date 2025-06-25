import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Context
import { HabitsContext } from '../context/HabitsContext';

// Import Screens (will be created in later phases)
// For now, we'll create placeholder components
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

// Temporary Onboarding Screen placeholder
const OnboardingScreen = ({ navigation }) => {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={80} color="#6366f1" />
        <Text style={styles.title}>Welcome to Habitify</Text>
        <Text style={styles.subtitle}>
          Build better habits, track your progress, and achieve your goals with our simple and effective habit tracker.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="today" size={24} color="#10b981" />
            <Text style={styles.featureText}>Daily Tracking</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="trending-up" size={24} color="#10b981" />
            <Text style={styles.featureText}>Progress Analytics</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="notifications" size={24} color="#10b981" />
            <Text style={styles.featureText}>Smart Reminders</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

// Temporary Sign In Screen placeholder
const SignInScreen = ({ navigation }) => {
  const { setUser } = useContext(HabitsContext);

  const handleSignIn = () => {
    // Simulate authentication - replace with real auth logic
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@habitify.com',
      joinedDate: new Date().toISOString(),
    };
    
    setUser(mockUser);
    Alert.alert('Success', 'Welcome to Habitify!');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.authHeader}>
        <Ionicons name="log-in" size={60} color="#6366f1" />
        <Text style={styles.authTitle}>Sign In</Text>
        <Text style={styles.authSubtitle}>Welcome back! Continue your habit journey.</Text>
      </View>

      <View style={styles.authForm}>
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputLabel}>Email (Demo Mode)</Text>
          <Text style={styles.inputText}>demo@habitify.com</Text>
        </View>
        
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputLabel}>Password (Demo Mode)</Text>
          <Text style={styles.inputText}>••••••••</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleSignUp}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Temporary Sign Up Screen placeholder
const SignUpScreen = ({ navigation }) => {
  const { setUser } = useContext(HabitsContext);

  const handleSignUp = () => {
    // Simulate registration - replace with real auth logic
    const mockUser = {
      id: '2',
      name: 'New User',
      email: 'newuser@habitify.com',
      joinedDate: new Date().toISOString(),
    };
    
    setUser(mockUser);
    Alert.alert('Success', 'Account created successfully!');
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.authHeader}>
        <Ionicons name="person-add" size={60} color="#6366f1" />
        <Text style={styles.authTitle}>Sign Up</Text>
        <Text style={styles.authSubtitle}>Create your account and start building habits.</Text>
      </View>

      <View style={styles.authForm}>
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputLabel}>Full Name (Demo Mode)</Text>
          <Text style={styles.inputText}>Your Name</Text>
        </View>
        
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputLabel}>Email (Demo Mode)</Text>
          <Text style={styles.inputText}>your@email.com</Text>
        </View>
        
        <View style={styles.inputPlaceholder}>
          <Text style={styles.inputLabel}>Password (Demo Mode)</Text>
          <Text style={styles.inputText}>••••••••</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleSignIn}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Auth Stack Navigator
const AuthStack = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then(value => {
      setHasSeenOnboarding(!!value);
    });
  }, []);

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
      }}
      initialRouteName={hasSeenOnboarding ? 'SignIn' : 'Onboarding'}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    alignItems: 'center',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  authHeader: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  authForm: {
    flex: 1,
  },
  inputPlaceholder: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  inputText: {
    fontSize: 16,
    color: '#1f2937',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#6b7280',
  },
  linkTextBold: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
});

export default AuthStack;