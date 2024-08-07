import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Pressable } from 'react-native';



const fetchDepartments = async (locationid) => {
    try {
        const response = await fetch(`http://10.10.9.89:202/api/Users/DepartmentMasterListByLocation?locationid=${locationid}`);
        const data = await response.json();
        return data;
        // console.log('Fetched API Departments:', data);
    } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
};

const fetchCheckLists = async (locationid, departmentId) => {
    try {
        const response = await fetch(`http://10.10.9.89:202/api/Users/CheckListMasterListByDepartment?locationid=${locationid}&departmentid=${departmentId}`);
        const data = await response.json();
        console.log('Fetched CheckLists:', data);
        return data;
    } catch (error) {
        console.error('Error fetching checklists:', error);
        return [];
    }
};

const App = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [checkLists, setCheckLists] = useState([]);
    const [selectedCheckList, setSelectedCheckList] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [ward, setWard] = useState('');
    const [room, setRoom] = useState('');
    const [status, setStatus] = useState('');
    const [user, setUser] = useState('');
    const [lastActionDate, setLastActionDate] = useState(new Date());
    const [taskDate, setTaskDate] = useState(new Date());

    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [showLastActionDatePicker, setShowLastActionDatePicker] = useState(false);
    const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    useEffect(() => {
        fetchDepartments('10701').then(data => {
            console.log("DATA => ", data)
            if (Array.isArray(data)) {
                setDepartments(data);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchCheckLists('10701', selectedDepartment).then(data => {
                if (Array.isArray(data)) {
                    setCheckLists(data);
                } else {
                    setCheckLists([]);
                }
            });
        }
    }, [selectedDepartment]);

    const handleSearch = () => {
        // Handle search logic
    };

    const handleHideFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const handleClear = () => {
        setSelectedDepartment('');
        setSelectedCheckList('');
        setFromDate(new Date());
        setToDate(new Date());
        setWard('');
        setRoom('');
        setStatus('');
        setUser('');
        setLastActionDate(new Date());
        setTaskDate(new Date());
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Triggered Check List</Text>
            </View>
            <View style={styles.statusSummary}>
                <Text style={styles.statusSummaryText}>Status Wise All Tickets Counter</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusBox}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Pending</Text>
                        <Text style={styles.statusCount}>0</Text>
                    </View>
                    <View style={styles.statusBox}>
                        <Text style={{ color: 'yellow', fontWeight: 'bold' }}>Drafted</Text>
                        <Text style={styles.statusCount}>0</Text>
                    </View>
                    <View style={styles.statusBox}>
                        <Text style={{ color: 'lightgreen', fontWeight: 'bold' }}>Completed</Text>
                        <Text style={styles.statusCount}>0</Text>
                    </View>
                    <View style={styles.statusBox}>
                        <Text style={{ color: 'orange', fontWeight: 'bold' }}>Lapsed</Text>
                        <Text style={styles.statusCount}>0</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.label}>Department</Text>
            <Picker
                selectedValue={selectedDepartment}
                onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Please select a department" value="0" />
                {departments?.map((dept, index) => {
                    console.log('Fetched Department:', dept, index); // Log each department object
                    return (
                        <Picker.Item key={dept.departmentId} label={dept.departmentName} value={dept.departmentId} />
                    );
                })}

            </Picker>



            <Text style={styles.label}>Check List Name</Text>
            <Picker
                selectedValue={selectedCheckList}
                onValueChange={(itemValue) => setSelectedCheckList(itemValue)}
                style={styles.picker}
                enabled={checkLists.length > 0}
            >
                <Picker.Item label="Please select a checklist" value="0" />
                {checkLists.map(list => (
                    <Picker.Item key={list.id} label={list.name} value={list.id} />
                ))}
            </Picker>

            <Text style={styles.label}>From Date</Text>
            <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePickerButton}>
                <Text>{fromDate.toDateString()}</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
                <DateTimePicker
                    value={fromDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || fromDate;
                        setShowFromDatePicker(false);
                        setFromDate(currentDate);
                    }}
                />
            )}

            <Text style={styles.label}>To Date</Text>
            <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePickerButton}>
                <Text>{toDate.toDateString()}</Text>
            </TouchableOpacity>
            {showToDatePicker && (
                <DateTimePicker
                    value={toDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || toDate;
                        setShowToDatePicker(false);
                        setToDate(currentDate);
                    }}
                />
            )}

            <View style={styles.buttonContainer}>
                <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text>Search</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={handleClear}>
                    <Text>Clear</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={handleHideFilters}>
                    <Text>{showMoreFilters ? "Hide Filters" : "Show More"}</Text>
                </Pressable>
            </View>

            {showMoreFilters && (
                <>
                    <Text style={styles.label}>Ward</Text>
                    <Picker
                        selectedValue={ward}
                        onValueChange={(itemValue) => setWard(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Ward" value="0" />
                        {/* Add ward options here */}
                    </Picker>

                    <Text style={styles.label}>Room</Text>
                    <Picker
                        selectedValue={room}
                        onValueChange={(itemValue) => setRoom(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Room" value="" />
                        {/* Add room options here */}
                    </Picker>

                    <Text style={styles.label}>Status</Text>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue) => setStatus(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Status" value="" />
                        {/* Add status options here */}
                    </Picker>

                    <Text style={styles.label}>User</Text>
                    <Picker
                        selectedValue={user}
                        onValueChange={(itemValue) => setUser(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select User" value="" />
                        {/* Add user options here */}
                    </Picker>

                    <Text style={styles.label}>Last Action Date</Text>
                    <View style={styles.datePickerButton}>
                        <TouchableOpacity onPress={() => setShowLastActionDatePicker(true)}>
                            <Text style={styles.dateText}>{lastActionDate.toDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                    {showLastActionDatePicker && (
                        <DateTimePicker
                            value={lastActionDate}
                            mode="date"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || lastActionDate;
                                setShowLastActionDatePicker(false);
                                setLastActionDate(currentDate);
                            }}
                        />
                    )}
                </>
            )}

            <Text style={styles.label}>Task Date</Text>
            <View style={styles.datePickerButton}>
                <TouchableOpacity onPress={() => setShowTaskDatePicker(true)}>
                    <Text style={styles.dateText}>{taskDate.toDateString()}</Text>
                </TouchableOpacity>
            </View>
            {showTaskDatePicker && (
                <DateTimePicker
                    value={taskDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || taskDate;
                        setShowTaskDatePicker(false);
                        setTaskDate(currentDate);
                    }}
                />
            )}
        </ScrollView>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
    },
    headerText: {
        color: 'black',
        fontWeight: 'bold',
    },
    statusSummary: {
        backgroundColor: "#6495ed",
        borderRadius: 15,
        marginVertical: 20,
        padding: 10,
    },
    statusSummaryText: {
        fontWeight: "bold",
        alignSelf: "center",
        fontSize: 16,
        color: "white",
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    statusBox: {
        alignItems: 'center',
    },
    statusCount: {
        fontSize: 24,
        color: "white",
    },
    label: {
        marginTop: 10,
        fontWeight: 'bold',
        color: "black",
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
    },
    datePickerButton: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        marginBottom: 10,
    },
    dateText: {
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        backgroundColor: 'lightblue',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
    },
});
