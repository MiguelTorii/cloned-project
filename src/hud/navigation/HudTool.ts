import { ReactElement } from 'react';

export interface HudTool {
  id: string;
  displayName: string;
  icon?: ReactElement;
  iconText?: string;
  childTools?: HudTool[];
}
