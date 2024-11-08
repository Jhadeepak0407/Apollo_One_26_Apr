import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

const FilterModal = ({ visible, onClose, onApplyFilter }) => {
  const [statusFilter, setStatusFilter] = useState("");

  const applyFilter = () => {
   
    const filterValue = statusFilter === "All" ? "" : statusFilter;
    onApplyFilter(filterValue);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          <Text style={styles.label}>Status</Text>
          <View style={styles.listContainer}>
            {["All", "Completed", "Pending", "Drafted"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.listItem,
                  statusFilter === status && styles.selectedItem,
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={styles.listItemText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
  <TouchableOpacity onPress={applyFilter} style={[styles.alertButton, { backgroundColor: '#FF5722' }]}>
    {/* <FontAwesome name="check" size={20} color="#FFFFFF" /> */}
    <Text style={[styles.alertButtonText, { color: '#FFFFFF' }]}>Apply</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={onClose} style={[styles.modalButton, { backgroundColor: 'grey' }]}>
    {/* <FontAwesome name="times" size={20} color="#FF5722" /> */}
    <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Cancel</Text>
  </TouchableOpacity>
</View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    fontFamily: "Mullish",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: "#999",
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#A490F6",
    
    fontFamily: "Mullish",
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
   
   
  },
  alertButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
  },


  listContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    // color: 'darkgrey',
    fontFamily: "Mullish",
    marginBottom: 8,
  },
  listItem: {
    padding: 10,
    fontFamily: "Mullish",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedItem: {
    borderColor: "#A490F6",
    
    backgroundColor: "#D1C4E9"
  },
  listItemText: {
    color: "#A490F6",
  },
});

export default React.memo(FilterModal);
