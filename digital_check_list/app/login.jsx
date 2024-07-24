// loginpage.jsx
// npm install to install node_modules
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { View, TextInput, Button, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const logo = require('../assets/digital_check_list/images/apollo-logo.png');



const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('DELHI');
  const router = useRouter();

  const handleLogin = async ({ id }) => {

    try {
      const response = await fetch(
        `http://10.10.10.41:9001/api/Employee/GetEmployee?id=${id}`
      );
      let data = await response.json();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      console.log(data[0]?.EmployeeCode);

      if (data[0]?.EmployeeCode?.length === 6 || data[0]?.EmployeeCode?.length === 7) {
        router.replace("applist")
      }


    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logo} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="MedMantra Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="MedMantra Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={{
          width: "100%",
          borderRadius: 15,
          overflow: "hidden",
          backgroundColor: "red",
          height: 60,
          marginBottom: 10
        }}>
          <Picker
            selectedValue={location}
            style={styles.input}
            onValueChange={(itemValue) => setLocation(itemValue)}
          >
            <Picker.Item label="DELHI" value="DELHI" />
            <Picker.Item label="MUMBAI" value="MUMBAI" />
            <Picker.Item label="CHENNAI" value="CHENNAI" />
          </Picker>
        </View>
        <Pressable style={styles.button} onPress={() => handleLogin({ id: username })}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    //borderColor: '#ADD8E6',
    borderWidth: 1,
    borderRadius: 10,
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
  button: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    marginTop: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default LoginScreen;
