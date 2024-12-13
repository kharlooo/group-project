import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Notification from '../Notification';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', visible: false });

  // Handle the sign up process
  const handleSignup = async () => {
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setNotification({ message: "Please fill in all fields.", visible: true });
      return;
    }

    if (password.length < 6) {
      setNotification({ message: "Password must be at least 6 characters long.", visible: true });
      return;
    }

    if (password !== confirmPassword) {
      setNotification({ message: "Passwords do not match.", visible: true });
      return;
    }

    try {
      // Attempt to create a new user account
      await createUserWithEmailAndPassword(auth, email, password);

      // If successful, show a success notification and navigate to the login screen after 3 seconds
      setNotification({ message: "Registration successful!", visible: true });
      setTimeout(() => {
        navigation.navigate("Login");
      }, 3000);
    } catch (error) {
      // If there's an error, handle it
      handleSignupError(error);
    }
  };

  // Handle any errors that occur during sign up
  const handleSignupError = (error) => {
    // Initialize the error message with a default value
    let errorMessage = "An error occurred. Please try again.";

    // Check for specific Firebase error codes
    switch (error.code) {
      case "auth/invalid-email":
        // Invalid email address
        errorMessage = "The email address is not valid.";
        break;
      case "auth/email-already-in-use":
        // Email address already in use
        errorMessage = "The email address is already in use.";
        break;
      case "auth/missing-email":
        // No email address provided
        errorMessage = "Please provide an email address.";
        break;
      default:
        // Fall back to the default error message
        errorMessage = error.message;
        break;
    }

    // Set the notification state to show the error message
    setNotification({ message: errorMessage, visible: true });
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
        {/* Show a notification if there's an error or success message */}
        <Notification 
          message={notification.message} 
          visible={notification.visible} 
          onDismiss={() => setNotification({ ...notification, visible: false })} 
        />
        <View style={styles.container}>
          <Text style={styles.title}>Get Started</Text>

          {/* Form container to hold the input fields and buttons */}
          <View style={styles.formContainer}>
            {/* Email input field */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password input field */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
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

            {/* Confirm Password input field */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

            {/* Sign up button */}
            <TouchableOpacity onPress={handleSignup}>
              <LinearGradient
                colors={["#ff7e5f", "#feb47b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Link to login screen if the user already has an account */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkAction}>Login</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker tint for contrast
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
    textAlign: "left", // Align text to the left
  },
  formContainer: {
    width: "100%",
    paddingBottom: 80, // Add spacing at the bottom
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
    justifyContent: "center", // Center-align the text
    marginTop: 15,
    paddingTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: "#fff",
  },
  linkAction: {
    fontSize: 14,
    color: "#ff7e5f",
    fontWeight: "bold",
  },
});

export default SignupScreen;
