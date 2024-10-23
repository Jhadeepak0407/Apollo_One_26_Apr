import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, FlatList, SafeAreaView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomDatePicker from "../../projects/digital_check_list/components/getcustomdaterange";
import FilterModal from "../../projects/digital_check_list/components/filterbox";
import MenuItem from "../../projects/digital_check_list/components/getmenuitems";
import CustomDropdown from "../../projects/digital_check_list/components/getdropdowndetails";
import CustomAlert from "../../projects/digital_check_list/components/alertmessage";
import ConfirmCustomAlert from "../../projects/digital_check_list/components/confirmalert";
import { fetchDepartments, fetchCheckLists, fetchMenuDetails } from "../../services/triggeredchecklistapi";

const App = () => {
  const locationId = "10701";
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
  const [alertVisible, setAlertVisible] = useState(false);  // Manages alert visibility
  const [alertTitle, setAlertTitle] = useState("");         // Manages alert title
  const [alertMessage, setAlertMessage] = useState(""); 
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const memoizedDepartments = useMemo(() => departments, [departments]);
  const memoizedCheckLists = useMemo(() => checkLists, [checkLists]);
 
  const filteredMenu = useMemo(() => {
    if (!filterStatus) return menu;
    return menu.filter((item) => item.status === filterStatus);
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
      if (menuDetails && menuDetails.length > 0) {
        setMenu(menuDetails);
        setIsMenuVisible(true);
        setIsMenuVisible(true);
      } else {
        setMenu([]);
        setIsMenuVisible(false);
        setIsMenuVisible(false);
      }
    } else {
       // Set alert details and make it visible
    setAlertTitle("Selection Required Fields");

    setAlertMessage("Please select a checklist and valid date range.");
    setAlertVisible(true);
    }
  };

  const handleClear = useCallback(() => {
    setIsAlertVisible(true); // Show the custom alert modal
  }, []);

  const handleConfirmClear = () => {
    // Perform the clear action when "OK" is pressed
    setSelectedDepartment("");
    setSelectedCheckList(null);
    setFromDate(new Date());
    setToDate(new Date());
    setMenu([]);
    setIsMenuVisible(false);
    setIsAlertVisible(false); // Hide the alert after clearing
  };

  const handleCancelClear = () => {
    // Close the alert when "Cancel" is pressed
    setIsAlertVisible(false);
  };


  return (
    <SafeAreaView style={{ flex: 1,marginTop:35 }}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <Text style={styles.label}>Department</Text>
      <CustomDropdown
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
     
    <TouchableOpacity
      onPress={() => setIsFilterModalVisible(true)}
      style={styles.filterButton}
    >
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
          <ConfirmCustomAlert
        visible={isAlertVisible}
        title="Clear Selection"
        message="Are you sure you want to clear the selections?"
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
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
    </SafeAreaView>
    
  );
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
    fontFamily: "Mullish",
    marginBottom: 8,
    color:"darkblack",
    fontWeight:"800"
    
  },
  dropdown: {
    borderColor: "#A490F6",
    marginBottom: 16,
    zIndex: 15,
    borderBottomColor: "#A490F6",
    color: "black",
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
  },
  datePickerContainer: {
    flex: 1,
    marginRight: 5,
    fontFamily:"Mullish",
    //color:'#999',
    borderColor: "#A490F6",
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
  placeholderText: {
    fontSize: 16,
    color: "black",
    fontFamily: "Mullish",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  filterButton1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
   
  },
  
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginLeft: 10,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#A490F6",
    fontFamily: "Mullish",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
});
 
export default App;
 
const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Pending':
      return 'orange';
    case 'Drafted':
      return 'blue';
    default:
      return 'grey';
  }
};
 
const formatDate = (date, format) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
 
  switch (format) {
    case 'YYYY-MM-dd':
      return `${year}-${month}-${day}`;
    default:
      return date.toDateString();
  }
};