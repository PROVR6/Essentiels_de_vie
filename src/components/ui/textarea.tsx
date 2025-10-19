import * as React from 'react';
import { clsx } from 'clsx';
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={clsx('input min-h-[100px]', className)} {...props} />; }
