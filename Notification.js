// Notification.js
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

// Notification component definition
const Notification = ({ message, visible, onDismiss }) => {
  // Create a ref for the animated opacity value, initialized to 1 (fully visible)
  const opacity = useRef(new Animated.Value(1)).current;

  // Effect to handle the visibility and animation of the notification
  useEffect(() => {
    if (visible) {
      // Fade in animation when the notification becomes visible
      Animated.timing(opacity, {
        toValue: 1, // Target opacity value
        duration: 300, // Duration of the fade-in animation
        useNativeDriver: true, // Use native driver for better performance
      }).start();

      // Set a timer to fade out the notification after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0, // Target opacity value for fade out
          duration: 300, // Duration of the fade-out animation
          useNativeDriver: true, // Use native driver for better performance
        }).start(() => {
          onDismiss(); // Call the onDismiss function after fade out completes
        });
      }, 3000); // Show the notification for 3 seconds

      // Cleanup function to clear the timer on unmount or when visible changes
      return () => clearTimeout(timer);
    }
  }, [visible, opacity, onDismiss]); // Dependencies for the effect

  // If the notification is not visible, return null (do not render anything)
  if (!visible) return null;

  // Render the animated notification view
  return (
    <Animated.View style={[styles.notification, { opacity }]}>
      <Text style={styles.notificationText}>{message}</Text>
    </Animated.View>
  );
};

// Styles for the notification component
const styles = StyleSheet.create({
  notification: {
    position: 'absolute', // Position the notification absolutely
    top: 50, // Adjust this value to move the notification lower
    left: 20, // Add some left padding
    right: 20, // Add some right padding
    backgroundColor: 'rgba(255, 0, 0, 0.8)', // Red background for error
    padding: 15, // Padding inside the notification
    alignItems: 'center', // Center the text horizontally
    borderRadius: 10, // Add border radius for rounded corners
    zIndex: 1000, // Ensure the notification appears above other components
  },
  notificationText: {
    color: '#fff', // White text color
    fontWeight: 'bold', // Bold text
  },
});

// Export the Notification component
export default Notification;