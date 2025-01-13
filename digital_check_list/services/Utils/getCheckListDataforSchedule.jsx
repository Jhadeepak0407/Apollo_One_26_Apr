import axios from 'axios';

// Fetch data from the first API (Main Header)
export const fetchHeaderData = async (params,setHeaderData, setLoading, setError) => {
  try {
    setLoading(true);
    const response = await axios.get(`http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains?taskid=${params?.cid}`);
    const fetchedHeaderData = response.data;

    if (!fetchedHeaderData || fetchedHeaderData.length === 0) {
      throw new Error('Fetched header data is empty or invalid.');
    }

    console.log('Fetched Header Data:', fetchedHeaderData);
    setHeaderData(fetchedHeaderData); // Set fetched header data
  } catch (error) {
    console.error('Error fetching header data:', error.message);
    setError('Error fetching header data.');
  } finally {
    // setLoading(false); // Set loading to false
    console.log("Api 1");
  }
};

// Fetch data from the second API (Sub Header)
export const fetchSubHeaderData = async (setSubHeaderData, setLoading, setError) => {
  try {
    const response = await axios.get('http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Main_sub?Fieldid=1201&IsMainHeader=1&Action=TextBox');
    const fetchedSubHeaderData = response.data;

    if (!fetchedSubHeaderData || fetchedSubHeaderData.length === 0) {
      throw new Error('Fetched sub-header data is empty or invalid.');
    }

    console.log('Fetched Sub-Header Data:', fetchedSubHeaderData);
    setSubHeaderData(fetchedSubHeaderData); // Set fetched sub-header data
  } catch (error) {
    console.error('Error fetching sub-header data:', error.message);
    setError('Error fetching sub-header data.');
  } finally {
    console.log("Api 2");
    //setLoading(false); // Set loading to false
  }
};

// Fetch data from the third API (Sub Header Value)

export const fetchSubHeaderValue = async (  params,
    fieldid,setSubHeaderValue, setLoading, setError ) => {
  try {
// console.log("headervalue",fieldid);
// console.log("sequenceNumber",params.sequenceNumber);
// console.log("cid",params.cid);

    //const response = await axios.get('http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains_Header_Value?taskid=16&ip_number=DELIP504639');
    const response = await axios.get(`http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains_Header_ValueforSchedule?SequenceNumber=${params?.sequenceNumber}&TaskId=${params?.cid}&Fieldid=${fieldid}&Location=10701`);
  ////  console.log("response",response);
    const fetchedSubHeaderValue = response.data;

    if (!fetchedSubHeaderValue || fetchedSubHeaderValue.length === 0) {
      throw new Error('Fetched sub-header value is empty or invalid.');
    }

    console.log('Fetched Sub-Header Value:', fetchedSubHeaderValue);
    setSubHeaderValue(fetchedSubHeaderValue); // Set fetched sub-header data
  } catch (error) {
    console.error('Error fetching sub-header data:', error.message);
    setError('Error fetching sub-header data.');
  } finally {
    console.log("Api 2");
    //setLoading(false); // Set loading to false
  }
};

const apiInstance = async ({ method = "GET", url, body }) => {

  try {
    let response;
    if (method === "GET")
      response = await axios.get('http://10.10.9.89:203/api/' + url);
    else response = await axios.post('http://10.10.9.89:203/api/' + url, body, {});


    const fetchedSubHeaderValue = response.data;

    if (!fetchedSubHeaderValue || fetchedSubHeaderValue.length === 0) {
      throw new Error('Unknown Error!');
    }

    // console.table(fetchedSubHeaderValue);

    return {
      data: fetchedSubHeaderValue,
      error: null,
      status: 200
    }

  } catch (error) {
    console.error('Error fetching sub-header data:', error);

    return {
      data: null,
      error: error.message,
      status: 501
    }

  } finally {
    console.log("Api 2");
    //setLoading(false); // Set loading to false
  }
}








export const fetchCheckListDetails = async (setcheckListDetails, setLoading, setError , params,setFileName,setfinalsave) => {

 
   const fetchedCheckListData =await axios.get(`http://10.10.9.89:203/api/Users/CheckListDetailsforschedule?SequenceNumber=${params?.sequenceNumber}&CID=${params?.cid}&LocationId=10701`);


  if (fetchedCheckListData.status == "200") {

    console.log(fetchedCheckListData.data);

    console.log('setcheckListDetailskarm12');
    console.table(fetchedCheckListData.data);
    fetchedCheckListData.data.forEach((item, index) => {
      if (item.fieldType_id == 6) {
         /// console.log(`Filename at index ${index}:`, item.actualFileName);
          setFileName(item.actualFileName),
          setfinalsave(item.isFinalSave);
          console.log("finalsabe",item.isFinalSave)
      }
  });
      setcheckListDetails(fetchedCheckListData.data);
    
    console.log("setcheckListDetails",setcheckListDetails);
  } else setError('Error fetching questions.');


};





