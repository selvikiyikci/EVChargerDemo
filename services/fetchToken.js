const fetch = require('node-fetch');
let token; 
const fetchToken = async (userId) => {
    try {
        const response = await fetch("https://backend.voltgo.com.tr:5008/api/v1/auth/generate-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error("Error fetching token:", error);
        throw new Error("Error fetching token.");
    }
};
module.exports = fetchToken;