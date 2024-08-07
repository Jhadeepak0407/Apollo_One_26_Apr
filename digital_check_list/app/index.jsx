import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    (async function () {
      try {
        let response = await AsyncStorage.getItem("user_info");
        response = JSON.parse(response);
        const tokenNo = response?.token || "";
        if (tokenNo.length > 10) {
          await AsyncStorage.setItem("user_info", JSON.stringify(response));
          router.replace("applist");
        } else {
          router.replace("login");
        }
      } catch (error) {
        router.replace("login");
      }
    })();
  }, []);
}
