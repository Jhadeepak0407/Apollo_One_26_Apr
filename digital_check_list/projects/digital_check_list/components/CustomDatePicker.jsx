import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";

function DatePickerView({
  showDate,
  handleDayPress,
  markedDates,
  setShowDate,
}) {
  return (
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
  );
}

const styles = StyleSheet.create({
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

export default React.memo(DatePickerView);
