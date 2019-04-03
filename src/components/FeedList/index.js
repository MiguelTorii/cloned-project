// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FilterListIcon from '@material-ui/icons/FilterList';
import FeedItem from './feed-item';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    // maxWidth: 500,
    // maxHeight: '100%',
    // overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  title: {
    flex: 1
  },
  textField: {
    marginLeft: theme.spacing.unit,
    flex: 1
  },
  items: {
    overflowY: 'auto',
    // height: '100%',
    flex: 1,
    marginTop: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit * 2
  },
  header: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 48
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  popover: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit
  },
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  items: Array<Object>,
  isLoading: boolean,
  handleShare: Function,
  handlePostClick: Function
};

type State = {
  anchorEl: ?string,
  from: string,
  userClasses: string,
  postType: string
};

class FeedList extends React.PureComponent<Props, State> {
  state = {
    anchorEl: null,
    from: 'everyone',
    userClasses: 'all',
    postType: 'all'
  };

  handleClick = event => {
    const { currentTarget } = event;
    this.setState({
      anchorEl: currentTarget
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClearFilters = () => {
    this.setState({ from: 'everyone', userClasses: 'all', postType: 'all' });
  };

  getFilterCount = () => {
    const { from, userClasses, postType } = this.state;
    let count = 0;
    if (from !== 'everyone') count += 1;
    if (userClasses !== 'all') count += 1;
    if (postType !== 'all') count += 1;
    return count;
  };

  render() {
    const {
      classes,
      isLoading,
      items,
      handleShare,
      handlePostClick
    } = this.props;
    const { anchorEl, from, userClasses, postType } = this.state;
    const open = Boolean(anchorEl);
    const filterCount = this.getFilterCount();

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Paper className={classes.header} elevation={1}>
            <InputBase
              className={classes.input}
              type="search"
              placeholder="Search Classmates"
            />
            <Divider className={classes.divider} />
            <IconButton
              color="primary"
              className={classes.iconButton}
              aria-label="Directions"
              aria-owns={open ? 'filter-popper' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <Badge badgeContent={filterCount} color="primary">
                <FilterListIcon />
              </Badge>
            </IconButton>
          </Paper>
          <div className={classes.items}>
            {isLoading ? (
              <div className={classes.loader}>
                <CircularProgress />
              </div>
            ) : (
              items.map(item => (
                <FeedItem
                  key={item.feed_id}
                  data={item}
                  handleShareClick={handleShare}
                  handlePostClick={handlePostClick}
                />
              ))
            )}
          </div>
        </Paper>
        <Popover
          id="filter-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
        >
          <Paper className={classes.popover}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="from-native-helper">From</InputLabel>
              <NativeSelect
                value={from}
                onChange={this.handleChange('from')}
                input={<Input name="from" id="from-native-helper" />}
              >
                <option value="everyone">Everyone</option>
                <option value="classmates">Classmates</option>
                <option value="my_posts">My Posts</option>
                <option value="bookmarks">Bookmards</option>
              </NativeSelect>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="userClasses-native-helper">
                Classes
              </InputLabel>
              <NativeSelect
                value={userClasses}
                onChange={this.handleChange('userClasses')}
                input={
                  <Input name="userClasses" id="userClasses-native-helper" />
                }
              >
                <option value="all">All</option>
              </NativeSelect>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="postType-native-helper">
                Type of Post
              </InputLabel>
              <NativeSelect
                value={postType}
                onChange={this.handleChange('postType')}
                input={<Input name="userClasses" id="postType-native-helper" />}
              >
                <option value="all">All</option>
                <option value="flashcards">Flashcards</option>
                <option value="classnotes">Class notes</option>
                <option value="links">Links</option>
                <option value="questions">Questions</option>
              </NativeSelect>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              disabled={filterCount === 0}
              className={classes.button}
              onClick={this.handleClearFilters}
            >
              Clear Filters
            </Button>
          </Paper>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(FeedList);
