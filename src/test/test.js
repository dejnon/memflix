'use strict';

mocha.setup('bdd');
mocha.reporter('html');

testBackground();

mocha.run();

function testBackground() {
  describe("Storage", function() {
    function resetStorage() {
      return setWords({}).
        then((words) => chai.expect(words).to.deep.equal({})).
        then(() => getWords()).
        then((words) => chai.expect(words).to.deep.equal({}));
    }

    it("Adds new words if none are set", function() {
      let newWords = {
        'that': { word: 'That', trans: 'Tamto', new: true, discarded: false},
        'this': { word: 'This', trans: 'To', new: true, discarded: false},
      };

      return resetStorage().
        then(() => addWords(newWords)).
        then((words) => chai.expect(words).to.deep.equal(newWords)).
        then(() => getWords()).
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
        then(() => addWords(existingWords)).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => getWords()).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => addWords(newWords)).
        then((words) => chai.expect(words).to.deep.equal(combinedWords)).
        then(() => getWords()).
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
        then(() => addWords(existingWords)).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => getWords()).
        then((words) => chai.expect(words).to.deep.equal(existingWords)).
        then(() => addWords(newWords)).
        then((words) => chai.expect(words).to.deep.equal(combinedWords)).
        then(() => getWords()).
        then((words) => chai.expect(words).to.deep.equal(combinedWords)); 
    });
  });

  describe("Parsing", function() {
    it("Computes a hash of the word", function() {
      chai.expect(stripKey("aa")).to.equal("aa"); 
      chai.expect(stripKey("they'll")).to.equal("theyll"); 
      chai.expect(stripKey("We`re")).to.equal("were"); 
      chai.expect(stripKey("rock-bottom")).to.equal("rockbottom"); 
      chai.expect(stripKey("10")).to.equal(undefined); 
      chai.expect(stripKey("$10")).to.equal(undefined);
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
      return chai.expect(parse(subs)).to.deep.equal(words); 
    });
  });
};
