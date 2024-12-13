import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Line, Path } from 'react-native-svg';
import { ref, get } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Homepage = () => {
  // State variables for the homepage component
  const [ledStatus, setLedStatus] = useState({ red: false, yellow: false, green: false });
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [selectedPattern, setSelectedPattern] = useState('leftToRight');
  const [playing, setPlaying] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // The IP address of your ESP32 board
  const esp32Url = 'http://192.168.28.123';

  // Fetch sensor data from the Realtime Database
  const fetchSensorData = async () => {
    try {
      // Get a reference to the sensorReading node in the Realtime Database
      const sensorRef = ref(rtdb, '/sensorReading');
      // Get the latest snapshot of the sensorReading node
      const snapshot = await get(sensorRef);
      // If the snapshot exists (i.e., sensor data is available)
      if (snapshot.exists()) {
        // Get the latest sensor data from the snapshot
        const data = snapshot.val();
        // Update the state with the latest sensor data
        setTemperature(data.temp);
        setHumidity(data.humid);
      } else {
        // If the snapshot does not exist, set the state to default values
        setTemperature(25);
        setHumidity(60);
      }
    } catch (error) {
      // If an error occurs while fetching sensor data, set the state to default values
      setTemperature(25);
      setHumidity(60);
    }
  };

  useEffect(() => {
    // Fetch sensor data every 5 seconds
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Listen to auth state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in
        console.log('User logged in:', user.email);
        setUserEmail(user.email);

        // Check if the popup has been shown in this session
        const popupShown = await AsyncStorage.getItem('popupShown');
        if (!popupShown) {
          // Show the popup and animate its fade in and out
          setShowWelcomeMessage(true);

          // Save flag to AsyncStorage to prevent showing it again
          await AsyncStorage.setItem('popupShown', 'true');

          // Fade in the popup notification
          Animated.timing(fadeAnim, {
            // Animate the opacity to 1
            toValue: 1,
            // Animation duration
            duration: 500,
            // Use native driver for smoother animation
            useNativeDriver: true,
          }).start();

          // After 3 seconds, fade out the popup
          setTimeout(() => {
            // Fade out the popup notification
            Animated.timing(fadeAnim, {
              // Animate the opacity to 0
              toValue: 0,
              // Animation duration
              duration: 500,
              // Use native driver for smoother animation
              useNativeDriver: true,
            }).start();

            // After the animation is complete, hide the popup
            setTimeout(() => {
              setShowWelcomeMessage(false);
              console.log('Popup notification hidden');
            }, 500);
          }, 3000);
        }
      } else {
        // No user is logged in
        setUserEmail('');
        setShowWelcomeMessage(false);
        console.log('No user logged in');
      }
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [fadeAnim]);

  // Function to toggle the LED state
  const toggleLed = async (color, state) => {
    // Determine the action based on the state
    const action = state ? 'on' : 'off';
    try {
      // Send a request to the ESP32 to control the LED
      const response = await fetch(`${esp32Url}/led/${color}/${action}`);
      const data = await response.text();
      // Log the LED status
      console.log(`${color} LED: ${data}`);
    } catch (error) {
      // Log any errors that occur
      console.error('Error controlling LED:', error);
    }
    // Update the LED status in the state
    setLedStatus((prevStatus) => ({
      ...prevStatus,
      [color]: state,
    }));
  };

  // A simple delay function that returns a promise that resolves after the given number of milliseconds
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const resetLeds = async () => {
    try {
      // Check which pattern is selected 
      if (selectedPattern === 'rightToLeft') {
        // Turn off LEDs in reverse order for right-to-left pattern
        await toggleLed('green', false);
        await delay(200);
        await toggleLed('yellow', false);
        await delay(200);
        await toggleLed('red', false);
      } else {
        // Default left-to-right pattern for turning off LEDs
        await toggleLed('red', false);
        await delay(200);
        await toggleLed('yellow', false);
        await delay(200);
        await toggleLed('green', false);
      }

      // Set playing state to false after LEDs are reset
      setPlaying(false);
    } catch (error) {
      // Log any errors that occur
      console.error('Error resetting LEDs:', error);
    }
  };
  

  const playPattern = () => {
    // Set playing state to true
    setPlaying(true);
    if (selectedPattern === 'leftToRight') {
      // Turn on red LED
      toggleLed('red', true);
      // Delay for 1 second
      setTimeout(() => {
        // Turn on yellow LED
        toggleLed('yellow', true);
      }, 1000);
      // Delay for 2 seconds
      setTimeout(() => {
        // Turn on green LED
        toggleLed('green', true);
      }, 2000);
      // Delay for 3 seconds
      setTimeout(() => {
        // Reset LEDs
        resetLeds();
      }, 3000);
    } else if (selectedPattern === 'rightToLeft') {
      // Turn on green LED
      toggleLed('green', true);
      // Delay for 1 second
      setTimeout(() => {
        // Turn on yellow LED
        toggleLed('yellow', true);
      }, 1000);
      // Delay for 2 seconds
      setTimeout(() => {
        // Turn on red LED
        toggleLed('red', true);
      }, 2000);
      // Delay for 3 seconds
      setTimeout(() => {
        // Reset LEDs
        resetLeds();
      }, 3000);
    }
  };

  const getButtonStyle = (color) => {
    // Object containing colors for each button state
    const buttonColors = {
      red: ['#ff7675', '#d63031'],
      yellow: ['#fdcb6e', '#e17055'],
      green: ['#55efc4', '#00cec9'],
    };

    // If the LED is on, return the color for the on state
    // Otherwise, return the color for the off state
    return ledStatus[color]
      ? buttonColors[color]
      : ['#dfe6e9', '#b2bec3'];
  };

  // GradientButton component definition
  const GradientButton = ({ color, children, onPress, disabled }) => (
    // TouchableOpacity provides a tactile feedback
    <TouchableOpacity onPress={onPress} disabled={disabled} style={{ borderRadius: 30 }}>
      {/* LinearGradient applies a gradient background */}
      <LinearGradient
        colors={getButtonStyle(color)} // Dynamic gradient colors based on LED status
        style={{
          width: 60, // Button width
          height: 60, // Button height
          borderRadius: 30, // Rounded corners
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          opacity: disabled ? 0.6 : 1, // Reduce opacity when disabled
        }}
      >
        {children} 
      </LinearGradient>
    </TouchableOpacity>
  );

  // Customizable gradient button component with a rounded rectangle shape
  const GradientPlayButton = ({ colors, children, onPress, disabled }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={{ borderRadius: 20 }}>
      <LinearGradient
        colors={colors}
        style={{
          padding: 15,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );


  return (
    // Background gradient fot the entire screen
    <LinearGradient
      colors={['#1e3c72', '#2a5298']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Show a welcome message with the user's email address when the component mounts and the user is logged in. The message fades out after 3 seconds. */}
      {showWelcomeMessage && (
        <Animated.View style={[styles.welcomeMessageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeMessage}>Welcome back, {userEmail}</Text>
        </Animated.View>
      )}

      <View style={styles.lumenHeader}>
        {/* The Lumen logo is a combination of a circle and three lines. The circle represents the lightbulb. */}
        <Svg height="50" width="50" viewBox="0 0 64 64" style={styles.logo}>
          <Circle cx="32" cy="20" r="12" fill="gold" />
          <Path
            d="M22,32c0,7.732,9,8,10,8s10-0.268,10-8"
            stroke="gold"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <Line x1="28" y1="40" x2="28" y2="48" stroke="gold" strokeWidth="4" />
          <Line x1="36" y1="40" x2="36" y2="48" stroke="gold" strokeWidth="4" />
        </Svg>
        <Text style={styles.lumenText}>Lumen</Text>
      </View>

      <View style={styles.circleContainer}>
        {/* Gradient circle for temperature */}
        <LinearGradient
          colors={['#ff7675', '#d63031']}
          style={styles.circle}
        >
          {/* Temperature text in the circle */}
          <Text style={styles.circleText}>{temperature}°C</Text>
          {/* Subtext for the temperature circle */}
          <Text style={styles.circleSubText}>Temp</Text>
        </LinearGradient>
        {/* Gradient circle for humidity */}
        <LinearGradient
          colors={['#00cec9', '#0984e3']}
          style={styles.circle}
        >
          {/* Humidity text in the circle */}
          <Text style={styles.circleText}>{humidity}%</Text>
          {/* Subtext for the humidity circle */}
          <Text style={styles.circleSubText}>Humidity</Text>
        </LinearGradient>
      </View>

      <View style={styles.ledButtonsContainer}>
        {/* Toggles the red LED when pressed. */}
        <GradientButton
          color="red"
          onPress={() => toggleLed('red', !ledStatus.red)}
        >
          <Text style={styles.ledButtonText}>Red</Text>
        </GradientButton>
        {/* Toggles the yellow LED when pressed. */}
        <GradientButton
          color="yellow"
          onPress={() => toggleLed('yellow', !ledStatus.yellow)}
        >
          <Text style={styles.ledButtonText}>Yellow</Text>
        </GradientButton>
        {/* Toggles the green LED when pressed. */}
        <GradientButton
          color="green"
          onPress={() => toggleLed('green', !ledStatus.green)}
        >
          <Text style={styles.ledButtonText}>Green</Text>
        </GradientButton>
      </View>

      <View style={styles.patternPlayContainer}>
        {/* Container for the pattern selection and play button */}
        <View style={styles.patternContainer}>
          {/* Label for the pattern selection */}
          <Text style={styles.patternLabel}>Select Pattern:</Text>
          {/* Picker component for pattern selection */}
          <Picker
            selectedValue={selectedPattern}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedPattern(itemValue)}
          >
            <Picker.Item label="Left to Right" value="leftToRight" />
            <Picker.Item label="Right to Left" value="rightToLeft" />
          </Picker>
        </View>
        {/* Gradient button for playing the pattern */}
        <GradientPlayButton
          colors={playing ? ['#b2bec3', '#636e72'] : ['#4f9deb', '#6c5ce7']}
          onPress={playPattern}
          disabled={playing}
        >
          {/* Text for the play button, changes when playing */}
          <Text style={styles.playButtonText}>{playing ? 'Playing...' : 'Play'}</Text>
        </GradientPlayButton>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeMessageContainer: {
    position: 'absolute',
    top: 50, 
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: '#2d3436',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  welcomeMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  lumenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    marginRight: 10,
  },
  lumenText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  circleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  circleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  circleSubText: {
    fontSize: 14,
    color: 'white',
  },
  ledButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  ledButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  patternPlayContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  patternContainer: {
    marginBottom: 20,
    width: '100%',
  },
  patternLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 55,
    backgroundColor: '#4f9deb',
    color: 'white',
    borderRadius: 10,
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Homepage;

