// @flow

import React from 'react';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Flashcards } from '../../types/models';
import { getFlashcards } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import FlashcardViewer from '../../components/FlashcardViewer';
import Flashcard from '../../components/Flashcard';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';

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
  },
  flashcards: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  flashcardId: number
};

type State = {
  flashcards: ?Flashcards
};

class ViewFlashcards extends React.PureComponent<Props, State> {
  state = {
    flashcards: null
  };

  componentDidMount = async () => {
    this.loadData();
  };

  loadData = async () => {
    const {
      user: {
        data: { userId }
      },
      flashcardId
    } = this.props;
    const { deck = [], ...flashcards } = await getFlashcards({
      userId,
      flashcardId
    });
    this.setState({
      flashcards: {
        ...flashcards,
        deck: deck.map(item => ({
          question: item.question,
          answer: item.answer,
          id: uuidv4()
        }))
      }
    });
    const {
      postInfo: { feedId }
    } = flashcards;

    logEvent({
      event: 'Feed- View Flashcards',
      props: { 'Internal ID': feedId }
    });
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { flashcards } = this.state;

    if (!flashcards)
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
      thanked,
      inStudyCircle,
      deck,
      postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount }
    } = flashcards;

    return (
      <div className={classes.root}>
        {/* <fieldset disabled="disabled" style={{borderStyle: 'none', padding: 0, margin: 0}}> */}
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
          <FlashcardViewer title={title} flashcards={deck} />
          <div className={classes.flashcards}>
            {// $FlowIgnore
            deck.map(({ id, question, answer }, index) => (
              <Flashcard
                key={id}
                index={index + 1}
                question={question}
                answer={answer}
              />
            ))}
          </div>
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
        {/* </fieldset> */}
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
)(withStyles(styles)(ViewFlashcards));
