import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { checkIn, checkOut, fetchVisitorDetails, getIVRCall } from "../../services/Utils/api/axiosAPI";
import { Stack, useLocalSearchParams } from "expo-router";
import showToast from "../../services/Utils/toasts/toastConfig";
import Toast from "react-native-toast-message";
import { useNavigation } from 'expo-router';

export default function App() {
  const [visitorPassData, setVisitorPassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const [dataLoading, setDataLoading] = useState(true);

  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [loadingIVRCall, setLoadingIVRCall] = useState(false);
  const navigation = useNavigation(); // Navigation from expo-router


  const API_ENDPOINTS = {
    visitorDetails: "http://10.10.9.89:203/api/DigitalPass/Visitor",
    ivrCall: "http://10.10.9.89:203/api/DigitalPass/IVR",
    checkOut: "http://10.10.9.89:203/api/DigitalPass/CheckOut",
    checkIn: "http://10.10.9.89:203/api/DigitalPass/CheckIn",
    base: "http://10.10.9.89:203/api/DigitalPass"
  };

  const AUTH_KEY = params?.authKey || "FAAECC74-ED13-4EEB-8F9B-D4CC8A2FDA85";
  // const AUTH_KEY = 'BBA7BFC8-AAD7-46DB-9779-AAA5AF231E36'
  const delip = visitorPassData[0]?.ipid || 'DELIP482114';

  const getVisitorDetails2 = async () => {
    try {
      const response = await fetchVisitorDetails(API_ENDPOINTS.visitorDetails, AUTH_KEY);
      setVisitorPassData(response);

    } catch (error) {

    } finally {
    }
  };

  // Fetch Visitor Details on Page Load
  useEffect(() => {


    const getVisitorDetails = async () => {
      try {
        setDataLoading(true);

        const response = await fetchVisitorDetails(API_ENDPOINTS.visitorDetails, AUTH_KEY);

        setVisitorPassData(response);

        if (response && response[0].pass_Type === 'Ward') {
          console.log(1);
          // Update the title if the pass type is '24 Hrs'
          navigation.setOptions({
            title: 'PATIENT VISITOR PASS', // Dynamic title based on pass type
          });
        }

        else if (response && response[0].pass_Type === 'ICU') {
          navigation.setOptions({
            title: ' E - ICU PASS', // Dynamic title based on pass type
          });
        }

        else {
          console.log(2);

          // Default title if the pass type is different
          navigation.setOptions({
            title: 'PATIENT ATTENDANT PASS',
          });
        }
        setDataLoading(false);

      } catch (error) {
        setDataLoading(false);

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


      const phoneNumber = visitorPassData[0]?.attendantNo || "8700871587";
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
    } catch (error) {
      setLoadingIVRCall(false);
      setLoading(false);

    }
  };

  // Handle Checkout
  const handleCheckOut = async () => {
    try {
      setLoadingCheckOut(true);
      setLoading(true);


      const passType = visitorPassData[0]?.pass_Type;
      console.log(passType);
      const response = await checkOut(API_ENDPOINTS.base, AUTH_KEY, passType);
      console.log("response" , response)
      if (response === "Success") {

        showToast('success', 'Checked Out Successfully', '', text1color = 'green');

        getVisitorDetails2();
        // Show Toast message after successful checkout

        setLoadingCheckOut(false);
        setLoading(false);

      }

      else if (response==="No Records Updated")  {
        showToast('success', 'There is not attendant for check out', '', text1color = 'red');

        getVisitorDetails2();
        // Show Toast message after successful checkout

        setLoadingCheckOut(false);
        setLoading(false);
      }
    } catch (error) {
      showToast('error', 'Checkout Failed', '', text1color = 'red');

      // Optionally, you can show an error message in the toast
      setLoadingCheckOut(false);
      setLoading(false);


    }
  };

  // Handle CheckIn
  const handleCheckIn = async () => {
    try {
      setLoadingCheckIn(true);
      setLoading(true);

      const passType = visitorPassData[0]?.pass_Type;
      console.log('Pass Type (Check IN) = >', passType)
      const response = await checkIn(API_ENDPOINTS.base, AUTH_KEY, delip, passType);

      if (response.status === "Success") {
        showToast('success', 'Checked In Successfully', '', 'blue');

        getVisitorDetails2(); // Ensure this is awaited if it's async
        setLoadingCheckIn(false);
        setLoading(false);
      } else {
        showToast('error', response?.message, '', 'blue');
        setLoadingCheckIn(false);
        setLoading(false);
      }

    } catch (error) {
      showToast('error', 'Checkin Failed', 'An error occurred during checkin. Please try again.', 'blue');
      setLoadingCheckIn(false);
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4C00" />
      </View>
    );
  }

  return (

    visitorPassData.length > 0 && visitorPassData[0]?.pass_Type == 'ICU' ?



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
                <Text style={styles.infoLabel}>Requested Date Time :</Text>
                <Text style={styles.infoValue}>{visitorPassData[0].createD_ON}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Validity :</Text>
                <Text style={styles.infoValue}>{visitorPassData[0].valiD_TILL}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Requested By :</Text>
                <Text style={styles.infoValue}>{visitorPassData[0].createD_BY}</Text>
              </View>

              {visitorPassData[0].checked_in_date != "" &&
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Checked In :</Text>
                  <Text style={styles.infoValue}>{visitorPassData[0].checked_in_date}</Text>
                </View>}

              {visitorPassData[0].checked_out_date != "" &&
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Checked Out :</Text>
                  <Text style={styles.infoValue}>{visitorPassData[0].checked_out_date}</Text>
                </View>}

            </View>

            <View style={styles.icuButtonContainer}>
              {/* Check-In Button */}
              {visitorPassData[0].checked_in_date == "" && (
                <TouchableOpacity
                  style={styles.checkInButton}
                  disabled={loading}
                  onPress={() => handleCheckIn()}
                >
                  {loadingCheckIn ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.icuButtonText}>Check In</Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Check-Out Button */}
              {visitorPassData[0].checked_in_date != "" &&
                visitorPassData[0].checked_out_date == "" && (
                  <>
                    <Text style={styles.icuPassText}>Checked In</Text>
                    <TouchableOpacity
                      style={styles.checkOutButton}
                      disabled={loading}
                      onPress={() => handleCheckOut()}
                    >
                      {loadingCheckOut ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.icuButtonText}>Check Out</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}

              {/* Checked-Out Text */}
              {visitorPassData[0].checked_out_date != "" && (
                <>
                  <Text style={styles.icuPassText}>Checked Out</Text>
                </>
              )}
            </View>

          </>
        )}



        <Toast ref={Toast.setRef} />


      </View>



      :


      visitorPassData.length > 0 ?

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

          {visitorPassData.length > 0 && (
            <>
              <Text style={styles.passNo}>
                Pass No: <Text style={styles.passNoHighlight}>{visitorPassData[0].passid}</Text>
              </Text>

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
                  <Text style={styles.infoLabel}>Validity :</Text>
                  <Text style={styles.infoValue}>
                    {visitorPassData[0].pass_Type == '24 Hrs' ? 'Till Discharge' : (visitorPassData[0].valiD_TILL)}
                  </Text>
                </View>

                {
                  visitorPassData[0].pass_Type == '24 Hrs' ? null : (
                    <>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Max. Attendants :</Text>
                        <Text style={styles.infoValue}>{visitorPassData[0].allowedVistor}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Attendants Visited :</Text>
                        <Text style={styles.infoValue}>{visitorPassData[0].no_of_visitor}</Text>
                      </View>
                    </>
                  )
                }

              </View>

              {/* Scrollable List */}
              {visitorPassData[0].no_of_visitor > 0 && visitorPassData[0].attendantLabel != '' > 0 ? (
                <ScrollView style={styles.listContainer}>
                  {visitorPassData.map((visitor, index) => (
                    <View key={index} style={styles.attendantContainer}>
                      <Text style={styles.attendantText}>{visitor.attendantLabel} :</Text>
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
          {visitorPassData[0]?.pass_Type == 'Ward' ? <View style={styles.buttonContainer}>
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
          </View> :

            <View style={styles.attendantButtonContainer}>
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

            </View>}





          {/* Toast Message */}
          {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
          <Toast ref={Toast.setRef} />


        </View>

        :

        <View style={styles.invalidPassTextcontainer}>
          <Text style={styles.invalidPassText}>INVALID PASS</Text>
        </View>

  );
}

const styles = StyleSheet.create({

  icuButtonContainer: {
    marginTop: 20, // Space above the button
    alignItems: 'center', // Centers horizontally
  },
  invalidPassTextcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
  },
  invalidPassText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000', // Red color for the text
    textAlign: 'center',
  },
  icuPassText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff0000', // Red color for the text
    textAlign: 'center',
    marginBottom: 15
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  icuButton: {
    backgroundColor: '#007bff', // Button color
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 8, // Rounded corners
    marginTop: 10
  },
  attendantButtonContainer: {
    flexDirection: 'row', // To arrange buttons side by side
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    gap: 15,
    marginTop: 20, // Optional, for spacing
  },
  icuButtonText: {
    color: '#fff', // Text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center text
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
  }, loadingContainer: {
    flex: 1, // Takes the full space available
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    backgroundColor: '#fff', // Optional: To set a background color
  },
});

