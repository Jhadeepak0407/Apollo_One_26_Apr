
const CustomDatePicker1 = ({ fromDate, toDate, setFromDate, setToDate }) => {
    const [showDate, setShowDate] = React.useState(false);

    const handleDayPress = useCallback((day) => {
        const selectedDate = day.dateString;

        if (!fromDate) {
            setFromDate(selectedDate);
            setToDate("");
        } else if (!toDate && new Date(selectedDate) >= new Date(fromDate)) {
            setToDate(selectedDate);
        } else {
            setFromDate(selectedDate);
            setToDate("");
        }
    }, [fromDate, toDate, setFromDate, setToDate]);

    // Memoize the marked dates to prevent unnecessary recalculations
    const markedDates = useMemo(() => {
        return {
            ...generateDateRange(fromDate, toDate),
            [fromDate]: {
                selected: true,
                color: "#A490F6",
                textColor: "white",
            },
            [toDate]: {
                selected: true,
                color: "#A490F6",
                textColor: "white",
            },
        };
    }, [fromDate, toDate]);

    const handleDateToggle = useCallback(() => {
        setShowDate((prevState) => !prevState);
    }, []);

    useEffect(() => {
        console.log("fromDate => ", fromDate);
        console.log("toDate => ", toDate);
    }, [fromDate, toDate]);

    const formatDate1 = useCallback((date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }, []);

    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.specificationsDetails}>
                    <Pressable onPress={handleDateToggle} style={{ flexDirection: "row" }}>
                        {fromDate && toDate ? (
                            <Text style={styles.date}>
                                {formatDate1(new Date(fromDate))} - {formatDate1(new Date(toDate))}
                            </Text>
                        ) : (
                            <Text style={styles.date}>Select Dates</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
            {showDate && (
                <View style={styles.container}>
                    <View style={styles.centeredView}>
                        <Modal animationType="none" transparent={true} visible={showDate}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={{ width: Dimensions.get("window").width - 20 }}>
                                        <Calendar
                                            onDayPress={handleDayPress}
                                            markedDates={markedDates}
                                            markingType={"period"}
                                        />
                                    </View>
                                    <View style={styles.doneBtn}>
                                        <Pressable onPress={() => setShowDate(false)}>
                                            <Text style={styles.doneBtnTxt}>Cancel</Text>
                                        </Pressable>
                                        <Pressable onPress={() => setShowDate(false)}>
                                            <Text style={styles.doneBtnTxt}>Done</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            )}
        </View>
    );
};

// Wrap the component with React.memo
export default React.memo(CustomDatePicker1);