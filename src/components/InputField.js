import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  style,
  inputStyle,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer];
    
    if (isFocused) {
      baseStyle.push(styles.inputContainer_focused);
    }
    
    if (error) {
      baseStyle.push(styles.inputContainer_error);
    }
    
    if (!editable) {
      baseStyle.push(styles.inputContainer_disabled);
    }
    
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (multiline) {
      baseStyle.push(styles.input_multiline);
    }
    
    if (leftIcon) {
      baseStyle.push(styles.input_withLeftIcon);
    }
    
    if (rightIcon || secureTextEntry) {
      baseStyle.push(styles.input_withRightIcon);
    }
    
    if (inputStyle) {
      baseStyle.push(inputStyle);
    }
    
    return baseStyle;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={secureTextEntry ? togglePasswordVisibility : onRightIconPress}
            disabled={!secureTextEntry && !onRightIconPress}
          >
            {secureTextEntry ? (
              <Text style={styles.passwordToggle}>
                {isPasswordVisible ? '🙈' : '👁️'}
              </Text>
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {maxLength && (
        <Text style={styles.characterCount}>
          {value ? value.length : 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  
  required: {
    color: '#FF3B30',
    marginLeft: 2,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  
  inputContainer_focused: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  inputContainer_error: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  
  inputContainer_disabled: {
    backgroundColor: '#F2F2F7',
    opacity: 0.6,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 12,
  },
  
  input_multiline: {
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
  
  input_withLeftIcon: {
    marginLeft: 8,
  },
  
  input_withRightIcon: {
    marginRight: 8,
  },
  
  leftIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  rightIconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  
  passwordToggle: {
    fontSize: 18,
  },
  
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
  
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default InputField;