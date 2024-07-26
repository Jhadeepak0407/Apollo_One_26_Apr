import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { View, TextInput, Button, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, StatusBar, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const logo = require('../assets/digital_check_list/images/apollo-logo.png');

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('10701');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await makeApiCall();
      handleResponse(response);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
    
   
  };

  const validateForm = () => {
    let isValid = true;

    if (!username) {
      setUsernameError('Please enter your username');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const makeApiCall = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: username,
      password: password,
      locationid: location
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return await fetch("http://10.10.9.89:202/api/Users/login", requestOptions);
  };

  const handleResponse = async (response) => {
    const data = await response.text();
    console.log(data);
    console.log(typeof data)
  };

  const handleError = (error) => {
    setError(error);
    console.error("Error during authentication:", error);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logo} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="MedMantra Username"
          value={username}
          onChangeText={setUsername}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="MedMantra Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={location}
            style={styles.input}
            onValueChange={(itemValue) => setLocation(itemValue)}
          >
            <Picker.Item label="DELHI" value="10701" />
            <Picker.Item label="MUMBAI" value="MUMBAI" />
            <Picker.Item label="CHENNAI" value="CHENNAI" />
          </Picker>
        </View>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    borderWidth: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  pickerContainer: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "red",
    height: 60,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    marginTop: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
