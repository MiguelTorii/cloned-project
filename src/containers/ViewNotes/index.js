// @flow

import React from 'react';
import update from 'immutability-helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { PhotoNote } from '../../types/models';
import { getNotes, bookmark } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';
import ImageGallery from '../../components/ImageGallery';
import PdfGallery from '../../components/PdfGallery';
import PostTags from '../PostTags';
import Report from '../Report';
import DeletePost from '../DeletePost';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  },
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  user: UserState,
  noteId: number,
  push: Function
};

type State = {
  photoNote: ?PhotoNote,
  report: boolean,
  deletePost: boolean
};

class ViewNotes extends React.PureComponent<Props, State> {
  state = {
    photoNote: null,
    report: false,
    deletePost: false
  };

  componentDidMount = async () => {
    this.loadData();
  };

  handleBookmark = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const { photoNote } = this.state;
    if (!photoNote) return;
    const { feedId, bookmarked } = photoNote;
    try {
      const newState = update(this.state, {
        photoNote: {
          bookmarked: { $set: !bookmarked }
        }
      });
      this.setState(newState);
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      const newState = update(this.state, {
        photoNote: {
          bookmarked: { $set: bookmarked }
        }
      });
      this.setState(newState);
    }
  };

  handleReport = () => {
    this.setState({ report: true });
  };

  handleReportClose = () => {
    this.setState({ report: false });
  };

  handleDelete = () => {
    this.setState({ deletePost: true });
  };

  handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    if (deleted && deleted === true) {
      const { push } = this.props;
      push('/feed');
    }
    this.setState({ deletePost: false });
  };

  loadData = async () => {
    const {
      user: {
        data: { userId }
      },
      noteId
    } = this.props;
    const photoNote = await getNotes({ userId, noteId });
    this.setState({ photoNote });
    const {
      postInfo: { feedId }
    } = photoNote;

    logEvent({
      event: 'Feed- View Photo Note',
      props: { 'Internal ID': feedId }
    });
  };

  render() {
    const {
      classes,
      push,
      user: {
        data: {
          userId,
          firstName: myFirstName,
          lastName: myLastName,
          profileImage
        }
      }
    } = this.props;
    const { photoNote, report, deletePost } = this.state;

    if (!photoNote)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    const {
      feedId,
      postId,
      typeId,
      roleId,
      name,
      userProfileUrl,
      courseDisplayName,
      created,
      body,
      title,
      notes,
      thanked,
      inStudyCircle,
      postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount },
      readOnly,
      bookmarked
    } = photoNote;

    const notesMap = notes.map(item => ({
      src: item.fullNoteUrl,
      fileName: item.note,
      thumbnail: item.noteUrl
    }));

    const images = notesMap.filter(nm => !nm.src.includes('.pdf'))
    const pdfs = notesMap.filter(nm => nm.src.includes('.pdf'))

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <PostItem feedId={feedId}>
            <ErrorBoundary>
              <PostItemHeader
                pushTo={push}
                postId={postId}
                typeId={typeId}
                currentUserId={userId}
                userId={ownerId}
                name={name}
                userProfileUrl={userProfileUrl}
                classroomName={courseDisplayName}
                created={created}
                body={body}
                title={title}
                bookmarked={bookmarked}
                roleId={roleId}
                onBookmark={this.handleBookmark}
                onReport={this.handleReport}
                onDelete={this.handleDelete}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <ImageGallery images={images} />
            </ErrorBoundary>
            <ErrorBoundary>
              <PdfGallery pdfs={pdfs} />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostTags userId={userId} feedId={feedId} />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostItemActions
                userId={userId}
                ownerId={ownerId}
                feedId={feedId}
                postId={postId}
                typeId={typeId}
                name={name}
                userProfileUrl={profileImage}
                thanked={thanked}
                inStudyCircle={inStudyCircle}
                questionsCount={questionsCount}
                thanksCount={thanksCount}
                viewCount={viewCount}
                ownName={`${myFirstName} ${myLastName}`}
                onReload={this.loadData}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostComments
                feedId={feedId}
                postId={postId}
                typeId={typeId}
                readOnly={readOnly}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <Report
                open={report}
                ownerId={ownerId}
                objectId={feedId}
                onClose={this.handleReportClose}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <DeletePost
                open={deletePost}
                feedId={feedId}
                onClose={this.handleDeleteClose}
              />
            </ErrorBoundary>
          </PostItem>
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user,
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ViewNotes));
