'use client';
import * as React from 'react';
export function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v:boolean)=>void }) { return (
  <button aria-pressed={checked} onClick={()=>onCheckedChange(!checked)} className="relative inline-flex h-6 w-11 items-center rounded-full transition" style={{backgroundColor: checked ? '#0ea5e9' : '#d1d5db'}}>
    <span className={"inline-block h-5 w-5 transform rounded-full bg-white transition " + (checked ? 'translate-x-5' : 'translate-x-1')} />
  </button>
); }
