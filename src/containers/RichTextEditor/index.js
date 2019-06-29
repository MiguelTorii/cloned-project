// @flow

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { getPresignedURL } from '../../api/media';
import CustomQuill from '../../components/CustomQuill';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    position: 'relative',
    maxWidth: 'inherit',
    maxHeight: 200
  },
  quill: {
    padding: theme.spacing.unit * 2,
    maxHeight: 200
  },
  input: {
    display: 'none'
  },
  loader: {
    position: 'absolute',
    zIndex: 1200,
    top: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  placeholder: string,
  value: string,
  onChange: Function
};

type State = {
  loading: boolean
};

class RichTextEditor extends React.PureComponent<Props, State> {
  state = {
    loading: false
  };

  componentDidMount = () => {
    if (this.rte && this.rte.editor) {
      this.rte.editor
        .getEditor()
        .getModule('toolbar')
        .addHandler('image', this.handleImageInput);
    }
  };

  handleImageInput = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };

  handleInputChange = async () => {
    if (
      this.rte &&
      this.rte.editor &&
      this.fileInput &&
      this.fileInput.files.length > 0 &&
      this.fileInput.files[0].size < 8000000
    ) {
      this.setState({ loading: true });
      try {
        // $FlowIgnore
        const file = this.fileInput.files[0];
        // $FlowIgnore
        const range = this.rte.editor.getEditor().getSelection();
        // $FlowIgnore
        this.rte.editor.getEditor().enable(false);
        const {
          user: {
            data: { userId }
          }
        } = this.props;
        const { type } = file;
        const result = await getPresignedURL({
          userId,
          type: 1,
          mediaType: type
        });

        const { readUrl, url } = result;

        await axios.put(url, file, {
          headers: {
            'Content-Type': type
          }
        });

        // $FlowIgnore
        this.rte.editor.getEditor().insertEmbed(range.index, 'image', readUrl);

        // $FlowIgnore
        this.rte.editor.getEditor().enable(true);
      } catch (err) {
        if (this.rte && this.rte.editor)
          this.rte.editor.getEditor().enable(true);
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  rte: ?Object;

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      },
      placeholder,
      value,
      onChange
    } = this.props;

    const { loading } = this.state;

    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <div className={classes.quill}>
            <CustomQuill
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              ref={element => {
                this.rte = element;
              }}
            />
          </div>
          <input
            accept="image/*"
            className={classes.input}
            ref={fileInput => {
              this.fileInput = fileInput;
            }}
            onChange={this.handleInputChange}
            type="file"
          />
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(RichTextEditor));
