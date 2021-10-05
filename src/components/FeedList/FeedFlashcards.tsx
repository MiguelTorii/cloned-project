import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LoadImg from '../LoadImg/LoadImg';
import CustomQuill from '../CustomQuill/CustomQuill';
import { useStyles } from '../_styles/FeedList/FeedFlashcards';

const strip = (s) => s.replace(/<[^>]*>?/gm, '');

const FeedFlashcards = ({ deck }) => {
  const classes: any = useStyles();
  const imageStyle = useMemo(
    () => ({
      borderRadius: 4,
      maxHeight: 40,
      maxWidth: 40
    }),
    []
  );
  const imageStyleSingle = useMemo(
    () => ({
      borderRadius: 4,
      maxHeight: 40,
      maxWidth: 160
    }),
    []
  );
  const count = useMemo(() => deck.length - 3, [deck]);
  return deck.slice(0, 3).map(({ id, question, answer, questionImageUrl, answerImageUrl }, k) => (
    <Grid container key={id} className={classes.flashCardPreview}>
      {k === 2 && count > 0 && (
        <div className={classes.count}>
          <Typography className={classes.countLabel}>
            +{count} more {count === 1 ? 'card' : 'cards'}
          </Typography>
        </div>
      )}
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
        {questionImageUrl && (
          <Grid item xs={strip(question) ? 3 : 12} className={classes.image}>
            <LoadImg
              url={questionImageUrl}
              style={strip(question) ? imageStyle : imageStyleSingle}
            />
          </Grid>
        )}
        {strip(question) && (
          <Grid item xs={questionImageUrl ? 9 : 12}>
            <div className={classes.markdownContainer}>
              <CustomQuill value={question} readOnly />
            </div>
          </Grid>
        )}
      </Grid>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
        {answerImageUrl && (
          <Grid item xs={strip(answer) ? 3 : 12} className={classes.image}>
            <LoadImg url={answerImageUrl} style={strip(answer) ? imageStyle : imageStyleSingle} />
          </Grid>
        )}
        {strip(answer) && (
          <Grid item xs={answerImageUrl ? 9 : 12}>
            <div className={classes.markdownContainer}>
              <CustomQuill value={answer} readOnly />
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  ));
};

export default FeedFlashcards;
