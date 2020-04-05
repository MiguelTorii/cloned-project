// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
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
    width: 450
  },
  row: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 24,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 18,
    margin: '8px 0',
    textAlign: 'center'
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    marginTop: 4
  },
  itemTitle: {
    color: theme.circleIn.palette.action,
    fontSize: 18,
    letterSpacing: 0.5,
    marginLeft: 24,
  },
  icon: {
    height: 36,
    width: 36
  },
  text2: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  action: {
    color: theme.circleIn.palette.action,
  }
})

const UseCases = ({
  classes,
}: {
  classes: Object
}) => {
  const Item = ({ imageUrl, title }: { imageUrl: string, title: string }) => (
    <div className={classes.item}>
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
          <Item imageUrl={question} title="Post a Question" />
          <Item imageUrl={videos} title="Start a Chat or Group Chat" />
        </UseCase>
        <UseCase
          title="Group Studying or Project"
          text="CircleIn makes group projects and studying so much easier. Don’t worry if someone is down the hall or across the country"
        >
          <Item imageUrl={videos} title="Create a Video Study Session" />
          <Item imageUrl={groupchat} title="Start a Chat or Group Chat" />
          <Item imageUrl={links} title="Share a link to a file or video" />
        </UseCase>
      </div>
      <div className={classes.row}>
        <UseCase
          title="Get Ready for a Test"
          text="CircleIn is great for preparing for your next midterm or final exam"
        >
          <Item imageUrl={flashcards} title="Create Flashcards" />
          <Item imageUrl={notes} title="Upload your Notes" />
          <Item imageUrl={reminders} title="Create a Reminder" />
        </UseCase>
        <UseCase
          title="Get Organized"
          text="To make life easier, we all need reminders. Setup reminders to study, to review flashcards and to review notes your classmates posted"
        >
          <Item imageUrl={reminders} title="Set a Reminder" />
          <Item imageUrl={bookmarks} title="View my Bookmarks" />
        </UseCase>
      </div>
      <div className={classes.text2}>
        {`Send us an email with your best study tips at `}
        <span className={classes.action}>hello@circleinapp.com</span>!
      </div>
    </div>
  )
}

export default withRoot(withStyles(styles)(withWidth()(UseCases)))