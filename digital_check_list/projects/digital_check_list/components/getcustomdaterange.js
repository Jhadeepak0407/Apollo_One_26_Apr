// import React, { useCallback, useEffect, useMemo } from "react";
// import {View,Text,StyleSheet,Pressable,ScrollView,Dimensions
// } from "react-native";
// import DatePickerView from "./CustomDatePicker";

// const formatDate = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const generateDateRange = (startDate, endDate) => {
//   const dates = {};
//   let currentDate = new Date(startDate);
//   const end = new Date(endDate);

//   while (currentDate <= end) {
//     const formattedDate = formatDate(currentDate);
//     dates[formattedDate] = {
//       color: "#d9d2f9",
//       textColor: "white",
//     };
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return dates;
// };

// const CustomDatePicker1 = ({ fromDate, toDate, setFromDate, setToDate }) => {
//   const [showDate, setShowDate] = React.useState(false);

//   const handleDayPress = useCallback((day) => {
//     const selectedDate = day.dateString;

//     if (!fromDate) {
//       setFromDate(selectedDate);
//       setToDate("");
//     } else if (!toDate && new Date(selectedDate) >= new Date(fromDate)) {
//       setToDate(selectedDate);
//     } else {
//       setFromDate(selectedDate);
//       setToDate("");
//     }
//   }, [fromDate, toDate, setFromDate, setToDate]);

//   const markedDates = useMemo(() => {
//     return {
//       [fromDate]: {
//         selected: true,
//         color: "#A490F6",
//         textColor: "white",
//       },
//       [toDate]: {
//         selected: true,
//         color: "#A490F6",
//         textColor: "white",
//       },
//     };
//   }, [fromDate, toDate]);

//   const handleDateToggle = useCallback(() => {
//     setShowDate((prevState) => !prevState);
//   }, []);

//   useEffect(() => {
//     console.log("fromDate => ", fromDate);
//     console.log("toDate => ", toDate);
//   }, [fromDate, toDate]);

//   const formatDate1 = useCallback((date) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   }, []);



//   return (
//     <View>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View style={styles.specificationsDetails}>
//           <Pressable onPress={handleDateToggle} style={{ flexDirection: "row" }}>
//             {fromDate && toDate ? (
//               <Text style={styles.date}>
//                 {formatDate1(new Date(fromDate))} - {formatDate1(new Date(toDate))}
//               </Text>
//             ) : (
//               <Text style={styles.date}>Select Dates</Text>
//             )}
//           </Pressable>
//         </View>
//       </ScrollView>
//       {showDate && (
//         <DatePickerView showDate={showDate}
//           handleDayPress={handleDayPress}
//           markedDates={markedDates}
//           setShowDate={setShowDate} />
//       )}
//     </View>
//   );
// };

// // Wrap the component with React.memo
// export default React.memo(CustomDatePicker1);

// // const styles = StyleSheet.create({
// //   specificationsDetails: {
// //     padding: 8,
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     borderColor: "#A490F6",
// //     backgroundColor: "#2C3E50",
// //     alignItems: "center",
// //     margin:1,
// //     width: '100%',
// //     justifyContent: "center",
// //     flexDirection: "row",
// //   },
// //   date: {
// //     fontSize: 16,
// //     color: "#333",
// //     padding: 5,
// //   },
// // });

// const styles = StyleSheet.create({
//   doneBtn: {
//     flexDirection: "row",
//     alignSelf: "flex-end",
//     paddingHorizontal: 20,
//     paddingVertical: 22,
//     gap: 30,
//   },
//   doneBtnTxt: {
//     fontWeight: "500",
//     color: "#A490F6",
//   },
//   specificationsDetails: {
//     flexDirection: "row",
//     gap: 5,
//   },
//   date: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#A490F6",
//     borderRadius: 20,
//     color: "#A490F6",
//     padding: 10,
//     position: "relative",
//     bottom: 1,
//   },
//   container: {
//     width: Dimensions.get("window").width - 20,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalView: {
//     marginTop: 50,
//     backgroundColor: "white",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     width: Dimensions.get("screen").width,
//     height: Dimensions.get("screen").height - 380,
//   },
// });



import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Animated } from "react-native";
import DatePickerView from "./CustomDatePicker";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateDateRange = (startDate, endDate) => {
  const dates = {};
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const formattedDate = formatDate(currentDate);
    dates[formattedDate] = {
      color: "#d9d2f9",
      textColor: "white",
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const CustomDatePicker1 = ({ fromDate, toDate, setFromDate, setToDate }) => {
  const [showDate, setShowDate] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleDayPress = useCallback((day) => {
    const selectedDate = day.dateString;

    if (!fromDate) {
      setFromDate(selectedDate);
      setToDate("");
    } else if (!toDate && new Date(selectedDate) >= new Date(fromDate)) {
      setToDate(selectedDate);
    } else {
      setFromDate(selectedDate);
      setToDate("");
    }
  }, [fromDate, toDate, setFromDate, setToDate]);

  const markedDates = useMemo(() => {
    if (fromDate && toDate) {
      return {
        ...generateDateRange(fromDate, toDate),
        [fromDate]: {
          selected: true,
          color: "#A490F6",
          textColor: "white",
        },
        [toDate]: {
          selected: true,
          color: "#A490F6",
          textColor: "white",
        },
      };
    } else {
      return {
        [fromDate]: {
          selected: true,
          color: "#A490F6",
          textColor: "white",
        },
      };
    }
  }, [fromDate, toDate]);

  const handleDateToggle = useCallback(() => {
    setShowDate((prevState) => !prevState);

    // 3D animation effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  useEffect(() => {
    console.log("fromDate => ", fromDate);
    console.log("toDate => ", toDate);
  }, [fromDate, toDate]);

  const formatDate1 = useCallback((date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.specificationsDetails}>
          <Pressable onPress={handleDateToggle} style={{ flexDirection: "row" }}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              {fromDate && toDate ? (
                <Text style={styles.date}>
                  {formatDate1(new Date(fromDate))} - {formatDate1(new Date(toDate))}
                </Text>
              ) : (
                <Text style={styles.date}>Select Dates</Text>
              )}
            </Animated.View>
          </Pressable>
        </View>
      </ScrollView>
      {showDate && (
        <DatePickerView
          showDate={showDate}
          handleDayPress={handleDayPress}
          markedDates={markedDates}
          setShowDate={setShowDate}
        />
      )}
    </View>
  );
};

// Wrap the component with React.memo
export default React.memo(CustomDatePicker1);

const styles = StyleSheet.create({
  specificationsDetails: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderTopRightRadius:8,
    borderColor: "#A490F6",
    //backgroundColor: "#2C3E50",
    alignItems: "center",
    margin: 1,
    width: '100%',
    justifyContent: "center",
    flexDirection: "row",
  },
  date: {
    fontSize: 16,
    color: "#333",
    padding: 5,
  },
  container: {
    width: Dimensions.get("window").width - 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginTop: 50,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height - 380,
  },
});



