import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import {  } from 'expo-status-bar';
import {View, StatusBar} from "react-native"
export default function Layout() {
  return (
    <View style={{
      flex:1
    }}>
      <StatusBar barStyle="light-content" backgroundColor="#000"/>
      <Provider store={store}>
        <Stack />
      </Provider>
    </View>
  );
}
