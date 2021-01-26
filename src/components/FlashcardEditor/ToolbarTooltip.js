import React, { useCallback, useReducer, useEffect } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(() => ({
  tooltipContainer: {
    textAlign: 'center'
  },
  tooltip: {
    fontSize: 14,
  },
  popper: {
    zIndex: 1500,
  }
}))

const ctrl = window.navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'

const initialState = {
  header: {
    text: '',
    el: null,
    open: false
  },
  bold: {
    text: 'Bold',
    shortcut: `${ctrl } + b`,
    el: null,
    open: false
  },
  italic: {
    text: 'Italic',
    shortcut: `${ctrl } + i`,
    el: null,
    open: false
  },
  underline: {
    text: 'Underline',
    shortcut: `${ctrl } + u`,
    el: null,
    open: false
  },
  strike: {
    text: 'Strike',
    el: null,
    open: false
  },
  blockquote: {
    text: 'Quote',
    el: null,
    open: false
  },
  ordered: {
    text: 'Ordered List',
    el: null,
    open: false
  },
  unordered: {
    text: 'Bullets',
    el: null,
    open: false
  },
  tab: {
    text: 'Indent',
    el: null,
    open: false
  },
  untab: {
    text: 'Unindent',
    el: null,
    open: false
  },
  link: {
    text: 'Link',
    el: null,
    open: false
  },
  clean: {
    text: 'Clean',
    el: null,
    open: false
  },
  image: {
    text: 'Image',
    el: null,
    open: false
  },
  formula: {
    text: 'Formula',
    el: null,
    open: false
  },
}

function reducer(state, action) {
  const { type, params } = action
  switch (type) {
  case 'ADD_ELEMENT':
    return { ...state, [params.name]: { ...state[params.name], el: params.el } }
  case 'SHOW':
    return { ...state, [params.name]: { ...state[params.name], open: true } }
  case 'HIDE':
    return { ...state, [params.name]: { ...state[params.name], open: false } }
  default:
    return state
  }
}

const ToolbarTooltip = ({ toolbar }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const classes = useStyles()

  useEffect(() => {
    if (toolbar) {
      toolbar.controls.forEach(([n, el], k) => {
        let name = n
        if (name === 'list') name = k === 6 ? 'ordered': 'unordered'
        if (name === 'indent') name = k === 8 ? 'tab': 'untab'
        // eslint-disable-next-line
        el.onmouseenter = () => dispatch({ type: 'SHOW', params: { name }})
        // eslint-disable-next-line
        el.onmouseleave = () => dispatch({ type: 'HIDE', params: { name }})
        dispatch({ type: 'ADD_ELEMENT', params: { name, el } })
      })
    }
  }, [toolbar, dispatch])

  const renderTooltip = useCallback((text, shortcut) => (
    <div className={classes.tooltipContainer}>
      <div>
        {text}
      </div>
      <div>
        {shortcut}
      </div>
    </div>
  ), [classes])

  return (
    <div>
      {Object.keys(state).map(k => {
        if(!state[k].el) return null
        return (
          <Tooltip
            key={k}
            title={renderTooltip(state[k].text, state[k].shortcut)}
            classes={{
              tooltip: classes.tooltip,
              popper: classes.popper
            }}
            arrow
            PopperProps={{
              anchorEl: state[k].el,
              placement: 'top',
              open: state[k].open,
            }}
          >
            <div/>
          </Tooltip>
        )})}
    </div>
  )
}

export default ToolbarTooltip
