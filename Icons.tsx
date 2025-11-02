import React from 'react';
import Svg, { 
  Path, 
  Circle, 
  Polygon, 
  Polyline, 
  Line,
  Rect 
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string; // Add this line
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

// Fixed StarIcon with proper fill handling
export const StarIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#000', 
  fill = 'none', // Default to 'none'
  strokeWidth = 2 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </Svg>
);