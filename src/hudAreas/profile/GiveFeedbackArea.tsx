import React, { useCallback, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from 'components/Dialog/Dialog';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import { sendFeedback as sendFeedbackAPI } from '../../api/user';

const GiveFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const onChange = useCallback((e) => {
    setFeedback(e.target.value);
  }, []);
  const sendFeedback = useCallback(async () => {
    setIsSubmittingFeedback(true);
    const res = await sendFeedbackAPI({
      feedback,
      origin
    });

    setIsSubmittingFeedback(false);

    if (!(res as any)?.success) {
      setError('Failed to send Feedback');
    } else {
      setIsSuccessModalOpen(true);
      setFeedback('');
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
            <GradientButton
              variant="contained"
              color="primary"
              disabled={!feedback || isSubmittingFeedback}
              loading={isSubmittingFeedback}
              onClick={sendFeedback}
            >
              Send Feedback
            </GradientButton>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={isSuccessModalOpen}
        title="We received your feedback!"
        onCancel={() => setIsSuccessModalOpen(false)}
      >
        <DialogContent>
          <Typography variant="h6">
            Thanks for your feedback to help us improve CircleIn!
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GiveFeedback;
