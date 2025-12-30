"use client";

import React, { useRef, useState, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  length?: number;
  onChange?: (value: string) => void;
}

export const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(
  ({ className, length = 6, onChange, ...props }, ref) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
      // Allow only single digits
      const value = element.value.replace(/[^0-9]/g, '').slice(0, 1);
      
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (onChange) {
        onChange(newOtp.join(''));
      }

      // Move to next input if a digit is entered
      if (value !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };
    
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').slice(0, length);
        if (/[^0-9]/.test(paste)) return;

        const newOtp = new Array(length).fill('');
        for (let i = 0; i < paste.length; i++) {
            newOtp[i] = paste[i];
        }
        setOtp(newOtp);

        if (onChange) {
            onChange(newOtp.join(''));
        }

        const nextFocusIndex = Math.min(paste.length, length - 1);
        inputRefs.current[nextFocusIndex]?.focus();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    };

    useImperativeHandle(ref, () => inputRefs.current[0]!);

    return (
      <div className={cn('flex justify-center space-x-2', className)} {...props}>
        {otp.map((data, index) => {
          return (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
              onPaste={handlePaste}
              ref={el => (inputRefs.current[index] = el)}
            />
          );
        })}
      </div>
    );
  }
);
OtpInput.displayName = 'OtpInput';