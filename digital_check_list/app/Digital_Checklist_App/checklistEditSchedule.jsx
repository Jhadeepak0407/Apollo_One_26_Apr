import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Button, Image, Modal,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library'; // Import media library for permissions and file access
import * as IntentLauncher from 'expo-intent-launcher'; // Import the intent launcher module
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToast from "../../services/Utils/toasts/toastConfig";


import { fetchHeaderData, fetchSubHeaderValue, fetchCheckListDetails,fetchFile } from '../../services/Utils/getCheckListDataforSchedule';
import RadioButtonGroup from '../../projects/digital_check_list/components/radioButtonComponentSchedule';
import { saveFormData, updateFormData } from '../../services/Utils/postCheckListDataSchedule';

const MainPage = () => {
  const [headerData, setHeaderData] = useState([]);
  const [subHeaderValue, setSubHeaderValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkListDetails, setCheckListDetails] = useState([]);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null); // For image handling
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  
  const [showMediaOptions, setShowMediaOptions] = useState(false); 
  const [uploadStatus, setUploadStatus] = useState(null); // Track upload status
  const [fileUri, setFileUri] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [fileName, setFileName] = useState(null); // Set your file name here
  const [finalsave, setfinalsave]= useState(null)
    const [EmpID, setEmpID] = useState(null);
      const [locationid, setLocationID] = useState(null);

  const params = useLocalSearchParams();
  console.log('params',params)
  const router = useRouter();

  
  useEffect(() => {
    // Set screen title dynamically
    if (params.sequenceNumber) {
      router.setParams({ title: params.sequenceNumber });
    }
  },[]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('auth'); // Assuming 'auth' is the key you are using
       /// console.log("storage1",storedUser);
        if (storedUser) {
          const user = JSON.parse(storedUser);
         //// console.log("storage2",user);
          // Extract EmpID and locationid from the stored data
          setEmpID(user.id);
          setLocationID(user.selectedLocation);// Assuming tmsemployeelocationcode is the locationid
          // Log location correctly
        console.log("Location ID:", user.selectedLocation); 
        }
      } catch (error) {
        console.log('Error loading user data from AsyncStorage:', error);
      }
    };

    loadUserData();
  }, []);
  


   // Request permission to access media library on app load
   useEffect(() => {
    const requestPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        setPermissionStatus(status);
      } else {
        setPermissionStatus(status);
        Alert.alert('Permission Error', 'Permission to access media library is not granted.');
      }
    };

    requestPermission();
  }, []);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract base64 from data URL
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convert to base64 string
    });
  };

  useEffect(() => {
    if (!fileName) {
      console.log(`Downloading ${fileName}`);
      console.log(`finalsave ${finalsave}`);
      setFileName(null);
    }
  }, [fileName]); // Trigger effect on fileName change

  const downloadImage = async () => {
    ///console.log("fileNameNoida",fileName)

    if (!loading && permissionStatus === 'granted' && fileName) {
      setLoading(true); // Show loading state while downloading

      try {
        
        
        const response = await fetch(`http://10.10.9.89:203/api/Upload/download?fileName=${fileName}`);
        const fileBlob = await response.blob();
        const tempFileUri = FileSystem.documentDirectory + 'downloadedFile.png';

        // Write the file to local storage
        await FileSystem.writeAsStringAsync(tempFileUri, await blobToBase64(fileBlob), {
          encoding: FileSystem.EncodingType.Base64,
        });

        const publicFileUri = FileSystem.documentDirectory + 'downloadedFilePublic.png';
        await FileSystem.copyAsync({ from: tempFileUri, to: publicFileUri });

        const asset = await MediaLibrary.createAssetAsync(publicFileUri);
        await MediaLibrary.createAlbumAsync('Expo', asset, false);

        setFileUri(publicFileUri); // Store the public URI of the file
        setLoading(false);
        Alert.alert('Download Successful', 'The image has been downloaded to your gallery.');
      } catch (error) {
        setLoading(false);
        console.error('Error fetching file:', error);
        Alert.alert('Download Failed', 'There was an error while downloading the file.');
      }
    }
  };


  useEffect(() => {
    const fetchSubHeader = async () => {
      if (headerData.length > 0) {
        const fieldId = headerData[0].fieldId;
        try {
          await fetchSubHeaderValue(params, fieldId, setSubHeaderValue, setLoading, setError,locationid);
        } catch (error) {
          console.error('Error fetching sub-header value:', error);
        }
      }
    };

    fetchSubHeader();
  }, [headerData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchHeaderData(params, setHeaderData, setLoading, setError);


        await fetchCheckListDetails(setCheckListDetails, setLoading, setError, params , setFileName,setfinalsave,locationid);
        setCheckListDetails((prevDetails) => {
          const updatedDetails = prevDetails.map((item) => {
            if (item.field_id === 1211  ) {
              console.log(`Filename for field_id 1211:`, item.actualFileName);
              console.log(`Finalsave for field_id 1211:`, item.isFinalSave);
  
              // Delay setting fileName and finalsave using a timeout
              setTimeout(() => {
                setFileName(item.actualFileName);
                setfinalsave(item.isFinalSave);
              }, 2000); // Delay of 2000ms
            }
            // Add EmpID to the updated item
            return {
              ...item,
              EmpID: EmpID, // Include EmpID from state
            };
          });
  console.log(updatedDetails);
          // Log updated details in a tabular format
         //// console.table(updatedDetails);
  
          return updatedDetails;
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [locationid]); // Add EmpID to dependencies


 
  
  const handleTextChange = (text, subfieldId) => {
    setSubHeaderValue((prevValues) =>
      prevValues.map((item) =>
        item.subfieldId === subfieldId
          ? { ...item, secondColumnData: text }
          : item
      )
    );
  };

  const validateData = (finalData) => {
    if (!finalData?.questions || !Array.isArray(finalData.questions)) {
      Alert.alert("Validation Error", "Invalid form data.");
      return false;
    }
  
    for (const item of finalData.questions) {
      console.log('dd',item.fieldType_id)
      if (item.fieldType_id === "4" && (!item.selection || item.selection.trim() === "")) {
        console.log('ee',item.fieldType_id)
        console.log("inside")
        Alert.alert("Validation Error", `All questions are mandatory.`);
        return false;
      }


      if (item.fieldType_id === "6" && ( item.actualFileName.trim().toLowerCase()==="null" || !item.actualFileName || item.actualFileName.trim() === ""|| item.actualFileName.trim().toLowerCase === "null")) {
        console.log('ggg',item.fieldType_id)
        console.log("inside")
        Alert.alert("Validation Error", `All questions are mandatory.`);
        return false;
      }
    }
  
    return true; // All validations passed
  };

  const handleDraftSave = async () => {
    setLoading(true);
    let actualFileName = "Null"; // Default value
    // Upload the image first if it exists
    if (image) {
      try {
        const fileName = image.split('/').pop() || `image_${Date.now()}.jpg`;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'];

        // Validate file type
        if (!allowedExtensions.includes(fileExtension)) {
          setLoading(false);
          Alert.alert('Invalid File', 'Please upload a valid image or PDF file.');
          return;
        }

        
        // Create a unique file name
        const originalFileName = fileName.substring(0, fileName.lastIndexOf('.'));
        const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters from the original filename
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Sanitize the timestamp
        const sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9]/g, ''); // Clean the extension to ensure it contains only alphanumeric characters
        
        const uniqueFileName = `${sanitizedFileName}${timestamp}.${sanitizedExtension}`; // Combine them with a dot before the file extension
        
              actualFileName = uniqueFileName;
        console.log("actualfilename",actualFileName);
        // Prepare file data
        const file = {
          uri: image,
          name: uniqueFileName,
          type: 'image/jpeg', // Adjust MIME type as needed
        };

        // Upload the file
        await uploadImage(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to upload the image. Please try again.');
        return;
      }
    }

    // Prepare the final data to save
    const finalData = {
      header: subHeaderValue,
      questions: checkListDetails.map((item) => ({
        ...item,
        actualFileName: item.fieldType_id === "6" ? actualFileName : item.actualFileName || "Null",
        createdBy:EmpID,updatedby:EmpID,locationid:locationid
      })),
    };
    

    console.log(finalData);
    // Save the form data
    try {
       console.log('finalData' ,finalData);
       
      const response = await saveFormData(finalData);
      if (response.status === '200') {
        Alert.alert('Success', 'Draft saved successfully.');
        ///showToast('success', 'Success', 'Draft saved successfully.', 'green');

        router.back(); // Navigate back
      } else {
        Alert.alert('Error', 'Failed to save draft.');
      }
      console.log('API response:', response);
    } catch (error) {
      console.error('Error while saving form data:', error);
      Alert.alert('Error', 'Failed to save the draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = async () => {
    setLoading(true);
    let actualFileName = "Null"; 

    
    // Upload the image first if it exists
    if (image) {
      try {
        const fileName = image.split('/').pop() || `image_${Date.now()}.jpg`;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'];

        // Validate file type
        if (!allowedExtensions.includes(fileExtension)) {
          setLoading(false);
          Alert.alert('Invalid File', 'Please upload a valid image or PDF file.');
          return;
        }

        const originalFileName = fileName.substring(0, fileName.lastIndexOf('.'));
        const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters from the original filename
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Sanitize the timestamp
        const sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9]/g, ''); // Clean the extension to ensure it contains only alphanumeric characters
        
        const uniqueFileName = `${sanitizedFileName}${timestamp}.${sanitizedExtension}`; // Combine them with a dot before the file extension
        
              actualFileName = uniqueFileName;
       //// console.log("actualfilename",actualFileName);
        // Prepare file data
        const file = {
          uri: image,
          name: uniqueFileName,
          type: 'image/jpeg', // Adjust MIME type as needed
        };

        // Upload the file
        await uploadImage(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to upload the image. Please try again.');
        return;
      }
    }
  // Proceed with saving the form data
    const finalData = {
      header: subHeaderValue,
      questions: checkListDetails.map((item) => ({
        ...item,
        actualFileName: item.fieldType_id === "6" ? actualFileName : item.actualFileName || "Null", 
         createdBy:EmpID,updatedby:EmpID,locationid:locationid
      })),
    };
    console.log(finalData);
    try {
      if (!validateData(finalData)) {
        setLoading(false);

        return; // Stop execution if validation fails
      }
      const response = await updateFormData(finalData);
      if (response.status === "200") {
        setLoading(false);
        router.back();
       //// console.table(response.data);
      }
      console.log('API response:', response);
    } catch (error) {
      console.error('Error while saving form data:', error);
    }
  };

  const selectionHandler = ({ key, naText, subFieldID }) => {
    setCheckListDetails((prev) =>
      prev.map((item) =>
        item.field_id === key
          ? { ...item, selection: subFieldID }
          : item
      )
    );
  };

  const remarkHandler = ({ key, remarkText, subFieldID }) => {
    setCheckListDetails((prev) =>
      prev.map((item) =>
        item.field_id === key
          ? { ...item, natext: remarkText, selection: subFieldID }
          : item
      )
    );
  };

  const pickFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Update the image state
    }
    toggleModal(); // Close the modal
  };

  const pickFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.status !== 'granted') {
      alert('Camera access is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Update the image state
      setShowMediaOptions(false); // Hide media options after selecting an image
    }
    toggleModal(); // Close the modal after selecting an image
  };

  
  const toggleMediaOptions = () => {
    setShowMediaOptions(!showMediaOptions);
  };
  const toggleModal = () => {
    setModalVisible((prev) => !prev);
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

  const uploadImage = async (file) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'];
  
  // Maximum file size (10 MB)npm s
  const maxFileSize = 25 * 1024 * 1024;

  // Get file details
  const fileName = file.name; // Original file name
 
  const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

  const fileSize = file.size;


  // Validate file extension
  if (!allowedExtensions.includes(fileExtension)) {
    alert('Invalid file type. Please upload an image or PDF.');
    return;
  }

  // Validate file size
  if (fileSize > maxFileSize) {
    alert('File size exceeds the 10MB limit.');
    return;
  }

  // Generate a unique file name using timestamp
  const originalFileName = fileName.substring(0, fileName.lastIndexOf('.'));
  // const uniqueFileName = `${originalFileName}${new Date().toISOString().replace(/[-:.]/g, '')}${fileExtension}`
  // .replace(/[^a-zA-Z0-9]/g, ''); // Removes all non-alphanumeric characters
  const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters from the original filename
  ////const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Sanitize the timestamp
  const sanitizedExtension = fileExtension.replace(/[^a-zA-Z0-9]/g, ''); // Clean the extension to ensure it contains only alphanumeric characters
  
  const uniqueFileName = `${sanitizedFileName}.${sanitizedExtension}`; // Combine them with a dot before the file extension
  
  console.log("uniquefilename",uniqueFileName);
  // Create FormData
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: uniqueFileName,
    type: file.type, // Ensure the correct MIME type is set
  });
console.log("fileuri",file.uri);
  try {
    const response = await fetch('http://10.10.9.89:203/api/Upload/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (response.ok) {
      /////alert('File uploaded successfully!');
      console.log('Upload Response:', await response.json());
    } else {
      const errorResponse = await response.json();
      alert(`Upload failed: ${errorResponse.message}`);
      console.error('Upload Error:', errorResponse);
    }
  } catch (error) {
    console.error('Error during upload:', error);
    alert('An error occurred while uploading the file.');
  }
  };

  const deleteImage = () => {
    setImage(null); // Clear the image state
  };
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>{params.checklistname}</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
  options={{ 
    title: `Task ID: ${params.sequenceNumber || "Edit Checklist"}`, 
    statusBarColor: "black" 
  }} 
/>
        <View style={styles.sectionContainer}>
          {subHeaderValue?.map((item) => (
            <View key={item.subfieldId} style={styles.fieldContainer}>
              {/* <Text style={styles.label}>{item.textBoxFieldName}</Text> */}
              <TextInput
                style={styles.input}
                value={item.secondColumnData}
                editable={false}
                onChangeText={(text) => handleTextChange(text, item.subfieldId)}
                placeholder="Enter value"
                placeholderTextColor="#495057"
                 textAlign="center"
              />
            </View>
          ))}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Points to check</Text>
            {checkListDetails
              ?.sort((a, b) => Number(a.field_id) - Number(b.field_id))
              ?.map((questionItem, index) => (
                <View key={questionItem.field_id} style={styles.questionContainer}>
                  <Text style={styles.taskDetail}>
                    {index + 1}. {questionItem.field_name}
                  </Text>
                  {questionItem.fieldType_Name === 'Remark' ? (
                    <TextInput
                      style={styles.input1}
                      value={questionItem.natext}
                      placeholder={questionItem.natext ? questionItem.natext : "Enter the Comment"}
                      onChangeText={(text) =>
                        remarkHandler({
                          key: questionItem.field_id,
                          remarkText: text,
                          subFieldID: questionItem.subField,
                        })
                      }
                    />
                  ) : questionItem.fieldType_Name === 'FileUpload' ? (
                    <View>
                    <TouchableOpacity style={styles.uploadButton} onPress={toggleModal}>
                      <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
            
          
                    {modalVisible && (
                      <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={toggleModal}
                      >
                        <View style={styles.modalOverlay}>
                          <View style={styles.modalContent}>
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={toggleModal}
                            >
                              <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
          
                            <View style={styles.optionRow}>
                              <TouchableOpacity style={styles.option} onPress={pickFromCamera}>
                                <Icon name="camera" size={30} color="#FF4C00" />
                                <Text style={styles.optionText}>Camera</Text>
                              </TouchableOpacity>
                              {/* <TouchableOpacity style={styles.option} onPress={pickFromLibrary}>
                                <Icon name="folder" size={30} color="#FF4C00" />
                                <Text style={styles.optionText}>Gallery</Text>
                              </TouchableOpacity> */}
                            </View>
                          </View>
                        </View>
                      </Modal>
                    )}
          
          {image && (
  <View style={styles.imageWrapper}>
    <TouchableOpacity onPress={toggleModal}>
      <Image source={{ uri: image }} style={styles.imagePreview} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
      <Icon name="trash" size={20} color="#FF4C00" />
    </TouchableOpacity>
  </View>
)}


                    
                  </View>
                  ) : (
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
                          subFieldID: e.value,
                        })
                      }
                    />
                  )}
                </View>
              ))}
          </View>
          
          {fileName && fileName !== 'Null' ? (
  <TouchableOpacity onPress={downloadImage} disabled={loading}>
    <Text style={styles.linkText}>
      {loading ? 'Downloading...' : 'Download Image'}
    </Text>
  </TouchableOpacity>
) : (
  <Text style={styles.infoText}>.</Text>
)}



        </View>

       
      </ScrollView>
      
      {/* Modal to display the image */}
      {image && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: image }} style={styles.modalImage} />
            <Button title="Close" onPress={toggleModal} />
          </View>
        </Modal>
      )}
      
      <View style={styles.buttonContainer}>
  {finalsave === null || finalsave === '0' || finalsave === '' ? (
    // Show buttons if finalsave is null, 0, or an empty string
    <>
      <TouchableOpacity style={styles.button} onPress={handleDraftSave}>
        <Icon name="save" size={20} color="#fff" />
        <Text style={styles.buttonText}>Draft</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.successButton]}
        onPress={handleFinalSave}
      >
        <Icon name="check-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </>
  ) : null}
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
  taskDetail: {
    fontSize: 16,
   // fontFamily: 'Mulish_400Regular',
  },
  fieldContainer: {
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0078D4',            // Text in professional blue
    textAlign: 'center',
    backgroundColor: '#E3F2FD',  // Light mode soft blue
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input1: {
    height: 40,
    borderColor: '#CED4DA',
    backgroundColor:'#FFFFFF',
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
    backgroundColor: '#0078D4',
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
    color: '#FFFFFF',
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

  attachmentContainer: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  attachmentLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Keeps dark background for modal container for contrast
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0', // Light gray border for contrast on light background
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0', // Consistent border for preview
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly dark overlay to focus on the modal
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F5F5F5', // Light white-grey background for the modal content
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 18,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    color: '#007AFF',
    marginTop: 8,
    fontSize: 14,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    elevation: 3,
  },
  // deleteButton: {
  //   marginTop: 10, // Creates spacing between the image and delete button
  //   backgroundColor: '#fff',
  //   borderRadius: 5,
  //   padding: 5,
  //   elevation: 2, // Adds a shadow effect
  // },
  // other styles remain the same
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 20,
  },
 
});

export default MainPage;
