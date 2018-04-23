'use strict';

mocha.setup('bdd');
mocha.reporter('html');

testStorage();
testParser();
testTranslation();

mocha.run();

function testStorage() {
  describe("Storage", function() {
    function resetStorage() {
      return Storage.setWords({}).
        then((words) => chai.expect(words).to.deep.equal({})).
        then(() => Storage.getWords()).
        then((words) => chai.expect(words).to.deep.equal({}));
    }

    it("Adds new words if none are set", function() {
      let newWords = {
        'that': { word: 'That', trans: 'Tamto', new: true, discarded: false},
        'this': { word: 'This', trans: 'To', new: true, discarded: false},
      };

      return resetStorage().
        then(() => Storage.addWords(newWords)).
        then((words) => chai.expect(words).to.deep.equal(newWords)).
        then(() => Storage.getWords()).
        then((words) => chai.expect(words).to.deep.equal(newWords));    
    });

    it("Appends new words to the existing ones", function() {
      let existingWords = {
        'that': { word: 'That', trans: 'Tamto', new: true, discarded: false},
        'this': { word: 'This', trans: 'To', new: true, discarded: false},
      };
      let newWords = {
        'thaw': { word: 'Thaw', trans: 'Odwilz', new: true, discarded: false},
      };
      let combinedWords = Object.assign(existingWords, newWords);

      return resetStorage().
        then(() => Storage.addWords(existingWords)).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => Storage.getWords()).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => Storage.addWords(newWords)).
        then((words) => chai.expect(words).to.deep.equal(combinedWords)).
        then(() => Storage.getWords()).
        then((words) => chai.expect(words).to.deep.equal(combinedWords));
    });

    it("Adds new words but skips the words that already exist", function() {
      let existingWords = {
        'that': { word: 'That', trans: 'Tamto', new: true, discarded: false},
        'this': { word: 'This', trans: 'To', new: true, discarded: false},
      };
      let newWords = {
        'thaw': { word: 'Thaw', trans: 'Odwilz', new: true, discarded: false},
        'this': { word: 'This', trans: 'Shouldnt be here', new: true, discarded: false},
      };
      let combinedWords = {
        'that': existingWords['that'],
        'this': existingWords['this'],
        'thaw': newWords['thaw'],
      };

      return resetStorage().
        then(() => Storage.addWords(existingWords)).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => Storage.getWords()).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => Storage.addWords(newWords)).
        then((words) => chai.expect(words).to.deep.equal(combinedWords)).
        then(() => Storage.getWords()).
        then((words) => chai.expect(words).to.deep.equal(combinedWords)); 
    });
  });
};

function testParser() {
  describe("Parsing", function() {
    it("Computes a hash of the word", function() {
      chai.expect(Parser.stripKey("aa")).to.equal("aa"); 
      chai.expect(Parser.stripKey("they'll")).to.equal("theyll"); 
      chai.expect(Parser.stripKey("We`re")).to.equal("were"); 
      chai.expect(Parser.stripKey("rock-bottom")).to.equal("rockbottom"); 
      chai.expect(Parser.stripKey("10")).to.equal(undefined); 
      chai.expect(Parser.stripKey("$10")).to.equal(undefined);
    });

    it("Parses raw XML into hash of words", function() {
      let subs = `
        <?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <body>
        <p begin="34166666t" end="48333333t" region="region_1" xml:id="subtitle0"><span style="style_2">[Anakind] </span><span style="style_1">I'am your father.</span></p>
        <p begin="80416666t" end="99166666t" region="region_1" xml:id="subtitle1">[Luke] Hello, 10$!<br/><span style="style_1">MY re-discovered son, you.. your yours..</span></p>
        </body>
      `;
      let words = {
        'anakind':      { word: 'Anakind',       trans: 'To', count: 0},
        "iam":          { word: "I'am",          trans: 'To', count: 0},
        'your':         { word: 'yours',         trans: 'To', count: 0},
        'father':       { word: 'father',        trans: 'To', count: 0},
        'luke':         { word: 'Luke',          trans: 'To', count: 0},
        'hello':        { word: 'Hello',         trans: 'To', count: 0},
        'my':           { word: 'MY',            trans: 'To', count: 0},
        'rediscovered': { word: 're-discovered', trans: 'To', count: 0},
        'son':          { word: 'son' ,          trans: 'To', count: 0},
        'you':          { word: 'you',           trans: 'To', count: 0},
      }
      return chai.expect(Parser.xmlToWords(subs)).to.deep.equal(words); 
    });
  });
};

function testTranslation() {
  describe("Translation", function() {
    it("Returns empty string if no translation", function() {
      return Translation.get('', 'pl', 'en').
        then((t) => chai.expect(t.translations).to.deep.equal([])); 
    });
    it("Returns empty string if word does not exist", function() {
      return Translation.get('xyz', 'pl', 'en').
        then((t) => chai.expect(t.translations).to.deep.equal([])); 
    });    
    it("Translates simple word from EN to PL", function() {
      return Translation.get('moth', 'en', 'pl').
        then((t) => chai.expect(t.translations).to.contain('ćma')); 
    });
    it("Translates contraction from EN to PL", function() {
      return Translation.get("we'll", 'en', 'pl').
        then((t) => chai.expect(t.descriptions[0]).to.contain('będziemy'));
    });
    it("Provides full expression for contraction in EN", function() {
      return Translation.get("you'll", 'en', 'pl').
        then((t) => chai.expect(t.descriptions[0]).to.contain("you will")); 
    });
    it("Should not include tags", function() {
      return Translation.get("I'll", 'en', 'pl').
        then((t) => chai.expect(t.descriptions[0]).to.not.contain("<i>"));
    }); 
    it("Should not propose duplicates", function() {
      return Translation.get('dwa', 'pl', 'en').
        then((t) => chai.expect(t.translations.length).to.be.equal(_.uniq(t.translations).length));
    }); 
    it("Proposes several meanings", function() {
      return Translation.get('zamek', 'pl', 'en').
        then((t) => chai.expect(t.translations).to.contain('castle').and.contain('lock')); 
    });
    it("It re-tries with downcase translation if no results found", function() {
      // @TODO - check both calls are made
      return Translation.get('That', 'en', 'pl').
        then((t) => chai.expect(t.translations).to.contain('tamten')); 
    }); 
  });
};