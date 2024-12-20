import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function App() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false); // Track layout readiness

  useEffect(() => {
    (async function () {
      try {
        let response = await AsyncStorage.getItem("auth");
        console.log("LocalStorage at Index Page =>", response);

        if (response) {
          response = JSON.parse(response);
          const tokenNo = response?.token || "";
          console.log("Parsed Token =>", tokenNo);

          if (tokenNo.length > 10) {
            router.replace("applist");
          } else {
            router.replace("login");
          }
        } else {
          console.log("No auth data found. Redirecting to login.");
          router.replace("login");
        }
      } catch (error) {
        console.error(
          "Error occurred while fetching or parsing auth data: ",
          error
        );
        router.replace("login");
      } finally {
        setIsReady(true); // Indicate layout is ready
      }
    })();
  }, []);

  if (!isReady) {
    return null; // Render nothing while preparing navigation
  }

  return null; // Render nothing as this component only handles redirection
}
