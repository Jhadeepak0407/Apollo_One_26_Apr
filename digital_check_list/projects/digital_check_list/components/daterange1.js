import React, { useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";

// Helper function to format the date
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
  const [showDate, setShowDate] = React.useState(false);

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
  }, [fromDate, toDate]);

  const handleDateToggle = useCallback(() => {
    setShowDate((prevState) => !prevState);
  }, []);

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

  console.log("CHecking me!")

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.specificationsDetails}>
          <Pressable onPress={handleDateToggle} style={{ flexDirection: "row" }}>
            {fromDate && toDate ? (
              <Text style={styles.date}>
                {formatDate1(new Date(fromDate))} - {formatDate1(new Date(toDate))}
              </Text>
            ) : (
              <Text style={styles.date}>Select Dates</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
      {showDate && (
        <View style={styles.container}>
          <View style={styles.centeredView}>
            <Modal animationType="none" transparent={true} visible={showDate}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ width: Dimensions.get("window").width - 20 }}>
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
                </View>
              </View>
            </Modal>
          </View>
        </View>
      )}
    </View>
  );
};

// Wrap the component with React.memo
export default React.memo(CustomDatePicker1);

const styles = StyleSheet.create({
  specificationsDetails: {
    padding: 7,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#A490F6",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    margin: 2,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  doneBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  doneBtnTxt: {
    fontSize: 16,
    color: "#A490F6",
    fontWeight: "bold",
  },
});
