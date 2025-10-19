'use client';
import * as React from 'react';
export function useToast(){ const [msg,setMsg]=React.useState<string|null>(null); React.useEffect(()=>{ if(!msg) return; const t=setTimeout(()=>setMsg(null), 1500); return ()=>clearTimeout(t); },[msg]); const Toast = ()=> msg ? (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]"><div className="bg-black text-white rounded-xl px-4 py-2 shadow">{msg}</div></div>) : null; return { setMsg, Toast }; }
