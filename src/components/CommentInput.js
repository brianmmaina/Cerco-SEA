import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';

export default function CommentInput({ onSubmit, placeholder = "Add a comment...", disabled = false }) {
  const { theme } = useTheme();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (!commentText.trim()) {
      return;
    }

    onSubmit(commentText.trim());
    setCommentText('');
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }
    ]}>
      <TextInput
        style={[
          styles.input,
          { 
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surfaceSecondary,
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        value={commentText}
        onChangeText={setCommentText}
        multiline
        maxLength={500}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          { 
            backgroundColor: commentText.trim() ? theme.colors.primary : theme.colors.surfaceSecondary,
            opacity: commentText.trim() && !disabled ? 1 : 0.5,
          }
        ]}
        onPress={handleSubmit}
        disabled={!commentText.trim() || disabled}
      >
        <Ionicons 
          name="send" 
          size={16} 
          color={commentText.trim() ? theme.colors.textInverse : theme.colors.textTertiary} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 