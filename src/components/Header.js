import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = '#FFFFFF',
  textColor = '#1C1C1E',
  showBackButton = false,
  backButtonColor = '#007AFF',
  elevation = true,
  style,
  titleStyle,
  subtitleStyle,
  centerComponent,
  variant = 'default', // 'default', 'large', 'minimal'
  statusBarStyle = 'dark-content',
}) => {
  const getContainerStyle = () => {
    const baseStyle = [
      styles.container,
      { backgroundColor },
      variant === 'large' && styles.container_large,
      variant === 'minimal' && styles.container_minimal,
    ];

    if (elevation) {
      baseStyle.push(styles.container_elevated);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTitleStyle = () => {
    const baseStyle = [
      styles.title,
      { color: textColor },
      variant === 'large' && styles.title_large,
      variant === 'minimal' && styles.title_minimal,
    ];

    if (titleStyle) {
      baseStyle.push(titleStyle);
    }

    return baseStyle;
  };

  const renderBackButton = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={onLeftPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.backButtonText, { color: backButtonColor }]}>
        ← Back
      </Text>
    </TouchableOpacity>
  );

  const renderLeftIcon = () => {
    if (showBackButton) {
      return renderBackButton();
    }
    
    if (leftIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {leftIcon}
        </TouchableOpacity>
      );
    }
    
    return <View style={styles.iconPlaceholder} />;
  };

  const renderRightIcon = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }
    
    return <View style={styles.iconPlaceholder} />;
  };

  const renderCenterContent = () => {
    if (centerComponent) {
      return centerComponent;
    }

    return (
      <View style={styles.titleContainer}>
        <Text style={getTitleStyle()} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: textColor }, subtitleStyle]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={getContainerStyle()} edges={['top']}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {renderLeftIcon()}
        </View>
        
        <View style={styles.centerSection}>
          {renderCenterContent()}
        </View>
        
        <View style={styles.rightSection}>
          {renderRightIcon()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  
  container_large: {
    paddingBottom: 20,
  },
  
  container_minimal: {
    paddingVertical: 8,
  },
  
  container_elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  
  centerSection: {
    flex: 3,
    alignItems: 'center',
  },
  
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  
  titleContainer: {
    alignItems: 'center',
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  title_large: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  title_minimal: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
    textAlign: 'center',
  },
  
  backButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  iconButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  
  iconPlaceholder: {
    width: 32,
    height: 32,
  },
});

export default Header;