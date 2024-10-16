import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    (async function () {
      try {
        let response = await AsyncStorage.getItem("auth");
        // console.log(" LocalStorage at Index Page => ", response);
        response = JSON.parse(response);
        const tokenNo = response?.token || "";
        if (tokenNo.length > 10) {
          router.replace("applist");
        } else {
          router.replace("login");
        }
      } catch (error)
       { 
        router.replace("login");
      }
    })();
  }, []);
}
