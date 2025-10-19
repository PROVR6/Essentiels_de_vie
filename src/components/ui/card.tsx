import * as React from 'react';
import { clsx } from 'clsx';
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={clsx('card overflow-hidden', className)} {...props} />; }
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={clsx('p-4', className)} {...props} />; }
