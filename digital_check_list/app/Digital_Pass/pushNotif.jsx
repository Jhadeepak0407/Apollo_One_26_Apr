import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const PushMessage = () => {
  const [visible, setVisible] = useState(false);

  const showMessage = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false); // Hide after 3 seconds
    }, 3000);
  };

  return (
    <>
      {/* Button to trigger push message */}
      <TouchableOpacity onPress={showMessage} style={styles.triggerButton}>
        <Text style={styles.buttonText}>Show Push Message</Text>
      </TouchableOpacity>

      {/* Modal for Push Message */}
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.messageBox}>
            <Text style={styles.title}>Hello, NOOBDE!</Text>
            <Text style={styles.message}>
              This is a popup message that will close shortly. 🎉
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  messageBox: {
    width: Dimensions.get('window').width * 0.8, // Responsive width
    padding: 20,
    backgroundColor: '#333', // Dark background for the popup
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White title color
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#ddd', // Light grey message text color
  },
  triggerButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PushMessage;
