const postRequestForm = async (url, formData = null, bearerToken = null) => {
  const options = {
    method: "POST",
    body: formData !== null ? formData : "",
    
  };
  if (bearerToken !== null) {
    options["headers"] = {
      'Authorization': 'Bearer ' + bearerToken,
    }
  }
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      return null;
    }
  };
  
  export default postRequestForm;
  