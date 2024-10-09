import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

const generateDateRange = (startDate, endDate) => {
  const dates = {};
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates[formattedDate] = {
      color: "#d9d2f9",
      textColor: "white",
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const MyCalendar = () => {
  const [showDate, setShowDate] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;

    if (!selectedStartDate) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate("");
    } else if (
      !selectedEndDate &&
      new Date(selectedDate) >= new Date(selectedStartDate)
    ) {
      setSelectedEndDate(selectedDate);
    } else {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate("");
    }
  };

  const markedDates = {
    ...generateDateRange(selectedStartDate, selectedEndDate),
    [selectedStartDate]: {
      selected: true,
      color: "#A490F6", // Changed from Colors.listSecondaryBackground
      textColor: "white",
    },
    [selectedEndDate]: {
      selected: true,
      color: "#A490F6", // Changed from Colors.listSecondaryBackground
      textColor: "white",
    },
  };

  const handleDate = () => {
    setShowDate(!showDate);
  };

  return (
    <View style={{}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.specificationsDetails}>
          <Pressable onPress={handleDate} style={{ flexDirection: "row" }}>
            {showDate ? (
              <Text style={styles.date}>
                {selectedStartDate || "yy/mm/dd"} -{" "}
                {selectedEndDate || "yy/mm/dd"}
              </Text>
            ) : (
              <Text style={styles.date}>Select Dates</Text>
            )}
          </Pressable>
          <Text style={styles.friend}>Crowd - Friends</Text>
          <Text style={styles.friend}>
            {"N"} {"Days"} {/* Removed specification references */}
          </Text>
        </View>
      </ScrollView>
      {showDate && (
        <View style={styles.container}>
          <View style={styles.centeredView}>
            <Modal animationType="none" transparent={true} visible={showDate}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      width: Dimensions.get("window").width,
                    }}
                  >
                    <Calendar
                      onDayPress={handleDayPress}
                      markedDates={markedDates}
                      markingType={"period"}
                    />
                  </View>
                  <View style={styles.doneBtn}>
                    <Pressable onPress={() => setShowDate(false)}>
                      <Text style={styles.doneBtnTxt}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={() => setShowDate(false)}>
                      <Text style={styles.doneBtnTxt}>Done</Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      width: 112,
                      height: 5,
                      backgroundColor: "#F0EDF3",
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doneBtn: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingHorizontal: 25,
    paddingVertical: 22,
    gap: 30,
  },
  doneBtnTxt: {
    fontWeight: "500",
    color: "#A490F6", // Changed from Colors.listSecondaryBackground
  },
  specificationsDetails: {
    flexDirection: "row",
    gap: 5,
  },
  friend: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#A490F6", // Changed from Colors.listSecondaryBackground
    borderRadius: 20,
    color: "#A89DDB",
    padding: 10,
    bottom: 1,
  },
  date: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#A490F6", // Changed from Colors.listSecondaryBackground
    borderRadius: 20,
    color: "#A490F6",
    padding: 10,
    position: "relative",
    bottom: 1,
  },
  container: {
    width: Dimensions.get("window").width - 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height - 380,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default MyCalendar;
