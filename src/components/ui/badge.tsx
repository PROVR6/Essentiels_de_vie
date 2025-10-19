import * as React from 'react';
import { clsx } from 'clsx';
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={clsx('badge', className)} {...props} />; }
