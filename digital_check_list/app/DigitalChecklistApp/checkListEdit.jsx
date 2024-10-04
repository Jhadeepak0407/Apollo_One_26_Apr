import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import RadioButtonGroup from '../../projects/digital_check_list/components/radioButtonComponent';
import CustomDropdown from '../../projects/digital_check_list/components/dropDownListComponent';

const colorPalette = {
  primary: '#0056B3', 
  secondary: '#F9F9F9',
  accent: '#FF4C00', 
  success: '#28A745', 
  textDark: '#212529', 
  textLight: '#FFFFFF', 
  textSubtle: '#6C757D',
  border: '#CED4DA', 
};

const MainPage = () => {
  const [radioSelections, setRadioSelections] = useState({});
  const [dropdownValues, setDropdownValues] = useState({});

  const data = {
    ipno: "DELIP0000",
    checklistname: "Daily Discharge Room Checklist",
    taskDetails: {
      taskID: 123,
      Ward: '4th floor',
      Room: '2654',
      status: 'Pending',
      taskDate: '23/09/2024'
    },
    pointsToCheck: [
      {
        id: 1,
        headername: '1. Main Door Lock And Hinges',
        controltype: 'radiobutton',
        controlvalues: [
          { title: 'OK', value: 0 },
          { title: 'Not OK', value: 1 },
          { title: 'N/A', value: 2 }
        ],
        Remarks: 'Please provide details if not ok or n/a.'
      },
      {
        id: 2,
        controltype: 'radiobutton',
        headername: '2. A/C Thermostat And Remote',
        controlvalues: [
          { title: 'OK', value: 0 },
          { title: 'Not OK', value: 1 },
          { title: 'N/A', value: 2 }
        ],
        Remarks: 'Additional comments here.'
      },
      {
        id: 3,
        controltype: 'dropdownlist',
        headername: '3. A/C Noise Free',
        controlvalues: [
          { title: 'OK', value: 0 },
          { title: 'Not OK', value: 1 },
          { title: 'N/A', value: 2 }
        ],
        Remarks: 'Select the appropriate option.'
      }
    ]
  };

  const handleDraftSave = () => {
    console.log('Draft saved:', { radioSelections, dropdownValues });
  };

  const handleFinalSave = () => {
    console.log('Final saved:', { radioSelections, dropdownValues });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{data.checklistname}</Text>
      </View>

      <View style={styles.taskDetailsContainer}>
        <Text style={styles.taskDetail}>IP No: {data.ipno}</Text>
        <Text style={styles.taskDetail}>Ward: {data.taskDetails.Ward}</Text>
        <Text style={styles.taskDetail}>Room: {data.taskDetails.Room}</Text>
        <Text style={styles.taskDetail}>Status: {data.taskDetails.status}</Text>
        <Text style={styles.taskDetail}>Task Date: {data.taskDetails.taskDate}</Text>
      </View>

      {data.pointsToCheck.map((point) => (
        <View key={point.id} style={styles.pointContainer}>
          <Text style={styles.pointHeader}>{point.headername}</Text>
          {point.controltype === 'radiobutton' ? (
            <RadioButtonGroup
              options={point.controlvalues.map(value => ({ label: value.title.toUpperCase(), value: value.value }))}
              onValueChange={(selectedValue) => {
                setRadioSelections(prev => ({
                  ...prev,
                  [point.id]: selectedValue
                }));
                console.log(`Selected for ${point.headername}: ${point.controlvalues[selectedValue]?.title}`);
              }}
              nARemarks={point.Remarks}
            />
          ) : (
            <CustomDropdown
              data={point.controlvalues}
              value={dropdownValues[point.id]} 
              onChange={(item) => {
                setDropdownValues(prev => ({
                  ...prev,
                  [point.id]: item.onValueChange
                }));
                console.log(`Selected for ${point.headername}: ${item.title}`); 
              }}
              placeholder="Select an option"
            />
          )}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Draft Save" onPress={handleDraftSave} color={colorPalette.accent} />
        <Button title="Final Save" onPress={handleFinalSave} color={colorPalette.success} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colorPalette.secondary, 
  },
  header: {
    paddingVertical: 15,
    backgroundColor: colorPalette.primary, 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: colorPalette.textLight, 
    textAlign: 'center',
  },
  taskDetailsContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E7F1FF', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2, 
  },
  taskDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: colorPalette.textDark, 
  },
  pointContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF', 
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1, 
  },
  pointHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colorPalette.textDark, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default MainPage;
