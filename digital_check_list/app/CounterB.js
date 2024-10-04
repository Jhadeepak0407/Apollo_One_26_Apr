import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectCounterBValue } from "../redux/selectors/counterBSelector";

import { fetchProductRequest } from "../redux/actions/productActions";

export default function CounterB() {
    const count = useSelector(selectCounterBValue);
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log(count.value);
        console.log(count);
    }, [count]);

    //   const incrementFunction = (value) => ({ type: "INCREMENT_B", payload: value });

    // const incrementWithPayload = { type: "INCREMENT_B", payload: 5 };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    title="Fetch From Product API"
                    onPress={() => dispatch(fetchProductRequest())}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    counterText: {
        fontSize: 32,
        marginBottom: 20,
        fontWeight: "bold",
        color: "#333",
    },
    buttonContainer: {
        marginVertical: 10,
        width: "60%",
    },
});