export const fetchProductAPI = async (page=1,limit=10) => {
    try {
      console.log("API Product Fetch is called!");
  
      // Making the API request using fetch
      const response = await fetch('https://fake-api1.vercel.app/api/products?page=${page}&limit=${limit}', {
        method: 'GET', // Since it's a GET request, you can omit this line as GET is the default method.
        headers: {
          'Content-Type': 'application/json', // Add any headers you need here.
        },
      });
  
      // Checking if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parsing the JSON response
      const data = await response.json();
  
      // Return the data you want from the response
      return data;
    } catch (error) {
      console.error("Error fetching the products:", error);
      // Handle or rethrow the error
      throw error;
    }
  };