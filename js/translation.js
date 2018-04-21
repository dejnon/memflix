let Translation = {
  _exactTranslation: function(results, languageCode) {
    return _(results).
      filter({phrase: {language: languageCode}}).
      map((source) => _.get(source, 'phrase.text')).
      uniqBy(_.lowerCase).
      compact().
      value();
  },

  _verboseDescription: function(results, languageCode) {
    const XmlTags = /<\/?[^>]+(>|$)/g;

    return _(results).
      flatMap((r) => _.get(r, 'meanings')).
      filter({language: languageCode}).
      map((t) => t.text.replace(XmlTags, "")).
      uniqBy(_.lowerCase).
      compact().
      value();
  },

  get: function(wordToTranslate, sourceLanguageCode, targetLanguageCode) {
    let url = 
      (word) => `https://glosbe.com/gapi/translate?`+
                `from=${sourceLanguageCode}&`+
                `dest=${targetLanguageCode}&`+
                `phrase=${word}&`+
                `format=json`
    let extractResults = (response) => response.data.tuc;

    return axios.get(url(wordToTranslate))
      .then(extractResults)
      .then((results) => {
        if (!_.isEmpty(results)) return results;
        let word = _.toLower(wordToTranslate);
        return axios.
          get(url(word)).
          then(extractResults);
      })
      .then((results) => {
        return {
          translations: Translation._exactTranslation(results, targetLanguageCode),
          descriptions: Translation._verboseDescription(results, targetLanguageCode)
        };
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  getLog: function(wordToTranslate, sourceLanguageCode, targetLanguageCode) {
    return Translation.
      get(wordToTranslate, sourceLanguageCode, targetLanguageCode).
      then((t) => { console.log(t); return t; });
  }
}; 