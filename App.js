import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Navigation container for the app
import { createStackNavigator } from '@react-navigation/stack'; // Stack navigator for navigation between screens
import Homepage from './screens/Homepage'; // Homepage screen component
import AboutUs from './screens/AboutUs'; // About Us screen component
import LoginScreen from './screens/LoginScreen'; // Login screen component
import SignupScreen from './screens/SignupScreen'; // Signup screen component
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icon library for tab icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // Async storage for local data persistence

const Stack = createStackNavigator(); // Create a stack navigator

// Main App Component
export default function App() {
  // State to track whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State to track the currently selected tab (Home, About Us, Logout)
  const [selectedTab, setSelectedTab] = useState('Home');

  // State to manage the welcome message visibility
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Function to handle logout with confirmation dialog
  const handleLogout = (navigation) => {
    Alert.alert(
      "Confirm Logout", // Title of the dialog
      "Are you sure you want to log out?", // Message in the dialog
      [
        {
          text: "Cancel", // Option to cancel
          style: "cancel",
        },
        {
          text: "OK", // Option to confirm logout
          onPress: async () => {
            setIsLoggedIn(false); // Set logged-in state to false
            setShowWelcomeMessage(false); // Reset the welcome message state
            await AsyncStorage.removeItem('popupShown'); // Clear stored popup state
          },
        },
      ],
      { cancelable: false } // Prevent dismissal by tapping outside
    );
  };

  // Effect to check the login status and manage welcome message visibility
  useEffect(() => {
    const checkLoginStatus = async () => {
      const popupShown = await AsyncStorage.getItem('popupShown'); // Check if the popup was already shown
      if (isLoggedIn && !popupShown) {
        setShowWelcomeMessage(true); // Show the welcome message
        await AsyncStorage.setItem('popupShown', 'true'); // Mark popup as shown
      }
    };

    checkLoginStatus(); // Run the check on component mount and whenever `isLoggedIn` changes
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Conditional rendering of screens based on login status */}
        {!isLoggedIn ? (
          <>
            {/* Login Screen */}
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>

            {/* Signup Screen */}
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          /* Main Screen with tab navigation */
          <Stack.Screen name="Main">
            {(props) => (
              <View style={styles.container}>
                {/* Main content container */}
                <View style={styles.contentContainer}>
                  {/* Render Home or About Us based on the selected tab */}
                  {selectedTab === 'Home' ? (
                    <Homepage
                      showWelcomeMessage={showWelcomeMessage} // Pass welcome message state
                      setShowWelcomeMessage={setShowWelcomeMessage} // Pass setter to Homepage
                    />
                  ) : (
                    <AboutUs />
                  )}
                </View>

                {/* Tab navigation bar */}
                <View style={styles.tabContainer}>
                  {/* About Us Tab */}
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setSelectedTab('About Us')} // Switch to About Us tab
                  >
                    <Ionicons 
                      name="information-circle" 
                      size={24} 
                      color={selectedTab === 'About Us' ? '#4f9deb' : 'gray'} 
                    />
                    <Text style={selectedTab === 'About Us' ? styles.activeTabText : styles.tabText}>About Us</Text>
                  </TouchableOpacity>

                  {/* Home Tab (centered and larger) */}
                  <TouchableOpacity
                    style={styles.centerTab}
                    onPress={() => setSelectedTab('Home')} // Switch to Home tab
                  >
                    <Ionicons 
                      name="home" 
                      size={24} 
                      color={selectedTab === 'Home' ? '#4f9deb' : 'gray'} 
                    />
                    <Text style={selectedTab === 'Home' ? styles.activeTabText : styles.tabText}>Home</Text>
                  </TouchableOpacity>

                  {/* Logout Tab */}
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleLogout(props.navigation)} // Trigger logout
                  >
                    <Ionicons 
                      name="log-out" 
                      size={24} 
                      color={selectedTab === 'Logout' ? '#4f9deb' : 'gray'} 
                    />
                    <Text style={selectedTab === 'Logout' ? styles.activeTabText : styles.tabText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background color
  },
  contentContainer: {
    flex: 1, // Fill the available space
  },
  tabContainer: {
    flexDirection: 'row', // Arrange tabs horizontally
    justifyContent: 'center', // Center tabs horizontally
    borderRadius: 15, // Rounded corners for the tab bar
    marginHorizontal: 20, // Horizontal margin
    backgroundColor: '#fff', // White background for the tab bar
    paddingVertical: 10, // Vertical padding inside the tab bar
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    position: 'absolute', // Position at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Bring to the front
  },
  tab: {
    alignItems: 'center', // Center text and icons
    flex: 1, // Equal space for each tab
    paddingVertical: 5, // Vertical padding
  },
  centerTab: {
    flex: 2, // Make the Home tab larger
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5, // Vertical padding
  },
  tabText: {
    fontSize: 12, // Font size for tab labels
    color: 'gray', // Inactive tab text color
  },
  activeTabText: {
    fontSize: 12, // Font size for active tab labels
    color: '#4f9deb', // Active tab text color
  },
});
