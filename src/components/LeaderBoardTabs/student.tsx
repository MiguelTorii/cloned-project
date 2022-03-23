import React from 'react';

import LoadImg from '../LoadImg/LoadImg';

const Student = ({ student, you }) => {
  const { firstName, lastName, profileImg } = student;
  const imageStyle: any = {
    height: 45,
    backgroundColor: '#bdbdbd',
    width: 45,
    borderRadius: '50%',
    display: 'flex',
    color: '#1b2a32',
    alignItems: 'center',
    justifyContent: 'center',
    objectFit: 'cover'
  };
  const container = {
    display: 'flex',
    alignItems: 'center'
  };
  const name = {
    marginLeft: 10
  };
  const fallback = <div style={imageStyle}>{`${firstName[0]}${lastName[0]}`}</div>;
  const fullName = you ? 'You' : `${firstName} ${lastName}`;
  return (
    <div style={container}>
      <LoadImg style={imageStyle} url={profileImg} loadingSize={12} fallback={fallback} />
      <div style={name}>{fullName}</div>
    </div>
  );
};

export default Student;
