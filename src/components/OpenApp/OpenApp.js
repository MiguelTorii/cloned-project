// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import appStore from '../../assets/img/app-store.png';
import googlePlay from '../../assets/img/google-play.png';

import { styles } from '../_styles/OpenApp';

type Props = {
  classes: Object
};

class OpenApp extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h4" align="center" paragraph>
          Video calls are not supported in this platform, please download the
          app to access all features
        </Typography>
        <ButtonBase className={classes.button}>
          <img className={classes.img} alt="App Store" src={appStore} />
        </ButtonBase>
        <ButtonBase className={classes.button}>
          <img className={classes.img} alt="Google Play" src={googlePlay} />
        </ButtonBase>
      </div>
    );
  }
}

export default withStyles(styles)(OpenApp);
