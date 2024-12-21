import React from 'react';
import { View, Text, Modal, StyleSheet, Dimensions } from 'react-native';

// Function to show messages
const showMessage = (type, message) => {
  // This function will return the JSX that displays the message
  console.log("called")
  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.messageBox, type === 'success' ? styles.success : styles.error]}>
          <Text style={styles.title}>{type === 'success' ? 'Success!' : 'Error!'}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
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
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  success: {
    backgroundColor: '#28a745', // Green for success
  },
  error: {
    backgroundColor: '#dc3545', // Red for error
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
    color: '#fff', // White message text color
  },
});

export default showMessage;
