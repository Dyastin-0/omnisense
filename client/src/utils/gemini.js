export const askGemini = async (message) => {
  const response = await fetch.post("https://omnisense.ai.dyastin.tech/ask/", {
    message,
  });

  return response.data;
};
