chrome.runtime.onMessage.addListener((newRequest, sender, sendResponse) => {
  let newWords = Parser.xmlToWords(newRequest.data);
  console.log(newWords);
  Storage.setWords(newWords);
  return true; // Keep the channel open
});