// apiService.js
const API_BASE_URLS = {
    save: 'http://10.10.9.89:203/api/Users/SaveCheckListforschedule',
    update: 'http://10.10.9.89:203/api/Users/UpdateCheckListSchedule',
  };
  
  const makeApiCall = async (url, finalData) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to call API at ${url}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error; // Rethrow the error after logging it
    }
  };
  
  export const saveFormData = async (finalData) => {
    return await makeApiCall(API_BASE_URLS.save, finalData);
  };
  
  export const updateFormData = async (finalData) => {
    return await makeApiCall(API_BASE_URLS.update, finalData);
  };
  