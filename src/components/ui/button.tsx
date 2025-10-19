import * as React from 'react';
import { clsx } from 'clsx';
export function Button({ className, variant='primary', type='button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'outline' }) {
  const base = 'btn ' + (variant==='primary' ? 'btn-primary' : variant==='secondary' ? 'btn-secondary' : 'border rounded-xl px-3 py-2');
  return <button type={type} className={clsx(base, className)} {...props} />;
}
