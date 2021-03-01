// @flow
import React, { useEffect, useMemo, memo, useCallback, useState } from 'react'
import ClassMultiSelect from 'containers/ClassMultiSelect'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { cypher } from 'utils/crypto'
import cx from 'clsx'
import queryString from 'query-string'
import Tooltip from 'containers/Tooltip'

const useStyles = makeStyles(theme => ({
  classTextField: {
    minWidth: 400,
    [theme.breakpoints.down('sm')]: {
      minWidth: 330
    }
  },
  links: {
    padding: theme.spacing(0, 1)
  },
  classSelector: {
    padding: theme.spacing(1, 2)
  },
  currentPath: {
    color: theme.circleIn.palette.action,
    fontWeight: 900
  }
}))

type Props = {
  updateFeed: Function,
  push: Function,
  search: string,
  pathname: string,
  state: Object,
  firstName: string,
  expertMode: boolean,
  classList: Array
};

const HeaderNavigation = ({
  openClassmatesDialog,
  classList,
  push,
  search,
  pathname,
  firstName,
  expertMode,
  updateFeed,
  state
}: Props) => {
  const options = useMemo(() => {
    try {
      const newClassList = {}
      classList.forEach(cl => {
        if (
          cl.section &&
          cl.section.length > 0 &&
          cl.className &&
          cl.bgColor
        )
          cl.section.forEach(s => {
            newClassList[s.sectionId] = cl
          })
      })
      return Object.keys(newClassList).map(sectionId => {
        return {
          ...newClassList[sectionId],
          sectionId: Number(sectionId),
        }
      })
    } finally {/* NONE */}
  }, [classList])

  const [selectedClasses, setSelectedClasses] = useState([])
  const classes= useStyles()

  const handleFilters = useCallback(options => {
    setSelectedClasses(options)
    const filters = options.map(o => (JSON.stringify({
      classId: o.classId,
      sectionId: o.sectionId
    })))
    updateFeed(filters)
  }, [updateFeed])

  useEffect(() => {
    if (state?.selectedClasses) {
      state.selectedClasses.forEach(sc => {
        const id = options.findIndex(o => (
          o.classId === sc.classId &&
          o.sectionId === sc.sectionId
        ))
        if (id === -1) {
          handleFilters(options)
        } else {
          handleFilters(state.selectedClasses)
        }
      })
    } else {
      handleFilters(options)
    }
  }, [handleFilters, options, state])

  const onSelect = useCallback(options => {
    handleFilters(options)
    const parsedHash = queryString.parse(search)
    const { class: remove, 0: remove2, ...rest } = parsedHash
    if (options.length === 1) {
      const newSearch = queryString.stringify({
        ...rest,
        class: cypher(
          `${options[0].classId}:${options[0].sectionId}`
        )
      })
      push({
        pathname,
        search: newSearch,
        state: { selectedClasses: options }
      })
    } else {
      const newSearch = queryString.stringify(rest)
      push({
        pathname,
        search: newSearch,
        state: { selectedClasses: options }
      })
    }

  }, [handleFilters, pathname, push, search])

  const navigate = useCallback((path, extras) => () =>{
    const parsedHash = queryString.parse(search)
    const { class: remove, 0: remove2, from: remove3, ...rest } = parsedHash
    if (selectedClasses.length === 1) {
      const newSearch = queryString.stringify({
        ...rest,
        ...extras,
        class: cypher(
          `${selectedClasses[0].classId}:${selectedClasses[0].sectionId}`
        )
      })
      push({
        pathname: path,
        search: newSearch,
        state: { selectedClasses }
      })
    } else {
      const newSearch = queryString.stringify({
        ...rest,
        ...extras,
      })
      push({
        pathname: path,
        search: newSearch,
        state: { selectedClasses }
      })
    }
  }, [push, search, selectedClasses])

  return (
    <Box>
      <Tooltip
        id={9046}
        placement="left"
        text="Sort the Class Feed by selecting classes in this dropdown menu. :)"
      >
        <ClassMultiSelect
          noEmpty
          variant='standard'
          allLabel={`${firstName}'s Classes`}
          containerStyle={classes.classSelector}
          textFieldStyle={classes.classTextField}
          externalOptions={options}
          placeholder='Select Classes...'
          selected={selectedClasses}
          onSelect={onSelect}
        />
      </Tooltip>
      <Box className={classes.links}>
        <Button
          onClick={navigate('/feed', {})}
          className={cx(
            pathname === '/feed' && classes.currentPath
          )}
        >
            Class Feed
        </Button>
        <span> | </span>
        <Button
          onClick={navigate('/my_posts' , { from: 'me' })}
          className={cx(
            pathname === '/my_posts' && classes.currentPath
          )}
        >
            My Posts
        </Button>
        <span> | </span>
        <Button
          onClick={navigate('/bookmarks', { from: 'bookmarks' })}
          className={cx(
            pathname === '/bookmarks' && classes.currentPath
          )}
        >
            Bookmarks
        </Button>
        {selectedClasses.length === 1 && (
          <>
            <span> | </span>
            <Button onClick={openClassmatesDialog(expertMode ? 'student' : 'classmate')} >
      Classmates
            </Button>
          </>
        )}

        {selectedClasses.length === 1 && !expertMode && (
          <>
            <span> | </span>
            <Button
              onClick={navigate('/leaderboard', {})}
              className={cx(
                pathname === '/leaderboard' && classes.currentPath
              )}
            >
            Class Leaderboard
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default memo(HeaderNavigation)
