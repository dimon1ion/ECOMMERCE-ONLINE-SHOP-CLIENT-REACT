const getRequestWithToken = async (url, bearerToken) => {
    try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + bearerToken,
            "Content-Type": "application/json",
          },
        });
        return response;
      } catch (error) {
        return null;
      }
}

export default getRequestWithToken;