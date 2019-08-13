// @flow
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AddIcon from '@material-ui/icons/Add';
import type { HomeCard } from '../../types/models';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';
import amazonLogo from '../../assets/svg/amazon_logo.svg';
import trophy from '../../assets/svg/trophy.svg';
import studyPacketCard from '../../assets/svg/study_packet_card.svg';
import ring from '../../assets/svg/ring.svg';
import { renderText } from '../HomeGridList/utils';

const ranks = [
  {
    label: 'Bronze',
    icon: bronze
  },
  {
    label: 'Silver',
    icon: silver
  },
  {
    label: 'Gold',
    icon: gold
  },
  {
    label: 'Platinum',
    icon: platinum
  },
  {
    label: 'Diamond',
    icon: diamond
  },
  {
    label: 'Master',
    icon: master
  }
];

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const items = [{ key: 1 }, { key: 2 }, { key: 3 }];

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  title: {
    color: '#fec04f'
  },
  badge: {
    marginLeft: theme.spacing.unit,
    height: 32,
    width: 32
  },
  grow: {
    flex: 1
  },
  slots: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    margin: theme.spacing.unit,
    display: 'flex'
  },
  helpButton: {
    width: 20,
    height: 20,
    borderRadius: '100%'
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1
  },
  avatar: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1,
    marginRight: theme.spacing.unit
  },
  card: {
    width: 92,
    height: 92,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 'auto',
    maxWidth: 80,
    height: 'auto',
    maxHeight: 50
  },
  addButton: {
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 92,
    height: 92
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2
  },
  link: {
    margin: theme.spacing.unit,
    color: theme.palette.primary.main
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  },
  circleIn: {
    color: theme.circleIn.palette.action
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  contentIcon: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    height: 40
  }
});

type Props = {
  classes: Object,
  data: HomeCard,
  rank: number,
  isLoading: boolean,
  onOpenLeaderboard: Function
};

type State = {
  open: boolean
};

class YourMonthCard extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, data, rank, isLoading, onOpenLeaderboard } = this.props;
    const { open } = this.state;

    // eslint-disable-next-line no-script-url
    const dudUrl = 'javascript:;';

    if (isLoading)
      return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>
      );
    const newItems = items.map((item, index) => {
      const slot = data.slots.find(o => o.slot === index);
      if (slot) return { ...item, ...slot };
      return item;
    });

    return (
      <Fragment>
        <Paper className={classes.root} elevation={1}>
          <div className={classes.header}>
            <Typography variant="h3" className={classes.title} paragraph>
              {data.title}
            </Typography>
            <img
              alt={rank ? ranks[rank].label : ''}
              src={rank ? ranks[rank].icon : ''}
              className={classes.badge}
            />
            <span className={classes.grow} />
            <ButtonBase
              className={classes.helpButton}
              onClick={this.handleOpen}
            >
              <Avatar className={classes.helpIcon}>?</Avatar>
            </ButtonBase>
          </div>
          <Typography variant="h5" paragraph>
            {renderText(data.subtitle.text, data.subtitle.style)}
          </Typography>
          <Typography variant="h5" paragraph>
            Your Top Picks
          </Typography>
          <div className={classes.slots}>
            {newItems.map(item => (
              <div key={item.key} className={classes.item}>
                <Avatar className={classes.avatar}>{item.key}</Avatar>
                {!item.displayName ? (
                  <ButtonBase
                    className={classes.addButton}
                    href="/store"
                    component={MyLink}
                  >
                    <AddIcon />
                  </ButtonBase>
                ) : (
                  <Paper
                    className={classes.card}
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.displayName}
                      className={classes.image}
                    />
                  </Paper>
                )}
              </div>
            ))}
          </div>
          <div className={classes.links}>
            <Typography variant="h6">
              <Link
                href="/store"
                component={MyLink}
                color="inherit"
                className={classes.link}
              >
                Reward Store
              </Link>
            </Typography>
            <Typography variant="h6">
              <Link
                href={dudUrl}
                onClick={onOpenLeaderboard}
                color="inherit"
                className={classes.link}
              >
                Leaderboard
              </Link>
            </Typography>
          </div>
        </Paper>
        <Dialog
          open={open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="md"
          aria-labelledby="more-info-title"
          aria-describedby="more-info-description"
        >
          <DialogContent>
            <DialogContentText
              id="video-points-description"
              className={classes.circleIn}
              variant="h3"
              paragraph
            >
              CircleIn
            </DialogContentText>
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              paragraph
            >
              Students are constantly prepping for the next exam, assignment, or
              project. CircleIn is your platform to connect with classmates and
              give or get help, earning real-life rewards as you go!
            </DialogContentText>
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              variant="h5"
              paragraph
            >
              Your Month
            </DialogContentText>
            <div className={classes.content}>
              <img
                src={amazonLogo}
                alt="Amazon"
                className={classes.contentIcon}
              />
              <DialogContentText
                id="video-points-description"
                color="textPrimary"
                paragraph
              >
                Every 1st Tuesday of the month, your points are automatically
                converted into your top picks. Let us know what your three
                most-wanted rewards are by heading to the Rewards Store and
                placing them inside of the Top Three slots!
              </DialogContentText>
            </div>
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              variant="h5"
              paragraph
            >
              Season Grand Prize
            </DialogContentText>
            <div className={classes.content}>
              <img src={trophy} alt="Trophy" className={classes.contentIcon} />
              <DialogContentText
                id="video-points-description"
                color="textPrimary"
                paragraph
              >
                Your season stats are important to you, not only because it
                tracks your performance on CircleIn, but because it leads to
                something awesome... the Season Grand Prize! To check your
                current season stats, head to the Home screen. To view all your
                season stats, head to the Profile.
              </DialogContentText>
            </div>
            <DialogContentText
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
            </div>
            <DialogContentText
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
                you complete the ring, we give you a total of 1,500 scholarship
                points to let you know you’re awesome!
              </DialogContentText>
            </div>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Ok
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(YourMonthCard);
