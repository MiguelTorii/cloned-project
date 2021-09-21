/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable no-nested-ternary */
// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import { processClasses } from 'containers/ClassesSelector/utils';
import { cypher } from 'utils/crypto';
import OutlinedTextValidator from 'components/OutlinedTextValidator/OutlinedTextValidator';
import SimpleErrorDialog from 'components/SimpleErrorDialog/SimpleErrorDialog';
import CreatePostForm from 'components/CreatePostForm/CreatePostForm';
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip';
import RichTextEditor from 'containers/RichTextEditor/RichTextEditor';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import type { CampaignState } from '../../reducers/campaign';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import {
  createBatchPhotoNote,
  getNotes,
  updatePhotoNote,
  createPhotoNote
} from '../../api/posts';
import * as notificationsActions from '../../actions/notifications';
import { logEventLocally } from '../../api/analytics';
import UploadImages from '../UploadImages/UploadImages';

const styles = (theme) => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  leftCharacters: {
    marginRight: theme.spacing(2)
  },
  leftCharactersRed: {
    marginRight: theme.spacing(2),
    color: theme.circleIn.palette.brand
  },
  errorMessage: {
    color: theme.circleIn.palette.brand,
    fontWeight: 'bold',
    marginLeft: theme.spacing()
  },
  divisorOr: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    textAlign: 'center'
  },
  divisorTitle: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    textAlign: 'center'
  },
  labelClass: {
    fontWeight: 'bold',
    position: 'absolute',
    top: 6,
    left: 24,
    backgroundColor: theme.circleIn.palette.formBackground,
    zIndex: 9,
    padding: theme.spacing(0, 0.5)
  },
  textValidator: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.circleIn.palette.appBar
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F5C264'
    }
  },
  quillGrid: {
    '& .quill': {
      '& .ql-toolbar': {
        backgroundColor: theme.circleIn.palette.appBar,
        borderColor: theme.circleIn.palette.appBar
      },
      '& .ql-container': {
        borderColor: theme.circleIn.palette.appBar,

        '& .ql-editor.ql-blank::before': {
          opacity: 1
        }
      }
    }
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  wrapper: {
    margin: theme.spacing(),
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%'
  },
  submit: {
    fontWeight: 'bold',
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)',
    color: theme.circleIn.palette.primaryText1,
    marginRight: theme.spacing(1),
    borderRadius: 100,
    fontSize: 20,
    [theme.breakpoints.up('sm')]: {
      width: 160
    }
  },
  mt3: {
    marginTop: theme.spacing(3)
  },
  breakdown: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    color: theme.circleIn.palette.brand
  },
  counter: {
    textAlign: 'right',
    color: theme.circleIn.palette.brand,
    paddingRight: theme.spacing(2)
  }
});

type ImageUrl = {
  fullNoteUrl: string,
  note: string,
  noteUrl: string
};

type Props = {
  classes: Object,
  noteId: string,
  user: UserState,
  pushTo: Function,
  campaign: CampaignState,
  width: string,
  enqueueSnackbar: Function,
  handleUpdateImages: Function,
  location: {
    search: string,
    pathname: string
  }
};

type State = {
  loading: boolean,
  title: string,
  classId: number,
  sectionId: ?number,
  summary: string,
  tags: Array<SelectType>,
  tagsError: boolean,
  hasImages: boolean,
  errorDialog: boolean,
  notes: Array<ImageUrl>,
  errorTitle: string,
  errorBody: string,
  changed: ?boolean,
  isEdit: boolean
};

class CreateNotes extends React.PureComponent<Props, State> {
  uploadImages: {
    handleUploadImages: Function
  };

  constructor(props) {
    super(props);

    const {
      classId: currentSelectedClassId,
      sectionId: curretnSelectedSectoinId,
      classList
    } = props;

    this.state = {
      loading: false,
      title: '',
      // tagsError: false,
      classId: currentSelectedClassId || 0,
      sectionId: curretnSelectedSectoinId || 0,
      summary: '',
      changed: false,
      tags: [],
      errorDialog: false,
      errorTitle: '',
      isEdit: false,
      classList: classList || [],
      errorBody: '',
      questionToolbar: null,
      editor: null,
      body: null,
      notes: []
      // count: 50,
    };
  }

  handlePush = (path) => {
    const { pushTo, campaign } = this.props;

    const { sectionId, classId } = this.state;

    if (campaign.newClassExperience) {
      const search = !this.canBatchPost()
        ? `?class=${cypher(`${classId}:${sectionId}`)}`
        : '';
      pushTo(`${path}${search}`);
    } else {
      pushTo(path);
    }
  };

  componentDidMount = async () => {
    this.loadData();
    const { editor } = this.state;
    // const { classId, sectionId } = decypherClass()
    // this.setState({ classId: Number(classId), sectionId: Number(sectionId) })

    if (localStorage.getItem('note')) {
      const note = JSON.parse(localStorage.getItem('note'));
      if ('title' in note) {
        this.setState({ title: note.title });
      }
      if ('body' in note) {
        this.setState({ body: note.body });
      }
      if ('changed' in note) {
        this.setState({ changed: note.changed });
      }
    }

    if (editor) {
      this.setState({
        questionToolbar: editor.getEditor().theme.modules.toolbar
      });
    }
  };

  handleRTEChange = (value) => {
    this.setState({
      body: value,
      changed: true
      // count: Math.max(50 - value.length, 0)
    });

    if (localStorage.getItem('note')) {
      const currentNote = JSON.parse(localStorage.getItem('note'));
      currentNote.body = value;
      currentNote.changed = true;
      localStorage.setItem('note', JSON.stringify(currentNote));
    } else {
      const note = {
        body: value,
        changed: true
      };
      localStorage.setItem('note', JSON.stringify(note));
    }
  };

  loadData = async () => {
    const {
      user: {
        data: { userId, segment },
        userClasses: { classList: classes }
      },
      noteId
    } = this.props;
    try {
      if (!noteId) return;
      this.setState({ isEdit: true });
      const photoNote = await getNotes({
        userId,
        noteId: parseInt(noteId, 10)
      });
      const userClasses = processClasses({ classes, segment });
      const { sectionId } = JSON.parse(userClasses[0].value);

      const { title, classId, body, tags } = photoNote;

      this.setState({
        title,
        classId,
        sectionId,
        body,
        tags
      });
    } catch (e) {
      this.handlePush('/feed');
    }
  };

  createNotes = async () => {
    const { tags } = this.state;
    const { setIsPosting } = this.props;

    if (tags.length < 0) {
      return;
    }
    this.setState({ loading: true });
    if (this.uploadImages) {
      try {
        const {
          user: {
            data: { userId = '' }
          }
        } = this.props;
        const { classList, title, classId, sectionId, body } = this.state;

        if (this.canBatchPost() && !classList.length) {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Select one more classes',
            errorBody: 'Please try again'
          });
          return;
        }
        if (!this.canBatchPost() && !classId && !sectionId) {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Choose a class',
            errorBody: 'Please try again'
          });
          return;
        }
        if (!body) {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Add any description',
            errorBody: 'Please try again'
          });
          return;
        }

        const sectionIds = classList.map((c) => c.sectionId);
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map((item) => item.id);
        const tagValues = tags.map((item) => Number(item.value));

        setIsPosting(true);
        const {
          points,
          user: { firstName },
          classes: resClasses,
          photoNoteId
        } = this.canBatchPost()
          ? await createBatchPhotoNote({
              userId,
              title,
              sectionIds,
              fileNames,
              comment: body,
              tags: tagValues
            })
          : await createPhotoNote({
              userId,
              title,
              classId,
              sectionId,
              fileNames,
              comment: body,
              tags: tagValues
            });

        logEventLocally({
          category: 'PhotoNote',
          objectId: photoNoteId,
          type: 'Created'
        });

        let hasError = false;
        if (this.canBatchPost() && resClasses) {
          resClasses.forEach((r) => {
            if (r.status !== 'Success') hasError = true;
          });
          if (hasError || resClasses.length === 0) {
            setIsPosting(false);

            this.setState({
              loading: false,
              errorDialog: true,
              errorTitle: 'Error creating posts',
              errorBody: 'Please try again'
            });
            return;
          }
        }

        setTimeout(() => {
          if (points > 0 || this.canBatchPost()) {
            const { enqueueSnackbar, classes } = this.props;
            enqueueSnackbar({
              notification: {
                message: !this.canBatchPost()
                  ? `Congratulations ${firstName}, you have just earned ${points} points. Good Work!`
                  : 'All posts were created successfully',
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
          localStorage.removeItem('note');
          this.handlePush('/feed');
        }, 3000);
      } catch (err) {
        setIsPosting(false);

        if (err.message === 'no images') {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Error',
            errorBody: 'You must add at least 1 image'
          });
        } else {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Unknown Error',
            errorBody: 'Please try again'
          });
        }
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
          noteId
        } = this.props;
        const { title, classId, sectionId, summary } = this.state;
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map((item) => item.id);

        await updatePhotoNote({
          noteId,
          userId,
          title,
          classId,
          sectionId,
          fileNames,
          comment: summary
        });

        setTimeout(() => {
          this.setState({ loading: false });
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
          localStorage.removeItem('note');
          this.handlePush(`/notes/${noteId}`);
        }, 3000);
      } catch (err) {
        if (err.message === 'no images') {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Error',
            errorBody: 'You must add at least 1 image'
          });
        } else {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Unknown Error',
            errorBody: 'Please try again'
          });
        }
      }
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { noteId } = this.props;
    if (noteId) this.updateNotes();
    else this.createNotes();
  };

  handleTextChange = (name) => (event) => {
    this.setState({ [name]: event.target.value, changed: true });

    if (localStorage.getItem('note')) {
      const currentNote = JSON.parse(localStorage.getItem('note'));
      currentNote.title = event.target.value;
      currentNote.changed = true;
      localStorage.setItem('note', JSON.stringify(currentNote));
    } else {
      const note = {
        title: event.target.value,
        changed: true
      };
      localStorage.setItem('note', JSON.stringify(note));
    }
  };

  handleClasses = (classList) => {
    this.setState({ classList });
    if (classList.length > 0) {
      this.setState({
        sectionId: classList[0].sectionId,
        classId: classList[0].classId
      });
    } else {
      this.setState({
        sectionId: null,
        classId: 0
      });
    }
  };

  handleClassChange = ({
    classId,
    sectionId
  }: {
    classId: number,
    sectionId: number
  }) => {
    const { user } = this.props;
    const selected = user.userClasses.classList.find(
      (c) => c.classId === classId
    );
    if (selected) this.setState({ classList: [selected] });
    this.setState({ classId, sectionId });
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  getLeftCharts = (field) => (50 - field.length >= 0 ? 50 - field.length : 0);

  errorMessage = () => {
    const { classes } = this.props;
    const { summary } = this.state;

    if (Number(this.getLeftCharts(summary)) <= 0) return null;
    if (this.canBatchPost()) return <div />;

    return (
      <Typography
        variant="subtitle1"
        align="left"
        className={classes.errorMessage}
      >
        You must type 50 characters or more in the summary to post these notes.
      </Typography>
    );
  };

  canBatchPost = () => {
    const {
      user: {
        expertMode,
        data: { permission }
      }
    } = this.props;

    return expertMode && permission.includes('one_touch_send_posts');
  };

  setEditor = (editor) => {
    this.setState(editor);
  };

  render() {
    const { classes, width, images, handleUpdateImages } = this.props;

    const {
      loading,
      title,
      errorDialog,
      errorTitle,
      isEdit,
      changed,
      errorBody,
      questionToolbar,
      body,
      notes
      // count,
    } = this.state;

    const notSm = !['xs', 'sm'].includes(width);

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            errorMessage={this.errorMessage()}
            loading={loading}
            changed={changed}
            buttonLabel={isEdit ? 'Save' : 'Post! 🚀'}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} md={12}>
                <OutlinedTextValidator
                  labelClass={classes.labelClass}
                  inputClass={classes.textValidator}
                  name="title"
                  placeholder="e.g., Fundamental of Chemistry Notes - Unit #1 Matter and Measurements"
                  onChange={this.handleTextChange}
                  label="Title of Notes*"
                  variant={notSm ? null : 'standard'}
                  value={title}
                  validators={['required']}
                  errorMessages={['Title is required']}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <UploadImages
                  notes={notes}
                  imageChange={this.imageChange}
                  images={images}
                  handleUpdateImages={handleUpdateImages}
                  innerRef={(node) => {
                    this.uploadImages = node;
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} className={classes.quillGrid}>
                <ToolbarTooltip
                  toolbar={questionToolbar}
                  toolbarClass={classes.toolbarClass}
                />
                <RichTextEditor
                  setEditor={this.setEditor}
                  placeholder="Add a description to your question to help your classmates give the best answer! You’re a hero for asking a question--some of your classmates are probably wondering the same thing too."
                  value={body}
                  onChange={this.handleRTEChange}
                />
                {/* <div className={classes.counter}>
                  {count === 50 && 'Type 50 characters to earn points!'}
                  {count === 0 && '🎉 Yay! Points!'}
                  {count > 0 && count < 50 && `${count} characters left...`}
                </div> */}
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
)(withStyles(styles)(withWidth()(withRouter(CreateNotes))));
