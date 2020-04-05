/* eslint-disable jsx-a11y/click-events-have-key-events */
// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { push as routePush } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import withRoot from '../../withRoot';
import LoadImg from '../LoadImg';

import bookmarks from '../../assets/svg/bookmarks.svg';
import flashcards from '../../assets/svg/flashcards.svg';
import groupchat from '../../assets/svg/group_chat.svg';
import links from '../../assets/svg/links.svg';
import notes from '../../assets/svg/notes.svg';
import question from '../../assets/svg/questions.svg';
import reminders from '../../assets/svg/reminders.svg';
import videos from '../../assets/svg/videos.svg';

const styles = theme => ({
  useCase: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
    width: 400
  },
  row: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 22,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 16,
    margin: '8px 0',
    textAlign: 'center'
  },
  item: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    marginTop: 4
  },
  itemTitle: {
    color: theme.circleIn.palette.action,
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 24,
  },
  icon: {
    height: 36,
    width: 36
  },
  text2: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center'
  },
  action: {
    color: theme.circleIn.palette.action,
  }
})

const UseCases = ({
  classes,
  onRedirect,
  push,
  userId
}: {
  classes: Object,
  onRedirect: Function,
  push: Function,
  userId: number
}) => {
  const Item = (
    { imageUrl, onClick, title, to }: { imageUrl: string, onClick: ?Function, title: string, to: ?string }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={classes.item} onClick={() => {
      onRedirect();

      if (to) {
        push(to);
      } else if (onClick) {
        onClick();
      }
    }}>
      <div>
        <LoadImg className={classes.icon} key={imageUrl} url={imageUrl} />
      </div>
      <div className={classes.itemTitle}>{title}</div>
    </div>
  );

  const UseCase = (
    {
      children,
      title,
      text
    }: {
      children: Object | Array<Object>,
      text: string,
      title: string
    }) => (
    <div className={classes.useCase}>
      <div className={classes.title}>{title}</div>
      <div className={classes.text}>{text}</div>
      <div>{children}</div>
    </div>
  );

  return (
    <div>
      <div className={classes.row}>
        <UseCase
          title="Need Help"
          text="It feels terrible to struggle and not have immediate help. Post a question, your classmates get notified, and when you vote a student with “Best Answer”, they get 25,000 points for helping you out."
        >
          <Item imageUrl={question} title="Post a Question" to="/create/question" />
          <Item
            imageUrl={videos}
            onClick={() => {
              document.getElementById('circlein-newchat').click()
            }}
            title="Start a Chat or Group Chat"
          />
        </UseCase>
        <UseCase
          title="Group Studying or Project"
          text="CircleIn makes group projects and studying so much easier. Don’t worry if someone is down the hall or across the country"
        >
          <Item
            imageUrl={videos}
            onClick={() => {
              document.getElementById('circlein-newchat').click()
            }}
            title="Create a Video Study Session"
          />
          <Item
            imageUrl={groupchat}
            onClick={() => {
              document.getElementById('circlein-newchat').click()
            }}
            title="Start a Chat or Group Chat"
          />
          <Item imageUrl={links} title="Share a link to a file or video" to="/create/sharelink" />
        </UseCase>
      </div>
      <div className={classes.row}>
        <UseCase
          title="Get Ready for a Test"
          text="CircleIn is great for preparing for your next midterm or final exam"
        >
          <Item imageUrl={flashcards} title="Create Flashcards" to="/create/flashcards" />
          <Item imageUrl={notes} title="Upload your Notes" to="/create/notes" />
          <Item imageUrl={reminders} title="Create a Reminder" to="/reminders" />
        </UseCase>
        <UseCase
          title="Get Organized"
          text="To make life easier, we all need reminders. Setup reminders to study, to review flashcards and to review notes your classmates posted"
        >
          <Item imageUrl={reminders} title="Set a Reminder" to="/reminders" />
          <Item imageUrl={bookmarks} title="View my Bookmarks" to={`/profile/${userId}/2`} />
        </UseCase>
      </div>
      <div className={classes.text2}>
        {`Send us an email with your best study tips at `}
        <span className={classes.action}>hello@circleinapp.com</span>!
      </div>
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  userId: user.data.userId
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
)(withRoot(withStyles(styles)(withWidth()(UseCases))))