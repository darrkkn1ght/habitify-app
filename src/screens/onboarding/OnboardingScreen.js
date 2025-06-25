import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingData } from '../../data/dummyHabits';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Animation for slide transitions
  const animateSlideTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animation for button presses
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle scroll events
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    
    if (index !== currentIndex && index >= 0 && index < onboardingData.length) {
      setCurrentIndex(index);
      animateSlideTransition();
    }
  };

  // Navigate to next slide
  const goToNext = () => {
    animateButtonPress();
    
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
      animateSlideTransition();
    } else {
      // Last slide - navigate to auth
      navigation.replace('AuthStack');
    }
  };

  // Skip onboarding
  const skipOnboarding = () => {
    animateButtonPress();
    navigation.replace('AuthStack');
  };

  // Navigate to specific slide
  const goToSlide = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setCurrentIndex(index);
    animateSlideTransition();
  };

  // Slide animation effect
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentIndex * -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const renderSlide = (item, index) => {
    const isActive = index === currentIndex;
    
    return (
      <View key={item.id} style={[styles.slide, { width }]}>
        <LinearGradient
          colors={[item.backgroundColor, `${item.backgroundColor}90`]}
          style={styles.slideBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.slideContent,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationPlaceholder}>
                <Text style={styles.illustrationEmoji}>
                  {index === 0 ? '🎯' : index === 1 ? '📊' : '🏆'}
                </Text>
              </View>
              
              {/* Floating animation elements */}
              <View style={styles.floatingElements}>
                {[...Array(3)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.floatingDot,
                      {
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -10 - i * 5],
                            }),
                          },
                        ],
                        opacity: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 0.8],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex ? '#FFFFFF' : '#FFFFFF50',
              width: index === currentIndex ? 24 : 8,
            },
          ]}
          onPress={() => goToSlide(index)}
          activeOpacity={0.7}
        />
      ))}
    </View>
  );

  const renderButtons = () => {
    const isLastSlide = currentIndex === onboardingData.length - 1;
    
    return (
      <View style={styles.buttonContainer}>
        {/* Skip Button */}
        {!isLastSlide && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipOnboarding}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Next/Get Started Button */}
        <Animated.View
          style={[
            styles.nextButtonContainer,
            {
              transform: [{ scale: buttonScaleAnim }],
              flex: isLastSlide ? 1 : 0,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.nextButton,
              isLastSlide && styles.getStartedButton,
            ]}
            onPress={goToNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
            {!isLastSlide && (
              <Text style={styles.nextButtonArrow}>→</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Main Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {renderPagination()}
        {renderButtons()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  illustrationEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  floatingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
  textContent: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF90',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF80',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#FFFFFF80',
    fontWeight: '500',
  },
  nextButtonContainer: {
    minWidth: 120,
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginRight: 8,
  },
  nextButtonArrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
});

export default OnboardingScreen;