import { ReactNode } from 'react';

// Admin notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: Date;
  read: boolean;
}

// Settings field types
export interface SettingField {
  key: string;
  label: string;
  description?: string;
  type?: 'text' | 'textarea' | 'email' | 'url' | 'number';
  icon?: ReactNode;
}

// For site settings groups
export interface SettingsGroup {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  fields: SettingField[];
}

// Dashboard stats
export interface DashboardStat {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

// Brand colors
export interface BrandColors {
  primary: string;
  secondary: string;
  cream: string;
  dark: string;
  light: string;
}

// Admin menu item
export interface AdminMenuItem {
  label: string;
  href: string;
  icon: string;
  children?: AdminMenuItem[];
}
