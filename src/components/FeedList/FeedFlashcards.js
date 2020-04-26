import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Markdown from 'components/Markdown';
import LoadImg from 'components/LoadImg'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  flashCardPreview: {
    position: 'relative',
    backgroundColor: theme.circleIn.palette.flashcardBackground,
    borderRadius: theme.spacing(),
    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
    color: '#ffffff',
    fontSize: 11,
    height: 110,
    marginBottom: 15,
    marginRight: 15,
    minWidth: 199,
    padding: '10px 20px 10px 20px',
    width: 199,
  },
  markdownContainer: {
    maxHeight: 35,
    marginLeft: 4,
    overflow: 'hidden'
  },
  image: {
    textAlign: 'center',
  },
  count: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,0.75)',
    borderRadius: theme.spacing(),
    zIndex: 2,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  countLabel: {
    fontSize: 26,
    fontWeight: 'bold',
  }
}))

const strip = s => s.replace(/<[^>]*>?/gm, '')

const FeedFlashcards = ({ deck }) => {
  const classes = useStyles()
  const imageStyle = useMemo(() => ({
    borderRadius: 4,
    maxHeight: 40,
    maxWidth: 40
  }), [])

  const count = useMemo(() => deck.length - 3, [deck])

  return (
    deck.slice(0, 3).map(({ id, question, answer, questionImageUrl, answerImageUrl }, k) => (
      <Grid container key={id} className={classes.flashCardPreview}>
        {k === 2 &&
          <div className={classes.count}>
            <Typography className={classes.countLabel}>
              +{count} more {count === 1 ? 'card' : 'cards'}
            </Typography>
          </div>
        }
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='flex-start'
        >
          {questionImageUrl && <Grid item xs={strip(question) ? 3 : 12} className={classes.image}>
            <LoadImg url={questionImageUrl} style={imageStyle} />
          </Grid>}
          {strip(question) && <Grid item xs={questionImageUrl ? 9 : 12}>
            <div className={classes.markdownContainer}>
              <Markdown>{question}</Markdown>
            </div>
          </Grid>}
        </Grid>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='flex-end'
        >
          {answerImageUrl && <Grid item xs={strip(answer) ? 3 : 12} className={classes.image}>
            <LoadImg url={answerImageUrl} style={imageStyle} />
          </Grid>}
          {strip(answer) && <Grid item xs={answerImageUrl ? 9 : 12}>
            <div className={classes.markdownContainer}>
              <Markdown>{answer}</Markdown>
            </div>
          </Grid>}
        </Grid>
      </Grid>
    ))
  )
}

export default FeedFlashcards
