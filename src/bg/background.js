chrome.runtime.onMessage.addListener((newRequest, sender, sendResponse) => {
  let newWords = Parser.xmlToWords(newRequest.data);
  Storage.setWords(newWords);
  return true; // Keep the channel open
});
