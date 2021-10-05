import React from 'react';
import { useDrop } from 'react-dnd';

const style = {
  height: 50,
  width: 51,
  paddingTop: 2,
  border: '1px dashed gray',
  borderRadius: 5
};

const Dustbin = ({ accept, lastDroppedItem, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: !lastDroppedItem
    })
  });
  const isActive = isOver && canDrop;
  let backgroundColor = '#222';

  if (isActive) {
    backgroundColor = 'darkgreen';
  }

  const handleDrop = () => (canDrop ? drop : null);

  const imgStyle = {
    height: 50,
    width: 50
  };
  return (
    <div ref={handleDrop()} style={{ ...style, backgroundColor }}>
      {lastDroppedItem && <img alt="alt" src={lastDroppedItem.ic} style={imgStyle} />}
    </div>
  );
};

export default Dustbin;
