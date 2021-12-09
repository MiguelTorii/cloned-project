import React, { useCallback, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Box, Button } from '@material-ui/core';
import { sendFeedback as sendFeedbackAPI } from '../../api/user';

const GiveFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const onChange = useCallback((e) => {
    setFeedback(e.target.value);
  }, []);
  const sendFeedback = useCallback(async () => {
    const res = await sendFeedbackAPI({
      feedback,
      origin
    });

    if (!(res as any)?.success) {
      setError('Failed to send Feedback');
    }
  }, [feedback, origin]);
  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Typography align="center" paragraph>
            {
              "How do you think we can make CircleIn better for you? Have an idea that you'd like us to work on? Just enter it here and include your email so we can thank you!"
            }
          </Typography>
          <TextField
            fullWidth
            error={Boolean(error)}
            helperText={error}
            variant="outlined"
            onChange={onChange}
            value={feedback}
            multiline
            rowsMax={8}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={sendFeedback}>
              Send Feedback
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GiveFeedback;
