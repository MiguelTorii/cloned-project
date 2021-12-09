import { ReactElement } from 'react';

export interface HudToolData {
  id: string;
  displayName: string;
  icon?: ReactElement;
  iconText?: string;
  childTools?: HudToolData[];
  showIconOnly?: boolean;
  tooltip?: boolean;
}
