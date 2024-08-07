
export const loginApi = async ({ username, password, locationid }) => {
    try {
        const raw = JSON.stringify({
            username,
            password,
            locationid
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
        };

        const response = await fetch("http://10.10.9.89:202/api/Users/Login", requestOptions);
        if(data===undefined){
            return "API returned Undefined";
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("error", e)
        return {

        }
    }
};