import axios from 'axios';

// Fetch data from the first API (Main Header)
export const fetchHeaderData = async (setHeaderData, setLoading, setError) => {
  try {
    const response = await axios.get('http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains?taskid=16');
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
    const response = await axios.get('http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Main_sub?Fieldid=102&IsMainHeader=1&Action=TextBox');
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

export const fetchSubHeaderValue = async (setSubHeaderValue, setLoading, setError) => {
  try {
    const response = await axios.get('http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains_Header_Value?taskid=16&ip_number=DELIP504639');
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


// export const fetchQuestions = async (setQuestionsData, setLoading, setError) => {
//   const fetchedQuestions = await apiInstance({ url: "Users/DynamicFormDatadetails_Mains_without_header?taskid=16" });


//   if (fetchedQuestions.status == "200") {

//     const modifiedData = fetchedQuestions?.data?.map((item) => {
//       return {
//         ...item,
//         selection: "",
//         natext: "",
//         headerName: item.headerName ? item.headerName : "",
//         headerId: item.headerId ? item.headerId : "",
//         isMainHeader: JSON.stringify(item.isMainHeader)

//       }
//     })

//     console.table(modifiedData);

//     setQuestionsData(modifiedData);
//   } else setError('Error fetching questions.');

//   setLoading(false);

// };



export const fetchCheckListData = async (setQuestionsData, setLoading, setError) => {
  const fetchedCheckListData = await apiInstance({ url: "Users/CheckListDataBind?taskid=16&delip=22" });


  if (fetchedCheckListData.status == "200") {


    console.log('dd');
    console.table(fetchedCheckListData.data);

    setQuestionsData(fetchedCheckListData.data);
  } else setError('Error fetching questions.');

  setLoading(false);

};
