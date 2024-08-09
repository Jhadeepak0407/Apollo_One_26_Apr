import axios from "axios";

export const loginApi = async ({ username, password, locationid }) => {
  try {
    const payload = {
      username,
      password,
      locationid,
    };

    const response = await axios.post(
      "http://10.10.9.89:202/api/Users/Login",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        // timeout: 3000,
      }
    );

    console.log("API RESPONSE 1 => ", response)

    if (response.status >= 200 && response.status < 300) {

      return {
        error: "",
        status: response.status,
        data: response.data,
      };
    } else {
      return {
        error: `Request failed with status ${response.status}`,
        status: response.status,
        data: {},
      };
    }
  } catch (error) {
    if (error.response) {
      return {
        error: error.response.data.message || "An error occurred",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        error: "No response received from the server",
        status: 503,
      };
    } else if (error.code === "ECONNABORTED") {
      return {
        error: "Request timeout",
        status: 408,
      };
    } else {
      return {
        error: error.message,
        status: 500,
      };
    }
  }
};
