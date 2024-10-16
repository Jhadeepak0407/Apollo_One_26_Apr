import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Pressable, Platform, Dimensions, Alert, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';


import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';



const { width } = Dimensions.get('window');



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
              <FontAwesome name="check" size={20} color="green" />
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.modalButton}>
              <FontAwesome name="times" size={20} color="red" />
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


const fetchMenuDetails = async (checklistId, fromDate, toDate) => {
  try {
    const formattedFromDate = formatDate(fromDate, 'YYYY-MM-dd');
    const formattedToDate = formatDate(toDate, 'YYYY-MM-dd');


    const apiUrl = `http://10.10.9.89:203/api/Users/TaksListByCheckListID?checklistid=${checklistId}&from=${formattedFromDate}&to=${formattedToDate}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu details:', error);
    return [];
  }
};

const App = () => {
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
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
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
        setDepartments(data.map((dept) => ({ label: dept.departmentName, value: dept.departmentId })));
      }
    });
  }, [locationId]);


  useEffect(() => {
    if (selectedDepartment) {
      fetchCheckLists(locationId, selectedDepartment).then((data) => {
        if (Array.isArray(data)) {
          setCheckLists(data.map((list) => ({ label: list.checklist_name, value: list.checklist_id })));
        } else {
          setCheckLists([]);
        }
      });
    }
  }, [selectedDepartment, locationId]);

  const handleSearch = async () => {
    if (selectedCheckList && fromDate && toDate) {
      const menuDetails = await fetchMenuDetails(selectedCheckList, fromDate, toDate);
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
      'Clear Selection',
      'Are you sure you want to clear the selections?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {

            setSelectedDepartment('');
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





  const MenuItem = React.memo(({ item }) => {
    const navigation = useNavigation();

    const handlePress = () => {
      navigation.navigate('Digital_Checklist_App/checkListEdit', {
        taskID: item.taskID,
        ipnumber: item.ipnumber,
        bedCode: item.bedCode,
        ward: item.ward,
        status: item.status,
      });
    };
    return (

      <Pressable onPress={handlePress}
        style={({ pressed }) => [styles.menuItem, { backgroundColor: pressed ? '#f0f0f0' : '#fff' }]}
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View>
        <Stack.Screen
          options={{ title: "Digital CheckList", statusBarColor:"black" }} />
      </View>
      <Text style={styles.label}>Department</Text>
      <DropDownPicker
        open={openDeptDropdown}
        value={selectedDepartment}
        items={memoizedDepartments}
        setOpen={setOpenDeptDropdown}
        setValue={setSelectedDepartment}
        searchable={true}
        placeholder="Select a department"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onOpen={() => setOpenChecklistDropdown(false)}
      />

      <Text style={styles.label}>Check List Name</Text>
      <DropDownPicker
        open={openChecklistDropdown}
        value={selectedCheckList}
        items={memoizedCheckLists}
        setOpen={setOpenChecklistDropdown}
        setValue={setSelectedCheckList}
        searchable={true}
        placeholder="Select a checklist"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onOpen={() => setOpenDeptDropdown(false)}
      />


      <View style={styles.dateRow}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePickerButton}>
            <Text>{formatDate(fromDate, 'dd-MM-YYYY')}</Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowFromDatePicker(false);
                setFromDate(selectedDate || fromDate);
              }}
            />
          )}
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePickerButton}>
            <Text>{formatDate(toDate, 'dd-MM-YYYY')}</Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowToDatePicker(false);
                setToDate(selectedDate || toDate);
              }}
            />
          )}
        </View>
      </View>

      {isMenuVisible ? (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MenuItem item={item} />}
          ListEmptyComponent={<Text style={styles.noDataText}>No data available</Text>}
          nestedScrollEnabled
          style={styles.menuList}
        />
      ) : (
        <View style={styles.placeholder}>
          {/* <Text style={styles.placeholderText}>Please click search to view results.</Text> */}
          <Text style={styles.placeholderText}></Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)} style={styles.filterButton}>
          <FontAwesome name="filter" size={24} color="#1591ea" />
        </TouchableOpacity>
        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={handleSearch} style={styles.button}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear} style={styles.button}>
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


const formatDate = (date, format) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();


  switch (format) {
    case 'dd-MM-YYYY':
      return `${day}-${month}-${year}`;
    case 'YYYY-MM-dd':
      return `${year}-${month}-${day}`;

    default:
      return `${day}-${month}-${year}`;
  }
};

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
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginBottom: 8,
  },
  dropdown: {
    marginBottom: 16,
    zIndex: 15,
  },
  dropdownContainer: {
    maxHeight: 500,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerContainer: {
    flex: 1,
    marginRight: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },

  filterButton: {
    padding: 1,
    backgroundColor: 'white',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  rightButtons: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  button: {
    flexGrow: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    backgroundColor: '#1591ea',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  menuContainer: {
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  iconContainer: {
    marginRight: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },


  textGroup: {
    flex: 1,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 16,
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
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedItem: {
    backgroundColor: '#add8e6',
  },
  listItemText: {
    fontSize: 16,
  }
});

export default App;
