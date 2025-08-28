import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';
import { useComments } from '../context/CommentsContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function EventComments({ eventId, onCommentAdded }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getCommentsForEvent, addComment, deleteComment, updateCommentTimeAgo } = useComments();
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Get real comments for this event
  const comments = getCommentsForEvent(eventId);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to comment');
      return;
    }

    setIsLoading(true);
    try {
      const result = await addComment(eventId, newComment);

      if (result.success) {
        setNewComment('');
        if (onCommentAdded) {
          onCommentAdded(result.comment);
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to add comment');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async commentId => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteComment(eventId, commentId);
          if (!result.success) {
            Alert.alert('Error', result.error || 'Failed to delete comment');
          }
        },
      },
    ]);
  };

  const formatTimestamp = timestamp => {
    return updateCommentTimeAgo({ timestamp });
  };

  const canDeleteComment = comment => {
    return user && (comment.userId === user.id || user.isAdmin);
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Comments ({comments.length})
        </Text>
      </View>

      <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
        {displayedComments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
              No comments yet. Be the first to comment!
            </Text>
          </View>
        ) : (
          displayedComments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
                    {comment.userName}
                  </Text>
                  <Text style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
                    {formatTimestamp(comment.timestamp)}
                  </Text>
                </View>
                {canDeleteComment(comment) && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(comment.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.commentText, { color: theme.colors.textPrimary }]}>
                {comment.comment}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {comments.length > 3 && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowAllComments(!showAllComments)}
        >
          <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
            {showAllComments ? 'Show Less' : `Show ${comments.length - 3} More Comments`}
          </Text>
        </TouchableOpacity>
      )}

      {user && (
        <View style={styles.addCommentSection}>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.commentInput, { color: theme.colors.textPrimary }]}
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.textTertiary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: newComment.trim() ? theme.colors.primary : theme.colors.border,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={16}
                color={newComment.trim() ? theme.colors.textInverse : theme.colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  commentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  showMoreButton: {
    padding: 16,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addCommentSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    padding: 8,
    borderRadius: 16,
  },
});
