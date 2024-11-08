import React, { useState, useCallback } from "react";
import {View,TextInput,FlatList,TouchableOpacity,Text,StyleSheet,Modal,Pressable,} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 


const DropdownItem = React.memo(({ item, handleSelect }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );
});

const CustomDropdown = ({value,items,setValue,placeholder,searchPlaceholder,}) => {
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
          style={{ color: "#003366", fontSize: 14 }} 
        />
      </Pressable>

      {open && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownContainer}>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setOpen(false)}
              >
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
                  <DropdownItem
                    item={item}
                    handleSelect={handleSelect}
                  />
                )}
                initialNumToRender={15}
                ItemSeparatorComponent={() => <View style={styles.separator} />} 
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
    marginBottom: 16,
  },
  dropdown: {
    borderColor: "#A490F6",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    position: "absolute",
    top: "5%",
    left: "5%",
    right: "5%",
    bottom:"auto",
    borderRadius: 10,
    borderColor: "#A490F6",
    borderWidth: 1,
    padding: 10,
    zIndex: 100,
    maxHeight: "100%", 
    color:"black",

  },
  searchTextInputStyle: {
    borderBottomColor: "#A490F6",
    borderBottomWidth: 1,
    color: "black",
    padding: 5,
    marginBottom: 10,
  },
  item: {
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", // Line color
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10, // Ensure it stays on top
  },
  listStyle: {
    flexGrow: 1, // For scrollable FlatList
  },
});

export default CustomDropdown;
