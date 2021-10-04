import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "connected-react-router";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { processClasses } from "containers/ClassesSelector/utils";
import Divider from "@material-ui/core/Divider";
import Tooltip from "containers/Tooltip/Tooltip";
import withWidth from "@material-ui/core/withWidth";
import { withRouter } from "react-router";
import { decypherClass, cypher } from "utils/crypto";
import ClassMultiSelect from "containers/ClassMultiSelect/ClassMultiSelect";
import { PERMISSIONS } from "constants/common";
import type { CampaignState } from "../../reducers/campaign";
import type { UserState } from "../../reducers/user";
import type { State as StoreState } from "../../types/state";
import type { SelectType } from "../../types/models";
import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import UploadImages from "../UploadImages/UploadImages";
import ClassesSelector from "../ClassesSelector/ClassesSelector";
import OutlinedTextValidator from "../../components/OutlinedTextValidator/OutlinedTextValidator";
// import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from "../../components/SimpleErrorDialog/SimpleErrorDialog";
import { createBatchShareLink, createBatchPhotoNote, getNotes, updatePhotoNote, createPhotoNote, createShareLink } from "../../api/posts";
import * as notificationsActions from "../../actions/notifications";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { logEventLocally } from "../../api/analytics";

const styles = theme => ({
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
  }
});

type ImageUrl = {
  fullNoteUrl: string;
  note: string;
  noteUrl: string;
};
type Props = {
  classes: Record<string, any>;
  noteId: string;
  user: UserState;
  pushTo: (...args: Array<any>) => any;
  campaign: CampaignState;
  width: string;
  enqueueSnackbar: (...args: Array<any>) => any;
  location: {
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
  tagsError: boolean;
  hasImages: boolean;
  errorDialog: boolean;
  notes: Array<ImageUrl>;
  errorTitle: string;
  errorBody: string;
  changed: boolean | null | undefined;
  isEdit: boolean;
};

class CreateNotes extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    // tagsError: false,
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
  handlePush = path => {
    const {
      pushTo,
      campaign
    } = this.props;
    const {
      sectionId,
      classId
    } = this.state;

    if (campaign.newClassExperience) {
      const search = !this.canBatchPost() ? `?class=${cypher(`${classId}:${sectionId}`)}` : '';
      pushTo(`${path}${search}`);
    } else {
      pushTo(path);
    }
  };
  componentDidMount = async () => {
    this.loadData();
    const {
      classId,
      sectionId
    } = decypherClass();
    this.setState({
      classId: Number(classId),
      sectionId: Number(sectionId)
    });
  };
  loadData = async () => {
    const {
      user: {
        data: {
          userId,
          segment
        },
        userClasses: {
          classList: classes
        }
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
        noteId: parseInt(noteId, 10)
      });
      const userClasses = processClasses({
        classes,
        segment
      });
      const {
        sectionId
      } = JSON.parse(userClasses[0].value);
      const {
        title,
        classId,
        body,
        tags,
        notes
      } = photoNote;
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
    const {
      tags
    } = this.state;

    if (tags.length < 0) {
      // this.setState({ tagsError: true });
      return;
    }

    // this.setState({ tagsError: false });
    this.setState({
      loading: true
    });

    try {
      const {
        user: {
          data: {
            userId = ''
          }
        }
      } = this.props;
      const {
        classList,
        title,
        summary,
        url,
        classId,
        sectionId
      } = this.state;
      const tagValues = tags.map(item => Number(item.value));
      const res = this.canBatchPost() ? await createBatchShareLink({
        userId,
        title,
        summary,
        uri: url,
        sectionIds: classList.map(c => c.sectionId),
        tags: tagValues
      }) : await createShareLink({
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
        user: {
          firstName
        }
      } = res;
      let hasError = false;

      if (this.canBatchPost() && resClasses) {
        resClasses.forEach(r => {
          if (r.status !== 'Success') {
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
        objectId: linkId,
        type: 'Created'
      });

      if (points > 0 && !this.canBatchPost() || this.canBatchPost() && !hasError) {
        const {
          enqueueSnackbar,
          classes
        } = this.props;
        enqueueSnackbar({
          notification: {
            message: !this.canBatchPost() ? `Congratulations ${firstName}, you have just earned ${points} points. Good Work!` : 'All posts were created successfully',
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
    const {
      tags
    } = this.state;

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
            data: {
              userId = ''
            }
          }
        } = this.props;
        const {
          classList,
          title,
          classId,
          sectionId,
          summary
        } = this.state;
        const sectionIds = classList.map(c => c.sectionId);
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map(item => item.id);
        const tagValues = tags.map(item => Number(item.value));
        const {
          points,
          user: {
            firstName
          },
          classes: resClasses,
          photoNoteId
        } = this.canBatchPost() ? await createBatchPhotoNote({
          userId,
          title,
          sectionIds,
          fileNames,
          comment: summary,
          tags: tagValues
        }) : await createPhotoNote({
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
          objectId: photoNoteId,
          type: 'Created'
        });
        let hasError = false;

        if (this.canBatchPost() && resClasses) {
          resClasses.forEach(r => {
            if (r.status !== 'Success') {
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
            const {
              enqueueSnackbar,
              classes
            } = this.props;
            enqueueSnackbar({
              notification: {
                message: !this.canBatchPost() ? `Congratulations ${firstName}, you have just earned ${points} points. Good Work!` : 'All posts were created successfully',
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
  updateNotes = async () => {
    this.setState({
      loading: true
    });

    if (this.uploadImages) {
      try {
        const {
          user: {
            data: {
              userId = ''
            }
          },
          noteId
        } = this.props;
        const {
          title,
          classId,
          sectionId,
          summary
        } = this.state;
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map(item => item.id);
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
          const {
            enqueueSnackbar,
            classes
          } = this.props;
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
  handleSubmit = event => {
    event.preventDefault();
    const {
      noteId
    } = this.props;
    const {
      url
    } = this.state;

    if (url) {
      this.createSharelink();
    }

    if (noteId) {
      this.updateNotes();
    } else {
      this.createNotes();
    }
  };
  handleTextChange = name => event => {
    this.setState({
      [name]: event.target.value,
      changed: true
    });
  };
  handleClasses = classList => {
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
  handleClassChange = ({
    classId,
    sectionId
  }: {
    classId: number;
    sectionId: number;
  }) => {
    const {
      user
    } = this.props;
    const selected = user.userClasses.classList.find(c => c.classId === classId);

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
  // handleTagsChange = values => {
  // this.setState({ tags: values });
  // if (values.length === 0) this.setState({ tagsError: true });
  // else this.setState({ tagsError: false });
  // };
  handleErrorDialogClose = () => {
    this.setState({
      errorDialog: false,
      errorTitle: '',
      errorBody: ''
    });
  };
  getLeftCharts = field => // help ? 50 - help.length : 50;
  50 - field.length >= 0 ? 50 - field.length : 0;
  imageChange = () => {
    this.setState({
      changed: true
    });

    if (this.uploadImages && this.uploadImages.state && this.uploadImages.state.images) {
      this.setState({
        hasImages: this.uploadImages.state.images.length > 0
      });
    }
  };
  errorMessage = () => {
    const {
      classes
    } = this.props;
    const {
      summary
    } = this.state;

    if (Number(this.getLeftCharts(summary)) <= 0) {
      return null;
    }

    if (this.canBatchPost()) {
      return <div />;
    }

    return <Typography variant="subtitle1" align="left" className={classes.errorMessage}>
        You must type 50 characters or more in the summary to post these notes.
      </Typography>;
  };
  canBatchPost = () => {
    const {
      user: {
        expertMode,
        data: {
          permission
        }
      }
    } = this.props;
    return expertMode && permission.includes(PERMISSIONS.ONE_TOUCH_SEND_POSTS);
  };

  render() {
    const {
      classes,
      width
    } = this.props;
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
    return <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm title="Share Notes" errorMessage={this.errorMessage()} subtitle="When you upload your notes, it’s your classmates who can see them. You can help others by sharing and also get feedback too." loading={loading} changed={changed} buttonLabel={isEdit ? 'Save' : 'Share'} handleSubmit={this.handleSubmit}>
            <Grid container alignItems="center">
              {notSm && <Grid item md={2}>
                  <Typography variant="subtitle1">Title of note</Typography>
                </Grid>}
              <Grid item xs={12} md={10}>
                <OutlinedTextValidator onChange={this.handleTextChange} name="title" label={notSm ? '' : 'Title'} variant={notSm ? null : 'standard'} value={title} validators={['required']} errorMessages={['Title is required']} />
              </Grid>

              {notSm && <Grid item md={2}>
                  <Typography variant="subtitle1">Description of notes</Typography>
                </Grid>}
              <Grid item xs={12} md={10}>
                <OutlinedTextValidator onChange={this.handleTextChange} name="summary" multiline label={notSm ? '' : 'Description'} variant={notSm ? null : 'standard'} rows={notSm ? 4 : 1} value={summary} validators={['required']} errorMessages={['Description is required']} />
                <Typography variant="subtitle1" align="right" className={Number(this.getLeftCharts(summary)) > 0 ? classes.leftCharactersRed : classes.leftCharacters}>
                  {`${this.getLeftCharts(summary)} ${this.canBatchPost() ? 'more characters required' : 'more characters to earn points'}`}
                </Typography>
              </Grid>

              {
              /* {notSm && <Grid item md={2}> */
            }
              {
              /* <Typography variant="subtitle1">Tags</Typography> */
            }
              {
              /* </Grid>} */
            }
              {
              /* <Grid item xs={12} md={10}> */
            }
              {
              /* <TagsAutoComplete */
            }
              {
              /* tags={tags} */
            }
              {
              /* error={tagsError} */
            }
              {
              /* label={notSm ? '' : 'Tags'} */
            }
              {
              /* variant={notSm ? null : 'standard'} */
            }
              {
              /* onChange={this.handleTagsChange} */
            }
              {
              /* /> */
            }
              {
              /* </Grid> */
            }

              {notSm && <Grid item md={2}>
                  <Typography variant="subtitle1">Class</Typography>
                </Grid>}
              <Grid item xs={12} md={10}>
                {this.canBatchPost() && !isEdit ? <Tooltip id={9050} placement="right" text="In Expert Mode, you can post the same thing in more than one class! 🙌">
                    <ClassMultiSelect selected={classList} onSelect={this.handleClasses} />
                  </Tooltip> : <ClassesSelector classId={classId} sectionId={sectionId} label={notSm ? '' : 'Class'} variant={notSm ? null : 'standard'} onChange={this.handleClassChange} />}
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

              {notSm && !hasImages && <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1">Link to Google Docs</Typography>
                </Grid>}
              {!hasImages && <Grid item xs={12} md={10}>
                  <OutlinedTextValidator onChange={this.handleTextChange} label={!notSm ? 'Link to Google Docs (public link)' : 'Public link'} name="url" variant={notSm ? null : 'standard'} value={url} />
                </Grid>}
              {notSm && !url && !hasImages && <Grid item md={2} />}
              {!url && !hasImages && <Grid item xs={12} md={10}>
                  <Typography variant="subtitle1" className={classes.divisorOr}>
                    OR
                  </Typography>
                </Grid>}
              {notSm && !url && <Grid item md={2} />}
              {!url && <Grid item xs={12} md={10}>
                  <UploadImages notes={notes} imageChange={this.imageChange} innerRef={node => {
                this.uploadImages = node;
              }} />
                </Grid>}
            </Grid>
          </CreatePostForm>
        </ErrorBoundary>
        <ErrorBoundary>
          <SimpleErrorDialog open={errorDialog} title={errorTitle} body={errorBody} handleClose={this.handleErrorDialogClose} />
        </ErrorBoundary>
      </div>;
  }

}

const mapStateToProps = ({
  user,
  campaign
}: StoreState): {} => ({
  user,
  campaign
});

const mapDispatchToProps = (dispatch: any): {} => bindActionCreators({
  pushTo: push,
  enqueueSnackbar: notificationsActions.enqueueSnackbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withWidth()(withRouter(CreateNotes))));