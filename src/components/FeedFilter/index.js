// @flow
import React, { Fragment } from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from '../Dialog';
import DateRange from '../DateRange';

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
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    margin: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  filtersHeader: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filtersFooter: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  input: {
    marginRight: 8,
    flex: 1,
    borderRadius: 4,
    paddingLeft: 8,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  formControl: {
    margin: theme.spacing(2)
  },
  formButton: {
    marginLeft: theme.spacing(2),
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing()
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  grow: {
    flex: 1
  },
  filterButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
});

type Props = {
  classes: Object,
  courseDisplayName: string,
  newClassExperience: boolean,
  query: string,
  userClasses: Array<string>,
  postTypes: Array<string>,
  classesList: Array<{ value: string, label: string }>,
  fromDate: ?Object,
  toDate: ?Object,
  onChange: Function,
  onApplyFilters: Function,
  onClearFilters: Function,
  onOpenFilter: Function,
  onRefresh: Function,
  onChangeDateRange: Function,
  onClearSearch: Function
};

type State = {
  open: boolean,
  postTypes: Array<string>,
  userClasses: Array<string>
};

class FeedFilter extends React.PureComponent<Props, State> {
  state = {
    open: false,
    postTypes: [],
    userClasses: []
  };

  mounted: boolean;

  componentDidMount = () => {
    this.mounted = true;
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { postTypes, userClasses } = this.props;
    const { open } = this.state;
    if (open !== prevState.open && open) {
      this.setState({ postTypes, userClasses });
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
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
    const { newClassExperience, userClasses, postTypes } = this.props;
    let count = 0;
    // if (from !== 'everyone') count += 1;
    if (!newClassExperience && userClasses.length > 0) count += 1;
    if (postTypes.length > 0) count += 1;
    return count;
  };

  render() {
    const {
      classes,
      courseDisplayName,
      classesList,
      query,
      fromDate,
      toDate,
      onChange,
      onRefresh,
      onChangeDateRange,
      newClassExperience,
      onClearSearch,
    } = this.props;
    const { open, postTypes, userClasses } = this.state;
    const filterCount = this.getFilterCount();
    // eslint-disable-next-line no-script-url
    const dudUrl = 'javascript:;';
    const isPostTypesSelected = postTypes.length > 0;
    const isUserClassesSelected = userClasses.length > 0;

    return (
      <Fragment>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.filtersHeader}>
            <InputBase
              className={classes.input}
              // type="search"
              placeholder={
                courseDisplayName ? 
                  `Search for posts in ${courseDisplayName}` : 
                  'To search add some posts first'
              }
              value={query}
              onChange={onChange('query')}
              endAdornment={
                query !== '' && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={onClearSearch}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }
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
          </div>
          <div className={classes.filtersFooter}>
            <DateRange
              from={fromDate}
              to={toDate}
              onChange={onChangeDateRange}
            />
            <Button
              aria-haspopup="true"
              aria-label="Filter"
              aria-owns={open ? 'filter-popper' : undefined}
              className={classes.filterButton}
              color="primary"
              onClick={this.handleClick}
              variant={filterCount > 0 ? "contained" : "outlined"}
            >
              <Badge badgeContent={filterCount} color="secondary">
                Filters
              </Badge>
            </Button>
          </div>
        </Paper>
        <Dialog
          className={classes.dialog}
          okTitle="Search"
          onCancel={this.handleClose}
          onOk={this.handleApplyFilters}
          open={open}
          showActions
          showCancel
          title="Filter Posts by:"
        >
          <Grid container>
            {!newClassExperience && <Grid item xs={12} sm={6} className={classes.option}>
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">Courses</FormLabel>
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
            </Grid>}
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
          <div className={classes.actions}>
            <Button
              color="primary"
              className={classes.button}
              disabled={filterCount === 0}
              onClick={this.handleClearFilters}
            >
              Reset Filters
            </Button>
            <span className={classes.grow} />
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(FeedFilter);
