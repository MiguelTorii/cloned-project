// @flow
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
    padding: theme.spacing.unit,
    position: 'relative',
    minHeight: 400
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
  formControl: {
    margin: theme.spacing.unit * 2
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
  }
});

type Props = {
  classes: Object,
  userId: string,
  items: Array<Object>,
  query: string,
  from: string,
  userClass: string,
  defaultClass: string,
  postType: string,
  classesList: Array<{ value: string, label: string }>,
  isLoading: boolean,
  hasMore: boolean,
  handleShare: Function,
  handlePostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function,
  onChange: Function,
  onClearFilters: Function,
  onLoadMore: Function
};

type State = {
  anchorEl: ?string
};

class FeedList extends React.PureComponent<Props, State> {
  state = {
    anchorEl: null
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

  getFilterCount = () => {
    const { from, userClass, postType, defaultClass } = this.props;
    let count = 0;
    if (from !== 'everyone') count += 1;
    if (userClass !== defaultClass) count += 1;
    if (postType !== 0) count += 1;
    return count;
  };

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  render() {
    const {
      classes,
      userId,
      isLoading,
      items,
      classesList,
      handleShare,
      handlePostClick,
      onBookmark,
      onReport,
      onDelete,
      query,
      from,
      userClass,
      defaultClass,
      postType,
      hasMore,
      onChange,
      onClearFilters,
      onLoadMore
    } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const filterCount = this.getFilterCount();

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
              placeholder="Search Classmates"
              value={query}
              onChange={onChange('query')}
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
              {items.map(item => (
                <FeedItem
                  key={item.feedId}
                  userId={userId}
                  data={item}
                  handleShareClick={handleShare}
                  handlePostClick={handlePostClick}
                  onBookmark={onBookmark}
                  onReport={onReport}
                  onDelete={onDelete}
                />
              ))}
            </InfiniteScroll>
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
                onChange={onChange('from')}
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
                value={userClass}
                onChange={onChange('userClass')}
                input={<Input name="userClass" id="userClass-native-helper" />}
              >
                <option value={defaultClass}>All</option>
                {classesList.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="postType-native-helper">
                Type of Post
              </InputLabel>
              <NativeSelect
                value={postType}
                onChange={onChange('postType')}
                input={<Input name="postType" id="postType-native-helper" />}
              >
                <option value={0}>All</option>
                <option value={3}>Flashcards</option>
                <option value={4}>Class notes</option>
                <option value={5}>Links</option>
                <option value={6}>Questions</option>
              </NativeSelect>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              disabled={filterCount === 0}
              className={classes.button}
              onClick={onClearFilters}
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
