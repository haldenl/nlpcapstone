import React, { Component } from 'react';
import * as classNames from 'classnames';

import '../styles/PosController.css';

class PosController extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selected = this.props.data.reduce((arr, d) => {
      if (d.selected) { arr.push(d.outputPos); }
      return arr;
    }, []);

    const partsOfSpeech = PosController.pennTreeTags.map((obj) => {
      const pos = obj.tag;

      const classes = classNames({
        'pos': true,
        'selectable': this.props.partsOfSpeech.includes(pos),
        'selected': selected.includes(pos)
      });

      return (
        <div className={classes}
          key={pos}
          onMouseEnter={() => {
          if (!this.props.getHold()) {
            this.props.filterData((d) => {
              return d.outputPos === pos;
            });
          }
        }}>
        {pos}
        </div>
      )
    });

    return (
      <div className="PosController">
        {partsOfSpeech}
      </div>
    )
  }

  static pennTreeTags = [
    { tag: 'CC', description: 'coordinating conjunction' },
    { tag: 'CD', description: 'cardinal number' },
    { tag: 'DT', description: 'determiner' },
    { tag: 'EX', description: 'existential there' },
    { tag: 'FW', description: 'foreign word' },
    { tag: 'IN', description: 'preposition or subordinating conjunction' },
    { tag: 'JJ', description: 'adjective' },
    { tag: 'JJR', description: 'adjective, comparative' },
    { tag: 'JJS', description: 'adjective, superlative' },
    { tag: 'LS', description: 'list item marker' },
    { tag: 'MD', description: 'modal' },
    { tag: 'NN', description: 'noun, singular or mass' },
    { tag: 'NNP', description: 'proper noun, singular' },
    { tag: 'NNPS', description: 'proper noun, plural' },
    { tag: 'PDT', description: 'predeterminer' },
    { tag: 'POS', description: 'possessive ending' },
    { tag: 'PRP', description: 'personal pronoun' },
    { tag: 'PRP$', description: 'possessive pronoun' },
    { tag: 'RB', description: 'adverb' },
    { tag: 'RBR', description: 'adverb, comparative' },
    { tag: 'RBS', description: 'adverb, superlative' },
    { tag: 'RP', description: 'particle' },
    { tag: 'SYM', description: 'symbol' },
    { tag: 'TO', description: 'to' },
    { tag: 'UH', description: 'interjection' },
    { tag: 'VB', description: 'verb, base form' },
    { tag: 'VBD', description: 'verb, past tense' },
    { tag: 'VBG', description: 'verb, gerund or present participle' },
    { tag: 'VBN', description: 'verb, past participle' },
    { tag: 'VBP', description: 'verb, non-3rd person singular present' },
    { tag: 'VBZ', description: 'verb, 3rd person singular present' },
    { tag: 'WDT', description: 'wh-determiner' },
    { tag: 'WP', description: 'wh-pronoun' },
    { tag: 'WP$', description: 'possessive wh-pronoun' },
    { tag: 'wrb', description: 'wh-adverb' }
  ];
}

export default PosController;