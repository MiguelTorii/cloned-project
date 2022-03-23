import React from 'react';

import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import { PERMISSIONS } from 'constants/common';
import { decypherClass, cypherClass } from 'utils/crypto';

import * as notificationsActions from 'actions/notifications';
import { logEventLocally } from 'api/analytics';
import {
  createBatchShareLink,
  createBatchPhotoNote,
  getNotes,
  updatePhotoNote,
  createPhotoNote,
  createShareLink
} from 'api/posts';
import CreatePostForm from 'components/CreatePostForm/CreatePostForm';
import OutlinedTextValidator from 'components/OutlinedTextValidator/OutlinedTextValidator';
import SimpleErrorDialog from 'components/SimpleErrorDialog/SimpleErrorDialog';

import ClassesSelector from '../ClassesSelector/ClassesSelector';
import { processClasses } from '../ClassesSelector/utils';
import ClassMultiSelect from '../ClassMultiSelect/ClassMultiSelect';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tooltip from '../Tooltip/Tooltip';
import UploadImages from '../UploadImages/UploadImages';

import type { UserState } from 'reducers/user';
import type { SelectType, UserClass } from 'types/models';
import type { State as StoreState } from 'types/state';

const styles = (theme) => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
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
  }
});

type ImageUrl = {
  fullNoteUrl: string;
  note: string;
  noteUrl: string;
};

type Props = {
  userId: string;
  classes?: Record<string, any>;
  noteId: number;
  user?: UserState;
  pushTo?: (...args: Array<any>) => any;
  width?: string;
  enqueueSnackbar?: (...args: Array<any>) => any;
  location?: {
    search: string;
    pathname: string;
  };
};

type State = {
  loading: boolean;
  title: string;
  classId: number;
  sectionId: number | null | undefined;
  summary: string;
  url: string;
  tags: Array<SelectType>;
  hasImages: boolean;
  errorDialog: boolean;
  notes: Array<ImageUrl>;
  errorTitle: string;
  errorBody: string;
  changed: boolean | null | undefined;
  isEdit: boolean;
  classList: UserClass[];
};

class CreateNotes extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    classId: 0,
    url: '',
    sectionId: null,
    summary: '',
    changed: null,
    tags: [],
    notes: [],
    errorDialog: false,
    errorTitle: '',
    isEdit: false,
    hasImages: false,
    classList: [],
    errorBody: ''
  };

  uploadImages: {
    handleUploadImages: (...args: Array<any>) => any;
  };

  handlePush = (path) => {
    const { pushTo } = this.props;
    const { sectionId, classId } = this.state;
    const search = !this.canBatchPost() ? `?class=${cypherClass({ classId, sectionId })}` : '';

    pushTo(`${path}${search}`);
  };

  componentDidMount = async () => {
    this.loadData();
    const { classId, sectionId } = decypherClass();
    this.setState({
      classId: Number(classId),
      sectionId: Number(sectionId)
    });
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
      if (!noteId) {
        return;
      }

      this.setState({
        isEdit: true
      });
      const photoNote = await getNotes({
        userId,
        noteId: noteId
      });
      const userClasses = processClasses({
        classes,
        segment
      });
      const { sectionId } = JSON.parse(userClasses[0].value);
      const { title, classId, body, tags, notes } = photoNote;
      this.setState({
        title,
        classId,
        sectionId,
        summary: body,
        tags,
        notes
      });
    } catch (e) {
      this.handlePush('/feed');
    }
  };

  createSharelink = async () => {
    const { tags } = this.state;

    this.setState({
      loading: true
    });

    try {
      const {
        user: {
          data: { userId = '' }
        }
      } = this.props;
      const { classList, title, summary, url, classId, sectionId } = this.state;
      const tagValues = tags.map((item) => Number(item.value));
      const res = this.canBatchPost()
        ? await createBatchShareLink({
            userId,
            title,
            summary,
            uri: url,
            sectionIds: classList.map((c) => c.sectionId),
            tags: tagValues
          })
        : await createShareLink({
            userId,
            title,
            summary,
            uri: url,
            classId,
            sectionId,
            tags: tagValues
          });
      const {
        points,
        linkId,
        classes: resClasses,
        user: { firstName }
      } = res;
      let hasError = false;

      if (this.canBatchPost() && resClasses) {
        resClasses.forEach((r) => {
          // TODO there is a type mismatch here that needs to be resolved
          // once we know the real type of PostResponse.classes
          // because the declared `string[]` does not make sense with this code.
          if ((r as any).status !== 'Success') {
            hasError = true;
          }
        });

        if (hasError || resClasses.length === 0) {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Website not allowed',
            errorBody: `We're sorry, the website you entered is not allowed on CircleIn at this time, please contact support@circleinapp.com if you'd like for us to allow this website to be shared with your classmates`
          });
          return;
        }
      }

      if (!this.canBatchPost() && !linkId) {
        this.setState({
          loading: false,
          errorDialog: true,
          errorTitle: 'Website not allowed',
          errorBody: `We're sorry, the website you entered is not allowed on CircleIn at this time, please contact support@circleinapp.com if you'd like for us to allow this website to be shared with your classmates`
        });
        return;
      }

      logEventLocally({
        category: 'Link',
        objectId: String(linkId),
        type: 'Created'
      });

      if ((points > 0 && !this.canBatchPost()) || (this.canBatchPost() && !hasError)) {
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

  createNotes = async () => {
    const { tags } = this.state;

    if (tags.length < 0) {
      // this.setState({ tagsError: true });
      return;
    }

    // this.setState({ tagsError: false });
    this.setState({
      loading: true
    });

    if (this.uploadImages) {
      try {
        const {
          user: {
            data: { userId = '' }
          }
        } = this.props;
        const { classList, title, classId, sectionId, summary } = this.state;
        const sectionIds = classList.map((c) => c.sectionId);
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map((item) => item.id);
        const tagValues = tags.map((item) => Number(item.value));
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
              comment: summary,
              tags: tagValues
            })
          : await createPhotoNote({
              userId,
              title,
              classId,
              sectionId,
              fileNames,
              comment: summary,
              tags: tagValues
            });
        logEventLocally({
          category: 'PhotoNote',
          objectId: String(photoNoteId),
          type: 'Created'
        });
        let hasError = false;

        if (this.canBatchPost() && resClasses) {
          // TODO there is a type mismatch here that needs to be resolved
          // once we know the real type of PostResponse.classes
          // because the declared `string[]` does not make sense with this code.
          resClasses.forEach((r) => {
            if ((r as any).status !== 'Success') {
              hasError = true;
            }
          });

          if (hasError || resClasses.length === 0) {
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

          this.handlePush('/feed');
        }, 3000);
      } catch (err: any) {
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
    this.setState({
      loading: true
    });

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
          this.setState({
            loading: false
          });
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
          this.handlePush(`/notes/${noteId}`);
        }, 3000);
      } catch (err: any) {
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
    const { url } = this.state;

    if (url) {
      this.createSharelink();
    }

    if (noteId) {
      this.updateNotes();
    } else {
      this.createNotes();
    }
  };

  handleTextChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
      changed: true
    } as any);
  };

  handleClasses = (classList) => {
    this.setState({
      classList
    });

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

  handleClassChange = ({ classId, sectionId }: { classId: number; sectionId: number }) => {
    const { user } = this.props;
    const selected: UserClass = user.userClasses.classList.find((c) => c.classId === classId);

    if (selected) {
      this.setState({
        classList: [selected]
      });
    }

    this.setState({
      classId,
      sectionId
    });
  };

  handleErrorDialogClose = () => {
    this.setState({
      errorDialog: false,
      errorTitle: '',
      errorBody: ''
    });
  };

  imageChange = () => {
    this.setState({
      changed: true
    });

    if (
      this.uploadImages &&
      (this.uploadImages as any).state &&
      (this.uploadImages as any).state.images
    ) {
      this.setState({
        hasImages: (this.uploadImages as any).state.images.length > 0
      });
    }
  };

  canBatchPost = () => {
    const {
      user: {
        expertMode,
        data: { permission }
      }
    } = this.props;
    return expertMode && permission.includes(PERMISSIONS.ONE_TOUCH_SEND_POSTS);
  };

  render() {
    const { classes, width } = this.props;
    const {
      // tags,
      // tagsError,
      loading,
      title,
      classId,
      sectionId,
      summary,
      errorDialog,
      errorTitle,
      notes,
      isEdit,
      url,
      changed,
      hasImages,
      classList,
      errorBody
    } = this.state;
    const notSm = !['xs', 'sm'].includes(width);
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
              {notSm && (
                <Grid item md={2}>
                  <Typography variant="subtitle1">Title of note</Typography>
                </Grid>
              )}
              <Grid item xs={12} md={10}>
                <OutlinedTextValidator
                  onChange={this.handleTextChange}
                  name="title"
                  label={notSm ? '' : 'Title'}
                  variant={notSm ? null : 'standard'}
                  value={title}
                  validators={['required']}
                  errorMessages={['Title is required']}
                />
              </Grid>

              {notSm && (
                <Grid item md={2}>
                  <Typography variant="subtitle1">Description of notes</Typography>
                </Grid>
              )}
              <Grid item xs={12} md={10}>
                <OutlinedTextValidator
                  onChange={this.handleTextChange}
                  name="summary"
                  multiline
                  label={notSm ? '' : 'Description'}
                  variant={notSm ? null : 'standard'}
                  rows={notSm ? 4 : 1}
                  value={summary}
                  validators={['required']}
                  errorMessages={['Description is required']}
                />
              </Grid>
              {notSm && (
                <Grid item md={2}>
                  <Typography variant="subtitle1">Class</Typography>
                </Grid>
              )}
              <Grid item xs={12} md={10}>
                {this.canBatchPost() && !isEdit ? (
                  <Tooltip
                    id={9050}
                    placement="right"
                    text="In Expert Mode, you can post the same thing in more than one class! 🙌"
                  >
                    <ClassMultiSelect selected={classList} onSelect={this.handleClasses} />
                  </Tooltip>
                ) : (
                  <ClassesSelector
                    classId={classId}
                    sectionId={sectionId}
                    label={notSm ? '' : 'Class'}
                    variant={notSm ? null : 'standard'}
                    onChange={this.handleClassChange}
                  />
                )}
              </Grid>

              {notSm && <Grid item md={2} />}
              <Grid container item xs={12} md={10} justifyContent="center" alignItems="center">
                <Grid item xs={2} md={2}>
                  <Divider light />
                </Grid>
                <Grid item xs={7} md={7}>
                  <Typography className={classes.divisorTitle} variant="subtitle1">
                    Choose how to share notes
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2}>
                  <Divider light />
                </Grid>
              </Grid>

              {notSm && !hasImages && (
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1">Link to Google Docs</Typography>
                </Grid>
              )}
              {!hasImages && (
                <Grid item xs={12} md={10}>
                  <OutlinedTextValidator
                    onChange={this.handleTextChange}
                    label={!notSm ? 'Link to Google Docs (public link)' : 'Public link'}
                    name="url"
                    variant={notSm ? null : 'standard'}
                    value={url}
                  />
                </Grid>
              )}
              {notSm && !url && !hasImages && <Grid item md={2} />}
              {!url && !hasImages && (
                <Grid item xs={12} md={10}>
                  <Typography variant="subtitle1" className={classes.divisorOr}>
                    OR
                  </Typography>
                </Grid>
              )}
              {notSm && !url && <Grid item md={2} />}
              {!url && (
                <Grid item xs={12} md={10}>
                  <UploadImages
                    notes={notes}
                    imageChange={this.imageChange}
                    innerRef={(node) => {
                      this.uploadImages = node;
                    }}
                  />
                </Grid>
              )}
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

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      pushTo: push,
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(withWidth()(withRouter(CreateNotes))));
