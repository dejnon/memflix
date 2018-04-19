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
    let url = `https://glosbe.com/gapi/translate?`+
              `from=${sourceLanguageCode}&`+
              `dest=${targetLanguageCode}&`+
              `phrase=${wordToTranslate}&`+
              `format=json`

    return axios.get(url)
      .then(function (response) {
        let results = response.data.tuc;
        console.log( Translation._exactTranslation(results));
        return {
          translations: Translation._exactTranslation(results, targetLanguageCode),
          descriptions: Translation._verboseDescription(results, targetLanguageCode)
        };
      })
      .catch(function (error) {
        console.log(error);
      });
  },
}; 