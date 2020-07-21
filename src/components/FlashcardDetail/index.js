// @flow

import React, { useMemo } from 'react'
import Grid from '@material-ui/core/Grid'
import SelectedImage from 'components/SelectedImage'
import clsx from 'clsx'
import CreateIcon from '@material-ui/icons/Create'
import ClearIcon from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import CustomQuill from 'components/CustomQuill'

type Props = {
  id: string,
  question: string,
  answer: string,
  questionImage: string,
  answerImage: string,
  handleDelete: ?Function,
  hardCount: number,
  handleOpen: ?Function
};

const useStyles = makeStyles((theme) => ({
  markdownContainer: {
    marginBottom: theme.spacing(1),
  },
  root: {
    position: 'relative',
    borderRadius: theme.spacing(),
    backgroundColor: theme.circleIn.palette.flashcardBackground,
    padding: theme.spacing(1/2),
    width: '99%',
    margin: theme.spacing(1, 0, 1, 0)
  },
  rootItem: {
    padding: theme.spacing(1/2),
    width: '99%',
    margin: theme.spacing(1, 0, 1, 0)
  },
  question: {
    position: 'relative',
    wordBreak: 'break-word',
    fontWeight: 'bold',
  },
  answer: {
    position: 'relative',
    fontWeight: 'bold',
    wordBreak: 'break-word',
    borderLeft: '1px solid rgba(255,255,255,0.25)'
  },
  hasImage: {
    marginLeft: 60,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    minWidth: 0,
  },
  hidden: {
    display: 'none'
  },
  buttonGroup: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  hardCount: {
    margin: theme.spacing(),
    color: '#CDB09E',
    fontSize: 11,
    fontWeight: 'bold'
  }
}))

const FlashcardList = ({
  id,
  question,
  answer,
  questionImage,
  answerImage,
  hardCount,
  handleDelete,
  handleOpen
}: Props) => {
  const classes = useStyles()
  const imageStyle = useMemo(() => ({
    borderRadius: 8,
    maxHeight: 50,
    maxWidth: 50
  }), [])

  return (
    <div className={classes.root}>
      {hardCount > 0 &&
            <div className={classes.hardCount}>
              Marked as Didn't Remember {hardCount} time{hardCount === 1 ? '': 's'}
            </div>
      }
      <Grid
        key={id}
        container
        spacing={2}
        classes={{
          root: classes.rootItem
        }}
      >
        <div
          className={clsx(classes.buttonGroup)}
        >
          {handleDelete && <Button
            className={classes.button}
            onClick={handleOpen}
          >
            <CreateIcon fontSize="small" />
          </Button>}
          {handleOpen && <Button
            className={classes.button}
            onClick={handleDelete}
          >
            <ClearIcon fontSize="small" />
          </Button>}
        </div>
        <Grid item xs={4} className={classes.question}>
          {questionImage && <SelectedImage
            image={questionImage}
            imageStyle={imageStyle}
          />}
          <div className={clsx(
            questionImage && classes.hasImage,
            classes.markdownContainer
          )}>
            <CustomQuill value={question} readOnly />
          </div>
        </Grid>
        <Grid item xs={8} className={classes.answer}>
          {answerImage && <SelectedImage
            image={answerImage}
            imageStyle={imageStyle}
          />}
          <div className={clsx(
            answerImage&& classes.hasImage,
            classes.markdownContainer
          )}>
            <CustomQuill value={answer} readOnly />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default FlashcardList
