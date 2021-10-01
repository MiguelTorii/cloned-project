import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.circleIn.palette.appBar,
    padding: theme.spacing(1, 2, 2, 2)
  },
  tabs: {
    backgroundColor: '#2B2C2C',
    background: '#2B2C2C',
    border: '1px solid #5F6165',
    borderRadius: 100,
    boxShadow: 'none'
  },
  tab: {
    color: 'white',
    minWidth: 240
  },
  activeTab: {
    background: '#5F6165',
    color: 'white',
    fontWeight: 'bold',
    border: '2px solid #2B2C2C',
    borderRadius: 160
  }
}));

export default function MuiTabs({ firstTab, secondTab }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.tabs}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab
            className={classes.tab}
            classes={{
              selected: classes.activeTab
            }}
            label="Send to Students"
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tab}
            classes={{
              selected: classes.activeTab
            }}
            label="One-Touch Send to Classes"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {firstTab()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {secondTab()}
      </TabPanel>
    </div>
  );
}
