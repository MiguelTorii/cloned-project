// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { PhotoNote } from '../../types/models';
import { getNotes } from '../../api/posts';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';
import ImageGallery from '../../components/ImageGallery';

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
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState,
  noteId: number
};

type State = {
  photoNote: ?PhotoNote
};

class ViewNotes extends React.PureComponent<Props, State> {
  state = {
    photoNote: null
  };

  componentDidMount = async () => {
    this.loadData();
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
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { photoNote } = this.state;

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
      name,
      userProfileUrl,
      subject,
      classroomName,
      created,
      body,
      title,
      notes,
      thanked,
      inStudyCircle,
      postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount }
    } = photoNote;

    const images = notes.map(item => ({
      src: item.fullNoteUrl,
      thumbnail: item.noteUrl
    }));
    return (
      <div className={classes.root}>
        <PostItem>
          <PostItemHeader
            userId={ownerId}
            name={name}
            userProfileUrl={userProfileUrl}
            classroomName={
              subject !== '' ? `${subject} ${classroomName}` : classroomName
            }
            created={created}
            body={body}
            title={title}
          />
          <ImageGallery images={images} />
          <PostItemActions
            userId={userId}
            ownerId={ownerId}
            feedId={feedId}
            postId={postId}
            typeId={typeId}
            thanked={thanked}
            inStudyCircle={inStudyCircle}
            questionsCount={questionsCount}
            thanksCount={thanksCount}
            viewCount={viewCount}
            onReload={this.loadData}
          />
          <PostComments feedId={feedId} postId={postId} typeId={typeId} />
        </PostItem>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ViewNotes));
