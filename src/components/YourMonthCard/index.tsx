import React, { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import AddIcon from "@material-ui/icons/Add";
import type { HomeCard } from "../../types/models";
import bronze from "../../assets/svg/rank_bronze.svg";
import silver from "../../assets/svg/rank_silver.svg";
import gold from "../../assets/svg/rank_gold.svg";
import platinum from "../../assets/svg/rank_platinum.svg";
import diamond from "../../assets/svg/rank_diamond.svg";
import master from "../../assets/svg/rank_master.svg";
import amazonLogo from "../../assets/svg/amazon_logo.svg";
import trophy from "../../assets/svg/trophy.svg";
// import studyPacketCard from '../../assets/svg/study_packet_card.svg';
import ring from "../../assets/svg/ring.svg";
import appLogo from "../../assets/svg/app-logo.svg";
import { renderText } from "../HomeGridList/utils";
import { styles } from "../_styles/YourMonthCard";
const ranks = [{
  label: 'Bronze',
  icon: bronze
}, {
  label: 'Silver',
  icon: silver
}, {
  label: 'Gold',
  icon: gold
}, {
  label: 'Platinum',
  icon: platinum
}, {
  label: 'Diamond',
  icon: diamond
}, {
  label: 'Master',
  icon: master
}];

const MyLink = ({
  href,
  ...props
}) => <RouterLink to={href} {...props} />;

const items = [{
  key: 1
}, {
  key: 2
}, {
  key: 3
}];
type Props = {
  classes: Record<string, any>;
  data: HomeCard;
  rank: number;
  isLoading: boolean;
};
type State = {
  open: boolean;
};

class YourMonthCard extends React.PureComponent<Props, State> {
  state = {
    open: false
  };
  handleOpen = () => {
    this.setState({
      open: true
    });
  };
  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {
      classes,
      data,
      rank,
      isLoading
    } = this.props;
    const {
      open
    } = this.state;
    // eslint-disable-next-line no-script-url
    const dudUrl = 'javascript:;';

    if (isLoading) {
      return <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>;
    }

    const newItems = items.map((item, index) => {
      const slot = data.slots.find(o => o.slot === index);

      if (slot) {
        return { ...item,
          ...slot
        };
      }

      return item;
    });
    return <Fragment>
        <Paper className={classes.root} elevation={1}>
          <div className={classes.header}>
            <Typography variant="h3" className={classes.title} paragraph align="center">
              {data.title}
            </Typography>
            <img alt={rank ? ranks[rank].label : ''} src={rank ? ranks[rank].icon : ''} className={classes.badge} />
            {
            /* <span className={classes.grow} /> */
          }
          </div>
          {
          /* <ButtonBase className={classes.helpButton} onClick={this.handleOpen}>
           <Avatar className={classes.helpIcon}>?</Avatar>
          </ButtonBase> */
        }
          <Typography variant="h5" paragraph align="center">
            {renderText(data.subtitle.text, data.subtitle.style)}
          </Typography>
          <Typography variant="h5" paragraph align="center">
            Your Top Picks
          </Typography>
          <div className={classes.slots}>
            {newItems.map(item => <div key={item.key} className={classes.item}>
                <Avatar className={classes.avatar}>{item.key}</Avatar>
                {!item.displayName ? <ButtonBase className={classes.addButton} href="/store" component={MyLink}>
                    <AddIcon />
                  </ButtonBase> : <Paper className={classes.card} style={{
              backgroundColor: item.bgColor
            }}>
                    <img src={item.imageUrl} alt={item.displayName} className={classes.image} />
                  </Paper>}
              </div>)}
          </div>
          <div className={classes.links}>
            <Typography variant="h6" align="center">
              <Link href="/store" component={MyLink} color="inherit" className={classes.link}>
                Reward Store
              </Link>
            </Typography>
          </div>
        </Paper>
        <Dialog open onClose={this.handleClose} fullWidth maxWidth="md" aria-labelledby="more-info-title" aria-describedby="more-info-description">
          <DialogContent>
            <DialogContentText id="video-points-description" className={classes.circleIn} variant="h4" paragraph>
              CircleIn
            </DialogContentText>
            <DialogContentText id="video-points-description" color="textPrimary" paragraph>
              Students are constantly prepping for the next exam, assignment, or project. CircleIn
              is your platform to connect with classmates and give or get help, earning real-life
              rewards as you go!
            </DialogContentText>
            <DialogContentText id="video-points-description" color="textPrimary" variant="h5" paragraph>
              Your Month
            </DialogContentText>
            <div className={classes.content}>
              <img src={amazonLogo} alt="Amazon" className={classes.contentIcon} />
              <DialogContentText id="video-points-description" color="textPrimary" paragraph>
                Every 1st Tuesday of the month, your points are automatically converted into your
                top picks. Let us know what your three most-wanted rewards are by heading to the
                Rewards Store and placing them inside of the Top Three slots!
              </DialogContentText>
            </div>
            <DialogContentText id="video-points-description" color="textPrimary" variant="h5" paragraph>
              Season Grand Prize
            </DialogContentText>
            <div className={classes.content}>
              <img src={trophy} alt="Trophy" className={classes.contentIcon} />
              <DialogContentText id="video-points-description" color="textPrimary" paragraph>
                Your season stats are important to you, not only because it tracks your performance
                on CircleIn, but because it leads to something awesome... the Season Grand Prize! To
                check your current season stats, head to the Home screen. To view all your season
                stats, head to the Profile.
              </DialogContentText>
            </div>
            {
            /* <DialogContentText
             id="video-points-description"
             color="textPrimary"
             variant="h5"
             paragraph
            >
             Study Packets
            </DialogContentText>
            <div className={classes.content}>
             <img
               src={studyPacketCard}
               alt="Study Packet Card"
               className={classes.contentIcon}
             />
             <DialogContentText
               id="video-points-description"
               color="textPrimary"
               paragraph
             >
               Every week, CircleIn finds and collects the best posts created
               by your classmates and turns them into a study packet just for
               you!
             </DialogContentText>
            </div> */
          }
            {
            /* <DialogContentText
             id="video-points-description"
             color="textPrimary"
             variant="h5"
             paragraph
            >
             Daily Streaks
            </DialogContentText>
            <div className={classes.content}>
             <img src={ring} alt="Ring" className={classes.contentIcon} />
             <DialogContentText
               id="video-points-description"
               color="textPrimary"
               paragraph
             >
               Students are studying Sunday through Saturday. That’s why we
               reward you when you log in every day of the week. The Daily
               Streak Ring represents an entire week using CircleIn. Every time
               you complete the ring, we give you a total of 150,000 points to
               let you know you’re awesome!
             </DialogContentText>
            </div> */
          }
            <DialogContentText id="video-points-description" color="textPrimary" variant="h5" paragraph>
              CircleIn App
            </DialogContentText>
            <div className={classes.content}>
              <img src={appLogo} alt="CircleIn App" className={classes.contentIcon} />
              <DialogContentText id="video-points-description" color="textPrimary" paragraph>
                Just like you enjoy our web version, you can download the app by going to your app
                store, searching CircleIn and then just login. Much success!
              </DialogContentText>
            </div>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Ok
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Fragment>;
  }

}

export default withStyles(styles)(YourMonthCard);