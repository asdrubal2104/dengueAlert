'use client';

import React from 'react';
import {
  Thermometer,
  Brain,
  Eye,
  Dumbbell,
  Bone,
  Activity,
  AlertCircle,
  Sparkles,
  BatteryLow,
  UtensilsCrossed,
  Flame,
  AlertTriangle,
  Droplet,
  TestTube,
  Moon,
  Zap,
  Snowflake,
  Maximize2,
  Wind,
  Syringe,
  HelpCircle,
  ZapOff,
  HeartPulse,
  Stethoscope,
  LucideProps,
} from 'lucide-react';

interface SintomaIconProps extends Omit<LucideProps, 'ref'> {
  name?: string;
  nombreIcono?: string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  thermometer: Thermometer,
  brain: Brain,
  eye: Eye,
  dumbbell: Dumbbell,
  bone: Bone,
  activity: Activity,
  'alert-circle': AlertCircle,
  sparkles: Sparkles,
  'battery-low': BatteryLow,
  'utensils-crossed': UtensilsCrossed,
  flame: Flame,
  'alert-triangle': AlertTriangle,
  droplet: Droplet,
  'test-tube': TestTube,
  moon: Moon,
  zap: Zap,
  snowflake: Snowflake,
  'maximize-2': Maximize2,
  wind: Wind,
  syringe: Syringe,
  'help-circle': HelpCircle,
  'zap-off': ZapOff,
  'heart-pulse': HeartPulse,
};

export const SintomaIcon: React.FC<SintomaIconProps> = ({
  name,
  nombreIcono,
  className = '',
  size = 20,
  ...props
}) => {
  const iconKey = name || nombreIcono || 'stethoscope';
  const IconComponent = ICON_MAP[iconKey] || Stethoscope;
  return <IconComponent size={size} className={className} strokeWidth={2} {...props} />;
};
