// @flow

import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import SelectedImage from 'components/SelectedImage';
import clsx from 'clsx';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import CustomQuill from 'components/CustomQuill';
import { useStyles } from '../_styles/FlashcardDetail';

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
  const classes = useStyles();
  const imageStyle = useMemo(
    () => ({
      borderRadius: 8,
      maxHeight: 50,
      maxWidth: 50
    }),
    []
  );

  return (
    <div className={classes.root}>
      {hardCount > 0 && (
        <div className={classes.hardCount}>
          Marked as Didn't Remember {hardCount} time{hardCount === 1 ? '' : 's'}
        </div>
      )}
      <Grid
        key={id}
        container
        spacing={2}
        classes={{
          root: classes.rootItem
        }}
      >
        <div className={clsx(classes.buttonGroup)}>
          {handleDelete && (
            <Button className={classes.button} onClick={handleOpen}>
              <CreateIcon fontSize="small" />
            </Button>
          )}
          {handleOpen && (
            <Button className={classes.button} onClick={handleDelete}>
              <ClearIcon fontSize="small" />
            </Button>
          )}
        </div>
        <Grid item xs={4} className={classes.question}>
          {questionImage && (
            <SelectedImage image={questionImage} imageStyle={imageStyle} />
          )}
          <div
            className={clsx(
              questionImage && classes.hasImage,
              classes.markdownContainer
            )}
          >
            <CustomQuill value={question} readOnly />
          </div>
        </Grid>
        <Grid item xs={8} className={classes.answer}>
          {answerImage && (
            <SelectedImage image={answerImage} imageStyle={imageStyle} />
          )}
          <div
            className={clsx(
              answerImage && classes.hasImage,
              classes.markdownContainer
            )}
          >
            <CustomQuill value={answer} readOnly />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default FlashcardList;
