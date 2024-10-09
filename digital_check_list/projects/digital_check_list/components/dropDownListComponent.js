// projects/digital_check_list/components/CustomDropdown.js

import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const CustomDropdown = ({ data, value, onChange, placeholder }) => {
    // Transform data to match labelField and valueField requirements
    const formattedData = data.map(item => ({
        label: item.title.toUpperCase(), // Set label to title from controlvalues
        value: item.value  // Set value to value from controlvalues
    }));

    return (
        <Dropdown
            data={formattedData} // Use the formatted data
            valueField="value"
            labelField="label"
            value={value}
            
            
            searchPlaceholder="Search..."
            onChange={onChange}
            placeholder={placeholder}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            selectedTextStyle={styles.dropdownSelectedText}
            placeholderStyle={styles.dropdownPlaceholder}
            inputSearchStyle={styles.dropdownInputSearch}
        />
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        marginBottom: 20,
    },
    dropdown: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    dropdownContainerStyle: {
        maxHeight: 140,
    },
    dropdownSelectedText: {
        color: "#333",
    },
    dropdownPlaceholder: {
        color: "#999",
    },
    dropdownInputSearch: {
        backgroundColor: "#fff",
        color: "#333",
    },
});

export default CustomDropdown;
