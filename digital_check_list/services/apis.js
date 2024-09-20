export const loginApi = async ({ username, password, locationid }) => {
  try {
    const payload = {
      username,
      password,
      locationid,
    };

    const response = await fetch("http://10.10.9.89:202/api/Users/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("API RESPONSE 1 => ", response);

    if (response.ok) {
      const data = await response.json();
      return {
        error: "",
        status: response.status,
        data,
      };
    } else {
      return {
        error: `Request failed with status ${response.status}`,
        status: response.status,
        data: {},
      };
    }
  } catch (error) {
    console.log("API ERROR => ", error)

    if (error.name === "AbortError") {
      return {
        error: "Request timeout",
        status: 408,
      };
    } else if (error.name === "TypeError") {
      return {
        error: "No response received from the server",
        status: 503,
      };
    } else {
      return {
        error: error.message,
        status: 500,
      };
    }
  }
};
