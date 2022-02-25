/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { Checkbox } from '@material-ui/core';

import CustomSwitch from '../MainLayout/Switch';
import Dialog from '../Dialog/Dialog';
import { styles } from '../_styles/CreatePostForm';
import { CIRCLEIN101_SECTION_ID, CIRCLEIN101_TC } from 'constants/common';
import SimpleErrorDialog from 'components/SimpleErrorDialog';

type Props = {
  currentTag?: any;
  title?: string;
  subtitle?: string;
  classes?: Record<string, any>;
  children?: React.ReactNode;
  loading?: boolean;
  errorMessage?: any;
  changed?: boolean;
  buttonLabel?: string;
  toggleAnonymousActive?: any;
  anonymousActive?: any;
  handleSubmit?: (...args: Array<any>) => any;
  sectionId?: number;
};
type State = {
  open: boolean;
  errorTitle: string | null;
  errorBody: string | null;
  errorOpen: boolean;
  termsAndConditionAccepted: boolean;
};

class CreatePostForm extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      errorOpen: false,
      errorTitle: null,
      errorBody: null,
      termsAndConditionAccepted: false
    };
  }

  showBreakDownDialog = () => {
    this.setState({
      open: true
    });
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  getButtonLabel = () => {
    const { loading, changed, buttonLabel } = this.props;

    if (loading || !changed) {
      return 'Post';
    }

    return buttonLabel || 'Create';
  };

  handleFormError = () => {
    this.setState({
      errorOpen: true,
      errorTitle: 'Error',
      errorBody: 'Some fields are missing!'
    });
  };

  handleCloseErrorPopup = () => {
    this.setState({
      errorOpen: false
    });
  };

  handleChangeTermsAndCondition = (event) => {
    this.setState({
      termsAndConditionAccepted: event.target.checked
    });
  };

  render() {
    const { sectionId } = this.props;
    const {
      currentTag,
      classes,
      buttonLabel,
      children,
      loading,
      changed,
      toggleAnonymousActive,
      anonymousActive,
      errorMessage,
      handleSubmit
    } = this.props;
    const { open, errorBody, errorOpen, errorTitle, termsAndConditionAccepted } = this.state;
    return (
      <>
        <ValidatorForm
          onSubmit={handleSubmit}
          onError={this.handleFormError}
          className={classes.form}
        >
          <main className={classes.main}>
            <Paper className={classes.paper}>{children}</Paper>
            {sectionId === CIRCLEIN101_SECTION_ID && (
              <Box px={2} display="flex">
                <Box>
                  <Checkbox
                    checked={termsAndConditionAccepted}
                    onChange={this.handleChangeTermsAndCondition}
                  />
                </Box>
                <Typography variant="body2">{CIRCLEIN101_TC}</Typography>
              </Box>
            )}
            <Grid container alignItems="center">
              <Grid className={classes.mt3} item xs={12} sm={6}>
                {currentTag === 1 && (
                  <Box mb={2}>
                    <FormControlLabel
                      className={classes.anonymousActive}
                      control={
                        <CustomSwitch
                          checked={anonymousActive}
                          onChange={toggleAnonymousActive}
                          name="anonymous"
                        />
                      }
                      label={
                        anonymousActive ? 'This post is anonymous!' : 'Make this post anonymous! 👀'
                      }
                    />
                    <Typography className={classes.anonymouslyExplanation}>
                      Your classmates cannot see who asked the question, but this post can still be
                      flagged for academic dishonesty.
                    </Typography>
                  </Box>
                )}
                <Button
                  onClick={this.showBreakDownDialog}
                  color="primary"
                  className={classes.breakdown}
                >
                  🏆 &nbsp;<u>Points Breakdown</u>
                </Button>
              </Grid>
              <Grid className={classes.mt3} item xs={12} sm={6}>
                <div className={classes.actions}>
                  <div className={classes.wrapper}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={Boolean(
                        loading ||
                          !changed ||
                          (sectionId === CIRCLEIN101_SECTION_ID && !termsAndConditionAccepted)
                      )}
                      classes={{
                        root: classes.submit,
                        disabled: classes.disabled
                      }}
                      id="post-submit-btn"
                    >
                      {loading ? (
                        <div className={classes.divProgress}>
                          <CircularProgress size={24} className={classes.buttonProgress} />
                        </div>
                      ) : (
                        this.getButtonLabel()
                      )}
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12}>
                {errorMessage}
              </Grid>
            </Grid>
          </main>
        </ValidatorForm>
        <Dialog
          className={classes.dialog}
          contentClassName={classes.contentClassName}
          okTitle="Ok"
          onCancel={this.onClose}
          open={open}
          title="🏆 Points Breakdown"
        >
          <div className={classes.childContent}>
            <div className={classes.pointItems}>
              <div className={classes.itemMark}>
                <div className={classes.postItem}>Post ✏️</div>
              </div>
              <div className={classes.itemText}>Earn 1k points for creating a post.</div>
            </div>
            <div className={classes.pointItems}>
              <div className={classes.itemMark}>
                <div className={classes.questionItem}>Question 🤔</div>
              </div>
              <div className={classes.itemText}>
                Earn 5K points for asking a question, 2K for answering a question & 40K for Best
                Answer.
              </div>
            </div>
            <div className={classes.pointItems}>
              <div className={classes.itemMark}>
                <div className={classes.noteItem}>Notes 📝</div>
              </div>
              <div className={classes.itemText}>Earn 10K points for every page of notes.</div>
            </div>
            <div className={classes.pointItems}>
              <div className={classes.itemMark}>
                <div className={classes.resourceItem}>Resource 🔗</div>
              </div>
              <div className={classes.itemText}>Earn 5K points for each resource shared.</div>
            </div>
            <div className={classes.gotIt}>
              <Button variant="contained" className={classes.btnGotIt} onClick={this.onClose}>
                Got it! 👍
              </Button>
            </div>
          </div>
        </Dialog>
        <SimpleErrorDialog
          open={errorOpen}
          title={errorTitle || ''}
          body={errorBody || ''}
          handleClose={this.handleCloseErrorPopup}
        />
      </>
    );
  }
}

export default withStyles(styles as any)(CreatePostForm);
