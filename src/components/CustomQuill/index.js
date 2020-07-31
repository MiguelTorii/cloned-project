// @flow
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import withStyles from '@material-ui/core/styles/withStyles';
import cx from 'classnames'
import './quill.custom.css';
import MathQuill from './Math'

window.katex.oldRender = window.katex.render
window.katex.render = (value, node) => {
  // eslint-disable-next-line
  node.innerHTML = `$${value}$`
}

const renderFormulas = () => {
  const formulas = document.getElementsByClassName('ql-formula')
  formulas.forEach(f => {
    const formulaArray = f.innerHTML.split('$')
    if (formulaArray.length === 3) window.katex.oldRender(formulaArray[1], f)
  })
}

const styles = {
  readOnly: {
    '& .ql-toolbar': {
      display: 'none'
    },
    '& .ql-container': {
      border: 'none'
    },
    '& .ql-editor': {
      maxHeight: 'none',
      paddingTop: 0
    }
  }
}

const modules = {
  formula: true,
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['formula'],
    ['image'],
    ['clean']
  ]
};

type Props = {
  placeholder: string,
  value: string,
  readOnly: boolean,
  onChange: Function
};

class CustomQuill extends React.PureComponent<Props> {
  editor: ?Object;

  componentDidMount() {
    renderFormulas()
    const enableMathQuillFormulaAuthoring = MathQuill();
    enableMathQuillFormulaAuthoring(this.editor.editor,{
      displayHistory: true,
      operators: [
        ["\\sqrt[n]{x}", "\\nthroot"],
        ["\\frac{x}{y}","\\frac"],
        ["{a}^{b}", "^"],
        // eslint-disable-next-line
     ["\\int", "\int"],
        ["n \\choose k","\\choose"]
      ]
    });
  }

  render() {
    const { classes, placeholder, value, onChange, readOnly } = this.props;
    renderFormulas()

    return (
      <ReactQuill
        disabled
        className={cx(readOnly && classes.readOnly)}
        modules={modules}
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={element => {
          this.editor = element;
        }}
      />
    );
  }
}

export default withStyles(styles)(CustomQuill);
