import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Notification from '../Notification';

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', visible: false });

  const handleLogin = async () => {
    // Check if email and password fields are filled
    if (!email && !password) {
      // Show notification to fill in all fields
      setNotification({ message: "Please fill in all fields.", visible: true });
      return;
    }
  
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Mark user as logged in upon successful sign in
      setIsLoggedIn(true);
    } catch (error) {
      // Handle any errors that occur during sign in
      handleLoginError(error);
    }
  };

  // Handle any errors that occur during sign in
  const handleLoginError = (error) => {
    // Initialize the error message with a default value
    let errorMessage = "An error occurred. Please try again.";
  
    // Check for specific Firebase error codes
    switch (error.code) {
      // Invalid email address
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      // Credentials are invalid
      case "auth/invalid-credential":
        errorMessage = "Incorrect email or password. Please try again.";
        break;
      // No password provided
      case "auth/missing-password":
        errorMessage = "Please enter a password.";
        break;
      // Fall back to the default error message
      default:
        errorMessage = error.message;
        break;
    }
  
    // Set the notification state to show the error message
    setNotification({ message: errorMessage, visible: true });
  };

  // Hide the notification when the user dismisses it
  const handleDismissNotification = () => {
    setNotification({ ...notification, visible: false });
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(173, 216, 230, 0.8)", "rgba(135, 206, 250, 0.8)"]}
        style={styles.overlay}
      >
        {/* Show a notification if the user encounters an error */}
        <Notification 
          message={notification.message} 
          visible={notification.visible} 
          onDismiss={handleDismissNotification} 
        />
        <View style={styles.container}>
          <Text style={styles.title}>
            Welcome back to <Text style={styles.lumenText}>Lumen</Text>,
          </Text>
          <View style={styles.formContainer}>
            {/* Input field for email address */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              {/* Input field for password */}
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              {/* Toggle button to show/hide password */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            {/* Login button with gradient background */}
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={["#4c9de3", "#72b8f5"]} // Bluish gradient for the button
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* Navigation link to the Signup screen */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.linkAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker overlay for contrast
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "left",
  },
  lumenText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    opacity: 0.9, // Glowing effect
  },
  formContainer: {
    width: "100%",
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Increased opacity for better visibility
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderWidth: 1, // Added border for clarity
    borderColor: "rgba(200, 200, 200, 0.8)", // Soft gray border for subtle contrast
  },
  input: {
    flex: 1,
    height: 50,
    color: "#000000",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    paddingTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: "#fff",
  },
  linkAction: {
    fontSize: 14,
    color: "#4c9de3",
    fontWeight: "bold",
  },
});

export default LoginScreen;
