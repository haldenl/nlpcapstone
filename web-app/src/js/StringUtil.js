const PUNCTUATION = ['.', ',', '?', ':', ';', '!', '\'', '"'];
const END_OF_SENTENCE = [undefined, '.', '?', '!'];
const CAPITALIZE = [''];

class StringUtil {
  static getCleanString(prev, s, next) {
    let result = '';

    // start of sentence / capitalize
    if (END_OF_SENTENCE.includes(prev)) {
      result += s.charAt(0).toUpperCase() + s.slice(1);
    } else if (CAPITALIZE.includes(s)) {
      result += s.toUpperCase();
    } else {
      result += s;
    }

    // end of sentence / clause / apostrophe
    if (next && !PUNCTUATION.includes(next.charAt(0))) {
      result += ' ';
    }

    return result;
  }
}

export default StringUtil;