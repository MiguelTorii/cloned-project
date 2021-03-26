// @flow
import React, { Fragment } from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from 'containers/Tooltip'
// import ClassMultiSelect from 'containers/ClassMultiSelect'
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
    flexDirection: 'column',
    backgroundColor: theme.circleIn.palette.feedBackground
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
    marginLeft: theme.spacing(),
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
  searchIcon: {
    opacity: 0.3
  }
});

type Props = {
  classes: Object,
  courseDisplayName: string,
  expertMode: boolean,
  newClassExperience: boolean,
  query: string,
  userClasses: Array<string>,
  postTypes: Array<string>,
  classesList: Array<{ value: string, label: string }>,
  classList: array,
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
    openClassFilter: false,
    postTypes: [],
    selectedUserClasses: []
  };

  mounted: boolean;

  componentDidMount = () => {
    this.mounted = true;

    const { classList, userClasses } = this.props

    if (classList) {
      const selectedUserClasses = userClasses.map(uc => {
        const { classId } = JSON.parse(uc)
        const sc = classList.find(c => classId === c.classId)
        if (!sc) return null
        return {
          ...sc,
          sectionId: sc.section[0].sectionId
        }
      })
      this.setState({ selectedUserClasses })
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleClickClasses = () => {
    const { onOpenFilter } = this.props;
    this.setState({
      openClassFilter: true
    });
    onOpenFilter();
  };

  handleClick = () => {
    const { onOpenFilter } = this.props;
    this.setState({
      open: true
    });
    onOpenFilter();
  };

  handleClose = () => {
    this.setState({ open: false, openClassFilter: false });
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

  handleChangeClasses = selected => {
    const userClasses = selected.map(s => ({
      ...s,
      label: s.className,
      value: `{"classId": ${s.classId}, "sectionId": ${s.sectionId}}`
    }))

    this.setState({ userClasses, selectedUserClasses: selected })
  }

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

    const userClassesValues = userClasses
      ? userClasses.map(uc => uc.value)
      : []

    const filters = [
      {
        name: 'postTypes',
        value: postTypes
      },
      {
        name: 'userClasses',
        value: userClassesValues
      }
    ];
    onApplyFilters(filters);
    this.handleClose();
  };

  handleClearFilters = () => {
    const { onClearFilters } = this.props;
    onClearFilters();
    this.setState({ postTypes: [], userClasses: [] })
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
      expertMode,
      query,
      fromDate,
      toDate,
      onChange,
      onRefresh,
      onChangeDateRange,
      newClassExperience,
      userClasses,
      onClearSearch,
    } = this.props;
    const {
      // openClassFilter,
      // selectedUserClasses,
      open,
      postTypes
    } = this.state;
    const filterCount = this.getFilterCount();
    // eslint-disable-next-line no-script-url
    const isPostTypesSelected = postTypes.length > 0;
    const isUserClassesSelected = userClasses.length > 0;

    return (
      <Fragment>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.filtersHeader}>
            <InputBase
              className={classes.input}
              // type="search"
              startAdornment={<SearchIcon
                classes={{
                  root: classes.searchIcon
                }}
              />}
              placeholder={
                courseDisplayName ?
                  `Search for posts` :
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
            <Tooltip
              id={9047}
              hidden={!expertMode}
              placement="right"
              text="You can sort posts by date and filter posts by type!"
            >
              <Button
                aria-haspopup="true"
                aria-label="Filter"
                aria-owns={open ? 'filter-popper' : undefined}
                className={classes.filterButton}
                color="primary"
                onClick={this.handleClick}
                variant={filterCount > 0 ? "contained" : "outlined"}
              >
                Filters
              </Button>
            </Tooltip>
            {/* {expertMode && <Button */}
            {/* aria-haspopup="true" */}
            {/* aria-label="Filter" */}
            {/* aria-owns={open ? 'filter-popper' : undefined} */}
            {/* className={classes.filterButton} */}
            {/* color="primary" */}
            {/* onClick={this.handleClickClasses} */}
            {/* variant={userClasses.length > 0 ? "contained" : "outlined"} */}
            {/* > */}
            {/* Classes */}
            {/* </Button>} */}
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
            {(!newClassExperience) && <Grid item xs={12} sm={6} className={classes.option}>
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
                <Button
                  color='primary'
                  className={classes.formButton}
                  onClick={this.handleDeselectAll('userClasses')}
                >
                  Deselect All
                </Button>
              ) : (
                <Button
                  color='primary'
                  className={classes.formButton}
                  onClick={this.handleSelectAll('userClasses')}
                >
                    Select All
                </Button>
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
                <Button
                  color='primary'
                  className={classes.formButton}
                  onClick={this.handleDeselectAll('postTypes')}
                >
                  Deselect All
                </Button>
              ) : (
                <Button
                  color='primary'
                  className={classes.formButton}
                  onClick={this.handleSelectAll('postTypes')}
                >
                    Select All
                </Button>
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
        {/* <Dialog */}
        {/* open={openClassFilter} */}
        {/* fullWidth */}
        {/* maxWidth='sm' */}
        {/* title='Filter feed by class' */}
        {/* onCancel={this.handleClose} */}
        {/* secondaryVariant='text' */}
        {/* onSecondaryOk={this.handleClearFilters} */}
        {/* onOk={this.handleApplyFilters} */}
        {/* secondaryOkTitle='Reset' */}
        {/* showActions */}
        {/* okTitle='Search' */}
        {/* > */}
        {/* <ClassMultiSelect */}
        {/* noEmpty */}
        {/* variant='standard' */}
        {/* placeholder='Select Classes...' */}
        {/* selected={selectedUserClasses} */}
        {/* onSelect={this.handleChangeClasses} */}
        {/* /> */}
        {/* </Dialog> */}
      </Fragment>
    );
  }
}

export default withStyles(styles)(FeedFilter);
