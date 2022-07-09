const axios = require("axios");
// 그냥 import export 연습해볼까 해서..
const getLatesthash = require("./getLatesthash");

const hashedBits = async () => {
  const gettingLatesthash = async () => {
    let a = await getLatesthash();
    const res = JSON.parse(JSON.stringify(a));
    const data = res.data;
    const latestHash = data.latestHash;
    return latestHash;
  };
  let hash = await gettingLatesthash();
  const gettingBlockInfo = async () => {
    return axios
      .get(`https://blockchain.info/rawblock/${hash}`)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const blockInfo = await gettingBlockInfo();
  // maxTaget 상수 = 비트코인 제네시스 블록의 난이도 1d00ffff 의 bits 값을 해시한것
  const maxTarget = 0x00000000ffff0000000000000000000000000000000000000000000000000000;
  // bits 를 가져온다.
  const bits = blockInfo.data.bits;
  // bits 값을 8자리 16진수로 변환한다.
  const bitsToHex = "0x".concat(bits.toString(16));
  // 인풋에서 앞의 1바이트는 지수
  const indices = "0x".concat(bitsToHex.slice(2, 4));
  // 인풋에서 뒤의 3바이트는 계수
  const coefficient = "0x".concat(bitsToHex.slice(4));
  // 식 : 목푯값 (target) = 계수 (coefficient) * 2 ^ (8 * (지수 (indices) - 3))
  const target =
    parseInt(Number(coefficient), 10) *
    Math.pow(2, 8 * parseInt(Number(indices) - 3));
  // 나온 값을 다시 16진수로 치환한다.
  const hexedTarget = target.toString(16);
  // 2바이트의 16진수의 형태로 변환한다.
  let temp = [];
  if (hexedTarget.length <= 64) {
    temp = hexedTarget.split("");
    // Leading zeros 붙이기
    for (let i = 0; i < 64 - hexedTarget.length; i++) {
      temp.unshift("0");
    }
  }

  // 결과
  const hasedTarget = "0x".concat(temp.join(""));
  // Difficulty = MAX_TARGET / CURRENT_TARGET
  const difficulty = (maxTarget / Number(hasedTarget)).toFixed(2);
  console.log(
    `최신 블록: ${hash}\n난이도: ${difficulty}\n해싱된 목푯값: ${hasedTarget}`
  );
};

hashedBits();
