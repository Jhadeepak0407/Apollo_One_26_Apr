import React, { useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
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
        <DatePickerView showDate={showDate}
          handleDayPress={handleDayPress}
          markedDates={markedDates}
          setShowDate={setShowDate} />
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
    borderColor: "#A490F6",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    margin:1,
    width: '100%',
    justifyContent: "center",
    flexDirection: "row",
  },
  date: {
    fontSize: 16,
    color: "#333",
    padding: 5,
  },
});
