import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';

// Custom Dropdown Component
const CustomDropdown = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  placeholder,
  searchPlaceholder,
}) => {
  const [search, setSearch] = useState('');

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setValue(item.value);
        setOpen(false);
        setSearch('');
      }}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.selectedText}>
          {value ? items.find(item => item.value === value)?.label : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdownContainer}>
            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={search}
              onChangeText={setSearch}
            />

            {/* Items List */}
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={item => item.value.toString()}
              style={styles.list}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom:10,
  },
  dropdownButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A490F6',
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  list: {
    flexGrow: 0,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomDropdown;
