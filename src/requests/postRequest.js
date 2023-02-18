const postRequest = async (url, bodyData = null) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: bodyData !== null ? JSON.stringify(bodyData) : "",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export default postRequest;
