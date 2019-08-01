// @flow
import React from 'react';
import update from 'immutability-helper';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import FeedItem from './feed-item';
import DialogTitle from '../DialogTitle';

const types = [
  {
    value: '4',
    label: 'Notes'
  },
  {
    value: '6',
    label: 'Questions'
  },
  {
    value: '3',
    label: 'Flashcards'
  },
  {
    value: '5',
    label: 'Link'
  }
];

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit,
    position: 'relative',
    minHeight: 400
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
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
    maxHeight: 'calc(100vh - 170px)',
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
    minHeight: 48,
    backgroundColor: theme.circleIn.palette.appBar
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
  option: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  formControl: {
    margin: theme.spacing.unit * 2
  },
  formButton: {
    marginLeft: theme.spacing.unit * 2,
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing.unit
  },
  loader: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progress: {
    width: 180,
    height: 100,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noMessages: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  grow: {
    flex: 1
  }
});

type Props = {
  classes: Object,
  userId: string,
  items: Array<Object>,
  query: string,
  from: string,
  userClasses: Array<string>,
  postTypes: Array<string>,
  classesList: Array<{ value: string, label: string }>,
  isLoading: boolean,
  hasMore: boolean,
  fromFeedId: ?number,
  handleShare: Function,
  onPostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function,
  onChange: Function,
  onApplyFilters: Function,
  onClearFilters: Function,
  onLoadMore: Function,
  onUserClick: Function,
  onOpenFilter: Function,
  onRefresh: Function
};

type State = {
  open: boolean,
  postTypes: Array<string>,
  userClasses: Array<string>
};

class FeedList extends React.PureComponent<Props, State> {
  state = {
    open: false,
    postTypes: [],
    userClasses: []
  };

  componentDidMount = () => {
    this.mounted = true;
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { postTypes, userClasses } = this.props;
    const { open } = this.state;
    if (this.mounted && this.selectedRef) this.handleScrollToRef();
    if (open !== prevState.open && open) {
      this.setState({ postTypes, userClasses });
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleScrollToRef = () => {
    if (this.selectedRef && this.selectedRef.el) {
      this.selectedRef.el.scrollIntoView({ behavior: 'instant' });
    }
  };

  handleClick = () => {
    const { onOpenFilter } = this.props;
    this.setState({
      open: true
    });
    onOpenFilter();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    const { value } = event.target;
    const newState = update(this.state, {
      [name]: {
        $apply: b => {
          const index = b.findIndex(o => o === value);
          if (event.target.checked && index === -1) {
            return [...b, value];
          }
          if (!event.target.checked && index > -1) {
            return update(b, { $splice: [[index, 1]] });
          }
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleSelectAll = name => () => {
    const { classesList } = this.props;
    const values = [];
    switch (name) {
      case 'postTypes':
        values.push(...types.map(item => item.value));
        break;
      case 'userClasses':
        values.push(...classesList.map(item => item.value));
        break;
      default:
        break;
    }
    if (values.length > 0) {
      const newState = update(this.state, {
        [name]: { $set: values }
      });
      this.setState(newState);
    }
  };

  handleDeselectAll = name => () => {
    const newState = update(this.state, {
      [name]: { $set: [] }
    });
    this.setState(newState);
  };

  handleApplyFilters = () => {
    const { onApplyFilters } = this.props;
    const { postTypes, userClasses } = this.state;
    const filters = [
      {
        name: 'postTypes',
        value: postTypes
      },
      {
        name: 'userClasses',
        value: userClasses
      }
    ];
    onApplyFilters(filters);
    this.handleClose();
  };

  handleClearFilters = () => {
    const { onClearFilters } = this.props;
    onClearFilters();
    this.handleClose();
  };

  getFilterCount = () => {
    const { from, userClasses, postTypes } = this.props;
    let count = 0;
    if (from !== 'everyone') count += 1;
    if (userClasses.length > 0) count += 1;
    if (postTypes.length > 0) count += 1;
    return count;
  };

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  selectedRef: {
    // eslint-disable-next-line no-undef
    el: ?HTMLDivElement
  };

  mounted: boolean;

  render() {
    const {
      classes,
      userId,
      isLoading,
      items,
      classesList,
      handleShare,
      onPostClick,
      onBookmark,
      onReport,
      onDelete,
      query,
      hasMore,
      fromFeedId,
      onChange,
      onLoadMore,
      onUserClick,
      onRefresh
    } = this.props;
    const { open, postTypes, userClasses } = this.state;
    const filterCount = this.getFilterCount();
    // eslint-disable-next-line no-script-url
    const dudUrl = 'javascript:;';
    const isPostTypesSelected = postTypes.length > 0;
    const isUserClassesSelected = userClasses.length > 0;

    return (
      <div className={classes.container}>
        {isLoading && (
          <div className={classes.loader}>
            <div className={classes.progress}>
              <Typography align="center" variant="subtitle1" paragraph>
                Loading Posts
              </Typography>
              <CircularProgress size={20} />
            </div>
          </div>
        )}
        <Paper className={classes.root} elevation={0}>
          <Paper className={classes.header} elevation={1}>
            <InputBase
              className={classes.input}
              type="search"
              placeholder="Search for posts"
              value={query}
              onChange={onChange('query')}
            />
            <SearchIcon />
            <Divider className={classes.divider} />
            <IconButton
              color="primary"
              className={classes.iconButton}
              aria-label="Refresh"
              onClick={onRefresh}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              color="primary"
              className={classes.iconButton}
              aria-label="Filter"
              aria-owns={open ? 'filter-popper' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <Badge badgeContent={filterCount} color="primary">
                <FilterListIcon />
              </Badge>
            </IconButton>
          </Paper>
          <div
            className={classes.items}
            ref={node => {
              this.scrollParentRef = node;
            }}
          >
            <InfiniteScroll
              threshold={50}
              pageStart={0}
              loadMore={onLoadMore}
              hasMore={hasMore}
              useWindow={false}
              initialLoad={false}
              getScrollParent={() => this.scrollParentRef}
            >
              {items.length === 0 ? (
                <div className={classes.noMessages}>
                  <Typography variant="subtitle1" align="center">
                    No posts for the selected Filters.
                  </Typography>
                </div>
              ) : (
                items.map(item => (
                  <FeedItem
                    key={item.feedId}
                    userId={userId}
                    data={item}
                    handleShareClick={handleShare}
                    innerRef={node => {
                      if (fromFeedId === item.feedId) this.selectedRef = node;
                    }}
                    onPostClick={onPostClick}
                    onBookmark={onBookmark}
                    onReport={onReport}
                    onDelete={onDelete}
                    onUserClick={onUserClick}
                  />
                ))
              )}
            </InfiniteScroll>
          </div>
        </Paper>
        <Dialog
          open={open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
          aria-labelledby="filter-dialog-title"
          aria-describedby="filter-dialog-description"
        >
          <DialogTitle id="filter-dialog-title" onClose={this.handleClose}>
            {'Filter Posts by:'}
          </DialogTitle>
          <Grid container>
            <Grid item xs={12} sm={6} className={classes.option}>
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">Post Type</FormLabel>
                <FormGroup>
                  {classesList.map(item => (
                    <FormControlLabel
                      key={item.label}
                      control={
                        <Checkbox
                          checked={
                            userClasses.findIndex(o => o === item.value) > -1
                          }
                          onChange={this.handleChange('userClasses')}
                          value={item.value}
                        />
                      }
                      label={item.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              {isUserClassesSelected ? (
                <Link
                  href={dudUrl}
                  component="button"
                  variant="body2"
                  className={classes.formButton}
                  onClick={this.handleDeselectAll('userClasses')}
                >
                  Deselect All
                </Link>
              ) : (
                <Link
                  href={dudUrl}
                  component="button"
                  variant="body2"
                  className={classes.formButton}
                  onClick={this.handleSelectAll('userClasses')}
                >
                  Select All
                </Link>
              )}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.option}>
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">Post Type</FormLabel>
                <FormGroup>
                  {types.map(type => (
                    <FormControlLabel
                      key={type.label}
                      control={
                        <Checkbox
                          checked={
                            postTypes.findIndex(o => o === type.value) > -1
                          }
                          onChange={this.handleChange('postTypes')}
                          value={type.value}
                        />
                      }
                      label={type.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              {isPostTypesSelected ? (
                <Link
                  href={dudUrl}
                  component="button"
                  variant="body2"
                  className={classes.formButton}
                  onClick={this.handleDeselectAll('postTypes')}
                >
                  Deselect All
                </Link>
              ) : (
                <Link
                  href={dudUrl}
                  component="button"
                  variant="body2"
                  className={classes.formButton}
                  onClick={this.handleSelectAll('postTypes')}
                >
                  Select All
                </Link>
              )}
            </Grid>
          </Grid>
          {/* <FormControl className={classes.formControl}>
            <InputLabel htmlFor="from-native-helper">From</InputLabel>
            <NativeSelect
              value={from}
              // onChange={onChange('from')}
              input={<Input name="from" id="from-native-helper" />}
            >
              <option value="everyone">Everyone</option>
              <option value="classmates">Classmates</option>
              <option value="my_posts">My Posts</option>
              <option value="bookmarks">Bookmarks</option>
            </NativeSelect>
          </FormControl> */}
          <DialogActions className={classes.actions}>
            <Button
              color="primary"
              className={classes.button}
              disabled={filterCount === 0}
              onClick={this.handleClearFilters}
            >
              Reset Filters
            </Button>
            <span className={classes.grow} />
            <Button
              color="primary"
              className={classes.button}
              onClick={this.handleClose}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!isPostTypesSelected && !isUserClassesSelected}
              className={classes.button}
              onClick={this.handleApplyFilters}
            >
              Search
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(FeedList);
