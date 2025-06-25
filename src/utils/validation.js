// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 characters, one letter, one number)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// Habit name validation regex (letters, numbers, spaces, basic punctuation)
const HABIT_NAME_REGEX = /^[a-zA-Z0-9\s\-_.,!?()]+$/;

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const result = {
    isValid: false,
    errors: [],
  };

  if (!email) {
    result.errors.push('Email is required');
    return result;
  }

  if (typeof email !== 'string') {
    result.errors.push('Email must be a string');
    return result;
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    result.errors.push('Email cannot be empty');
    return result;
  }

  if (trimmedEmail.length > 254) {
    result.errors.push('Email is too long');
    return result;
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    result.errors.push('Please enter a valid email address');
    return result;
  }

  result.isValid = true;
  return result;
};

/**
 * Password validation
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireNumbers = true,
    requireLetters = true,
    requireSpecialChars = false,
  } = options;

  const result = {
    isValid: false,
    errors: [],
    strength: 'weak',
  };

  if (!password) {
    result.errors.push('Password is required');
    return result;
  }

  if (typeof password !== 'string') {
    result.errors.push('Password must be a string');
    return result;
  }

  if (password.length < minLength) {
    result.errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (password.length > maxLength) {
    result.errors.push(`Password must be no more than ${maxLength} characters long`);
  }

  if (requireLetters && !/[A-Za-z]/.test(password)) {
    result.errors.push('Password must contain at least one letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    result.errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
   result.errors.push('Password must contain at least one special character');
 }

 // Check for common weak patterns
 if (password.toLowerCase().includes('password') || 
     password.toLowerCase().includes('123456') ||
     password === password.toLowerCase() ||
     password === password.toUpperCase()) {
   result.errors.push('Password is too common or predictable');
 }

 // Calculate password strength
 let strengthScore = 0;
 if (password.length >= 8) strengthScore++;
 if (password.length >= 12) strengthScore++;
 if (/[a-z]/.test(password)) strengthScore++;
 if (/[A-Z]/.test(password)) strengthScore++;
 if (/\d/.test(password)) strengthScore++;
 if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strengthScore++;
 if (password.length >= 16) strengthScore++;

 if (strengthScore <= 2) {
   result.strength = 'weak';
 } else if (strengthScore <= 4) {
   result.strength = 'medium';
 } else {
   result.strength = 'strong';
 }

 result.isValid = result.errors.length === 0;
 return result;
};

/**
* Confirm password validation
*/
export const validateConfirmPassword = (password, confirmPassword) => {
 const result = {
   isValid: false,
   errors: [],
 };

 if (!confirmPassword) {
   result.errors.push('Please confirm your password');
   return result;
 }

 if (password !== confirmPassword) {
   result.errors.push('Passwords do not match');
   return result;
 }

 result.isValid = true;
 return result;
};

/**
* Habit name validation
*/
export const validateHabitName = (name) => {
 const result = {
   isValid: false,
   errors: [],
 };

 if (!name) {
   result.errors.push('Habit name is required');
   return result;
 }

 if (typeof name !== 'string') {
   result.errors.push('Habit name must be a string');
   return result;
 }

 const trimmedName = name.trim();

 if (trimmedName.length === 0) {
   result.errors.push('Habit name cannot be empty');
   return result;
 }

 if (trimmedName.length < 2) {
   result.errors.push('Habit name must be at least 2 characters long');
   return result;
 }

 if (trimmedName.length > 100) {
   result.errors.push('Habit name must be no more than 100 characters long');
   return result;
 }

 if (!HABIT_NAME_REGEX.test(trimmedName)) {
   result.errors.push('Habit name contains invalid characters');
   return result;
 }

 result.isValid = true;
 return result;
};

/**
* Habit description validation
*/
export const validateHabitDescription = (description) => {
 const result = {
   isValid: false,
   errors: [],
 };

 // Description is optional
 if (!description) {
   result.isValid = true;
   return result;
 }

 if (typeof description !== 'string') {
   result.errors.push('Description must be a string');
   return result;
 }

 const trimmedDescription = description.trim();

 if (trimmedDescription.length > 500) {
   result.errors.push('Description must be no more than 500 characters long');
   return result;
 }

 result.isValid = true;
 return result;
};

/**
* Habit frequency validation
*/
export const validateHabitFrequency = (frequency) => {
 const validFrequencies = ['daily', 'weekly', 'monthly', 'custom'];
 
 const result = {
   isValid: false,
   errors: [],
 };

 if (!frequency) {
   result.errors.push('Habit frequency is required');
   return result;
 }

 if (!validFrequencies.includes(frequency)) {
   result.errors.push('Invalid habit frequency');
   return result;
 }

 result.isValid = true;
 return result;
};

/**
* Habit target validation
*/
export const validateHabitTarget = (target, frequency) => {
 const result = {
   isValid: false,
   errors: [],
 };

 if (!target && target !== 0) {
   result.errors.push('Target is required');
   return result;
 }

 if (typeof target !== 'number') {
   result.errors.push('Target must be a number');
   return result;
 }

 if (target < 1) {
   result.errors.push('Target must be at least 1');
   return result;
 }

 // Set reasonable upper limits based on frequency
 let maxTarget;
 switch (frequency) {
   case 'daily':
     maxTarget = 50;
     break;
   case 'weekly':
     maxTarget = 100;
     break;
   case 'monthly':
     maxTarget = 500;
     break;
   default:
     maxTarget = 1000;
 }

 if (target > maxTarget) {
   result.errors.push(`Target cannot exceed ${maxTarget} for ${frequency} frequency`);
   return result;
 }

 result.isValid = true;
 return result;
};

/**
* Form validation helper
*/
export const validateForm = (formData, validationRules) => {
 const result = {
   isValid: true,
   errors: {},
   fieldErrors: {},
 };

 Object.keys(validationRules).forEach(fieldName => {
   const fieldValue = formData[fieldName];
   const validationFunction = validationRules[fieldName];
   
   if (typeof validationFunction === 'function') {
     const fieldResult = validationFunction(fieldValue);
     
     if (!fieldResult.isValid) {
       result.isValid = false;
       result.fieldErrors[fieldName] = fieldResult.errors;
       result.errors[fieldName] = fieldResult.errors[0]; // First error for display
     }
   }
 });

 return result;
};

/**
* Get password strength color
*/
export const getPasswordStrengthColor = (strength) => {
 switch (strength) {
   case 'weak':
     return '#ff4444';
   case 'medium':
     return '#ff8800';
   case 'strong':
     return '#00cc44';
   default:
     return '#cccccc';
 }
};

/**
* Get password strength text
*/
export const getPasswordStrengthText = (strength) => {
 switch (strength) {
   case 'weak':
     return 'Weak';
   case 'medium':
     return 'Medium';
   case 'strong':
     return 'Strong';
   default:
     return '';
 }
};

/**
* Clean and sanitize input
*/
export const sanitizeInput = (input) => {
 if (typeof input !== 'string') {
   return input;
 }
 
 return input.trim().replace(/\s+/g, ' ');
};

/**
* Validate multiple fields at once
*/
export const validateMultipleFields = (fields) => {
 const results = {};
 let allValid = true;

 Object.keys(fields).forEach(fieldName => {
   const { value, validator, ...options } = fields[fieldName];
   const result = validator(value, options);
   results[fieldName] = result;
   
   if (!result.isValid) {
     allValid = false;
   }
 });

 return {
   isValid: allValid,
   results,
 };
};

/**
 * Default export with all validation functions
 */
export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateHabitName,
  validateHabitDescription,
  validateHabitFrequency,
  validateHabitTarget,
  validateForm,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  sanitizeInput,
  validateMultipleFields,
};