// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { processClasses } from 'containers/ClassesSelector/utils';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import UploadImages from '../UploadImages';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { getNotes, updatePhotoNote, createPhotoNote } from '../../api/posts';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary';
import { getUserClasses } from '../../api/user';

const styles = theme => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  leftCharacters: {
    marginRight: theme.spacing(2)
  }
});

type ImageUrl = {
  fullNoteUrl: string,
  note: string,
  noteUrl: string,
}

type Props = {
  classes: Object,
  noteId: string,
  user: UserState,
  pushTo: Function,
  enqueueSnackbar: Function
};

type State = {
  loading: boolean,
  title: string,
  classId: number,
  sectionId: ?number,
  summary: string,
  tags: Array<SelectType>,
  tagsError: boolean,
  errorDialog: boolean,
  notes: Array<ImageUrl>,
  errorTitle: string,
  errorBody: string,
  changed: ?boolean,
  isEdit: boolean
};

class CreateNotes extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    classId: 0,
    sectionId: null,
    summary: '',
    changed: null,
    tags: [],
    notes: [],
    tagsError: false,
    errorDialog: false,
    errorTitle: '',
    isEdit: false,
    errorBody: ''
  };

  uploadImages: {
    handleUploadImages: Function
  };

  componentDidMount = async () => {
    this.loadData();
  };
  
  loadData = async () => {
    const {
      user: {
        data: { userId, segment }
      },
      noteId,
      pushTo
    } = this.props;
    try {
      if(!noteId) return
      this.setState({ isEdit: true })
      const photoNote = await getNotes({ userId, noteId });
      const { classes } = await getUserClasses({ userId });
      const userClasses = processClasses({ classes, segment });
      const { sectionId } = JSON.parse(userClasses[0].value);
    
      const {
        title,
        classId,
        body,
        tags,
        notes
      } = photoNote

      this.setState({
        title,
        classId,
        sectionId,
        summary: body,
        tags,
        notes
      })
    } catch(e) {
      pushTo('/feed');
    }
  };
 
  createNotes = async () => {
    const { tags } = this.state;
    if (tags.length < 0) {
      this.setState({ tagsError: true });
      return;
    }
    this.setState({ tagsError: false });
    this.setState({ loading: true });
    if (this.uploadImages) {
      try {
        const {
          user: {
            data: { userId = '' }
          },
          pushTo
        } = this.props;
        const { title, classId, sectionId, summary } = this.state;
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map(item => item.id);
        const tagValues = tags.map(item => Number(item.value));

        const {
          points,
          user: { firstName }
        } = await createPhotoNote({
          userId,
          title,
          classId,
          sectionId,
          fileNames,
          comment: summary,
          tags: tagValues
        });

        setTimeout(() => {
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
          pushTo('/feed')
        }, 3000);
      } catch (err) {
        if (err.message === 'no images')
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Error',
            errorBody: 'You must add at least 1 image'
          });
        else
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Unknown Error',
            errorBody: 'Please try again'
          });
      }
    }
  };

  updateNotes = async () => {
    this.setState({ loading: true });
    if (this.uploadImages) {
      try {
        const {
          user: {
            data: { userId = '' }
          },
          pushTo,
          noteId
        } = this.props;
        const { title, classId, sectionId, summary } = this.state;
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map(item => item.id);

        await updatePhotoNote({
          noteId,
          userId,
          title,
          classId,
          sectionId,
          fileNames,
          comment: summary,
        });


        setTimeout(() => {
          this.setState({ loading: false })
          const { enqueueSnackbar, classes } = this.props;
          enqueueSnackbar({
            notification: {
              message: `Successfully updated`,
              nextPath: `/notes/${noteId}`,
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
          pushTo(`/notes/${noteId}`)
        }, 3000)

      } catch (err) {
        if (err.message === 'no images')
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Error',
            errorBody: 'You must add at least 1 image'
          });
        else
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Unknown Error',
            errorBody: 'Please try again'
          });
      }
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const {noteId} = this.props
    if(noteId) this.updateNotes()
    else this.createNotes()
  }

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value, changed: true });
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

  getLeftCharts = field => {
    // help ? 50 - help.length : 50;
    return 50 - field.length >= 0 ? 50 - field.length : 0;
  };

  imageChange = () => this.setState({ changed: true })

  render() {
    const { classes } = this.props;
    const {
      loading,
      title,
      summary,
      tags,
      tagsError,
      errorDialog,
      errorTitle,
      classId,
      notes,
      sectionId,
      isEdit,
      changed,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            title="Share Notes"
            subtitle="When you upload your notes, it’s your classmates who can see them. You can help others by sharing and also get feedback too."
            loading={loading}
            changed={changed}
            buttonLabel={isEdit ? 'Save' : 'Share'}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Title</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <OutlinedTextValidator
                  label="Title"
                  onChange={this.handleTextChange}
                  name="title"
                  value={title}
                  validators={['required']}
                  errorMessages={['Title is required']}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Class</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <ClassesSelector 
                  classId={classId}
                  sectionId={sectionId}
                  onChange={this.handleClassChange} 
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Summary</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <OutlinedTextValidator
                  label="Summary"
                  onChange={this.handleTextChange}
                  name="summary"
                  multiline
                  rows={4}
                  value={summary}
                  validators={['required']}
                  errorMessages={['Summary is required']}
                />
                <Typography
                  variant="subtitle1"
                  align="right"
                  className={classes.leftCharacters}
                >{`${this.getLeftCharts(
                  summary
                )} more characters to earn points`}</Typography>
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
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Notes</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <UploadImages
                  notes={notes}
                  imageChange={this.imageChange}
                  innerRef={node => {
                    this.uploadImages = node;
                  }}
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
      pushTo: push,
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateNotes));
