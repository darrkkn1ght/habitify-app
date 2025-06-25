import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import ProgressBar from '../../components/ProgressBar';
import { HabitsContext } from '../../context/HabitsContext';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from '../../utils/validation';

const SignUpScreen = ({ navigation }) => {
  const { signUp, isLoading } = useContext(HabitsContext);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('weak');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const strengthAnim = useRef(new Animated.Value(0)).current;
  
  // Refs for form inputs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Component mount animation
  React.useEffect(() => {
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

  // Password strength animation
  React.useEffect(() => {
    Animated.timing(strengthAnim, {
      toValue: passwordStrength === 'weak' ? 0.33 : passwordStrength === 'medium' ? 0.66 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [passwordStrength]);

  // Shake animation for errors
  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }

    // Update password strength
    if (field === 'password') {
      const passwordValidation = validatePassword(value);
      setPasswordStrength(passwordValidation.strength);
    }
  };

  // Validate name
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return { isValid: false, errors: ['Name is required'] };
    }
    if (name.trim().length < 2) {
      return { isValid: false, errors: ['Name must be at least 2 characters long'] };
    }
    if (name.trim().length > 50) {
      return { isValid: false, errors: ['Name must be no more than 50 characters long'] };
    }
    return { isValid: true, errors: [] };
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    // Validate confirm password
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.errors[0];
    }

    // Check terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (!validateForm()) {
      triggerShakeAnimation();
      return;
    }

    try {
      const success = await signUp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      
      if (success) {
        Alert.alert(
          'Account Created!',
          'Your account has been created successfully. Welcome to Habitify!',
          [{ text: 'OK' }]
        );
        // Navigation handled by context
      } else {
        Alert.alert(
          'Sign Up Failed',
          'An account with this email already exists. Please try a different email.',
          [{ text: 'OK' }]
        );
        triggerShakeAnimation();
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred during sign up. Please try again.',
        [{ text: 'OK' }]
      );
      triggerShakeAnimation();
    }
  };

  // Handle terms press
  const handleTermsPress = () => {
    Alert.alert(
      'Terms & Conditions',
      'By using Habitify, you agree to our terms of service and privacy policy. Full terms will be available in the app settings.',
      [{ text: 'OK' }]
    );
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (!formData.password) return null;

    return (
      <View style={styles.passwordStrengthContainer}>
        <View style={styles.passwordStrengthBar}>
          <Animated.View
            style={[
              styles.passwordStrengthFill,
              {
                width: strengthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: getPasswordStrengthColor(passwordStrength),
              },
            ]}
          />
        </View>
        <Text style={[styles.passwordStrengthText, { color: getPasswordStrengthColor(passwordStrength) }]}>
          {getPasswordStrengthText(passwordStrength)}
        </Text>
      </View>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { translateX: shakeAnim },
                  ],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.logoContainer}>
                  <Text style={styles.logoEmoji}>🚀</Text>
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join thousands building better habits</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <InputField
                  ref={nameRef}
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  error={errors.name}
                  leftIcon="person-outline"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  returnKeyType="next"
                />

                <InputField
                  ref={emailRef}
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email}
                  leftIcon="mail-outline"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  returnKeyType="next"
                />

                <InputField
                  ref={passwordRef}
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Create a strong password"
                  secureTextEntry={!showPassword}
                  error={errors.password}
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  returnKeyType="next"
                />

                {renderPasswordStrength()}

                <InputField
                  ref={confirmPasswordRef}
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  error={errors.confirmPassword}
                  leftIcon="lock-closed-outline"
                  rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  onSubmitEditing={handleSignUp}
                  returnKeyType="go"
                />

                {/* Terms & Conditions */}
                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                      {acceptTerms && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={styles.termsTextContainer}>
                      <Text style={styles.termsText}>I agree to the </Text>
                      <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
                        <Text style={styles.termsLink}>Terms & Conditions</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  {errors.terms && (
                    <Text style={styles.errorText}>{errors.terms}</Text>
                  )}
                </View>

                {/* Sign Up Button */}
                <CustomButton
                  title="Create Account"
                  onPress={handleSignUp}
                  loading={isLoading}
                  style={styles.signUpButton}
                  textStyle={styles.signUpButtonText}
                />
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignIn')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF80',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  passwordStrengthContainer: {
    marginTop: -10,
    marginBottom: 20,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 5,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  termsContainer: {
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF60',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
   alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termsText: {
    fontSize: 14,
    color: '#FFFFFF80',
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 5,
    marginLeft: 32,
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonText: {
    color: '#764ba2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#FFFFFF80',
    marginRight: 8,
  },
  signInText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;