import React from 'react'
import Dialog from 'components/Dialog';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import TipsAnimation from 'assets/gif/tips.gif'
import tipsBubbles from 'assets/svg/tipsBubbles.svg'
import tipsCards from 'assets/svg/tipsCards.svg'
import tipsPad from 'assets/svg/tipsPad.svg'

const useStyles = makeStyles(theme => ({
  header: {
    textAlign: 'center',
    fontSize: 42
  },
  text: {
    marginBottom: theme.spacing(),
    fontSize: 12,
  },
  primaryText: {
    fontSize: 16,
    marginBottom: theme.spacing()
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: theme.spacing()
  },
  titleSecondary: {
    fontWeight: 'bold',
    width: '100%',
    fontSize: 18,
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  animation: {
    height: 220
  },
  borders: {
    borderColor: theme.circleIn.palette.primaryText2,
    borderStyle: 'solid',
    borderWidth: '1px 0 1px 0',
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1, 0)
  },
  itemContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  secondaryImg: {
    height: 90,
  }
}))

const Tips = ({ open, close }) => {
  const classes = useStyles()

  return (
    <Dialog
      open={open}
      onCancel={close}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography className={classes.header}>Tips for Using Workflow</Typography>
        </Grid>
        <Grid container spacing={2} justify='center' className={classes.borders} alignItems='center'>
          <Grid item xs={6} container justify='center'>
            <img className={classes.animation} alt='drag and drop tips animation' src={TipsAnimation} />
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Typography className={classes.title}>What is Workflow?</Typography>
              <Typography className={classes.primaryText}>
                Workflow is CircleIn's task management tool for students. It helps you work through your task list from start to end.
              </Typography>
              <Typography className={classes.primaryText}>
                The <b>Upcoming</b> column holds tasks coming up. The <b>In Progress</b> column holds tasks that you are currently working on. The <b>Done</b> column is holds that you finished. The <b>Overdue</b> column holds, well... tasks that are overdue!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4} className={classes.itemContainer}>
            <img alt='tips pad' src={tipsPad} className={classes.secondaryImg} />
            <Grid container>
              <Typography className={classes.titleSecondary}>How can I start using Workflow?</Typography>
              <Typography className={classes.text}>
                  You can start with tasks from your planner, syllabus, or from brainstorming. Once you have a solid task list, place them into Upcoming.
              </Typography>
              <Typography className={classes.text}>
                <b>DID YOU KNOW?</b> You can add due dates and tag classes for tasks on Workflow!
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.itemContainer}>
            <img alt='tips bubble' src={tipsBubbles} className={classes.secondaryImg} />
            <Grid container>
              <Typography className={classes.titleSecondary}>Break down large tasks into small steps.</Typography>
              <Typography className={classes.text}>
                  Break large tasks down into steps, and create a task for each step in Upcoming. Organize them chronologically (or by priority) and start chipping away!
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.itemContainer}>
            <img className={classes.secondaryImg} alt='tips cards' src={tipsCards} />
            <Grid container>
              <Typography className={classes.titleSecondary}>Prevent burn-out from too many tasks.</Typography>
              <Typography className={classes.text}>
                  Have no more than four tasks in In Progress to focus better and avoid task overload.
              </Typography>
              <Typography className={classes.text}>
                <b>DID YOU KNOW?</b> Placing higher priority tasks towards the top of the list is a great way to organize!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>

  )
}

export default Tips
