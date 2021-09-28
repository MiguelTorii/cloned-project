import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import TermsOfUse from '../../components/TermsOfUse/TermsOfUse';

const styles = (theme) => ({
  main: {
    padding: theme.spacing(2)
  }
});

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
};
type State = {};

class TermsOfUsePage extends React.Component<ProvidedProps & Props, State> {
  componentDidMount = () => {};

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <TermsOfUse />
      </main>
    );
  }
}

export default withRoot(withStyles(styles as any)(TermsOfUsePage));
