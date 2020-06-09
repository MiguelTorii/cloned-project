import React from 'react'
import { useDragLayer } from 'react-dnd'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 1004,
  left: 30,
  top: 10,
  maxWidth: 500,
}
function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    border: '1px dashed white',
    backgroundColor: 'rgba(255,255,255, 0.25)',
  }
}
const DragPreview = () => {
  const {
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {item.title}
      </div>
    </div>
  )
}

export default DragPreview
