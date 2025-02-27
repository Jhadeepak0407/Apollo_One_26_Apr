import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

const getStatusColor = (finalSave) => {
    switch (finalSave) {
      case "Drafted":
        return "#ffcc80"; // Orange for Drafted
      case "Completed":
        return "#27ae60"; // Green for Completed
      case "Pending":
        return "#b3cde0"; // Light Blue for Pending
      default:
        return "#bdc3c7"; // Default Gray
    }
  };
  
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
                    { backgroundColor: getStatusColor(status) }, // Dynamic color
                    statusFilter === status && styles.selectedItem,
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      { color: statusFilter === status ? "#fff" : "#000" },
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
  
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={applyFilter}
                style={[styles.alertButton, { backgroundColor: "#FF5722" }]}
              >
                <Text style={[styles.alertButtonText, { color: "#FFFFFF" }]}>
                  Apply
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.modalButton, { backgroundColor: "grey" }]}
              >
                <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
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
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 16,
      color: "#333",
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: "#666",
    },
    listContainer: {
      marginBottom: 16,
    },
    listItem: {
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedItem: {
      borderColor: "#A490F6",
    },
    listItemText: {
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    alertButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    alertButtonText: {
      fontSize: 16,
    },
    buttonText: {
      fontSize: 16,
    },
  });
  
  export default React.memo(FilterModal);