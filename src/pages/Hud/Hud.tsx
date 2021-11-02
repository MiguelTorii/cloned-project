import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import withRoot from '../../withRoot';
import { styles } from '../../components/_styles/Hud/Hud';

type Props = {
  classes: Record<string, any>;
};

const Hud = ({ classes }: Props) => (
  <main>
    <CssBaseline />
    <div className={cx(classes.app, classes.appWithHud)}>
      <div className={classes.mainAction}>Main action</div>
      <div className={classes.storyAvatar}>Avatar talking to me</div>
      <div className={classes.miniMap}>Mini map</div>
      <div className={classes.questTasks}>Quest tasks</div>
      <div className={classes.rewardUpdates}>Reward updates</div>
      <div className={classes.toolsAndSpells}>Tools and spells</div>
      <div className={classes.storyCaption}>Conversation</div>
      <div className={classes.experienceUpdates}>Experience updates</div>
      <div className={classes.experienceProgress}>Experience progress</div>
      <div className={classes.playerModes}>Player modes</div>
      <div className={classes.chatChannels}>Chat channels (groups and people)</div>
      <div className={classes.activeChat}>Active chat</div>
    </div>
  </main>
);

export default withRoot(withStyles(styles as any)(Hud));
