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
  borderColor: "#5A67D8", // A more muted, professional color
  borderWidth: 1.5,
  padding: 12,
  borderRadius: 8,
  backgroundColor: "#F9FAFB", // Subtle light background
  color: "#2D3748", // Dark gray for text
  fontSize: 14,
  fontFamily: "Arial, sans-serif", // Professional font
},
dropdownContainer: {
  backgroundColor: "#FFFFFF",
  position: "absolute",
  top: "5%",
  left: "5%",
  right: "5%",
  bottom: "auto",
  borderRadius: 10,
  borderColor: "#CBD5E0", // Subtle border
  borderWidth: 1.5,
  padding: 12,
  zIndex: 100,
  maxHeight: "80%", // Reduce max height for better UX
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add shadow for a floating effect
  color: "#1A202C", // Adjust text color for better contrast
  fontSize: 14,
  overflow: "auto", // Scroll if options exceed container height
},
dropdownItem: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderBottomColor: "#E2E8F0",
  borderBottomWidth: 1,
  fontSize: 14,
  color: "#4A5568",
},
dropdownItemHover: {
  backgroundColor: "#E2E8F0", // Highlighted background on hover
  color: "#2D3748",
},
dropdownItemSelected: {
  backgroundColor: "#5A67D8", // Highlighted for selected item
  color: "#FFFFFF",
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
