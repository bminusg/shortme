"use strict";

/**
 *
 * @desc Converting umlauts to html friendly characters
 * @param {String} value
 * @returns {String}
 *
 */

function replaceSpecialChars(value) {
  let replaced = value
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/é/g, "e")
    .replace(/ô/g, "o")
    .replace(/(\.|\,|\(|\)|\')/g, "");

  return replaced;
}

/**
 *
 * @param {String} fragment
 * @returns {String}
 */

function replaceDelimiterChars(fragment) {
  fragment = fragment.replace(/\-|\_|\:|\:\:|\|\|/g, "");
  return fragment;
}

function defineCharChunks(value = "", options = {}) {
  return {
    firstChar: value[0],
    lastChar: value[value.length - 1],
    chunks: value.substring(1, value.length - 1).split(""),
    isProtected: options.protect.indexOf(value) > -1 ? true : false,
    mergeChunk() {
      if (this.chunks.length < 2) return this.firstChar;
      return this.firstChar + this.chunks.join("") + this.lastChar;
    },
    charLength() {
      const chunkLength = this.chunks.length;
      if (chunkLength === 1) return 1;
      return chunkLength + 2;
    },
  };
}

const shortMethods = {
  /**
   * @description replace with first letter if char amount of the word is smaller then 4
   * @param {Array} fragments
   * @returns {Array}
   */
  replaceArticles(fragments = [], options) {
    const replacedArticles = fragments.map((fragment) =>
      options.protect.indexOf(fragment) === -1 && fragment.length <= 6
        ? fragment[0]
        : fragment
    );
    return replacedArticles;
  },

  /**
   * @description remove every vowel from every fragment
   * @param {Array} fragments
   * @param {Object} options
   * @returns {Array}
   */
  removeVowels(fragments = [], options) {
    const vowels = ["a", "e", "i", "o", "u"];
    const removedVowelsFragments = [];
    let charChunks = fragments.map((fragment) =>
      defineCharChunks(fragment, options)
    );

    for (let charChunk of charChunks) {
      if (!charChunk.isProtected) {
        charChunk.chunks = charChunk.chunks.filter(
          (char) => vowels.indexOf(char) === -1
        );
      }

      const removedVowels = charChunk.mergeChunk();
      removedVowelsFragments.push(removedVowels);
    }

    return removedVowelsFragments;
  },

  /**
   * @description remove every second char from word
   * @param {Array} fragments
   * @param {Object} options
   * @returns {Array}
   */
  removeEverySecondChar(fragments = [], options) {
    let removedEverySecondChar = [];
    let charChunks = fragments.map((fragment) =>
      defineCharChunks(fragment, options)
    );

    charChunks.forEach((charChunk) => {
      if (!charChunk.isProtected)
        charChunk.chunks = charChunk.chunks.filter(
          (char, idx) => idx % 2 !== 0
        );

      const slaughted = charChunk.mergeChunk();
      removedEverySecondChar.push(slaughted);
    });

    return removedEverySecondChar;
  },

  /**
   * @description concludes all first letters to one array item
   * @param {Array} fragments
   * @returns {Array}
   */
  defineAcronym(fragments = []) {
    let acronym = fragments.map((fragment) => fragment[0]);
    acronym = [acronym.join("")];
    return acronym;
  },
};

/**
 *
 * @param {String} input Raw text input
 * @param {Object} options Optional configuration options
 * @returns {String} formated shorten text version
 */
module.exports = function shortme(
  input = "",
  options = {
    delimiter: "_",
    maxCharLength: 16,
    protect: [],
  }
) {
  // BASIC TEXT CONVERTION
  input = decodeURIComponent(input).toLowerCase().trim();
  input = replaceDelimiterChars(input);

  // VALIDATE OPTIONS
  options.maxCharLength = parseInt(options.maxCharLength);

  // BUILD PREFORMATTED STRING FRAGEMENTS
  let fragments = input
    .split(" ")
    .filter((inputChunk) => inputChunk.length > 1)
    .map((inputChunk) => replaceSpecialChars(inputChunk));

  // DEFINE INITIAL OUTPUT
  let output = fragments.join(options.delimiter);

  // SHORTEN METHOD LOOP
  for (const method in shortMethods) {
    fragments = shortMethods[method](fragments, options);
    output = fragments.join(options.delimiter);

    console.log("OUTPUT", output, output.length);
    if (output.length <= options.maxCharLength) break;
  }

  return output;
};
