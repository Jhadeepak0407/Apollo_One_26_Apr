import React, { useState, useEffect, useCallback, useMemo,useLayoutEffect } from 'react';
import { View, Text,Modal, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Pressable, Platform, Dimensions, Alert, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import CustomDatePicker from '../../projects/digital_check_list/components/DateRange';
import CustomDatePicker1 from '../../projects/digital_check_list/components/daterange1';
import { useFonts, Mulish_400Regular } from '@expo-google-fonts/mulish';
import { useNavigation  } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

//const Stack = createStackNavigator();

// const { width } = Dimensions.get('window');



const FilterModal = ({ visible, onClose, onApplyFilter }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const applyFilter = () => {
    onApplyFilter(statusFilter);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Filter Options</Text>

      <Text style={styles.label}>Status</Text>
      <View style={styles.listContainer}>
        {['Completed', 'Pending', 'Drafted'].map((status) => (
          <TouchableOpacity 
            key={status} 
            style={[
              styles.listItem, 
              statusFilter === status && styles.selectedItem
            ]} 
            onPress={() => setStatusFilter(status)}>
            <Text style={styles.listItemText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={applyFilter} style={styles.modalButton}>
          <FontAwesome name="check" size={20} color="#A490F6" />
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.modalButton}>
          <FontAwesome name="times" size={20} color="#A490F6" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

  );
};

 


const fetchDepartments = async (locationId) => {
  try {
    const response = await fetch(`http://10.10.9.89:203/api/Users/DepartmentMasterListByLocation?locationid=${locationId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};


const fetchCheckLists = async (locationId, departmentId) => {
  try {
    const response = await fetch(`http://10.10.9.89:203/api/Users/CheckListMasterListByDepartment?locationid=${locationId}&departmentid=${departmentId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching checklists:', error);
    return [];
  }
};

// const formatDate = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

const fetchMenuDetails = async (checklistId, fromDate, toDate) => {
  try {
    //const formattedFromDate = formatDate(fromDate || new Date(), 'YYYY-MM-DD');
//const formattedToDate = formatDate(toDate || new Date(), 'YYYY-MM-DD');
    
    const apiUrl = `http://10.10.9.89:203/api/Users/TaksListByCheckListID?checklistid=${checklistId}&from=${fromDate}&to=${toDate}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu details:', error);
    return [];
  }
};


// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('applist')}
      />
    </View>
  );
}

const App = () => {
  let [fontsLoaded] = useFonts({
    Mulish_400Regular,
  });

  const navigation = useNavigation();
  const locationId = '10701'; 
  const [menu, setMenu] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [openDeptDropdown, setOpenDeptDropdown] = useState(false);
  const [checkLists, setCheckLists] = useState([]);
  const [selectedCheckList, setSelectedCheckList] = useState(null);
  const [openChecklistDropdown, setOpenChecklistDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null); 
const [isFilterModalVisible, setIsFilterModalVisible] = useState(false); 

 
  const memoizedDepartments = useMemo(() => departments, [departments]);
  const memoizedCheckLists = useMemo(() => checkLists, [checkLists]);

  const filteredMenu = useMemo(() => {
    if (!filterStatus) return menu;
    return menu.filter((item) => item.status === filterStatus);
  }, [menu, filterStatus]);

  useEffect(() => {
    fetchDepartments(locationId).then((data) => {
      if (Array.isArray(data)) {
        setDepartments(
          data.map((dept) => ({
            label: dept.departmentName,
            value: dept.departmentId,
          }))
        );
      }
    });
  }, [locationId]);

  useEffect(() => {
    if (selectedDepartment) {
      fetchCheckLists(locationId, selectedDepartment).then((data) => {
        if (Array.isArray(data)) {
          setCheckLists(
            data.map((list) => ({
              label: list.checklist_name,
              value: list.checklist_id,
            }))
          );
        } else {
          setCheckLists([]);
        }
      });
    }
  }, [selectedDepartment, locationId]);

  const handleSearch = async () => {
    if (selectedCheckList && fromDate && toDate) {
      const menuDetails = await fetchMenuDetails(
        selectedCheckList,
        fromDate,
        toDate
      );
      // console.log(fromDate)
      // console.log(toDate)
      if (menuDetails && menuDetails.length > 0) {
        setMenu(menuDetails);
        setIsMenuVisible(true);
      } else {
        setMenu([]);
        setIsMenuVisible(false);
      }
    } else {
      alert('Please select a checklist and valid date range.');
    }
  };

  const handleClear = useCallback(() => {
    Alert.alert(
      "Clear Selection",
      "Are you sure you want to clear the selections?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            setSelectedDepartment("");
            setSelectedCheckList(null);
            setFromDate(new Date());
            setToDate(new Date());
            setMenu([]);
            setIsMenuVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

 
  // <NavigationContainer>
  //     <Stack.Navigator
  //       initialRouteName="Home"
  //       screenOptions={({ navigation }) => ({
  //         headerRight: () => (
  //           <Icon
  //             name="home"
  //             size={24}
  //             color="#A490F6"
  //             style={{ marginRight: 10 }} // Adjust margin to place it properly
  //             onPress={() => navigation.navigate('applist')} // Navigate back to home when pressed
  //           />
  //         ),
  //       })}
  //     >
  //     </Stack.Navigator>
  //   </NavigationContainer>

 
  const MenuItem = React.memo(({ item }) => {
    const navigation = useNavigation(); // Initialize navigation

    // Define the handlePress function for navigation
    const handlePress = () => {
      navigation.navigate('Digital_Checklist_App/checkListEdit', {
        taskID: item.taskID,
        ipnumber: item.ipnumber,
       Rowid:item.rowid,
      
      });
    };
    return (
  
    <Pressable onPress={handlePress}
      style={({ pressed }) => [styles.menuItem, { backgroundColor: pressed ? getStatusColor(item.status) : '#fff' }]}
    >
      <View style={styles.iconContainer}>
  <View style={[styles.iconCircle, { backgroundColor: getStatusColor(item.status) }]}>
    {/* Display the letter based on the status */}
    <Text style={styles.iconText}>
      {item.status === 'Completed' ? 'C' : item.status === 'Pending' ? 'P' : item.status === 'Drafted' ? 'D' : ''}
    </Text>
  </View>
</View>

      <View style={styles.textGroup}>
        <View style={styles.textRow}>
          <Text style={styles.menuItemText}>{item.taskID}</Text>
          <Text style={styles.menuItemText}>{item.ipnumber}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.menuItemText}>{item.bedCode}/{item.ward}</Text>
        </View>
      </View>
    </Pressable>
    );
  });



  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
  
  <Text style={styles.label}>Department</Text>
      <DropDownPicker
        open={openDeptDropdown}
        value={selectedDepartment}
        items={memoizedDepartments}
        setOpen={setOpenDeptDropdown}
        setValue={setSelectedDepartment}
        placeholder="Select a department"
        searchPlaceholder="Search departments..."
      />
        <CustomAlert
      visible={alertVisible}
      title={alertTitle}
      message={alertMessage}
      onClose={() => setAlertVisible(false)}
    />

      <Text style={styles.label}>Checklist</Text>
      <CustomDropdown
        open={openChecklistDropdown}
        value={selectedCheckList}
        items={memoizedCheckLists}
        setOpen={setOpenChecklistDropdown}
        setValue={setSelectedCheckList}
        placeholder="Select a checklist"
        searchPlaceholder="Search checklists..."
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <View style={styles.dateRow}>
        <View style={styles.datePickerContainer}>
          <CustomDatePicker
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </View>
      </View>

      {isMenuVisible ? (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MenuItem item={item} />}
          ListEmptyComponent={
            <Text style={styles.noDataText}>No data available</Text>
          }
          nestedScrollEnabled
          style={styles.menuList}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}></Text>
        </View>
      )}

<View style={styles.buttonRow}>
  <TouchableOpacity onPress={() => setIsFilterModalVisible(true)} style={styles.filterButton}>
  <FontAwesome name="filter" size={20} color="#A490F6" />
  <Text style={styles.buttonText}>Filter</Text>
  </TouchableOpacity>
  <View style={styles.rightButtons}>
    <TouchableOpacity onPress={handleSearch} style={styles.button}>
    <FontAwesome name="search" size={20} color="#A490F6" />
    <Text style={styles.buttonText}>Search</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleClear} style={styles.button}>
    <FontAwesome name="times" size={20} color="#A490F6" />
    <Text style={styles.buttonText}>Clear</Text>
    </TouchableOpacity>
  </View>
</View>
<FilterModal
  visible={isFilterModalVisible}
  onClose={() => setIsFilterModalVisible(false)}
  onApplyFilter={(status) => {
    setFilterStatus(status);
    setIsFilterModalVisible(false);
  }}
/>

    </KeyboardAvoidingView>
  );

};


// const formatDate = (date, format) => {
//   const day = String(date.getDate()).padStart(2, '0'); 
//   const month = String(date.getMonth() + 1).padStart(2, '0'); 
//   const year = date.getFullYear(); 


//   switch (format) {
//     case 'dd-MM-YYYY':
//       return `${day}-${month}-${year}`;
//     case 'YYYY-MM-dd':
//       return `${year}-${month}-${day}`;
 
//     default:
//       return `${day}-${month}-${year}`; 
//   }
// };

const getStatusColor = (status) => {
  switch (status) {
    case 'Drafted':
      return '#1aa3ff';
    case 'Completed':
      return '#0F0';
    case 'Pending':
      return '#FFA500';
    default:
      return '#CCC';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    // color: 'darkgrey',
    fontFamily: "Mullish",
    marginBottom: 8,
    color:"darkblack",
    fontWeight:"800"
    
  },
  dropdown: {
    borderColor: "#A490F6",
    marginBottom: 16,
    zIndex: 15, 
    borderBottomColor:'#A490F6',
  },
  dropdownContainer: {
    borderColor: "#A490F6",
    borderWidth: 1,
    maxHeight: 500,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePickerContainer: {
    flex: 1,
    marginRight: 5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuList: {
    flex: 1,
    marginTop: 16,
    borderColor: "#A490F6",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  placeholderStyle:{
    borderColor:'#A490F6',
    borderBottomColor:'#A490F6',

  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontFamily:'Mulish_400Regular',
    
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  textGroup: {
    flex: 1,
    marginLeft: 12,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuItemText: {
    fontSize: 14,
    color: '#999',
    fontFamily:'Mulish_400Regular',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    fontFamily:'Mulish_400Regular',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: '#999',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 16,
      paddingHorizontal: 10, // Add padding on sides
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      backgroundColor: '#f0f0f0',
    },
    rightButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      backgroundColor: '#f0f0f0',
      marginLeft: 10, // Space between buttons
    },
    buttonText: {
      marginLeft: 6,
      fontSize: 16,
      color: '#A490F6',
       fontFamily:'Mulish_400Regular',
    
    },

  
 
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    padding: 10,
    fontFamily:'Mulish_400Regular',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedItem: {
    borderColor: '#A490F6',
  },
  listItemText: {
    color: '#A490F6',
  },
});

export default App;
