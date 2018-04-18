function addWords(newWords) {
  return getWords().
    then((existingWords) => {
      let wordsToSet = Object.assign(newWords, existingWords);
      let existingCount = Object.keys(existingWords).length;
      let addedCount = Object.keys(wordsToSet).length;
      console.log("Added");
      console.log(existingCount-addedCount);
      return setWords(wordsToSet);
    });
}

function setWords(words) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(
      {'words': words}, 
      () => resolve(words)
    );
  })
}

function getWords() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      ['words'], 
      (storage) => resolve(storage.words)
    );
  });
}
