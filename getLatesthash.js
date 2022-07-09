const axios = require("axios");

// 최근 블록의 해시를 받아온다.
module.exports = async () => {
  const latestHash = await axios
    .get("https://blockchain.info/q/latesthash")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log({ status: 400, message: "fail" });
    });
  return {
    status: 200,
    message: "ok",
    data: {
      latestHash: latestHash,
    },
  };
};
