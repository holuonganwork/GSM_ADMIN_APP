/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GreenSMLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'portal';
}

export const GreenSMLogo: React.FC<GreenSMLogoProps> = ({ className = '', variant = 'portal' }) => {
  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img 
          src="/greensm-icon.svg" 
          alt="Green SM Icon" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`relative flex items-center ${className}`}>
        <img 
          src="/greensm-logo.svg" 
          alt="Green SM Operations" 
          className="h-9 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Portal variant (matches top-left of Image 4)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Logo mark matching Image 1 & 2 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#20B9BE] flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 32 32" className="w-5 h-5 text-white" fill="none">
            <path 
              d="M7 16.5L12 21.5L22.5 9.5M19.5 7L24.5 11M19.5 7L22.5 9.5" 
              stroke="currentColor" 
              strokeWidth="3.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-[15px] font-extrabold tracking-tight leading-none">
            <span className="text-[#0F172A]">GREEN</span>
            <span className="text-[#20B9BE]">SM</span>
          </div>
          <span className="text-[8px] font-bold text-[#20B9BE] tracking-[0.2em] leading-tight">
            OPERATIONS
          </span>
        </div>
      </div>

      {/* Vertical subtle divider */}
      <div className="h-6 w-[1.5px] bg-slate-200 mx-0.5"></div>

      {/* Portal label */}
      <div className="flex flex-col">
        <span className="text-[13px] font-bold text-slate-900 tracking-tight leading-tight">
          Green SM
        </span>
        <span className="text-[9px] font-semibold text-[#20B9BE] tracking-wider uppercase leading-none">
          OPERATIONS PORTAL
        </span>
      </div>
    </div>
  );
};
