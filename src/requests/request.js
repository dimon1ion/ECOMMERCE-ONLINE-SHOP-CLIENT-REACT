const request = async (method = "GET", url, bodyData = null, formData = null, bearerToken = null) => {
    const options = {
        method: method,
        mode: 'cors'
      };
      if(bodyData !== null){
        options["body"] = JSON.stringify(bodyData);
        options["headers"]= {};
          options["headers"]["Content-Type"] = "application/json";
      }
      else if (formData !== null){
        options["body"] = formData;
      }
      if (bearerToken !== null) {
        if (options["headers"] === undefined){
            options["headers"] = {};
        } 
        options["headers"]["Authorization"] = 'Bearer ' + bearerToken;
      }
      console.log(options);
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      return null;
    }
  };
  
  export default request;