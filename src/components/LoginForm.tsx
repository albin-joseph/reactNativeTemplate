/**
 * Controlled Login Form Component
 * 
 * Interview Topics Demonstrated:
 * - Controlled inputs
 * - Form validation
 * - Error handling
 * - Accessibility
 * - Loading states
 * - Keyboard handling
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { LoginFormData, FormErrors } from '../../types';
import { api } from '../../services/api';

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 * Interview Point: Regex for email validation
 */
const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  return undefined;
};

/**
 * Validate password
 */
const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return undefined;
};

// ============================================
// COMPONENT
// ============================================

interface LoginFormProps {
  onSuccess?: (user: any) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // Error state
  const [errors, setErrors] = useState<FormErrors>({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for input focus management
  const passwordInputRef = useRef<TextInput>(null);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Handle input change
   * CRITICAL: Clear error when user starts typing
   */
  const handleChange = useCallback(
    (field: keyof LoginFormData) => (value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear field error on change
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Validate form
   * Interview Point: Show validation strategy
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle form submission
   * Interview Points:
   * - Async handling
   * - Error states
   * - Loading states
   * - Success callbacks
   */
  const handleSubmit = useCallback(async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.login(formData.email, formData.password);

      Alert.alert('Success', 'Login successful!');

      // Call success callback
      if (onSuccess) {
        onSuccess(response.user);
      }

      // Reset form
      setFormData({ email: '', password: '' });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSuccess]);

  /**
   * Handle "Next" button on email field
   * Interview Point: Smooth UX with keyboard navigation
   */
  const handleEmailSubmit = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor="#999999"
            value={formData.email}
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={handleEmailSubmit}
            editable={!isSubmitting}
            // Accessibility
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            ref={passwordInputRef}
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Enter your password"
            placeholderTextColor="#999999"
            value={formData.password}
            onChangeText={handleChange('password')}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!isSubmitting}
            // Accessibility
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
          accessibilityLabel="Login button"
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            Demo credentials: any email / password123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helperContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});
