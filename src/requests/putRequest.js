const putRequest = async (url, bodyData) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export default putRequest;
