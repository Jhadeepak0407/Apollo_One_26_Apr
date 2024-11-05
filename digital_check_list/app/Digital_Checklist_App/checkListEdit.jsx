import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Mulish_400Regular, Mulish_600SemiBold } from '@expo-google-fonts/mulish';
import { Stack, useRouter } from 'expo-router';
import { fetchHeaderData, fetchSubHeaderData, fetchQuestions, fetchSubHeaderValue } from '../../services/Utils/getCheckListData';
import RadioButtonGroup from '../../projects/digital_check_list/components/radioButtonComponent';

const MainPage = () => {
  const [headerData, setHeaderData] = useState([]);
  const [subHeaderData, setSubHeaderData] = useState([]);
  const [subHeaderValue, setSubHeaderValue] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerUpdatedData, setHeaderUpdatedData] = useState(null)
  const [error, setError] = useState(null);
  const counter = useRef(false);

  let [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_600SemiBold,
  });


  useEffect(() => {
    if (counter.current === false) {
      if (headerData.length === 0) {
        fetchHeaderData(setHeaderData, setLoading, setError);
        fetchSubHeaderData(setSubHeaderData, setLoading, setError);
        fetchSubHeaderValue(setSubHeaderValue, setLoading, setError);
        fetchQuestions(setQuestionsData, setLoading, setError);
        setLoading(false);
        counter.current = true;
      }
    }
  }, []);

  const handleTextChange = (text, subfieldId) => {
    setSubHeaderValue((prevValues) => {
      const updatedValues = prevValues.map((item) =>
        item.subfieldId === subfieldId
          ? { ...item, secondColumnData: text }
          : item
      );
      console.log(updatedValues); // Log the updated values after the map operation
      return updatedValues;
    });
  };
  



  const handleDraftSave = () => {
    console.log('Draft saved:', formValues);
  };

  const handleFinalSave = () => {
    const finalData = {
      header: subHeaderValue, // Assuming `subHeaderValue` is the state holding the header data
      questions: questionsData // Assuming `questionsData` is the state holding the questions
    };
  
    console.log('Final saved:', finalData);
  };
  

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const selectionHandler = (value, key, naText) => {
    setQuestionsData(prev => {
      const updatedQuestions = prev.map(item => {
        if (item.fieldId === key) {
          return { ...item, selection: value, natext: naText }; // Update both selection and naText
        }
        return item;
      });
      return updatedQuestions;
    });
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>Daily Discharge Room Checklist</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: "Edit Checklist", statusBarColor: "black" }} />
        {loading ? (
          <ActivityIndicator size="large" color="#545454" />
        ) : (
          <View style={styles.sectionContainer}>
          {subHeaderValue?.map((item) => (
        <View key={item.subfieldId} style={styles.fieldContainer}>
          <Text style={styles.taskDetail}>{item.textBoxFieldName}</Text>
          <TextInput
            style={styles.input}
            value={item.secondColumnData}  // Display secondColumnData as the initial value
            onChangeText={(text) => handleTextChange(text, item.subfieldId)}  // Update state by subfieldId
          />
        </View>
      ))}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Points to check</Text>
              {questionsData?.sort((a, b) => Number(b.fieldId) - Number(a.fieldId))?.map((questionItem) => {
                return (
                  <View key={questionItem.fieldId} style={styles.questionContainer}>
                    <Text style={styles.taskDetail}>{questionItem.fieldName}</Text>
                    <RadioButtonGroup
                      options={questionItem.checkBoxFieldName.split(',').map((option, index) => ({
                        label: option.trim(),
                        value: index,
                      }))}
                      selected={questionItem?.selection}
                      setSelectedValue={(e) => selectionHandler(e.label, questionItem.fieldId, e.naData)}
                      nARemarks={questionItem.natext} // Pass the current naText to the component
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
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
    </>
  );
};



// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F9F9F9',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Mulish_600SemiBold',
    marginBottom: 10,
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
    borderColor: '#CED4DA',
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
    backgroundColor: '#FF4C00',
    borderRadius: 5,
    marginBottom: 20
  },
  successButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
  },
  questionContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#E9ECEF',
    borderRadius: 5,
  },
  headerContainer: {
    backgroundColor: '#cce7ff', // Light blue color
    padding: 10,
    borderRadius: 10,
    alignItems: 'center', // Centers the content horizontally
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Shadow effect for Android
    margin: 10
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333', // Darker text color for better readability
    textAlign: 'center', // Center the text
    fontFamily: 'Mulish_400Regular',

  },
});

export default MainPage;
