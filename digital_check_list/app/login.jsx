import { StylesSheet, Text, View } from "react-native";
import { fontSizes } from "../projects/digital_check_list/constants/theme";
export default function App() {
    return (<View>
        <Text style={styles.title}>hello</Text>
        <Text style={styles.title}>hello</Text>
        <Text style={styles.title}>hello</Text>
    </View>)
}


const styles = StylesSheet.create({
    title: {
        color: "red",
        fontSize: fontSizes.primary
    }
})