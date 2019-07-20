// @flow
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import AddIcon from '@material-ui/icons/Add';
import type { Slot } from '../../types/models';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';

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
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
    marginBottom: 0
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
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  }
});

type Props = {
  classes: Object,
  slots?: Array<Slot>,
  rank?: number
};

type State = {};

class YourMonthCard extends React.PureComponent<Props, State> {
  static defaultProps = {
    slots: [],
    rank: 1
  };

  state = {};

  render() {
    const { classes, slots, rank } = this.props;
    const newItems = items.map((item, index) => {
      const slot = slots.find(o => o.slot === index);
      if (slot) return { ...item, ...slot };
      return item;
    });

    return (
      <Paper className={classes.root} elevation={1}>
        <div className={classes.header}>
          <Typography variant="h3" className={classes.title} paragraph>
            Your Month
          </Typography>
          <img
            alt={ranks[rank].label}
            src={ranks[rank].icon}
            className={classes.badge}
          />
          <span className={classes.grow} />
          <ButtonBase className={classes.helpButton}>
            <Avatar className={classes.helpIcon}>?</Avatar>
          </ButtonBase>
        </div>
        <Typography variant="h6" paragraph>
          You have 350 Points and 17 days left before 1st Tuesday Rewards
        </Typography>
        <Typography variant="h6" paragraph>
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
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(YourMonthCard);
