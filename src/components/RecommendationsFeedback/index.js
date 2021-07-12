import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import clsx from "clsx";

import Image1 from 'assets/img/rating_1.png';
import Image2 from 'assets/img/rating_2.png';
import Image3 from 'assets/img/rating_3.png';
import Image4 from 'assets/img/rating_4.png';
import useStyles from './style';
import { logEventLocally } from "../../api/analytics";
import TransparentButton from "../Basic/Buttons/TransparentButton";

const ratings = [
  {
    image: Image1,
    text: 'Very Useful',
    description: 'Yay! We’ll send you more posts like this!'
  },
  {
    image: Image2,
    text: 'Useful',
    description: 'We’ll work to send you more posts you’ll love!'
  },
  {
    image: Image3,
    text: 'A Little Useful',
    description: 'We’re going to work on sending you better post recommendations you’ll love.'
  },
  {
    image: Image4,
    text: 'Not Useful',
    description: 'Oh no! Tell us more about what was wrong with this post.'
  }
];

const RecommendationsFeedback = ({
  feedId
}) => {
  const classes = useStyles();
  const [ratingIndex, setRatingIndex] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [gaveMore, setGaveMore] = useState(false);

  const makeLog = (text) => {
    logEventLocally({
      category: 'Post',
      action: 'Rated',
      objectId: feedId,
      rating: text,
      recommendationType: 'In Post'
    });
  };

  const handleGiveFeedback = (index) => {
    setRatingIndex(index);
    if (index !== 3) {
      makeLog(ratings[index].text);
      setTimeout(() => setHidden(true), 3000);
    }
  };

  const handleNotUsefulFeedback = (message) => {
    setGaveMore(true);
    makeLog(`Not Useful-${message}`);
    setTimeout(() => setHidden(true), 3000);
  };

  const renderRatingText = () => {
    if (ratingIndex === 3 && gaveMore) {
      return (
        <>
          <Typography align="center" variant="h6">
            Not Useful
          </Typography>
          <Typography>
            {ratings[2].description}
          </Typography>
        </>
      )
    }
    return (
      <>
        <Typography align="center" variant="h6">
          {ratings[ratingIndex].text}
        </Typography>
        <Typography gutterBottom>
          {ratings[ratingIndex].description}
        </Typography>
        {ratingIndex === 3 && !gaveMore && (
          <Box display="flex" justifyContent="space-between">
            <TransparentButton compact onClick={() => handleNotUsefulFeedback('Irrelevant')}>
              It's irrelevant
            </TransparentButton>
            <TransparentButton compact onClick={() => handleNotUsefulFeedback('Spam')}>
              It's spam
            </TransparentButton>
          </Box>
        )}
      </>
    );
  };

  if (hidden) return null;

  return (
    <Paper elevation={0} className={classes.root}>
      <Typography variant="h6" gutterBottom>
        How useful was this post?
      </Typography>
      <Typography variant="body2" paragraph>
        When you rate a post, your recommendations get better each time!
      </Typography>
      <Grid container spacing={2}>
        {ratings.map((item, index) => (
          <Grid key={item.text} item xs={3} className={classes.imageContainer}>
            {ratingIndex !== null ? (
              <img
                src={item.image}
                alt={item.text}
                className={clsx(classes.image, ratingIndex !== index && 'disabled')}
              />
            ): (
              <Link component="button" onClick={() => handleGiveFeedback(index)}>
                <img src={item.image} alt={item.text} className={classes.image} />
              </Link>
            )}
          </Grid>
        ))}
      </Grid>
      {ratingIndex !== null ? (
        renderRatingText()
      ) : (
        <Box display="flex" justifyContent="space-between">
          <Typography>
            Very Useful
          </Typography>
          <Typography>
            Not Useful
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

RecommendationsFeedback.propTypes = {
  feedId: PropTypes.string.isRequired
};

export default RecommendationsFeedback;
