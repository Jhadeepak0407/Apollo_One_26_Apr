import moment from "moment";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Button, Modal, TouchableOpacity } from "react-native";
import DateRangePicker from "rn-select-date-range";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure to install this library

const CustomDateRange = () => {
  const [selectedRange, setRange] = useState({ firstDate: "", secondDate: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleConfirm = () => {
    if (selectedRange.firstDate && selectedRange.secondDate) {
      setFromDate(selectedRange.firstDate);
      setToDate(selectedRange.secondDate);
      setModalVisible(false);
    }
  };

  const handleClear = () => {
    setRange({ firstDate: "", secondDate: "" });
    setFromDate(new Date()); // Reset to current date
    setToDate(new Date());   // Reset to current date
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button title="Select Date Range" onPress={() => setModalVisible(true)} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <DateRangePicker
                onSelectDateRange={(range) => {
                  setRange(range);
                }}
                blockSingleDateSelection={true}
                responseFormat="DD-MM-YYYY"
                maxDate={moment()}
                minDate={moment().subtract(100, "years")}
                selectedDateContainerStyle={styles.selectedDateContainerStyle}
                selectedDateStyle={styles.selectedDateStyle}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                  <Icon name="checkmark" size={20} color="white" />
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                  <Icon name="close" size={20} color="white" />
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.dateContainer}>
          <Text>Start Date: {fromDate ? moment(fromDate).format("DD-MM-YYYY") : "Not selected"}</Text>
          <Text>End Date: {toDate ? moment(toDate).format("DD-MM-YYYY") : "Not selected"}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    margin: 20,
  },
  dateContainer: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  selectedDateContainerStyle: {
    height: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  selectedDateStyle: {
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomDateRange;




