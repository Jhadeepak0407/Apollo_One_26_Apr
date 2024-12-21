import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { checkIn, checkOut, fetchVisitorDetails, getIVRCall } from "../../services/Utils/api/axiosAPI";
import { Stack, useLocalSearchParams } from "expo-router";
import showToast from "../../services/Utils/toasts/toastConfig";
import Toast from "react-native-toast-message";
import { faL } from "@fortawesome/free-solid-svg-icons";
export default function App() {
  const [visitorPassData, setVisitorPassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();

  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [loadingIVRCall, setLoadingIVRCall] = useState(false);


  const API_ENDPOINTS = {
    visitorDetails: "http://10.10.9.89:203/api/DigitalPass/Visitor",
    ivrCall: "http://10.10.9.89:203/api/DigitalPass/IVR",
    checkOut: "http://10.10.9.89:203/api/DigitalPass/CheckOut",
    checkIn: "http://10.10.9.89:203/api/DigitalPass/CheckIn",
    base: "http://10.10.9.89:203/api/DigitalPass"
  };

  console.log(params.authKey);
  const AUTH_KEY = params?.authKey || "FAAECC74-ED13-4EEB-8F9B-D4CC8A2FDA85";
  const delip = visitorPassData[0]?.ipid || 'DELIP482114';

  const getVisitorDetails2 = async () => {
    try {
      const response = await fetchVisitorDetails(API_ENDPOINTS.visitorDetails, AUTH_KEY);
      console.log("Visitor Details:");
      setVisitorPassData(response);
    } catch (error) {
      console.error("Error fetching visitor details:", error);
    } finally {
    }
  };

  // Fetch Visitor Details on Page Load
  useEffect(() => {


    const getVisitorDetails = async () => {
      try {
        const response = await fetchVisitorDetails(API_ENDPOINTS.visitorDetails, AUTH_KEY);
        console.log("Visitor Details:");
        setVisitorPassData(response);
      } catch (error) {
        console.error("Error fetching visitor details:", error);
      } finally {
      }
    };

    getVisitorDetails();
  }, []);

  // Trigger IVR Call
  const handleIVRCall = async () => {
    try {
      setLoadingIVRCall(true);
      setLoading(true);

      console.log(3)

      const phoneNumber = visitorPassData[0]?.attendantNo || "8700871587";
      console.log("Calling IVR for:", phoneNumber);
      const response = await getIVRCall(API_ENDPOINTS.ivrCall, phoneNumber);
      if (response === 'Fail') {
        showToast('error', 'IVR call failed', '', text1color = 'red');
        setLoadingIVRCall(false);
        setLoading(false);

      } else {
        showToast('success', 'IVR call sent', '', text1color = 'green');
        setLoadingIVRCall(false);
        setLoading(false);

      }
      console.log("IVR Call Response:", response);
    } catch (error) {
      console.error("Error during IVR Call:", error);
      setLoadingIVRCall(false);
      setLoading(false);

    }
  };

  // Handle Checkout
  const handleCheckOut = async () => {
    try {
      setLoadingCheckOut(true);
      setLoading(true);

      console.log(2)

      console.log("Checking out with auth key:", AUTH_KEY);
      const response = await checkOut(API_ENDPOINTS.checkOut, AUTH_KEY);
      console.log(response);
      if (response === "Success") {
        console.log("yes");
        showToast('success', 'Checked Out Successfully', '', text1color = 'green');

        getVisitorDetails2();
        // Show Toast message after successful checkout

        setLoadingCheckOut(false);
        setLoading(false);

      }
      console.log("Checkout Response:", response);
    } catch (error) {
      showToast('error', 'Checkout Failed', '', text1color = 'red');

      console.error("Error during checkout:", error);
      // Optionally, you can show an error message in the toast
      setLoadingCheckOut(false);
      setLoading(false);


    }
  };

  // Handle CheckIn
  const handleCheckIn = async () => {
    try {
      console.log(1)
      setLoadingCheckIn(true);
      setLoading(true);

      console.log("Checking In with auth key:", AUTH_KEY);
      const response = await checkIn(API_ENDPOINTS.base, AUTH_KEY, delip);

      if (response.status === "Success") {
        console.log("yes");
        showToast('success', 'Checked In Successfully', '', 'blue');

        getVisitorDetails2(); // Ensure this is awaited if it's async
        setLoadingCheckIn(false);
        setLoading(false);
      } else {
        showToast('error', response?.message, '', 'blue');
        setLoadingCheckIn(false);
        setLoading(false);
      }

      console.log("CheckIn Response:", response);
    } catch (error) {
      console.error("Error during checkin:", error);
      showToast('error', 'Checkin Failed', 'An error occurred during checkin. Please try again.', 'blue');
      setLoadingCheckIn(false);
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#FF4C00" />
  //       <Text style={styles.loadingText}>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RipEa9MhY8WHcfhOfMqaEPtBsymJARyteg&s",
          }}
          style={styles.logo}
        />
      </View>

      {/* Title */}
      {visitorPassData.length > 0 && (
        <>
          <Text style={styles.passNo}>
            Pass No: <Text style={styles.passNoHighlight}>{visitorPassData[0].passid}</Text>
          </Text>

          {/* Visitor Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IPID :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].ipid}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ward :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].ward}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bed :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].bed}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Doctor :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].doctor}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valid Till :</Text>
              <Text style={styles.infoValue}>
                {(visitorPassData[0].valiD_TILL)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Max. Attendants :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].allowedVistor}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Attendants Visited :</Text>
              <Text style={styles.infoValue}>{visitorPassData[0].no_of_visitor}</Text>
            </View>
          </View>

          {/* Scrollable List */}
          {visitorPassData[0].no_of_visitor > 0 ? (
            <ScrollView style={styles.listContainer}>
              {visitorPassData.map((visitor, index) => (
                <View key={index} style={styles.attendantContainer}>
                  <Text style={styles.attendantText}>{visitor.attendantLabel } :</Text>
                  <Text style={styles.attendantText}>{visitor.checked_in_time}</Text>
                  <View
                    style={[styles.attendantStatus, { backgroundColor: visitor.checked_out_time ? "green" : "blue" }]}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noVisitorsContainer}>
              <Text style={styles.noVisitorsText}>No attendants have visited yet.</Text>
            </View>
          )}
        </>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.checkInButton} onPress={() => handleCheckIn()} disabled={loading}>

          {loadingCheckIn ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Check In</Text>
          )}

        </TouchableOpacity>
        <TouchableOpacity style={styles.checkOutButton} onPress={() => handleCheckOut()} disabled={loading} >

          {loadingCheckOut ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Check Out</Text>
          )}

        </TouchableOpacity>
        <TouchableOpacity style={styles.ivrCallButton} onPress={() => handleIVRCall()} disabled={loading}>
          {loadingIVRCall ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>IVR Call</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Toast Message */}
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
      <Toast ref={Toast.setRef} />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 90,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  noVisitorsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVisitorsText: {
    fontSize: 18,
    color: "red",
  },
  passNo: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: "center",
    color: "#555",
  },
  passNoHighlight: {
    fontWeight: "bold",
    color: "#000",
  },
  infoContainer: {
    width: "100%",
    marginVertical: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
  listContainer: {
    height: 180,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  attendantContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  attendantText: {
    fontSize: 14,
    color: "#333",
  },
  attendantStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  checkInButton: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  checkOutButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  ivrCallButton: {
    backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
});

