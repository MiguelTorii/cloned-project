import React from 'react'
import LoadImg from '../LoadImg'

const Student = ({ student }) => {
  const  { firstName, lastName, profileImg } = student
  const imageStyle = {
    height: 45,
    backgroundColor: '#bdbdbd',
    width: 45,
    borderRadius: '50%',
    display: 'flex',
    color: '#1b2a32', 
    alignItems: 'center',
    justifyContent: 'center',
    objectFit: 'cover'
  }
  const container = {
    display: 'flex',
    alignItems: 'center'
  }
  const name = {
    marginLeft: 10
  }

  const fallback = <div style={imageStyle}>{`${firstName[0]}${lastName[0]}`}</div>

  return (
    <div style={container}>
      <LoadImg style={imageStyle} url={profileImg} loadgingSize={12} fallback={fallback} />
      <div style={name}>{`${firstName} ${lastName}`}</div>
    </div>
  )
}

export default Student
