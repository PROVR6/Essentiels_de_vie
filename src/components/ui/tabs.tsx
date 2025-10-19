'use client';
import * as React from 'react';
import { clsx } from 'clsx';
export function Tabs({ value, onValueChange, children, className }:{value:string; onValueChange:(v:string)=>void; children:React.ReactNode; className?:string}) { return <div className={clsx('w-full', className)} data-value={value}>{children}</div>; }
export function TabsList({ className, children }:{className?:string; children:React.ReactNode}) { return <div className={clsx('grid gap-1 bg-white/70 backdrop-blur p-1 rounded-xl shadow-sm', className)}>{children}</div>; }
export function TabsTrigger({ value, current, onValueChange, children }:{value:string; current:string; onValueChange:(v:string)=>void; children:React.ReactNode}) { const active = value===current; return (
  <button className={clsx('w-full btn', active ? 'btn-primary' : 'btn-secondary')} onClick={()=>onValueChange(value)} aria-pressed={active}>{children}</button>
); }
