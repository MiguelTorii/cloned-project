// @flow
import React, { memo, useState, useCallback } from 'react'
import AutoComplete from 'components/AutoComplete';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { searchSchools } from 'api/sign-in';
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent:'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  schools: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

const SelectSchool = ({ school, setScreen, updateSchool }) => {
  const classes = useStyles()
  const [error, setError] = useState(false)

  const onLoad = useCallback(async value => {
    setError(false)

    if (value.trim().length > 1) {
      const schools = await searchSchools({ query: value });

      const options = schools.map(school => ({
        value: school.clientId,
        label: school.school,
        noAvatar: true,
        ...school
      }));

      return {
        options,
        hasMore: false
      };
    }
    return {
      options: [],
      hasMore: false
    };
  }, [])

  const onChange = useCallback(value => {
    updateSchool({ school: value });
  }, [updateSchool])

  const onSelect = useCallback(() => {
    if(school) setScreen('role')
    else setError(true)
  }, [school, setScreen])

  const onSubmit = useCallback(e => {
    e.preventDefault()
    onSelect()
  }, [onSelect])

  return (
    <div className={classes.container}>
      <Typography component="h1" variant="h5" align="center">
        Find your school
      </Typography>
      <form onSubmit={onSubmit} className={classes.schools}>
        <AutoComplete
          inputValue=""
          label=""
          placeholder="Search your school/college"
          error={error}
          values={school}
          errorText="You must select an option"
          isSchoolSearch
          onChange={onChange}
          onLoadOptions={onLoad}
        />
      </form>
      <Button
        variant='contained'
        onClick={onSelect}
        disabled={!school}
        color='primary'
      >
        Select School
      </Button>
    </div>
  )
}

export default memo(SelectSchool)
