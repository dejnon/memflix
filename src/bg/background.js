chrome.runtime.onMessage.addListener((newRequest, sender, sendResponse) => {
  let newWords = Parser.xmlToWords(newRequest.data);
  fetchTranslations(newWords).
    then((w) => {
      console.log(w);
      Storage.setWords(w)});
  return true; // Keep the channel open
});

function fetchTranslations(wordsToTranslate) {
  let promises = 
    Object.keys(wordsToTranslate).sort().map((word) => {
      return Translation.
        getLog(wordsToTranslate[word].word, 'en', 'pl').
        then((newTranslation) => {
          wordsToTranslate[word].trans = newTranslation.translations[0] || '';
          let result = {};
          result[word] = wordsToTranslate[word];
          return result;
        });
    });
  return Promise.
    all(promises).
    then((translations) => {
      return _.reduce(
        translations, 
        (memo, current) => _.assign(memo, current),  
        {});
    });
};