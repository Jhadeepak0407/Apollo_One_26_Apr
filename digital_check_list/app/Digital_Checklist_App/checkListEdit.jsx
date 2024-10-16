import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons
import { useFonts, Mulish_400Regular, Mulish_600SemiBold } from '@expo-google-fonts/mulish'; // Importing Mulish font
import { Stack } from 'expo-router';
import axios from 'axios';

const colorPalette = {
  primary: '#0056B3',
  secondary: '#F9F9F9',
  accent: '#FF4C00',
  success: '#28A745',
  textDark: '#212529',
  textLight: '#FFFFFF',
  border: '#CED4DA',
};      

const renderControl = (field, onChange) => {
  switch (field.fieldType) {
    case 'Textbox':
      return (
        <TextInput
          style={styles.input}
          placeholder={`Enter ${field.fieldName}`} 
          onChangeText={text => onChange(field.fieldId, text)}
        />
      );
    case 'Dropdown':
      return (
        <Picker
          style={styles.input}
          onValueChange={value => onChange(field.fieldId, value)} 
        >
          <Picker.Item label={`Select ${field.fieldName}`} value="" />
          {field.controlvalues && field.controlvalues.map(option => (
            <Picker.Item key={option.value} label={option.title} value={option.value} />
          ))}
        </Picker>
      );
    default:
      return <Text>No control available</Text>; // Fallback
  }
};

const MainPage = () => {
  const [dataa, setData] = useState({ pointsToCheck: [] }); // Initialize with empty pointsToCheck
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error
  const [formValues, setFormValues] = useState({}); // State to manage form input values

  let [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_600SemiBold,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains?taskid=16`);
        const fetchedData = response.data;

        if (!fetchedData || fetchedData.length === 0) {
          throw new Error('Fetched data is empty or invalid.');
        }

        console.log('Fetched Main Data:', fetchedData); 

        const promises = fetchedData.map(async (item) => {
          const { fieldId } = item;

          if (!fieldId) {
            console.warn(`FieldId is missing for item: ${JSON.stringify(item)}`);
            return null;
          }

          const subResponse = await axios.get(`http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Main_sub?Fieldid=102&IsMainHeader=1&Action=TextBox`);
          const subData = subResponse.data;

          return { ...item, subData };
        });

        const allResponses = await Promise.all(promises);

        const filteredResponses = allResponses.filter(response => response !== null);
        console.log('All Merged Responses:', filteredResponses);

        setData({ pointsToCheck: filteredResponses });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (fieldId, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  const handleDraftSave = () => {
    console.log('Draft saved:', formValues);
  };

  const handleFinalSave = () => {
    console.log('Final saved:', formValues);
  };

  if (loading) {
    return <Text>Loading...</Text>; 
  }

  if (error) {
    return <Text>Error: {error}</Text>; 
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: "Edit Checklist", statusBarColor: "black" }} />

      <View style={styles.taskDetailsContainer}>
        {dataa.pointsToCheck.map((point) => (
          <View key={point.fieldId} style={styles.fieldContainer}>
            <Text style={styles.taskDetail}>{point.fieldName}</Text>
            {point.subData && point.subData.map(field => renderControl(field, handleInputChange))} {/* Loop through subData */}
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDraftSave}>
          <Icon name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>Draft Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={handleFinalSave}>
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Final Save</Text>
        </TouchableOpacity>
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
  taskDetailsContainer: {
    padding: 10,
  },
  fieldContainer: {
    marginVertical: 10,
  },
  taskDetail: {
    fontSize: 16,
    fontFamily: 'Mulish_400Regular',
  },
  input: {
    height: 40,
    borderColor: colorPalette.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colorPalette.accent,
    borderRadius: 5,
  },
  successButton: {
    backgroundColor: colorPalette.success,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
  },
});

export default MainPage;
