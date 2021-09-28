import React, { Fragment } from 'react';
import update from 'immutability-helper';
import clsx from 'clsx';
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
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import ClearIcon from '@material-ui/icons/Clear';
import lodash from 'lodash';
import Tooltip from '../../containers/Tooltip/Tooltip';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import Dialog from '../Dialog/Dialog';
import DateRange from '../DateRange/DateRange';
import styles from '../_styles/FeedFilter';
import { DEFAULT_DEBOUNCE_DURATION_IN_MS } from '../../constants/common';
import { UserClass } from '../../types/models';

const types = [
  {
    value: '4',
    label: 'Notes',
    description: 'View all notes from you and your classmates',
    color: '#F5C264'
  },
  {
    value: '6',
    label: 'Questions',
    description: 'View all questions asked by your classmates, and yours',
    color: '#15A63D'
  },
  {
    value: '3',
    label: 'Flashcards',
    description: 'View all flashcards shared by you and your classmates',
    color: '#F54F47'
  },
  {
    value: '5',
    label: 'Resources',
    description: 'View all links and resources shared by you and your classmates',
    color: '#6F08D7'
  },
  {
    value: '8',
    label: 'Posts',
    description: 'View all general posts shared by classmates',
    color: '#1E88E5'
  }
];

type Props = {
  classes?: Record<string, any>;
  courseDisplayName?: string;
  expertMode?: boolean;
  newClassExperience?: boolean;
  query?: string;
  userClasses?: Array<string>;
  postTypes?: Array<string>;
  classesList?: Array<{
    value: string;
    label: string;
  }>;
  classList?: UserClass[];
  fromDate?: Record<string, any> | null | undefined;
  toDate?: Record<string, any> | null | undefined;
  from?: any;
  onChangeSearch: (...args: Array<any>) => any;
  onChange?: (...args: Array<any>) => any;
  onApplyFilters?: (...args: Array<any>) => any;
  onClearFilters?: (...args: Array<any>) => any;
  onOpenFilter?: (...args: Array<any>) => any;
  onRefresh?: (...args: Array<any>) => any;
  onChangeDateRange?: (...args: Array<any>) => any;
  onClearSearch?: (...args: Array<any>) => any;
};

type State = {
  open: boolean;
  openClassFilter: boolean;
  postTypes: Array<string>;
  userClasses: Array<string>;
  searchValue: string;
  selectedUserClasses: Array<string>;
};

class FeedFilter extends React.PureComponent<Props, State> {
  state = {
    open: false,
    openClassFilter: false,
    postTypes: [],
    selectedUserClasses: [],
    searchValue: '',
    userClasses: []
  };

  mounted: boolean;

  componentDidMount = () => {
    this.mounted = true;
    const { classList, userClasses, query, postTypes } = this.props;
    this.setState({
      searchValue: query,
      postTypes
    });

    if (classList) {
      // TODO remove this any which is hiding a type error
      // It looks like the actual type should `string[]`
      // but we need to deal with the null in here
      const selectedUserClasses: any = userClasses.map((uc) => {
        const { classId } = JSON.parse(uc);
        const sc = classList.find((c) => classId === c.classId);

        if (!sc) {
          // TODO this is a real type error:
          // null is not a string and cannot be assigned to the the state
          // variable `selectedUserClasses`
          return null;
        }

        return { ...sc, sectionId: sc.section?.[0]?.sectionId };
      });
      this.setState({
        selectedUserClasses
      });
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
    this.setState({
      open: false,
      openClassFilter: false
    });
  };

  onChangeSearchDebounced = lodash.debounce((search) => {
    const { onChangeSearch } = this.props;
    onChangeSearch(search);
  }, DEFAULT_DEBOUNCE_DURATION_IN_MS);

  handleChangeQuery = (event) => {
    const searchValue = event.target.value;
    this.setState({
      searchValue: searchValue
    });
    this.onChangeSearchDebounced(searchValue);
  };

  handleChange = (name) => (event) => {
    const { value } = event.target;
    const newState = update(this.state, {
      [name]: {
        $apply: (b) => {
          const index = b.findIndex((o) => o === value);

          if (event.target.checked && index === -1) {
            return [...b, value];
          }

          if (!event.target.checked && index > -1) {
            return update(b, {
              $splice: [[index, 1]]
            });
          }

          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleChangeClasses = (selected) => {
    const userClasses = selected.map((s) => ({
      ...s,
      label: s.className,
      value: `{"classId": ${s.classId}, "sectionId": ${s.sectionId}}`
    }));
    this.setState({
      userClasses,
      selectedUserClasses: selected
    });
  };

  handleSelectAll = (name) => () => {
    const { classesList } = this.props;
    const values = [];

    switch (name) {
      case 'postTypes':
        values.push(...types.map((item) => item.value));
        break;

      case 'userClasses':
        values.push(...classesList.map((item) => item.value));
        break;

      default:
        break;
    }

    if (values.length > 0) {
      const newState = update(this.state, {
        [name]: {
          $set: values
        }
      });
      this.setState(newState);
    }
  };

  handleRemoveFilter = (id) => () => {
    let currentPropTypes = [];
    const { onApplyFilters, userClasses } = this.props;
    const { postTypes } = this.state;

    if (id !== 'all') {
      currentPropTypes = postTypes.filter((postType) => postType !== id);
    }

    this.setState({
      postTypes: currentPropTypes
    });
    onApplyFilters({
      postTypes: currentPropTypes,
      userClasses
    });
  };

  handleDeselectAll = (name) => () => {
    const newState = update(this.state, {
      [name]: {
        $set: []
      }
    });
    this.setState(newState);
  };

  handleApplyFilters = () => {
    const { onApplyFilters, userClasses } = this.props;
    const { postTypes } = this.state;
    onApplyFilters({
      postTypes,
      userClasses
    });
    this.setState({
      open: false,
      openClassFilter: false
    });
  };

  getFilterCount = () => {
    const { newClassExperience, userClasses, postTypes } = this.props;
    let count = 0;

    if (!newClassExperience && userClasses.length > 0) {
      count += 1;
    }

    if (postTypes.length > 0) {
      count += 1;
    }

    return count;
  };

  render() {
    const {
      classes,
      courseDisplayName,
      classesList,
      expertMode,
      fromDate,
      toDate,
      onRefresh,
      onChangeDateRange,
      newClassExperience,
      userClasses,
      onChangeSearch
    } = this.props;
    const { open, postTypes, searchValue } = this.state;
    const filterCount = this.getFilterCount();
    // eslint-disable-next-line no-script-url
    const isPostTypesSelected = postTypes.length > 0;
    const isUserClassesSelected = userClasses.length > 0;
    return (
      <>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.filtersHeader}>
            <InputBase
              className={classes.input}
              startAdornment={
                <SearchIcon
                  classes={{
                    root: classes.searchIcon
                  }}
                />
              }
              placeholder={courseDisplayName ? 'Search posts' : 'To search add some posts first'}
              value={searchValue}
              onChange={this.handleChangeQuery}
              endAdornment={
                searchValue !== '' && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => onChangeSearch('')}
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
            <DateRange from={fromDate} to={toDate} onChange={onChangeDateRange} />
            <Tooltip
              id={9047}
              hidden={!expertMode}
              placement="right"
              text="You can sort posts by date and filter posts by type!"
            >
              <TransparentButton
                aria-haspopup="true"
                aria-label="Filter"
                aria-owns={open ? 'filter-popper' : undefined}
                className={classes.filterButton}
                onClick={filterCount ? this.handleRemoveFilter('all') : this.handleClick}
                variant="outlined"
                compact
              >
                {filterCount ? 'Reset Filters' : 'Filters'}
              </TransparentButton>
            </Tooltip>
            <div className={classes.filterButtonContainer}>
              {!!filterCount &&
                !!postTypes.length &&
                postTypes.map((postType) => {
                  const targetPostType = types.filter((type) => type.value === postType);
                  return (
                    <Chip
                      key={targetPostType[0].label}
                      label={targetPostType[0].label}
                      classes={{
                        root: classes.filterTypeBadge
                      }}
                      style={{
                        backgroundColor: targetPostType[0].color
                      }}
                      clickable
                      onDelete={this.handleRemoveFilter(targetPostType[0].value)}
                      deleteIcon={
                        <ClearIcon className={classes.deleteFilterIcon} fontSize="small" />
                      }
                    />
                  );
                })}
            </div>
          </div>
        </Paper>
        <Dialog
          className={classes.dialog}
          okTitle="Search"
          onCancel={this.handleClose}
          onOk={this.handleApplyFilters}
          open={open}
          showBackIcon
          showActions
          showCancel
          okButtonClass={classes.searchButton}
          disableOk={!isPostTypesSelected}
          closeButtonClass={classes.closeSearchModalButton}
          title="Filter Class Feed"
        >
          <Grid container>
            {!newClassExperience && (
              <Grid item xs={12} sm={6} className={classes.option}>
                <FormControl className={classes.formControl}>
                  <FormLabel component="legend">Courses</FormLabel>
                  <FormGroup>
                    {classesList.map((item) => (
                      <FormControlLabel
                        key={item.label}
                        control={
                          <Checkbox
                            checked={userClasses.findIndex((o) => o === item.value) > -1}
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
                    color="primary"
                    className={classes.formButton}
                    onClick={this.handleDeselectAll('userClasses')}
                  >
                    Deselect All
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className={classes.formButton}
                    onClick={this.handleSelectAll('userClasses')}
                  >
                    Select All
                  </Button>
                )}
              </Grid>
            )}
            <Grid item xs={12} className={classes.option}>
              <FormControl className={classes.formControl}>
                <FormLabel className={classes.filterDescription} component="legend">
                  Select posts you’d like to see below:
                </FormLabel>
                <FormGroup>
                  {types.map((type) => (
                    <>
                      <FormControlLabel
                        key={type.label}
                        control={
                          <Checkbox
                            checked={postTypes.findIndex((o) => o === type.value) > -1}
                            checkedIcon={
                              <span className={clsx(classes.icon, classes.checkedIcon)} />
                            }
                            icon={<span className={classes.icon} />}
                            onChange={this.handleChange('postTypes')}
                            value={type.value}
                          />
                        }
                        label={type.label}
                      />
                      <span className={classes.description}>{type.description}</span>
                    </>
                  ))}
                </FormGroup>
                <FormControlLabel
                  key="deselect"
                  control={
                    <Checkbox
                      checked={isPostTypesSelected}
                      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                      icon={<span className={classes.icon} />}
                      onChange={
                        isPostTypesSelected
                          ? this.handleDeselectAll('postTypes')
                          : this.handleSelectAll('postTypes')
                      }
                      value={isPostTypesSelected}
                    />
                  }
                  label={isPostTypesSelected ? 'Deselect All' : 'Select All'}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles as any)(FeedFilter);
