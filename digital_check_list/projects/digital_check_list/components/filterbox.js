import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterModal = ({ visible, onClose, onApplyFilter }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleApply = () => {
    onApplyFilter(selectedStatus);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filter Menu</Text>

          <TouchableOpacity
            onPress={() => setSelectedStatus('completed')}
            style={[
              styles.option,
              selectedStatus === 'completed' && styles.selectedOption,
            ]}
          >
            <Text style={styles.optionText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedStatus('pending')}
            style={[
              styles.option,
              selectedStatus === 'pending' && styles.selectedOption,
            ]}
          >
            <Text style={styles.optionText}>Pending</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
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
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#999',
  },
  applyButton: {
    padding: 10,
    backgroundColor: '#A490F6',
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
  },
});

export default FilterModal;
