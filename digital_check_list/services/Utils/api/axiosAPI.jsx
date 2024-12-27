import axios from "axios";

// Common API Instance Function
const apiInstance = async ({ method = "GET", url, body = null, headers = {} }) => {
  try {
    console.log(url)
    const response = await axios({
      method,
      url,
      data: body, // Add body for POST/PUT requests
      headers: {
        "Content-Type": "application/json",
        ...headers, // Merge custom headers
      },
    });
    return response.data;
  } catch (error) {
    console.error(`API Error [${method} ${url}]:`, error.message);
    throw error; // Pass error for centralized handling
  }
};

const apiInstance2 = async ({ method, url, data, headers = {} }) => {
  try {
    console.log(url)
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error; // Propagate the error for handling
  }
};

// API Methods
export const fetchVisitorDetails = (baseUrl, authKey) =>
  apiInstance({ method: "GET", url: `${baseUrl}/${authKey}` });

export const getIVRCall = (baseUrl, phoneNumber) =>
  apiInstance({ method: "GET", url: `${baseUrl}/${phoneNumber}` });

// export const checkOut = (baseUrl, authKey) =>
//   apiInstance({ method: "GET", url: `${baseUrl}/${authKey}` });

export const checkOut = (baseUrl, authKey , pass_type) =>
  apiInstance2({ 
    method: "GET", 
    url: `${baseUrl}/CheckOut/${authKey}?pass_type=${pass_type}` 
  });
export const checkIn = (baseUrl, authKey, delip, pass_type) =>
  apiInstance2({ 
    method: "GET", 
    url: `${baseUrl}/CheckIn?authKey=${authKey}&ipNumber=${delip}&pass_type=${pass_type}` 
  });
export default apiInstance;
