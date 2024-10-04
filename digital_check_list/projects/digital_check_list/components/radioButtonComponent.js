import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const RadioButtonGroup = ({ options, onValueChange, nARemarks }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [naRemarks, setNaRemarks] = useState(''); // Initialize as an empty string

    // Update naRemarks when nARemarks changes
    useEffect(() => {
        setNaRemarks(nARemarks);
    }, [nARemarks]);

    const handlePress = (value) => {
        setSelectedValue(value);
        onValueChange(value);
    };

    return (
        <View style={styles.radioGroup}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.radioButtonContainer,
                        selectedValue === option.value && styles.activeButton,
                    ]}
                    onPress={() => handlePress(option.value)}
                >
                    <Text
                        style={[
                            styles.radioButtonLabel,
                            selectedValue === option.value && styles.activeLabel,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}

            {/* TextInput for "n/a" option */}
            {selectedValue === 2 && ( // Assuming 2 is the value for "n/a"
                <TextInput
                    style={styles.textInput}
                    placeholder="Please provide details..."
                    value={naRemarks}
                    onChangeText={setNaRemarks}
                />
            )}
        </View>
    );
};




const styles = StyleSheet.create({
    radioGroup: {
        flexDirection: 'column',
        marginTop: 20,
    },
    radioButtonContainer: {
        borderRadius: 8,
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        marginVertical: 5,
        alignItems: 'center',
    },
    radioButtonLabel: {
        fontSize: 16,
        color: '#333',
    },
    activeButton: {
        backgroundColor: '#97abbf', 
    },
    activeLabel: {
        color: 'white', 
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 10,
    },
});

export default RadioButtonGroup;
