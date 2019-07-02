// @flow

import React from 'react';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import RichTextEditor from '../RichTextEditor';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { createQuestion } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function,
  enqueueSnackbar: Function
};

type State = {
  loading: boolean,
  title: string,
  body: string,
  classId: number,
  sectionId: ?number,
  tags: Array<SelectType>,
  tagsError: boolean,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string
};

class CreateQuestion extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    body: '',
    classId: 0,
    sectionId: null,
    tags: [],
    tagsError: false,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
  };

  componentDidMount = () => {
    logEvent({
      event: 'Home- Start Ask Question',
      props: {}
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { tags } = this.state;
    if (tags.length === 0) {
      this.setState({ tagsError: true });
      return;
    }
    this.setState({ tagsError: false });
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '' }
        },
        pushTo
      } = this.props;
      const { title, body, classId, sectionId } = this.state;

      const tagValues = tags.map(item => Number(item.value));
      const {
        points,
        user: { firstName }
      } = await createQuestion({
        userId,
        title,
        body,
        classId,
        sectionId,
        tags: tagValues
      });

      if (points > 0) {
        const { enqueueSnackbar } = this.props;
        enqueueSnackbar(
          `Congratulations ${firstName}, you have just earned ${points} points. Good Work!`,
          {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 2000
          }
        );
      }

      pushTo('/feed');
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleRTEChange = value => {
    this.setState({ body: value });
  };

  handleClassChange = ({
    classId,
    sectionId
  }: {
    classId: number,
    sectionId: number
  }) => {
    this.setState({ classId, sectionId });
  };

  handleTagsChange = values => {
    this.setState({ tags: values });
    if (values.length === 0) this.setState({ tagsError: true });
    else this.setState({ tagsError: false });
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      title,
      body,
      tags,
      tagsError,
      errorDialog,
      errorTitle,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            title="Ask a Question"
            loading={loading}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  {"What's your question?"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <OutlinedTextValidator
                  label="Question"
                  onChange={this.handleTextChange}
                  name="title"
                  value={title}
                  validators={['required']}
                  errorMessages={['Title is required']}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Description</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <RichTextEditor
                  placeholder="Add more details to your question to increase the chances of getting an answer"
                  value={body}
                  onChange={this.handleRTEChange}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Class</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <ClassesSelector onChange={this.handleClassChange} />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Tags</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TagsAutoComplete
                  tags={tags}
                  error={tagsError}
                  onChange={this.handleTagsChange}
                />
              </Grid>
            </Grid>
          </CreatePostForm>
        </ErrorBoundary>
        <ErrorBoundary>
          <SimpleErrorDialog
            open={errorDialog}
            title={errorTitle}
            body={errorBody}
            handleClose={this.handleErrorDialogClose}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(CreateQuestion)));
