/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import type { Node } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomSwitch from "components/MainLayout/Switch";
import Grid from "@material-ui/core/Grid";
import Dialog from "../Dialog/Dialog";
import { styles } from "../_styles/CreatePostForm";
type Props = {
  classes: Record<string, any>;
  children: Node;
  loading: boolean;
  errorMessage: string | null | undefined;
  changed: boolean;
  buttonLabel: string;
  handleSubmit: (...args: Array<any>) => any;
};
type State = {};

class CreatePostForm extends React.PureComponent<Props, State> {
  state = {
    open: false
  };
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
    const {
      loading,
      changed,
      buttonLabel
    } = this.props;

    if (loading || !changed) {
      return 'Post';
    }

    return buttonLabel || 'Create';
  };

  render() {
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
    const {
      open
    } = this.state;
    return <>
        <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
          <main className={classes.main}>
            <Paper className={classes.paper}>{children}</Paper>
            <Grid container alignItems="center">
              <Grid className={classes.mt3} item xs={12} sm={6}>
                {currentTag === 1 && <Box mb={2}>
                    <FormControlLabel className={classes.anonymousActive} control={<CustomSwitch checked={anonymousActive} onChange={toggleAnonymousActive} name="anonymous" />} label={anonymousActive ? 'This post is anonymous!' : 'Make this post anonymous! 👀'} />
                    <Typography className={classes.anonymouslyExplanation}>
                      Your classmates cannot see who asked the question, but this post can still be
                      flagged for academic dishonesty.
                    </Typography>
                  </Box>}
                <Button onClick={this.showBreakDownDialog} color="primary" className={classes.breakdown}>
                  🏆 &nbsp;<u>Points Breakdown</u>
                </Button>
              </Grid>
              <Grid className={classes.mt3} item xs={12} sm={6}>
                <div className={classes.actions}>
                  <div className={classes.wrapper}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={Boolean(loading || !changed)} classes={{
                    root: classes.submit,
                    disabled: classes.disabled
                  }} id="post-submit-btn">
                      {loading ? <div className={classes.divProgress}>
                          <CircularProgress size={24} className={classes.buttonProgress} />
                        </div> : this.getButtonLabel()}
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
        <Dialog className={classes.dialog} contentClassName={classes.contentClassName} okTitle="Ok" onCancel={this.onClose} open={open} title="🏆 Points Breakdown">
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
      </>;
  }

}

export default withStyles(styles)(CreatePostForm);