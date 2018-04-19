let Storage = {
  addWords: function(newWords) {
    return Storage.getWords().
      then((existingWords) => {
        let wordsToSet = Object.assign(newWords, existingWords);
        let existingCount = Object.keys(existingWords).length;
        let addedCount = Object.keys(wordsToSet).length;
        console.log("Added");
        console.log(existingCount-addedCount);
        return Storage.setWords(wordsToSet);
      });
  },

  setWords: function(words) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(
        {'words': words}, 
        () => resolve(words)
      );
    })
  },

  getWords: function() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
        ['words'], 
        (storage) => resolve(storage.words)
      );
    });
  },
};