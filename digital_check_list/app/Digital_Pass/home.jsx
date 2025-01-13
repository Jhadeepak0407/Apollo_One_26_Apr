import { Camera, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { AppState, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Alert, Text, Button, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Overlay } from "./overlay";

export default function Home() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // State to control the camera visibility
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();


  const processQRCode = (data) => {
    if (data && !qrLock.current) {
      qrLock.current = false;
      setTimeout(async () => {
        try {
          console.log(data);

          // Parse the URL to extract the `authKey` parameter
          const url = new URL(data);
          const authKey = url.searchParams.get('authKey');

          if (authKey) {
            console.log("authKey:", authKey);

            // Redirect to the desired route with parameters
            router.navigate({
              pathname: "/Digital_Pass/passPage",
              params: {
                authKey: authKey,
              },
            });
          } else {
            throw new Error("authKey not found");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Invalid QR Code", "The scanned code is not a valid URL or authKey is missing.");
          qrLock.current = false;
        }
      }, 500);
    }
  };
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getPermissions();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (hasPermission === null) {
    return <SafeAreaView><Text>Requesting camera permissions...</Text></SafeAreaView>;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView>
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {/* Show Scan button centered initially */}
      {!isScanning && (
        <View style={styles.centeredButtonContainer}>
          <Button title="Scan" onPress={() => setIsScanning(true)} />
        </View>
      )}

      {/* Show CameraView and Overlay when isScanning is true */}
      {isScanning && (
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={({ data }) => {
              processQRCode(data); // Call the function here with the scanned data
            }}
          />

          <Overlay />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredButtonContainer: {
    flex: 1,
    justifyContent: "center", // Vertically center the button
    alignItems: "center", // Horizontally center the button
  },
});
