import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

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
    <SafeAreaProvider>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Provider>
    </SafeAreaProvider>
  );
}
