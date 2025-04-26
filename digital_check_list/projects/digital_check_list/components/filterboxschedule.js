import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const getStatusColor = (finalSave) => {
  switch (finalSave) {
    case "Drafted":
      return "#ffcc80"; // Orange for Drafted
    case "Completed":
      return "#27ae60"; // Green for Completed
    case "Pending":
      return "#b3cde0"; // Light Blue for Pending
    case "All":
      return "#8e44ad"; // Purple for All
    default:
      return "#bdc3c7"; // Default Gray
  }
};

const FilterModal = ({ visible, onClose, onApplyFilter }) => {
  const statusOptions = ["All", "Completed", "Pending", "Drafted"];
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const toggleStatus = (status) => {
    if (status === "All") {
      // If "All" is selected, select all statuses
      if (!selectedStatuses.includes("All")) {
        setSelectedStatuses([...statusOptions]);
      } else {
        setSelectedStatuses([]); // Deselect all
      }
    } else {
      let updatedSelection = selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s !== status) // Remove status
        : [...selectedStatuses, status]; // Add status

      // If "All" is selected and a specific item is unselected, remove "All"
      if (updatedSelection.includes("All") && updatedSelection.length < statusOptions.length) {
        updatedSelection = updatedSelection.filter((s) => s !== "All");
      }

      // If all items (except "All") are selected, automatically select "All"
      if (updatedSelection.length === statusOptions.length - 1) {
        updatedSelection = [...statusOptions];
      }

      setSelectedStatuses(updatedSelection);
    }
  };

  const applyFilter = () => {
    onApplyFilter(selectedStatuses.includes("All") ? ["Completed", "Pending", "Drafted"] : selectedStatuses);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          <Text style={styles.label}>Status</Text>
          <View style={styles.listContainer}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.listItem,
                  {
                    backgroundColor: selectedStatuses.includes(status) ? getStatusColor(status) : "#fff",
                  },
                  selectedStatuses.includes(status) && styles.selectedItem,
                ]}
                onPress={() => toggleStatus(status)}
              >
                <Text style={{ color: selectedStatuses.includes(status) ? "#fff" : "#000" }}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={applyFilter} style={[styles.alertButton, { backgroundColor: "#FF5722" }]}>
              <Text style={styles.alertButtonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.modalButton, { backgroundColor: "grey" }]}>
              <Text style={styles.buttonText}>Cancel</Text>
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
    alignItems: "center",
  },
  selectedItem: {
    borderColor: "#A490F6",
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
    color: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default React.memo(FilterModal);
