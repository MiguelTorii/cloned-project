import React, { useState, useCallback } from 'react'
import update from 'immutability-helper'
import AmazonIc from 'assets/svg/specialty-icon-ic-amazon.svg'
import ChipotleIc from 'assets/svg/specialty-icon-ic-chipotle.svg'
import ChickfilaIc from 'assets/svg/specialty-icon-ic-chicfila.svg'
import StartbucksIc from 'assets/svg/specialty-icon-ic-starbucks.svg'
import WalmartIc from 'assets/svg/specialty-icon-ic-walmart.svg'
import TargetIc from 'assets/svg/specialty-icon-ic-target.svg'
import ItemTypes from './ItemTypes'
import Box from './Box'
import Dustbin from './Dustbin'

const Container = ({ saveReward }) => {
  const [dustbins, setDustbins] = useState([
    { id: 'f', accepts: [ItemTypes.FREE], lastDroppedItem: null },
    { id: 's', accepts: [ItemTypes.FREE], lastDroppedItem: null },
    { id: 't', accepts: [ItemTypes.FREE], lastDroppedItem: null },
  ])
  const [boxes] = useState([
    { ic: AmazonIc, name: 'Amazon', type: ItemTypes.FREE },
    { ic: StartbucksIc, name: 'Starbucks', type: ItemTypes.FREE },
    { ic: TargetIc, name: 'Target', type: ItemTypes.FREE },
    { ic: ChickfilaIc, name: 'Chick-Fil-A', type: ItemTypes.FREE },
    { ic: WalmartIc, name: 'Walmart', type: ItemTypes.FREE },
    { ic: ChipotleIc, name: 'Chipotle', type: ItemTypes.FREE },
  ])
  const [droppedBoxNames, setDroppedBoxNames] = useState([])
  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1
  }
  const handleDrop = useCallback(
    (index, item) => {
      const { name } = item
      saveReward(name, index)
      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name] } : { $push: [] }),
      )
      setDustbins(
        update(dustbins, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        }),
      )
    },
    [droppedBoxNames, dustbins, saveReward],
  )

  const optionsStyle = { 
    display: 'grid', 
    justifyContent: 'center',  
    gridTemplateColumns: "auto auto auto",
    gridGap: 10,
    overflow: 'hidden', 
    clear: 'both',
    margin: 15,
  }

  return (
    <div>
      <div style={optionsStyle}>
        {dustbins.map(({ id, accepts, lastDroppedItem }, index) => (
          <Dustbin
            key={id}
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={item => handleDrop(index, item)}
          />
        ))}
      </div>

      <div style={optionsStyle}>
        {boxes.map(({ ic, name, type }) => (
          <Box
            name={name}
            ic={ic}
            type={type}
            isDropped={isDropped(name)}
            key={name}
          />
        ))}
      </div>
    </div>
  )
}
export default Container

