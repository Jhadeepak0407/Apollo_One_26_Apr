import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, StatusBar ,TouchableOpacity,Text} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={{
      flex: 1
    }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: true,
          }}
        >
 {/* <Stack.Screen name="Digital_Checklist_App/TriggeredChecklist" options={{
            title: "Triggered Checklist"
          }} />  */}

          <Stack.Screen
            name="applist"
            options={{ headerShown: false }} />
            

            <Stack.Screen
  name="Digital_Pass/passPage"
  options={{
    title: "Patient Visitor Pass",
    headerTitleAlign: 'center',  // Centers the title
  }}
/>
{/* <Stack.Screen
  name="Digital_Checklist_App/TypeofCheckList"
  options={{
    title: "Type of CheckList",
    headerTitleAlign: 'center',  // Centers the title
  }}
/> */}
           
        </Stack>
      </Provider>
    </SafeAreaView>
  );
}

