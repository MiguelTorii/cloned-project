// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const texts = {
  flashcards: {
    tips: [
      'Break complex topics into multiple bite-sized questions!',
      'In study mode, use the shuffle feature to challenge your memorization skills',
      'Try to keep it one question or term per flashcard',
      'Read your flashcards outloud to commit them to memory!'
    ],
    maximize: [
      'Earn 5K points for flashcards',
      "Earn 20K points when classmates says 'Thanks!'",
      'Earn 30K points when a classmate bookmarks your post',
      'Earn 300 points when you set a reminder to review your post later',
      'Earn daily rewards during review',
      'Earn 20K+ points when you schedule a video session about a post or topic'
    ]
  },
  notes: {
    tips: [
      'Everyone has their own note-taking style. Be sure to write legibly and explain how to read your notes in the description!',
      'Don’t forget to write at least a 50-character summary to your notes to earn points',
      'Do you type your notes? Share them as a link, instead!'
    ],
    maximize: [
      'Earn 1,000 points for posting notes',
      "Earn 20K points when classmates says 'Thanks!'",
      'Earn 30K points when a classmate bookmarks your post',
      'Earn 300 points when you set a reminder to review your post later',
      'Earn daily rewards during review',
      'Earn 20K+ points when you schedule a video session about a post or topic'
    ]
  },
  question: {
    tips: [
      "Remember: if you have that question, somebody probably has it, too. Don't be shy: ask away!",
      'Adding a well-written description to your question helps provide context for your classmates to give the best answers possible.',
      "You have the ability to add an image or link in your question's description to add even more context!"
    ],
    maximize: [
      '1K for replying with an answer, 25K points for being selected as best answer',
      "Earn 20K points when classmates says 'Thanks!'",
      'Earn 30K points when a classmate bookmarks your post',
      'Earn 300 points when you set a reminder to review your post later',
      'Earn daily rewards during review',
      'Earn 20K+ points when you schedule a video session about a post or topic'
    ]
  },
  shareLink: {
    tips: [
      'Share links to files, websites, PDFs, PowerPoints, YouTube, and more!',
      'Make Google Drive and DropBox links shareable so classmates can view them!',
      'Only share links that are academic and professional.',
      'Did you know you can share links to helpful posts inside of CircleIn?'
    ],
    maximize: [
      'Earn 2K points for links',
      "Earn 20K points when classmates says 'Thanks!'",
      'Earn 30K points when a classmate bookmarks your post',
      'Earn 300 points when you set a reminder to review your post later',
      'Earn daily rewards during review',
      'Earn 20K+ points when you schedule a video session about a post or topic'
    ]
  }
};

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3)
    }
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(8)
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
      .spacing(3)}px`
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});

type Props = {
  classes: Object,
  type: string
};

type State = {};

class PostTips extends React.PureComponent<Props, State> {
  render() {
    const { classes, type } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <div className={classes.title}>
            <Typography variant="h6" paragraph>
              Tips and Tricks
            </Typography>
          </div>
          {texts[type].tips.map(item => (
            <Typography key={item} variant="body2" paragraph>
              {item}
            </Typography>
          ))}
          <div className={classes.title}>
            <Typography variant="h6" paragraph>
              Maximize Points
            </Typography>
          </div>
          {texts[type].maximize.map(item => (
            <Typography key={item} variant="body2" paragraph>
              {item}
            </Typography>
          ))}
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(PostTips);
