"use client";

import React, { useRef, useState, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  length?: number;
}

export const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(
  ({ className, length = 6, ...props }, ref) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
      if (isNaN(Number(element.value))) return;

      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);
      
      const form = element.form;
      if (form && props.onChange) {
        const event = {
            target: {
                name: props.name || '',
                value: newOtp.join(''),
            }
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }

      if (element.value !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    useImperativeHandle(ref, () => inputRefs.current[0]!);

    return (
      <div className={cn('flex justify-center space-x-2', className)}>
        {otp.map((data, index) => {
          return (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength={1}
              className="w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
              ref={el => (inputRefs.current[index] = el)}
              {...props}
            />
          );
        })}
      </div>
    );
  }
);
OtpInput.displayName = 'OtpInput';
