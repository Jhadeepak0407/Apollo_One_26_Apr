import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {View, StatusBar} from "react-native"

export default function Layout() {
  const [loaded, error] = useFonts({
    "Mullish": require("../assets/fonts/Mulish-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <View style={{
      flex:1
    }}>
      <StatusBar barStyle="light-content" backgroundColor="#000"/>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Provider>
    </View>
  );
}

