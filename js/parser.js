let Parser = { 
  stripKey: function(word) {
    let key = word.
      replace(/[\`\'\-\(\)]+/, '').
      replace(/s$/, '').
      toLowerCase();
    if (key.length <= 1 || key.match(/[0-9]/)) return;
    return key;
  },

  extractWords: function(tag) {
    return tag.
      innerHTML.
      replace(/<br/g, " <br").
      replace(/<\/?[^>]+(>|$)/g, '').
      replace(/[\.\,\!\[\]\?\"]+/g, '').
      split(" ");
  },

  xmlToWords: function(rawText) {
    let parser       = new DOMParser();
    let xmlDoc       = parser.parseFromString(rawText.trim(), "text/xml");
    let allLineNodes = xmlDoc.getElementsByTagName("p");
    let uniqWords    = new Object();

    for (let lineNode of allLineNodes) {
      for (let rawWord of Parser.extractWords(lineNode)) {
        let wordKey = Parser.stripKey(rawWord);
        if(!wordKey) continue; 
        uniqWords[wordKey] = rawWord.replace(/^-/, '');
      }
    }
    return uniqWords;
  },
};