/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GreenSMLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'portal' | 'mini';
}

export const GreenSMLogo: React.FC<GreenSMLogoProps> = ({ className = '', variant = 'portal' }) => {
  // Mini variant: just the authentic bird-wing mark
  if (variant === 'mini') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img 
          src="/greensm-mini-logo.png" 
          alt="Green SM Mini Logo" 
          className="h-8 w-auto object-contain drop-shadow-xs"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Icon variant: square app icon
  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img 
          src="/greensm-icon.png" 
          alt="Green SM Icon" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Full official logo
  if (variant === 'full') {
    return (
      <div className={`relative flex items-center ${className}`}>
        <img 
          src="/Green_SM_logo.svg.png" 
          alt="Green SM Operations" 
          className="h-9 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Portal variant (matches top-left header of GSM Operations Portal)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Mini Logo mark from official branding */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 flex items-center justify-center">
          <img 
            src="/greensm-mini-logo.png" 
            alt="Green SM Mini Logo" 
            className="h-7 w-auto object-contain transition-transform hover:scale-105 duration-200"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-[15px] font-black tracking-tight leading-none font-['Montserrat']">
            <span className="text-[#008284]">GREEN</span>
            <span className="text-[#E59800] ml-1">SM</span>
          </div>
          <span className="text-[8.5px] font-bold text-[#008284] tracking-[0.22em] leading-tight uppercase">
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
        <span className="text-[9px] font-semibold text-[#008284] tracking-wider uppercase leading-none">
          OPERATIONS PORTAL
        </span>
      </div>
    </div>
  );
};
