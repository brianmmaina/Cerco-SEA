import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';
import { useComments } from '../context/CommentsContext.js';
import { useAuth } from '../context/AuthContext.js';
import CommentInput from '../components/CommentInput.js';

// Default avatar for users without profile pictures
const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face';

const CommentItem = ({ comment, onDelete, isOwnComment }) => {
  const { theme } = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(comment.id) },
      ]
    );
  };

  return (
    <View style={styles.commentItem}>
      <Image 
        source={{ uri: comment.userAvatar || defaultAvatar }} 
        style={styles.commentAvatar} 
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentUser, { color: theme.colors.textPrimary }]}>
            {comment.userName}
          </Text>
          <View style={styles.commentMeta}>
            <Text style={[styles.commentTime, { color: theme.colors.textTertiary }]}>
              {comment.timeAgo}
            </Text>
            {isOwnComment && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={14} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={[styles.commentText, { color: theme.colors.textSecondary }]}>
          {comment.comment}
        </Text>
      </View>
    </View>
  );
};

export default function EventDetailsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getCommentsForEvent, addComment, deleteComment, refreshCommentTimes } = useComments();
  const { event } = route.params;
  const [isJoined, setIsJoined] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get comments for this event
  const eventComments = getCommentsForEvent(event.id);

  // Refresh comment times periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCommentTimes();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [refreshCommentTimes]);

  const handleJoinEvent = () => {
    setIsJoined(!isJoined);
    // In a real app, this would update the backend
  };

  const handleShareEvent = () => {
    // In a real app, this would open share dialog
    console.log('Share event:', event.title);
  };

  const handleAddComment = async (commentText) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to comment');
      return;
    }

    setIsSubmitting(true);
    const result = await addComment(event.id, commentText);
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await deleteComment(event.id, commentId);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to delete comment');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.textPrimary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareEvent}
          >
            <Ionicons 
              name="share-outline" 
              size={24} 
              color={theme.colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>

        {/* Event Image */}
        <Image source={{ uri: event.image }} style={styles.eventImage} />

        {/* Event Content */}
        <View style={styles.content}>
          {/* Event Header */}
          <View style={styles.eventHeader}>
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: theme.colors.textPrimary }]}>
                {event.title}
              </Text>
              <View style={styles.eventMeta}>
                <Ionicons 
                  name="location-outline" 
                  size={16} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={[styles.eventLocation, { color: theme.colors.textSecondary }]}>
                  {event.location}
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.categoryBadge,
              { backgroundColor: theme.colors.primary }
            ]}>
              <Text style={[styles.categoryText, { color: theme.colors.textInverse }]}>
                {event.category}
              </Text>
            </View>
          </View>

          {/* Event Description */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              About This Event
            </Text>
            <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]}>
              {event.description}
            </Text>
          </View>

          {/* Event Details */}
          <View style={[
            styles.detailsSection,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              ...theme.shadows.sm,
            }
          ]}>
            <View style={styles.detailItem}>
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={theme.colors.primary} 
              />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Date & Time
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                  {event.date} at {event.time}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Ionicons 
                name="people-outline" 
                size={20} 
                color={theme.colors.primary} 
              />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Attendees
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                  {event.attendees} people
                </Text>
              </View>
            </View>
          </View>

          {/* Comments Preview */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Comments ({eventComments.length})
              </Text>
              {eventComments.length > 2 && (
                <TouchableOpacity onPress={() => setShowComments(true)}>
                  <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                    View All
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {eventComments.length > 0 ? (
              eventComments.slice(0, 2).map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onDelete={handleDeleteComment}
                  isOwnComment={user && comment.userId === user.id}
                />
              ))
            ) : (
              <Text style={[styles.noCommentsText, { color: theme.colors.textTertiary }]}>
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[
        styles.actionBar,
        { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          ...theme.shadows.md,
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.commentButton,
            { 
              backgroundColor: theme.colors.surfaceSecondary,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setShowComments(true)}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={20} 
            color={theme.colors.textSecondary} 
          />
          <Text style={[styles.commentButtonText, { color: theme.colors.textSecondary }]}>
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.joinButton,
            { 
              backgroundColor: isJoined ? theme.colors.surfaceSecondary : theme.colors.primary,
              borderColor: isJoined ? theme.colors.border : theme.colors.primary,
            }
          ]}
          onPress={handleJoinEvent}
        >
          <Ionicons 
            name={isJoined ? "checkmark" : "add"} 
            size={20} 
            color={isJoined ? theme.colors.textSecondary : theme.colors.textInverse} 
          />
          <Text style={[
            styles.joinButtonText, 
            { 
              color: isJoined ? theme.colors.textSecondary : theme.colors.textInverse 
            }
          ]}>
            {isJoined ? 'Joined' : 'Join Event'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Ionicons 
                name="close" 
                size={24} 
                color={theme.colors.textPrimary} 
              />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Comments
            </Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.commentsList}>
            {eventComments.length > 0 ? (
              eventComments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onDelete={handleDeleteComment}
                  isOwnComment={user && comment.userId === user.id}
                />
              ))
            ) : (
              <View style={styles.emptyCommentsContainer}>
                <Ionicons 
                  name="chatbubble-outline" 
                  size={48} 
                  color={theme.colors.textTertiary} 
                />
                <Text style={[styles.emptyCommentsText, { color: theme.colors.textTertiary }]}>
                  No comments yet
                </Text>
                <Text style={[styles.emptyCommentsSubtext, { color: theme.colors.textTertiary }]}>
                  Be the first to share your thoughts!
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Comment Input */}
          <CommentInput 
            onSubmit={handleAddComment}
            disabled={isSubmitting}
            placeholder="Add a comment..."
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 152,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: 'absolute',
    top: 60, // Added status bar padding
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  eventImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  eventInfo: {
    flex: 1,
    marginRight: 16,
  },
  eventTitle: {
    fontSize: 28,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginLeft: 6,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 12,
  },
  eventDescription: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  detailsSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  commentsSection: {
    marginBottom: 24,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  commentUser: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  actionBar: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
  },
  commentButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 6,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    flex: 2,
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
  },
  placeholder: {
    width: 24,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  noCommentsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCommentsText: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
}); 