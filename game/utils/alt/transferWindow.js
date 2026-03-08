function isTransferWindowOpen() {
  const now = new Date();
  const month = now.getMonth() + 1;

  // Januar = Winter
  // Juli + August = Sommer
  return month === 1 || month === 7 || month === 8;
}

module.exports = { isTransferWindowOpen }; 