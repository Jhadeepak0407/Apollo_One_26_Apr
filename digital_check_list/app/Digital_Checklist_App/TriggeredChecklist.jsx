import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, FlatList, SafeAreaView  } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomDatePicker from "../../projects/digital_check_list/components/getcustomdaterange";
import FilterModal from "../../projects/digital_check_list/components/filterboxschedule";
import ScheduleMenuItem from "../../projects/digital_check_list/components/getmenuitemsforschedule";
import CustomDropdown from "../../projects/digital_check_list/components/getdropdownschedule";
import CustomAlert from "../../projects/digital_check_list/components/alertmessage";
import ConfirmCustomAlert from "../../projects/digital_check_list/components/confirmalert";
import { fetchDepartments, fetchCheckLists, fetchMenuDetails } from "../../services/triggeredchecklistapi";
import { fetchMenuDetailSchedule } from "../../services/schedulechecklistapi";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons'; // Import the icon library
import { SelectCountry } from "react-native-element-dropdown";

const App = () => {
  const router = useRouter();
  const { ctid,locationid  } = useLocalSearchParams(); // Use useLocalSearchParams to access query params
  const locationId = locationid || "10701"; // Set default if undefined


 useEffect(() => {
  console.log("CTID:", ctid);
  console.log("Location ID:", locationid);
}, [ctid, locationid]);

  const [menu, setMenu] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [openDeptDropdown, setOpenDeptDropdown] = useState(false);
  const [checkLists, setCheckLists] = useState([]);
  const [selectedCheckList, setSelectedCheckList] = useState(null);
  const [openChecklistDropdown, setOpenChecklistDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);  // Manages alert visibility
  const [alertTitle, setAlertTitle] = useState("");         // Manages alert title
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const itemsPerPage = 20; // Set how many items per page

  const memoizedDepartments = useMemo(() => departments, [departments]);
  const memoizedCheckLists = useMemo(() => checkLists, [checkLists]);

  const filteredMenu = useMemo(() => {
  if (!filterStatus) return menu;
  return menu.filter((item) => filterStatus.includes(item.finalSave));
}, [menu, filterStatus]);


const paginatedMenu = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredMenu.slice(startIndex, endIndex);
}, [filteredMenu, currentPage, itemsPerPage]);

useEffect(() => {
  const calculatedTotalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  setTotalPages(calculatedTotalPages || 1); // Default to 1 if no items
}, [filteredMenu, itemsPerPage]);

useEffect(() => {
  setCurrentPage(1); 
}, [filterStatus]);


    useEffect(() => {
      if (fromDate && toDate) {
        handleSearch();
      }
    }, [fromDate, toDate,departments]);

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
      fetchCheckLists(locationId, selectedDepartment, ctid).then((data) => {
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
  }, [selectedDepartment, locationId, ctid]);

  const handleSearch = async () => {

   if (selectedCheckList && fromDate && toDate && locationId) 
     {
      console.log(selectedCheckList);
      console.log(fromDate);
      console.log(toDate);
      console.log(locationId);

      const menuDetails = await fetchMenuDetailSchedule(
        selectedCheckList,
        fromDate,
        toDate,
        locationId
      );
      console.log("Menu item", menuDetails);
      if (menuDetails && menuDetails.length > 0) {
        setMenu(menuDetails);
        setIsMenuVisible(true);
     
       
      }
  
      
      else {
        setMenu([]);
        setIsMenuVisible(false);
        setAlertMessage("No Data Avaialale");
        setAlertTitle("Alert");
        setAlertVisible(true);
      }
  }
    
    else {
      setAlertTitle("Selection Required Fields");
      setAlertMessage("Please Select Department & Checklist Name");
      setAlertVisible(true);
    }
  };

  const handleClear = useCallback(() => {
    setIsAlertVisible(true); // Show the custom alert modal
  }, []);

  const handleConfirmClear = () => {
    setSelectedDepartment("");
    setSelectedCheckList(null);
    setFromDate(new Date());
    setToDate(new Date());
    setMenu([]);
    setIsMenuVisible(false);
    setIsAlertVisible(false); // Hide the alert after clearing
  };

  const handleCancelClear = () => {
    setIsAlertVisible(false);
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <Stack.Screen
          options={{
            title: 'Schedule Checklist',
            statusBarColor: 'black',
            headerTitleAlign: 'center',  
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" /> 
              </TouchableOpacity>
            ),
          }}
        />
  
        <CustomDropdown
          open={openDeptDropdown}
          value={selectedDepartment}
          items={memoizedDepartments}
          setOpen={setOpenDeptDropdown}
          setValue={setSelectedDepartment}
          placeholder="Department"
          searchPlaceholder="Search departments..." 
        />
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />

      
        <CustomDropdown
          open={openChecklistDropdown}
          value={selectedCheckList}
          items={memoizedCheckLists}
          setOpen={setOpenChecklistDropdown}
          setValue={setSelectedCheckList}
          placeholder="Checklist"
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
  {/* {["Completed", "Pending", "Drafted"].map((status) => (
    <TouchableOpacity
      key={status}
      style={[
        styles.statusBox,
        status === "Completed" && styles.completedBox,
        status === "Pending" && styles.pendingBox,
        status === "Drafted" && styles.draftedBox,
      ]}
      onPress={() => {
  
        setFilterStatus(status);  // Store the selected status in state
      }}
    >
      <Text
        style={[
          styles.statusText,
          (status === "Pending" || status === "Drafted") && styles.darkText,
        ]}
      >
        {status}
      </Text>
    </TouchableOpacity>
  ))} */}
        </View>

        {isMenuVisible ? (
   <FlatList
   data={paginatedMenu}
   keyExtractor={(item, index) => index.toString()}
   renderItem={({ item }) => <ScheduleMenuItem item={item} />}
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


        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={handlePrevPage}
            style={[styles.paginationButton, currentPage === 1 && styles.disabled]}
          >
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.pageNumber}>{`Page ${currentPage} of ${totalPages}`}</Text>

          <TouchableOpacity
            onPress={handleNextPage}
            style={[styles.paginationButton, currentPage === totalPages && styles.disabled]}
          >
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>



        <View style={styles.buttonRow}>
        <TouchableOpacity
  onPress={() => {
   
    if(selectedCheckList && fromDate && toDate && locationId){
      setIsFilterModalVisible(true);

    }
    else{
      setAlertTitle("Selection Required");
      setAlertMessage("Please select a department , checklist and date before applying filters.");
      setAlertVisible(true);
    }
  }}
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
          onApplyFilter={(finalSave) => {
            setFilterStatus(finalSave);
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
    height:2000
 
  },
  label: {
    fontSize: 16,
    fontFamily: "Mullish",
    marginBottom: 8,
    color: "darkblack",
    fontWeight: "800",
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
    ///marginBottom: 6,
  },
  datePickerContainer: {
    flex: 1,
    marginRight: 5,
    fontFamily: "Mullish",
    borderColor: "#A490F6",
    alignSelf: "auto", // Optional for additional control
  },
  menuList: {
    flex: 1,
   //// marginTop: 10,
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
    marginVertical: 5,
    paddingHorizontal: 10,
    marginTop:10
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


  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  menuList: {
    flex: 1,
    marginTop: 16,
    borderColor: "#A490F6",
  },
  ScheduleMenuItemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  ScheduleMenuItemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ScheduleMenuItemKey: {
    fontWeight: 'bold',
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  ScheduleMenuItemValue: {
    fontSize: 14,
    color: "#666",
    flex: 2,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "black",
  },
  statusBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 5, // Space between status boxes
    elevation: 5, // Adds a shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow blur for iOS
    transform: [{ translateY: 2 }], // Adds slight depth
    justifyContent: 'center', // Centers text vertically
    alignItems: 'center', // Centers text horizontally
    
  },
  
  
  completedBox: {
    backgroundColor: 'green',
    borderColor: '#006400', // Dark green border for contrast
    borderWidth: 2,
  },
  
  pendingBox: {
    backgroundColor: '#b3cde0', // Light blue
    borderColor: '#7a9ba6', // Darker blue border for contrast
    borderWidth: 2,
  },
  
  draftedBox: {
    backgroundColor: '#ffcc80', // Orange
    borderColor: '#e67e22', // Darker orange border for contrast
    borderWidth: 2,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  
  darkText: {
    color: 'black', // For Pending and Drafted
  },
  

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
   /// marginBottom:10,
  },
  paginationButton: {
    padding: 6,
    backgroundColor: '#A490F6',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  paginationText: {
    color: '#fff',
    fontSize: 12,
  },
  pageNumber: {
    fontSize: 12,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});

export default App;
