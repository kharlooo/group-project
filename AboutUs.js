import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'; 

// Array of team members with details like name, role, image, and personal statement
const members = [
  {
    id: 1,
    name: 'Kharlo A. Valiente',
    role: 'Backend Developer',
    image: require('../assets/images/me.jpg'),
    statement: '"I’m all about building systems that scale and run smoothly. Backend is where the magic happens!"',
  },
  {
    id: 2,
    name: 'Shane Lyke T. Tagle',
    role: 'Project Manager',
    image: require('../assets/images/bb.jpg'),
    statement: '"I turn ideas into action. Keeping projects organized and running smoothly is my thing."',
  },
  {
    id: 3,
    name: 'Jennelyn Serante',
    role: 'User Insights Specialist',
    image: require('../assets/images/jen.jpg'),
    statement: '"I love getting into the minds of users and figuring out what makes them tick. It helps make everything we do more meaningful."',
  },
  {
    id: 4,
    name: 'Jahleel Sicup',
    role: 'Frontend Developer',
    image: require('../assets/images/jah.jpg'),
    statement: '"I make sure that the user experience is smooth, fun, and intuitive. If you can’t interact with it easily, I’m on it."',
  },
  {
    id: 5,
    name: 'Romnic Contamina',
    role: 'Database Administrator',
    image: require('../assets/images/nic.png'),
    statement: '"I keep the data flowing fast and smooth. Data security and performance are always top of mind."',
  },
  {
    id: 6,
    name: 'Mercy Burdios',
    role: 'UI/UX Developer',
    image: require('../assets/images/mercy.png'),
    statement: '"I’m here to make interfaces that users actually enjoy using. A seamless experience is my goal."',
  },
  {
    id: 7,
    name: 'Reynold Jr. Roncesvalles',
    role: 'Assurance Specialist',
    image: require('../assets/images/bro.jpg'),
    statement: '"Quality is everything. I’m the one making sure everything works as it should before it’s released."',
  },
  {
    id: 8,
    name: 'Jasmin Inidal',
    role: 'Release Manager',
    image: require('../assets/images/jas.jpg'),
    statement: '"I make sure we’re on track for smooth and timely releases. It’s all about staying organized and making sure nothing slips through the cracks."',
  },
];

const AboutUs = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [opacityAnim] = useState(new Animated.Value(0)); 
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      console.log("Notification shown"); // Log to console when component mounts for the first time
      hasMounted.current = true;
    }
    return () => {
      // Cleanup logic if necessary (currently empty)
    };
  }, []);

  // Open the modal for a specific team member
  const openModal = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
    // Animate opacity to fade in the modal
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close the modal with a fade-out animation
  const closeModal = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedMember(null);
    });
  };

  return (
    <LinearGradient
      colors={['#1e3c72', '#2a5298']} // Gradient background for the container
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.lumenText}>Lumen</Text>
      <Text style={styles.title}>The team behind Lumen</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false} // Hides vertical scroll indicator
      >
        {members.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={styles.card}
            onPress={() => openModal(member)} // Opens modal for the selected member
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']} // Gradient for individual team member card
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <Image style={styles.image} source={member.image} />
              <Text style={styles.name}>{member.name}</Text>
              <Text style={styles.role}>{member.role}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {modalVisible && selectedMember && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal} // Closes the modal if back button is pressed
        >
          <BlurView intensity={60} style={styles.blurView}>
            <Animated.View style={[styles.modalBox, { opacity: opacityAnim }]}>
              <Image style={styles.modalImage} source={selectedMember.image} />
              <Text style={styles.modalName}>{selectedMember.name}</Text>
              <Text style={styles.modalRole}>{selectedMember.role}</Text>
              <Text style={styles.modalStatement}>{selectedMember.statement}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close-circle" size={35} color="#333" /> 
                {/* Close button for the modal */}
              </TouchableOpacity>
            </Animated.View>
          </BlurView>
        </Modal>
      )}
    </LinearGradient>
  );
};

const { width } = Dimensions.get('window');

// Styles for various components
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lumenText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Adds shadow to text
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 70,
  },
  card: {
    borderRadius: 15,
    marginBottom: 20,
    width: width * 0.85, // Card width based on screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  role: {
    fontSize: 14,
    color: '#d9d9d9',
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: width * 0.9, // Modal width based on screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalRole: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  modalStatement: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'transparent',
    padding: 10,
    elevation: 4,
  },
});

export default AboutUs;
