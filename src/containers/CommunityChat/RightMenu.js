import React, { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
// import Paper from '@material-ui/core/Paper'
// import InputBase from '@material-ui/core/InputBase'
// import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import { getInitials } from 'utils/chat'
import OnlineBadge from 'components/OnlineBadge'
import RoleBadge from 'components/RoleBadge'
import HoverPopup from 'components/HoverPopup'
// import { ReactComponent as SearchIcon } from 'assets/svg/search-icon.svg'
import useStyles from './_styles/rightMenu'

const MyLink = React.forwardRef(({ link, ...props }, ref) => {
  return <RouterLink to={link} {...props} ref={ref} />
})

const RightMenu = ({
  local,
  channel,
  setSelectedCourse,
}) => {
  const classes = useStyles()
  const localChannel = useMemo(() =>
    channel && local[channel.sid],
  [channel, local])

  if (!channel || !localChannel) return null

  return (
    <Grid
      item
      classes={{
        root: classes.container
      }}
    >
      <Grid
        container
        classes={{
          root: classes.container
        }}
        alignItems='flex-start'
      >
        <Grid
          container
          alignItems='flex-start'
          justify='flex-start'
          classes={{
            root: classes.header
          }}
          item
        >
          {/* <Paper component="form" className={classes.searchPaperRoot}>
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.search}
              placeholder="Search For Anything"
              inputProps={{ 'aria-label': 'search for anything' }}
            />
          </Paper> */}
        </Grid>
        <Grid
          classes={{
            root: classes.usersContainer
          }}
        >
          <Typography className={classes.usersTitle}>
            Members - {localChannel?.members.length}
          </Typography>
          <List dense className={classes.listRoot}>
            {localChannel?.members.map(m => {
              const fullName = `${m.firstname} ${m.lastname}`
              return (
                <HoverPopup
                  key={m.userId}
                  member={m}
                  setSelectedCourse={setSelectedCourse}
                >
                  <ListItem
                    component={MyLink}
                    disableGutters
                    link={`/profile/${m.userId}`}
                    button
                    classes={{
                      secondaryAction: classes.secondaryAction
                    }}
                  >
                    <ListItemAvatar>
                      <OnlineBadge
                        isOnline={m.isOnline}
                        bgColorPath="circleIn.palette.primaryBackground"
                      >
                        <Avatar
                          alt={fullName}
                          src={m.image}
                        >
                          {getInitials(fullName)}
                        </Avatar>
                      </OnlineBadge>
                    </ListItemAvatar>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      className={classes.memberName}
                    >
                      {fullName}
                      {m.roleId !== 1 && <RoleBadge />}
                    </Box>
                  </ListItem>
                </HoverPopup>
              )
            })}
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default React.memo(RightMenu)
