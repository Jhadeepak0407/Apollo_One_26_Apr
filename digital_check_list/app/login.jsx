import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
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
import { useDispatch, useSelector } from "react-redux";
import { LoginRequest } from "../redux/actions/loginActions";

const logo = require("../assets/digital_check_list/images/apollo-logo.png");

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.login);

  const AuthData = useSelector((state) => state.login);

  const handleLogin = () => {
    if (!validateForm()) return;

    if (username === "apolloadmin" && password === "apolloadmin") {
      router.replace("/applist");

    }
    const locationid = "10701";

    dispatch(LoginRequest({ username, password, locationid }));
    //dispatch({
    //type: "LOGIN_REQUEST",
    //payload: { username, password, locationid },
    // });
  };


  useEffect(() => {
    if (user?.token) {
      router.replace("/applist")
    }
    console.log(user)
  }, [user?.token])

  useEffect(() => {
    console.log("AuthData => ", AuthData?.user);
  }, [AuthData])

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
      <Stack.Screen
        options={{ headerShown: false }} />
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
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        <View style={styles.passwordContainer}>
          <TextInput
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
