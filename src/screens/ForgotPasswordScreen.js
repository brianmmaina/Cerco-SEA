import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setIsLoading(true);
    const result = await resetPassword(email.trim());
    setIsLoading(false);
    if (result.success) {
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Reset Failed', result.error || 'Please try again later');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Enter your email to receive a reset link.</Text>

          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.textPrimary }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary, ...theme.shadows.md, opacity: isLoading ? 0.7 : 1 }]}
            onPress={handleReset}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>
              {isLoading ? 'Sending…' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  backButton: { position: 'absolute', top: 60, left: 16, padding: 8, zIndex: 10 },
  formContainer: { flex: 1, justifyContent: 'center', paddingTop: 60 },
  title: { fontSize: 24, fontFamily: 'Manrope_600SemiBold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 24, textAlign: 'center' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 24 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
  button: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 16, fontFamily: 'Inter_400Regular' },
});
