import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

const RadioButtonGroup = ({ options, nARemarks, setSelectedValue, selected }) => {
    const subField = options.subField.split(",");
    const checkBoxFieldName = options.checkBoxFieldName.split(",");
    const data = subField.filter((_, i) => i != 0).map((item, index) => ({
        value: item,
        label: checkBoxFieldName[index]
    }))

    // console.log({ selected })

    return (
        <View style={styles.radioGroup}>
            {data.map((option) => (
                <Pressable
                    key={option.value}
                    style={[styles.radioButtonContainer, option.value === selected && styles.activeButton]}
                    onPress={() => {
                        setSelectedValue({ naData: nARemarks, value: option.value });
                    }}
                >
                    <Text style={[styles.radioButtonLabel, selected === option.value && styles.activeLabel]}>
                        {option.value.substr(-1) == "2" ? "N/A" : option.label}
                    </Text>
                </Pressable>
            ))}
            {selected.substr(-1) == "2" && (
                <TextInput
                    style={styles.textInput}
                    placeholder="Please provide details..."
                    value={nARemarks}
                    onChangeText={(text) => {
                        setSelectedValue({ value: selected, naData: text });
                        // ***Remove label key
                    }}
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
        backgroundColor: "#fff"
    },
});



export default React.memo(RadioButtonGroup);
