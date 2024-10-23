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

// Fetch data from the third API (Questions)
export const fetchQuestions = async (setQuestionsData, setLoading, setError) => {
  try {
    const response = await axios.get('http://10.10.9.89:203/api/Users/DynamicFormDatadetails_Mains_without_header?taskid=16');
    const fetchedQuestions = response.data;

    if (!fetchedQuestions || fetchedQuestions.length === 0) {
      throw new Error('Fetched questions data is empty or invalid.');
    }

    console.log('Fetched Questions Data:', fetchedQuestions);
    setQuestionsData(fetchedQuestions); // Set fetched questions data
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    setError('Error fetching questions.');
  } finally {
    console.log("API 3");
    setLoading(false); // Set loading to false
  }
};
