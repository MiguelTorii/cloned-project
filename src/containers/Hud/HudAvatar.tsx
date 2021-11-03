import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FullScreenLoader from '../../components/FullScreenLoader/FullScreenLoader';
import Avatar from '../../components/Avatar/Avatar';
import avatarImg from '../../assets/img/circlein-web-notification.png';

const HudAvatar = () => <Avatar alt="hud-avatar" src={avatarImg} />;

export default HudAvatar;
