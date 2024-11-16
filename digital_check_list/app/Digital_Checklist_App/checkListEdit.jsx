import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { fetchHeaderData, fetchSubHeaderValue, fetchCheckListDetails } from '../../services/Utils/getCheckListData';
import RadioButtonGroup from '../../projects/digital_check_list/components/radioButtonComponent';
import { saveFormData, updateFormData } from '../../services/Utils/postCheckListData';

const MainPage = () => {
  const [headerData, setHeaderData] = useState([]);
  const [subHeaderValue, setSubHeaderValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkListDetails, setcheckListDetails] = useState([]);
  const [error, setError] = useState(null);

  const params = useLocalSearchParams();
  const router = useRouter(); // Get router object from Expo Router

  useEffect(() => {
    console.table(checkListDetails);
  }, [checkListDetails]);

  useEffect(() => {
    console.table(params);
  }, [params]);

  useEffect(() => {
    // Fetch data and update loading state
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchHeaderData(setHeaderData, setLoading, setError);
        await fetchSubHeaderValue(setSubHeaderValue, setLoading, setError, params);
        await fetchCheckListDetails(setcheckListDetails, setLoading, setError, params);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (headerData.length === 0) {
      fetchData();
    }
  }, []);

  const handleTextChange = (text, subfieldId) => {
    setSubHeaderValue((prevValues) =>
      prevValues.map((item) =>
        item.subfieldId === subfieldId
          ? { ...item, secondColumnData: text }
          : item
      )
    );
  };

  const handleDraftSave = async () => {
    setLoading(true);
    const finalData = {
      header: subHeaderValue,
      questions: checkListDetails,
    };

    console.log(finalData);
    try {
      const response = await updateFormData(finalData);
      if(response.status = "200"){
        setLoading(false);
        router.back(); 
      }
      console.log('API response:', response);
    } catch (error) {
      console.error('Error while saving form data:', error);
    }
  };

  const handleFinalSave = async () => {
    setLoading(true);

    const finalData = {
      header: subHeaderValue,
      questions: checkListDetails,
    };

    try {
      const response = await saveFormData(finalData);
      if(response.status = "200"){
        setLoading(false);
        router.back(); 
      }
      console.log('API response:', response);
    } catch (error) {
      console.error('Error while saving form data:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4C00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const selectionHandler = ({ key, naText, subFieldID }) => {
    setcheckListDetails((prev) =>
      prev.map((item) =>
        item.field_id === key
          ? { ...item, selection: subFieldID, natext: naText }
          : item
      )
    );
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>Daily Discharge Room Checklist</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: "Edit Checklist", statusBarColor: "black" }} />
        <View style={styles.sectionContainer}>
          {subHeaderValue?.map((item) => (
            <View key={item.subfieldId} style={styles.fieldContainer}>
              <Text style={styles.taskDetail}>{item.textBoxFieldName}</Text>
              <TextInput
                style={styles.input}
                value={item.secondColumnData}
                onChangeText={(text) => handleTextChange(text, item.subfieldId)}
              />
            </View>
          ))}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Points to check</Text>
            {checkListDetails
              ?.sort((a, b) => Number(b.field_id) - Number(a.field_id))
              ?.map((questionItem, index) => (
                <View key={questionItem.field_id} style={styles.questionContainer}>
                  <Text style={styles.taskDetail}>
                    {index + 1}. {questionItem.field_name}
                  </Text>
                  <RadioButtonGroup
                    options={{
                      subField: questionItem.subField,
                      checkBoxFieldName: questionItem.checkBoxFieldName,
                    }}
                    selected={questionItem?.selection}
                    setSelectedValue={(e) =>
                      selectionHandler({
                        value: e.label,
                        key: questionItem.field_id,
                        naText: e.naData,
                        subFieldID: e.value,
                      })
                    }
                    nARemarks={questionItem.natext}
                  />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDraftSave}>
          <Icon name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>Draft Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={handleFinalSave}
        >
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Final Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};



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
    //fontFamily: 'Mulish_600SemiBold',
    marginBottom: 10,
  },
  fieldContainer: {
    marginVertical: 10,
  },
  taskDetail: {
    fontSize: 16,
   // fontFamily: 'Mulish_400Regular',
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
    backgroundColor: '#cce7ff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    margin: 10
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
   // fontFamily: 'Mulish_400Regular',

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF4C00',
  },
});

export default MainPage;
