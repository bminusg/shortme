/**
 *
 * @param {String} value
 * @returns {String}
 *
 * Converts Umlauts
 */
function umlauts(value) {
  let umlaut = value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/é/g, "e")
    .replace(/ô/g, "o")
    .replace(/(\.|,|\(|\)|\')/g, "");

  return umlaut;
}

/**
 *
 * @param {String} value
 * @returns {String}
 *
 * Create an Abbreviation in three Steps
 * Step 1: Saving first and last char to ensure recognition value
 * Step 2: Remove vowels from text chunk between first and last char
 * Step 3: If the word length is to long already it will remove every secondth char
 *
 */

function getShort(value = "") {
  const vowels = ["a", "e", "i", "o", "u"];
  const firstChar = value[0];
  const lastChar = value[value.length - 1];
  let charChunks = value.substring(1, value.length - 2).split("");

  charChunks = charChunks.filter((char) => vowels.indexOf(char) === -1);
  if (charChunks.length > 4)
    charChunks = charChunks.filter((char, idx) => idx % 2 !== 0);

  return firstChar + charChunks.join("") + lastChar;
}

/**
 *
 * @param {String} input Raw text input
 * @param {Object} options Configuration options
 * @returns {String} output formated shorten text version
 */

function shortme(input = "", options = {}) {
  // DEFINE OPTIONS FALLBACK
  const delimiterChar = options.delimiter || "_";
  const maxCharLength = options.maxCharLength || 16;

  // INPUT BASED VARIABLES
  input = decodeURIComponent(input).trim();
  const fragments = input.split(" ");
  const maxIDX = fragments.length - 1;

  // EDGE CASES
  const edgeCases = { deutschland: "dtl", volkswagen: "vw" };

  // OUTPUT DEFAULT VARIABLE
  let output = "";

  fragments.forEach((fragment, idx) => {
    const delimiter = idx === maxIDX ? "" : delimiterChar;
    fragment = umlauts(fragment);

    // EDGE CASE DEUTSCHLAND
    if (edgeCases[fragment]) output += edgeCases[fragment] + delimiter;
    // SINGLE WORD WITH MAX 16 CHARs
    else if (fragment.length < maxCharLength && fragments.length === 1)
      output += fragment + delimiter;
    // ONLY FIRST CHAR
    else if (fragments.length > 3 && fragment.length < 5) {
      output += fragment[0] + delimiter;
    }
    // ONLY FIRST CHAR WITHOUT DELIMITER
    else if (fragments.length > 3) output += fragment[0];
    // DEFAULT GET SHORT VERSION
    else output += getShort(fragment) + delimiter;
  });

  return output;
}

export default shortme;
