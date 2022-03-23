import React from 'react';

import cx from 'classnames';
import quillEmoji from 'quill-emoji';
import ReactQuill, { Quill } from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import withStyles from '@material-ui/core/styles/withStyles';

import './quill.custom.css';
import { styles } from '../_styles/CustomQuill';

import MathQuill from './Math';

const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;
Quill.register(
  {
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji
  },
  true
);
const modules = {
  formula: true,
  toolbar: [
    ['bold', 'italic', 'underline'],
    [
      {
        list: 'ordered'
      },
      {
        list: 'bullet'
      }
    ],
    ['formula'],
    ['image'],
    ['link'],
    ['clean'],
    ['emoji']
  ],
  keyboard: {
    bindings: {
      tabToPost: {
        key: 13,
        shortKey: true,
        handler: function (range, context) {
          const postButtonEl = document.getElementById('post-submit-btn');

          if (postButtonEl) {
            postButtonEl.focus();
          }

          return false;
        }
      }
    }
  },
  'emoji-toolbar': true,
  'emoji-shortname': true
};

type Props = {
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (...args: Array<any>) => any;
  classes?: any;
  ref?: any;
};

class CustomQuill extends React.PureComponent<Props> {
  editor: Record<string, any> | null | undefined;

  componentDidMount() {
    const enableMathQuillFormulaAuthoring = MathQuill();
    enableMathQuillFormulaAuthoring(this.editor.editor, {
      displayHistory: true,
      operators: [
        ['\\sqrt[n]{x}', '\\nthroot'],
        ['\\frac{x}{y}', '\\frac'],
        ['{a}^{b}', '^'], // eslint-disable-next-line
        ['\\int', 'int'],
        ['n \\choose k', '\\choose']
      ]
    });
  }

  render() {
    const { classes, placeholder, value, onChange, readOnly } = this.props;
    return (
      <ReactQuill
        // eslint-disable-next-line
        // @ts-ignore
        disabled
        className={cx(readOnly && classes.readOnly)}
        modules={modules}
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={(element) => {
          this.editor = element;
        }}
      />
    );
  }
}

export default withStyles(styles as any)(CustomQuill);
