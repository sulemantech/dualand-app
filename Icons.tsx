import React from 'react';
import Svg, { 
  Path, 
  Circle, 
  Polygon, 
  Polyline, 
  Line,
  Rect,
  G 
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="11" cy="11" r="8"/>
    <Path d="m21 21-4.3-4.3"/>
  </Svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <Polyline points="9 22 9 12 15 12 15 22"/>
  </Svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="m12 19-7-7 7-7"/>
    <Path d="M19 12H5"/>
  </Svg>
);

export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polygon points="6 3 20 12 6 21 6 3"/>
  </Svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Rect x="6" y="4" width="4" height="16" />
    <Rect x="14" y="4" width="4" height="16" />
  </Svg>
);

export const RewindIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polygon points="11 19 2 12 11 5 11 19"/>
    <Polygon points="22 19 13 12 22 5 22 19"/>
  </Svg>
);

export const RepeatIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="m17 2 4 4-4 4"/>
    <Path d="M3 11v-1a4 4 0 0 1 4-4h13"/>
    <Path d="m7 22-4-4 4-4"/>
    <Path d="M21 13v1a4 4 0 0 1-4 4H3"/>
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="18" cy="5" r="3"/>
    <Circle cx="6" cy="12" r="3"/>
    <Circle cx="18" cy="19" r="3"/>
    <Line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
    <Line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#000', 
  fill = 'none',
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </Svg>
);

// NEW ICONS - Added for the enhanced app

export const BookIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#000', 
  fill = 'none',
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="3"/>
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="10"/>
    <Line x1="12" y1="16" x2="12" y2="12"/>
    <Line x1="12" y1="8" x2="12.01" y2="8"/>
  </Svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </Svg>
);

export const MusicIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="8" cy="18" r="4"/>
    <Path d="M12 18V2l7 4"/>
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </Svg>
);

export const FlashIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </Svg>
);

export const HelpIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="10"/>
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <Line x1="12" y1="17" x2="12.01" y2="17"/>
  </Svg>
);

// Social Media Icons
export const FacebookIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </Svg>
);

export const TwitterIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </Svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </Svg>
);

// Additional UI Icons
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polyline points="20 6 9 17 4 12"/>
  </Svg>
);

export const XIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Line x1="18" y1="6" x2="6" y2="18"/>
    <Line x1="6" y1="6" x2="18" y2="18"/>
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Line x1="12" y1="5" x2="12" y2="19"/>
    <Line x1="5" y1="12" x2="19" y2="12"/>
  </Svg>
);

export const MinusIcon: React.FC<IconProps> = ({ size = 24, color = '#000', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Line x1="5" y1="12" x2="19" y2="12"/>
  </Svg>
);

// Export all icons as a single object for easier imports
export const Icons = {
  SearchIcon,
  HomeIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  RewindIcon,
  RepeatIcon,
  ShareIcon,
  StarIcon,
  BookIcon,
  HeartIcon,
  SettingsIcon,
  InfoIcon,
  MoonIcon,
  BellIcon,
  MusicIcon,
  PhoneIcon,
  FlashIcon,
  HelpIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsAppIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  MinusIcon,
};