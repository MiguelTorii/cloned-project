// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles';

import LoadImg from 'components/LoadImg';

import flashcards from 'assets/svg/hourly_flashcards.svg';
import links from 'assets/svg/links.svg';
import notes from 'assets/svg/notes.svg';

const styles = theme => ({
  action: {
    alignItems: 'center',
    display: 'flex',
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '16px 0px',
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  link: {
    color: theme.circleIn.palette.action,
    textDecoration: 'none'
  },
  row: {
    margin: '16px 0px'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  newPost: {
    background: theme.circleIn.palette.brand,
    borderRadius: 10,
    color: 'black',
    display: 'inline-block',
    fontSize: 18,
    fontWeight: 'bold',
    margin: '0px 2px',
    padding: '0px 8px',
  },
})

type Props = {
  classes: Object,
  hourlyReward: string
};

const HourlyGifts = ({ classes, hourlyReward }: Props) => {
  const imgStyle = {
    width: 30
  };

  return (
    <div className={classes.body}>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          How do I qualify?
        </div>
        <div className={classes.text}>
          It's super simple to win a $10 - $50 {hourlyReward} (maybe even $100)!
          Click the <p className={classes.newPost}>+ Create New Post</p> button, and share notes,
          create flashcards or share a helpful link to win
        </div>
      </div>
      <div className={classes.actions}>
        <div>
          <div className={classes.action}>
            <LoadImg url={notes} style={imgStyle} />
            <div className={classes.actionText}>Share your notes</div>
          </div>
          <div className={classes.action}>
            <LoadImg url={flashcards} style={imgStyle} />
            <div className={classes.actionText}>Create Flashcards</div>
          </div>
          <div className={classes.action}>
            <LoadImg url={links} style={imgStyle} />
            <div className={classes.actionText}>Share a Link</div>
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          How many people can win?
        </div>
        <div className={classes.text}>
          Every hour, up to 25 students on your campus who share notes, create flashcards,
          or share a helpful link will win.
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          Can I win multiple times in a week?
        </div>
        <div className={classes.text}>
          Yes. you can win each day, but don't spam CircleIn. If you have good
          notes you've taken from lectures in 4 different classes, that counts as 4 posts.
          <br /><br />
          If you are getting ready for upcoming tests in 3 different classes, creating 3
          different sets fo flashcards for each test counts as 3 posts.
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          How do I know if I've won?
        </div>
        <div className={classes.text}>
          At the end of each day, we'll email up to 300 gift cards to students at your school.
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          What if my classmates haven't joined CircleIn yet?
        </div>
        <div className={classes.text}>
          Tell your classmates to go to
          <a className={classes.link} rel='noopener noreferrer' target='_blank' href='https://CircleInApp.com'>
            {` CircleInApp.com `}
          </a>
          to join in. The more people who view what you post, and thank your posts,
          the larger the gift card is you can win ($10-$50).
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          Is there anything else I can do to win?
        </div>
        <div className={classes.text}>
          Yes! Setup group class chats and get active in chatting with your classmates about
          problems. Earn posts by getting together using our Video Meet-Up, create reminders
          for yourself. The more active you are on CircleIn for all of your studying needs,
          the more it helps you as a student and helps you win.
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          How do I contact CircleIn?
        </div>
        <div className={classes.text}>
          Email us at <a className={classes.link} href="mailto:Support@CircleInApp.com">
            Support@CircleInApp.com
          </a> anytime if you have thoughts, questions or new ideas.
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(HourlyGifts);
