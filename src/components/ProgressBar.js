import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ProgressBar = ({
  progress = 0,
  total = 100,
  height = 8,
  backgroundColor = '#F2F2F7',
  progressColor = '#007AFF',
  borderRadius,
  showPercentage = false,
  showLabels = false,
  animated = true,
  animationDuration = 500,
  style,
  label,
  sublabel,
  variant = 'linear', // 'linear', 'circular'
  size = 100, // for circular variant
  strokeWidth = 8, // for circular variant
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  const percentage = Math.min((progress / total) * 100, 100);
  const calculatedRadius = borderRadius !== undefined ? borderRadius : height / 2;

  useEffect(() => {
    if (animated) {
      if (variant === 'linear') {
        Animated.timing(animatedWidth, {
          toValue: percentage,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      } else if (variant === 'circular') {
        Animated.timing(animatedRotation, {
          toValue: percentage,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      }
    } else {
      animatedWidth.setValue(percentage);
      animatedRotation.setValue(percentage);
    }
  }, [percentage, animated, animationDuration, variant]);

  const getProgressWidth = () => {
    if (animated) {
      return animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      });
    }
    return `${percentage}%`;
  };

  const getRotationDegree = () => {
    if (animated) {
      return animatedRotation.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'clamp',
      });
    }
    return `${(percentage / 100) * 360}deg`;
  };

  if (variant === 'circular') {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={[styles.circularContainer, { width: size, height: size }, style]}>
        <View style={[styles.circularProgress, { width: size, height: size }]}>
          {/* Background circle */}
          <View
            style={[
              styles.circularBackground,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: backgroundColor,
              },
            ]}
          />
          
          {/* Progress circle */}
          <Animated.View
            style={[
              styles.circularForeground,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: progressColor,
                transform: [{ rotate: getRotationDegree() }],
              },
            ]}
          />
          
          {/* Center content */}
          <View style={styles.circularCenter}>
            {showPercentage && (
              <Text style={[styles.circularPercentage, { color: progressColor }]}>
                {Math.round(percentage)}%
              </Text>
            )}
            {label && (
              <Text style={styles.circularLabel} numberOfLines={1}>
                {label}
              </Text>
            )}
          </View>
        </View>
        
        {sublabel && (
          <Text style={styles.circularSublabel} numberOfLines={1}>
            {sublabel}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {(label || showLabels) && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label || 'Progress'}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color: progressColor }]}>
              {Math.round(percentage)}%
            </Text>
          )}
        </View>
      )}
      
      <View
        style={[
          styles.progressContainer,
          {
            height,
            backgroundColor,
            borderRadius: calculatedRadius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: getProgressWidth(),
              backgroundColor: progressColor,
              borderRadius: calculatedRadius,
            },
          ]}
        />
      </View>
      
      {showLabels && (
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>
            {progress} / {total}
          </Text>
        </View>
      )}
      
      {sublabel && (
        <Text style={styles.sublabel}>{sublabel}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  progressContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  
  progressFill: {
    height: '100%',
  },
  
  valueContainer: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  
  valueText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  
  sublabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Circular variant styles
  circularContainer: {
    alignItems: 'center',
  },
  
  circularProgress: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  circularBackground: {
    position: 'absolute',
    borderStyle: 'solid',
  },
  
  circularForeground: {
    position: 'absolute',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  
  circularCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  circularPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  circularLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
  
  circularSublabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ProgressBar;