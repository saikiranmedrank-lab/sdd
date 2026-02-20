export function parseHMS(hms){
  const parts = String(hms || "0:00:00").split(":").map(n => Number(n));
  let h=0,m=0,s=0;
  if(parts.length === 3){ [h,m,s]=parts; }
  else if(parts.length === 2){ [m,s]=parts; }
  else if(parts.length === 1){ [s]=parts; }
  h = Number.isFinite(h)?h:0;
  m = Number.isFinite(m)?m:0;
  s = Number.isFinite(s)?s:0;
  return (h*3600) + (m*60) + s;
}

export function fmtHM(seconds){
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  return `${h}h ${m}m`;
}

export function fmtH(seconds){
  const s = Math.max(0, Math.round(seconds));
  const h = s/3600;
  if(h < 10) return `${h.toFixed(1)}h`;
  return `${Math.round(h)}h`;
}

export function pct(a,b){
  if(b<=0) return 0;
  return Math.round((a/b)*100);
}
