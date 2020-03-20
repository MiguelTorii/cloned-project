// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { processClasses } from 'containers/ClassesSelector/utils';
import queryString from 'query-string'
import { withRouter } from 'react-router';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import RichTextEditor from '../RichTextEditor';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { createQuestion, getQuestion, updateQuestion } from '../../api/posts';
import { logEvent, logEventLocally } from '../../api/analytics';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary';
import { getUserClasses } from '../../api/user';
import type { CampaignState } from '../../reducers/campaign';

const styles = theme => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  campaign: CampaignState,
  pushTo: Function,
  questionId: number,
  location: {
    search: string
  },
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
  changed: ?boolean,
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
    changed: null,
    errorBody: ''
  };

  handlePush = path => {
    const { location: { search }, pushTo, campaign } = this.props
    if(campaign.newClassExperience) {
      pushTo(`${path}${search}`)
    } else {
      pushTo(path)
    }
  }

  componentDidMount = () => {
    const { questionId } = this.props
    if( questionId) this.loadData()

    const {
      location: { search = '' },
    } = this.props
    const {
      classId,
      sectionId,
    } = queryString.parse(search);

    this.setState({ classId: Number(classId), sectionId: Number(sectionId) })
    logEvent({
      event: 'Home- Start Ask Question',
      props: {}
    });
  };

  loadData = async () => {
    const {
      user: {
        data: { userId, segment }
      },
      questionId
    } = this.props;
    const question = await getQuestion({ userId, questionId });
    const { classes } = await getUserClasses({ userId });
    const userClasses = processClasses({ classes, segment });
    const { sectionId } = JSON.parse(userClasses[0].value);
    const { body, title, classId } = question
    this.setState({ body, title, classId, sectionId });
    const {
      postInfo: { feedId }
    } = question;

    logEvent({
      event: 'Feed- Edit Question',
      props: { 'Internal ID': feedId }
    });
  };

  updateQuestion = async () => {
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '' }
        },
        questionId
      } = this.props;
      const { title, body, classId, sectionId } = this.state;

      const res = await updateQuestion({
        userId,
        questionId,
        title,
        body,
        classId,
        sectionId,
      });

      if (!res.success) throw new Error('Couldnt update')
      
      const { enqueueSnackbar, classes } = this.props;
      enqueueSnackbar({
        notification: {
          message: `Successfully updated`,
          nextPath: `/question/${questionId}`,
          options: {
            variant: 'info',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 7000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          }
        }
      });

      this.handlePush(`/question/${questionId}`);
      this.setState({ loading: false })
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  createQuestion = async () => {
    const { tags } = this.state;
    if (tags.length < 0) {
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
      } = this.props;
      const { title, body, classId, sectionId } = this.state;

      const tagValues = tags.map(item => Number(item.value));
      const {
        points,
        user: { firstName },
        questionId,
      } = await createQuestion({
        userId,
        title,
        body,
        classId,
        sectionId,
        tags: tagValues
      });

      logEventLocally({
        category: 'Question',
        objectId: questionId,
        type: 'Created',
      });

      if (points > 0) {
        const { enqueueSnackbar, classes } = this.props;
        enqueueSnackbar({
          notification: {
            message: `Congratulations ${firstName}, you have just earned ${points} points. Good Work!`,
            nextPath: '/feed',
            options: {
              variant: 'success',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 7000,
              ContentProps: {
                classes: {
                  root: classes.stackbar
                }
              }
            }
          }
        });
      }

      this.handlePush('/feed');
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { questionId } = this.props
    if(questionId) this.updateQuestion()
    else this.createQuestion()
  }

  handleTextChange = name => event => {
    this.setState({ changed: true })
    this.setState({ [name]: event.target.value });
  };

  handleRTEChange = value => {
    const { changed } = this.state
    if (changed === null) this.setState({ changed: false })
    else this.setState({ changed: true })
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
    const { questionId, classes } = this.props;
    const {
      loading,
      classId,
      sectionId,
      title,
      body,
      tags,
      tagsError,
      errorDialog,
      errorTitle,
      changed,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            title="Ask a Question"
            subtitle="When you enter a question here, the question gets sent to your classmates to provide you with the help you need"
            loading={loading}
            changed={changed}
            handleSubmit={this.handleSubmit}
            buttonLabel={questionId ? 'Save' : 'Create'}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  What's your question?
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <OutlinedTextValidator
                  label="Enter your question here"
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
                <ClassesSelector 
                  classId={classId}
                  sectionId={sectionId}
                  onChange={this.handleClassChange} />
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

const mapStateToProps = ({ user, campaign }: StoreState): {} => ({
  user,
  campaign
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push,
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CreateQuestion)));
