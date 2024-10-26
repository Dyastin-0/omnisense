import axios from "axios";

export const askGemini = async (message) => {
  try {
    const response = await axios.post(
      `https://omnisense.ai.dyastin.tech/ask/`,
      { message }
    );
    return response.data;
  } catch (error) {
    console.error("Error asking Gemini:", error);
    throw error;
  }
};
