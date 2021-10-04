import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import AutoComplete from "../AutoComplete/AutoComplete";
import type { SelectType } from "../../types/models";
import { styles } from "../_styles/AuthSearchSchool";
const MyLink = React.forwardRef(({
  href,
  ...props
}, ref) => <RouterLink to="/terms-of-use" target="_blank" {...props} ref={ref} />);
type Props = {
  classes: Record<string, any>;
  school: SelectType | null | undefined;
  error: boolean;
  onChange: (...args: Array<any>) => any;
  onLoad: (...args: Array<any>) => any;
};

class AuthSearchSchool extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      school,
      error,
      onChange,
      onLoad
    } = this.props;
    return <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" align="center">
            {"Enter your school's name"}
          </Typography>
          <div className={classes.schools}>
            <AutoComplete id="search-school" values={school} inputValue="" label="" placeholder="Search your school/college" error={error} errorText="You must select an option" isSchoolSearch onChange={onChange} onLoadOptions={onLoad} />
          </div>
          <Typography variant="subtitle1" align="center">
            {"By searching for and selecting your school, I agree to CircleIn's  "}
            <Link href="/terms-of-use" component={MyLink}>
              Terms of Service and Privacy Policy
            </Link>
          </Typography>
        </Paper>
      </div>;
  }

}

export default withStyles(styles)(AuthSearchSchool);