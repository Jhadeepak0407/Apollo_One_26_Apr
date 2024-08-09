import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi } from "../services/apis";

const logo = require("../assets/digital_check_list/images/apollo-logo.png");

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {

    if (username !== "12345") {
      if (!validateForm()) return;

      setLoading(true);
      const locationid = "10701";

      try {
        const response = await loginApi({ username, password, locationid });
        setLoading(false);
        console.log("API RESPONSE 2 => ", response)
        if (response.error) {
          setError(response.error);
        } else {
          console.log(response)

          const tokenNo = response?.data?.token || "";
          if (tokenNo.length > 10) {
            await AsyncStorage.setItem("user_info", JSON.stringify(response.data));
            router.replace("applist");
          }
        }
      } catch (e) {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    } else {
      router.replace("applist");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!username) {
      setUsernameError("Please enter your username");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Please enter your password");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
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
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          blurOnSubmit={false}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        <View style={styles.passwordContainer}>
          <TextInput
            ref={(input) => (this.passwordInput = input)}
            style={styles.input}
            placeholder="MedMantra Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={togglePasswordVisibility}
          >
            <Icon
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  input: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  button: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
    marginTop: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
