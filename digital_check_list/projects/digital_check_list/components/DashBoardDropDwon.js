import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DropdownPicker = ({ data, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleSelect = (item) => {
    setSearchQuery(item.label);
    setIsDropdownOpen(false);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Select an option..."
        onFocus={() => setIsDropdownOpen(true)}
      />
      {isDropdownOpen && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.value.toString()}
          style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdown: {
    maxHeight: 200,
    marginTop: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});

export default DropdownPicker;
