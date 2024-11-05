import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

const RadioButtonGroup = ({ options, nARemarks, setSelectedValue, selected }) => {
    const [naRemarks, setNaRemarks] = useState(nARemarks);

    useEffect(() => {
        setNaRemarks(nARemarks); // Update the local state whenever the prop changes
    }, [nARemarks]);

    return (
        <View style={styles.radioGroup}>
            {options.map((option) => (
                <Pressable
                    key={option.value}
                    style={[styles.radioButtonContainer, option.label === selected && styles.activeButton]}
                    onPress={() => {
                        setSelectedValue({ label: option.label, naData: naRemarks });
                    }}
                >
                    <Text style={[styles.radioButtonLabel, selected === option.label && styles.activeLabel]}>
                        {option.label}
                    </Text>
                </Pressable>
            ))}
            {selected?.toLowerCase() === "na" && (
                <TextInput
                    style={styles.textInput}
                    placeholder="Please provide details..."
                    value={naRemarks}
                    onChangeText={(text) => {
                        setNaRemarks(text);
                        setSelectedValue({ label: selected, naData: text }); // Update parent state on text change
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
    },
});



export default React.memo(RadioButtonGroup);
