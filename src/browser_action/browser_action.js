function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let getNextWord = (function () {
  let index = 0;
  console.log('next!');
  
  return function() {
    Storage.getWords().then((storedWords) => {
      let words = Object.values(storedWords);
      if (!words[index]) return;
      document.getElementById('word').innerText = capitalizeFirstLetter(words[index].word);
      document.getElementById('translate').innerText = words[index].trans;
      index++;
    });
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  getNextWord();
    document.
    getElementById('next').
    addEventListener('click', getNextWord);
})