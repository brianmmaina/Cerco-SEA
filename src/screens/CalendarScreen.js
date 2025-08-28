import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  TouchableOpacity,
    ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext.js';

// Generate mock events for current dates
const generateMockEvents = () => {
  const today = new Date();
  const events = [];
  
  // Generate events for the next 7 days
  for (let i = 0; i < 7; i++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + i);
    const dateString = eventDate.toISOString().split('T')[0];
    
    // Add 1-2 events per day
    const numEvents = Math.floor(Math.random() * 2) + 1;
    
    for (let j = 0; j < numEvents; j++) {
      const eventTypes = [
        {
          title: 'Study Group - Computer Science',
          location: 'Mugar Library',
          time: '2:00 PM',
          description: 'Working on algorithms and data structures',
          category: 'Academic',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
        },
        {
          title: 'Coffee Meetup',
          location: 'Starbucks - BU Campus',
          time: '3:30 PM',
          description: 'Casual coffee and conversation',
          category: 'Social',
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
        },
        {
          title: 'Yoga in the Park',
          location: 'BU Beach',
          time: '6:00 AM',
          description: 'Start your day with mindfulness',
          category: 'Wellness',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        },
        {
          title: 'Music Jam Session',
          location: 'College of Fine Arts',
          time: '8:00 PM',
          description: 'Bring your instruments!',
          category: 'Arts',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        },
        {
          title: 'BU Basketball Game',
          location: 'Agganis Arena',
          time: '7:00 PM',
          description: 'Come support the Terriers!',
          category: 'Sports',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
        },
      ];
      
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const attendees = Math.floor(Math.random() * 200) + 5;
      
      events.push({
        id: `${dateString}-${j}`,
        ...eventType,
        date: dateString,
        attendees,
      });
    }
  }
  
  return events;
};

const mockEvents = generateMockEvents();

const CalendarDay = ({ day, date: _date, isSelected, hasEvents, onPress, isWeekView = true, isToday = false }) => {
  const { theme } = useTheme();

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatDayText = () => {
    if (isWeekView) {
      return `${day.name} ${day.number}${getDaySuffix(day.number)}`;
    } else {
      return day.number.toString();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        {
          backgroundColor: isSelected ? theme.colors.primary : (isToday ? theme.colors.accentLight : 'transparent'),
          borderColor: hasEvents ? theme.colors.primary : (isToday ? theme.colors.accent : 'transparent'),
          minWidth: isWeekView ? 80 : 40,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.dayText,
        { 
          color: isSelected 
            ? theme.colors.textInverse 
            : (isToday ? theme.colors.accent : theme.colors.textPrimary),
          fontSize: isWeekView ? 12 : 14,
          fontWeight: isToday ? 'bold' : 'normal',
        }
      ]}>
        {formatDayText()}
      </Text>
      {hasEvents && (
        <View style={[
          styles.eventDot,
          { 
            backgroundColor: isSelected 
              ? theme.colors.textInverse 
              : theme.colors.primary 
          }
        ]} />
      )}
    </TouchableOpacity>
  );
};

const EventCard = ({ event, onPress }) => {
  const { theme } = useTheme();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Sports':
        return theme.colors.primary;
      case 'Academic':
        return theme.colors.accent;
      case 'Social':
        return theme.colors.secondary;
      case 'Wellness':
        return theme.colors.accentLight;
      case 'Arts':
        return theme.colors.primaryLight;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.eventCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        }
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Text style={[styles.eventTitle, { color: theme.colors.textPrimary }]}>
              {event.title}
            </Text>
            <View style={styles.eventMeta}>
              <Ionicons 
                name="location-outline" 
                size={14} 
                color={theme.colors.textSecondary} 
              />
              <Text style={[styles.eventLocation, { color: theme.colors.textSecondary }]}>
                {event.location}
              </Text>
            </View>
          </View>
          
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(event.category) }
          ]}>
            <Text style={[styles.categoryText, { color: theme.colors.textInverse }]}>
              {event.category}
            </Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons 
              name="time-outline" 
              size={14} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
              {event.time}
            </Text>
          </View>
          
          <View style={styles.attendees}>
            <Ionicons 
              name="people-outline" 
              size={14} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.attendeesText, { color: theme.colors.textSecondary }]}>
              {event.attendees}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CalendarScreen({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [selectedView, setSelectedView] = useState('week'); // 'week' or 'month'
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, 1 = next week, etc.
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); // 0 = current month, 1 = next month, etc.

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Generate calendar days for current week
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Apply week offset
    startOfWeek.setDate(startOfWeek.getDate() + (currentWeekOffset * 7));

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = mockEvents.some(event => event.date === dateString);
      const isToday = dateString === todayString;
      
      days.push({
        name: dayName,
        number: dayNumber,
        dateString,
        hasEvents,
        isToday,
      });
    }
    return days;
  };

  // Generate calendar days for current month
  const generateMonthDays = () => {
    const days = [];
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);
    const firstDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const startOfWeek = new Date(firstDayOfMonth);
    startOfWeek.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    // Generate 6 weeks (42 days) to fill the calendar
    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayNumber = date.getDate();
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = mockEvents.some(event => event.date === dateString);
      const isCurrentMonth = date.getMonth() === targetMonth.getMonth();
      const isToday = dateString === todayString;
      
      days.push({
        number: dayNumber,
        dateString,
        hasEvents,
        isCurrentMonth,
        isToday,
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();
  const monthDays = generateMonthDays();

  const getEventsForDate = (date) => {
    return mockEvents.filter(event => event.date === date);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { event });
    };

    return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.background,
        paddingTop: Math.max(insets.top - 40, 10),
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Calendar
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.viewToggle,
              { 
                backgroundColor: selectedView === 'week' 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedView('week')}
          >
            <Text style={[
              styles.viewToggleText,
              { 
                color: selectedView === 'week' 
                  ? theme.colors.textInverse 
                  : theme.colors.textPrimary 
              }
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.viewToggle,
              { 
                backgroundColor: selectedView === 'month' 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedView('month')}
          >
            <Text style={[
              styles.viewToggleText,
              { 
                color: selectedView === 'month' 
                  ? theme.colors.textInverse 
                  : theme.colors.textPrimary 
              }
            ]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar */}
      <View style={[
        styles.calendarContainer,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        }
      ]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              if (selectedView === 'week') {
                setCurrentWeekOffset(prev => prev - 1);
              } else {
                setCurrentMonthOffset(prev => prev - 1);
              }
            }}
          >
            <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <Text style={[styles.monthYear, { color: theme.colors.textPrimary }]}>
            {selectedView === 'week' 
              ? `Week of ${weekDays[0]?.dateString ? new Date(weekDays[0].dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}`
              : `${currentMonth} ${currentYear}`
            }
          </Text>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              if (selectedView === 'week') {
                setCurrentWeekOffset(prev => prev + 1);
              } else {
                setCurrentMonthOffset(prev => prev + 1);
              }
            }}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.todayButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => {
            setSelectedDate(todayString);
            setCurrentWeekOffset(0);
            setCurrentMonthOffset(0);
          }}
        >
          <Text style={[styles.todayButtonText, { color: theme.colors.textInverse }]}>
            Today
          </Text>
        </TouchableOpacity>

        {selectedView === 'week' ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarGrid}
          >
            {weekDays.map((day, index) => (
              <CalendarDay
                key={index}
                day={day}
                isSelected={selectedDate === day.dateString}
                hasEvents={day.hasEvents}
                onPress={() => setSelectedDate(day.dateString)}
                isWeekView={true}
                isToday={day.isToday}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.monthGrid}>
            {/* Day headers */}
            <View style={styles.monthDayHeaders}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <Text key={index} style={[styles.monthDayHeader, { color: theme.colors.textSecondary }]}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Month days */}
            <View style={styles.monthDaysGrid}>
              {monthDays.map((day, index) => (
                <CalendarDay
                  key={index}
                  day={day}
                  isSelected={selectedDate === day.dateString}
                  hasEvents={day.hasEvents}
                  onPress={() => setSelectedDate(day.dateString)}
                  isWeekView={false}
                  isToday={day.isToday}
                />
              ))}
            </View>
          </View>
        )}
            </View>

      {/* Events List */}
      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <Text style={[styles.eventsTitle, { color: theme.colors.textPrimary }]}>
            {selectedDateEvents.length > 0 
              ? `${selectedDateEvents.length} Event${selectedDateEvents.length > 1 ? 's' : ''}`
              : 'No Events'
            }
                </Text>
          <Text style={[styles.selectedDate, { color: theme.colors.textSecondary }]}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
                        </Text>
                    </View>

                    <ScrollView
          style={styles.eventsList}
                        showsVerticalScrollIndicator={false}
        >
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onPress={() => handleEventPress(event)} 
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name="calendar-outline" 
                size={48} 
                color={theme.colors.textTertiary} 
              />
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                No events scheduled for this date
              </Text>
                            <TouchableOpacity
                style={[
                  styles.createEventButton,
                  { 
                    backgroundColor: theme.colors.primary,
                    ...theme.shadows.sm,
                  }
                ]}
                onPress={() => navigation.navigate('Create')}
              >
                <Text style={[styles.createEventButtonText, { color: theme.colors.textInverse }]}>
                  Create Event
                                            </Text>
                            </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
        paddingHorizontal: 24,
    paddingTop: 60, // Added status bar padding
        paddingBottom: 16,
    },
    headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  viewToggleText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  calendarContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  monthYear: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
  },
  calendarGrid: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 8,
  },
  monthGrid: {
    // Month view layout
  },
  monthDayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  monthDayHeader: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    width: 40,
    textAlign: 'center',
  },
  monthDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDay: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 80,
        marginBottom: 8,
    },
  dayText: {
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventsSection: {
        flex: 1,
        paddingHorizontal: 24,
  },
  eventsHeader: {
    marginBottom: 16,
    },
    eventsTitle: {
        fontSize: 20,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
  },
  selectedDate: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  eventsList: {
    flex: 1,
    paddingBottom: 160, // Increased bottom padding for better tab bar clearance
    },
    eventCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  eventContent: {
    flex: 1,
        padding: 16,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    alignItems: 'flex-start',
        marginBottom: 8,
    },
  eventInfo: {
    flex: 1,
    marginRight: 12,
    },
    eventTitle: {
        fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventLocation: {
        fontSize: 12,
    fontFamily: 'Inter_400Regular',
        marginLeft: 4,
    },
    categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
        borderRadius: 8,
    },
    categoryText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginLeft: 4,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
        fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginLeft: 4,
    },
  emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    paddingVertical: 60,
    },
  emptyStateText: {
        fontSize: 16,
    fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        marginTop: 16,
    marginBottom: 24,
  },
  createEventButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createEventButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    },
});