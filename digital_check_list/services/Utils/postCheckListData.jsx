// apiService.js
const API_BASE_URL = 'http://10.10.9.89:203/api/Users/SaveFormData'; 

export const saveFormData = async (finalData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    });

    if (!response.ok) {
      throw new Error('Failed to save form data');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error; 
  }
};
