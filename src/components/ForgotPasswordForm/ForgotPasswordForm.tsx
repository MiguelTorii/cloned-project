import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import withStyles from "@material-ui/core/styles/withStyles";
import { ReactComponent as AppLogo } from "../../assets/svg/circlein_logo.svg";
import { styles } from "../_styles/ForgotPasswordForm";

const MyLink = ({
  link,
  ...props
}) => <RouterLink to={link} {...props} />;

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
  email: string;
  loading: boolean;
  onChange: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
};
type State = {};

class ForgotPasswordForm extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const {
      classes,
      email,
      loading,
      onSubmit,
      onChange
    } = this.props;
    return <main className={classes.main}>
        <Paper className={classes.paper}>
          <AppLogo style={{
          maxHeight: 100,
          maxWidth: 200
        }} />
          <Typography component="h1" variant="h5">
            Recover Password
          </Typography>
          <ValidatorForm instantValidate={false} onSubmit={onSubmit} className={classes.form}>
            <TextValidator label="Email Address" margin="normal" onChange={onChange('email')} name="email" autoComplete="email" autoFocus fullWidth value={email} disabled={loading} validators={['required', 'isEmail']} errorMessages={['email is required', 'email is not valid']} />
            <div className={classes.wrapper}>
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} className={classes.submit}>
                Recover
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </ValidatorForm>
          <div className={classes.links}>
            <Typography variant="subtitle1" gutterBottom>
              {'Already have an account? '}
              <Link component={MyLink} link="/login" href="/login">
                Sign in
              </Link>
            </Typography>
          </div>
        </Paper>
      </main>;
  }

}

export default withStyles(styles)(ForgotPasswordForm);