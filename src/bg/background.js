chrome.runtime.onMessage.addListener((newRequest, sender, sendResponse) => {
  let newWords = parse(newRequest.data);
  Storage.setWords(newWords);
  return true; // Keep the channel open
});

function stripKey(word) {
  let key = word.
    replace(/[\`\'\-]+/, '').
    replace(/s$/, '').
    toLowerCase();
  if (key.length <= 1 || key.match(/[0-9]/)) return;
  return key;
}

function extractWords(tag) {
  return tag.
    innerHTML.
    replace(/<br/g, " <br").
    replace(/<\/?[^>]+(>|$)/g, '').
    replace(/[\.\,\!\[\]\?\"]+/g, '').
    split(" ");
}

function wordTemplate(word) {
  return { word: word.replace(/^-/, ''), trans: 'To', count: 0 };
}

function parse(rawText) {
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(rawText.trim(), "text/xml");
  let allLineNodes = xmlDoc.getElementsByTagName("p");
  let uniqWords = new Object();

  for (let lineNode of allLineNodes) {
    for (let rawWord of extractWords(lineNode)) {
      let wordKey = stripKey(rawWord);
      if(!wordKey) continue; 
      uniqWords[wordKey] = wordTemplate(rawWord);
    }
  }
  return uniqWords;
}
