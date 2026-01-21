import React from 'react';
import { BadgeProps } from '../../types';

const BADGE_COLORS = {
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  amber: 'bg-amber-100 text-amber-800'
} as const;

const Badge: React.FC<BadgeProps> = ({ color, icon, text }) => {
  return (
    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[10px] font-medium ${BADGE_COLORS[color]}`}>
      {icon && <span className="flex-shrink-0 w-2.5 h-2.5">{React.cloneElement(icon as React.ReactElement, { className: 'w-2.5 h-2.5' })}</span>}
      <span className="whitespace-nowrap">{text}</span>
    </span>
  );
};

export default React.memo(Badge);
