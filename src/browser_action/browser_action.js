function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function trimIfNeeded(array) {
  const maxLength = 120;
  let string = array.join(", ");
  return (string.length > maxLength) ? 
    string.substring(0, maxLength - 3) + "..." :
    string;
}

let getNextWord = (function () {
  let index = 0;
  console.log('next!');

  return function() {
    Storage.getWords().then((storedWords) => {
      let words = Object.keys(storedWords);
      let wordToTranslate = storedWords[words[index]];
      console.log(wordToTranslate);
      Translation.getLog(wordToTranslate, 'en', 'pl').
        then((result) => {
          if(_.isEmpty(result.translations)) getNextWord();
          document.getElementById('word').innerText = capitalizeFirstLetter(result.word);
          document.getElementById('translate').innerText = trimIfNeeded(result.translations);
          index++;
        })
    });
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  getNextWord();
    document.
    getElementById('next').
    addEventListener('click', getNextWord);
})