import { areasToUrl } from 'hud/frame/useHudRoutes';
import { CHAT_MAIN_AREA, CHAT_AREA } from 'hud/navigationState/hudNavigation';

export const FILE_LIMIT_SIZE = 40 * 1000 * 1000;
export const BIG_CHAT_FILE_NAME_TRANCATE_LIMIT = 18;
export const SMALL_CHAT_FILE_NAME_TRANCATE_LIMIT = 16;

export const CHAT_URL = areasToUrl[CHAT_MAIN_AREA][CHAT_AREA];
