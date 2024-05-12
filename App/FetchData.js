const DataAPI = async () => {
    try {
      let data = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/10bZWv4KdlRFdji-ZQBxWLnerA6sGMD1Jtj9KKCF3m6k/values/sheet1?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCMS2ORuFyuDYgYFuQMloChgjTTCJdjhrQ"
      );
      let { values } = await data.json();
      let [, ...Data] = values.map((data) => data);
      return Data;
    } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Error");
    }
  };
  export default DataAPI;
  