const getRequest = async (url) => {
    try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
      } catch (error) {
        return null;
      }
}

export default getRequest;