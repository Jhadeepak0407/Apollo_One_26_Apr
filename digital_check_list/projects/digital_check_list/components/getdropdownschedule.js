import React, { useState, useCallback } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropdownItem = React.memo(({ item, handleSelect }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );
});

const CustomDropdown = ({ value, items, setValue, placeholder, searchPlaceholder }) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = useCallback((item) => {
    setValue(item.value);
    setOpen(false);
  }, [setValue]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(!open)} style={styles.dropdown}>
        <TextInput
          placeholder={placeholder}
          value={items.find((i) => i.value === value)?.label || ""}
          editable={false}
          style={styles.textInput}
        />
      </Pressable>

      {open && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color="#A490F6" />
              </TouchableOpacity>

              <TextInput
                style={styles.searchTextInputStyle}
                placeholder={searchPlaceholder}
                value={searchText}
                onChangeText={setSearchText}
              />

              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <DropdownItem item={item} handleSelect={handleSelect} />
                )}
                numColumns={2} // Display two items per row
                columnWrapperStyle={styles.columnWrapper}
                initialNumToRender={15}
                style={styles.listStyle}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  dropdown: {
    borderColor: "#5A67D8",
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    color: "#2D3748",
    fontSize: 14,
    fontFamily: "Arial, sans-serif",

   ///width:"50%"
  },
  textInput: {
    color: "#003366",
    fontSize: 14,
    paddingRight: 30, // Provide space for the icon inside
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: "5%",
    left: "5%",
    right: "5%",
    bottom: "auto",
    borderRadius: 10,
    borderColor: "#CBD5E0",
    borderWidth: 1.5,
    padding: 12,
    zIndex: 100,
    maxHeight: "80%",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    fontSize: 14,
    overflow: "auto",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  searchTextInputStyle: {
    borderBottomColor: "#A490F6",
    borderBottomWidth: 1,
    color: "black",
    padding: 5,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    minHeight: 60,
    maxWidth: "45%",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listStyle: {
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  text: {
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});

export default CustomDropdown;
