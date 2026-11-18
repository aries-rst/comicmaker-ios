/* Comic Maker editor — offline, runs inside Android WebView / iOS WKWebView / any browser */
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const PAGE_W=1000, PAGE_H=1400;
const LAYOUTS={
 '1':[[20,20,960,1360]],
 '2h':[[20,20,960,670],[20,710,960,670]],
 '2v':[[20,20,470,1360],[510,20,470,1360]],
 '3':[[20,20,960,670],[20,710,470,670],[510,710,470,670]],
 '4':[[20,20,470,670],[510,20,470,670],[20,710,470,670],[510,710,470,670]],
 '6':[[20,20,470,440],[510,20,470,440],[20,480,470,440],[510,480,470,440],[20,940,470,440],[510,940,470,440]]
};
const ICON={food:'M24 14 C16 8 8 12 8 24 C8 36 16 42 24 40 C32 42 40 36 40 24 C40 12 32 8 24 14Z M24 14 Q24 8 28 5',frame:'M6 14 V6 H14 M34 6 H42 V14 M42 34 V42 H34 M14 42 H6 V34 M24 14 a5 5 0 1 0 0.1 0 M16 34 Q16 24 24 24 Q32 24 32 34',font:'M10 40 L22 8 H26 L38 40 M15 28 H33',undo:'M14 18 H30 Q40 18 40 28 Q40 38 30 38 H18 M14 18 l8 -8 M14 18 l8 8',person:'M24 8 a7 7 0 1 0 0.1 0 M10 42 Q10 24 24 24 Q38 24 38 42',bubble:'M8 10 H40 V32 H22 L14 40 V32 H8Z',text:'M10 12 H38 M24 12 V40 M18 40 H30',image:'M6 10 H42 V38 H6Z M6 32 L18 22 L28 30 L34 24 L42 32 M32 16 a3 3 0 1 0 0.1 0',help:'M24 6 a18 18 0 1 0 0.1 0 M18 19 Q18 12 24 12 Q30 12 30 18 Q30 23 24 25 V29 M24 35 V36',star:'M24 6 L29 18 L42 19 L32 27 L35 40 L24 33 L13 40 L16 27 L6 19 L19 18Z',layers:'M24 8 L42 18 L24 28 L6 18Z M6 26 L24 36 L42 26 M6 34 L24 44 L42 34',trash:'M10 14 H38 M18 14 V8 H30 V14 M13 14 L15 42 H33 L35 14 M20 20 V36 M28 20 V36',flip:'M24 6 V42 M20 12 L8 36 H20Z M28 12 L40 36 H28Z',share:'M36 10 a5 5 0 1 0 0.1 0 M12 24 a5 5 0 1 0 0.1 0 M36 38 a5 5 0 1 0 0.1 0 M16 22 L32 13 M16 26 L32 35',save:'M8 8 H34 L40 14 V40 H8Z M14 8 V18 H32 V8 M14 40 V28 H34 V40',download:'M24 8 V32 M14 22 L24 32 L34 22 M8 40 H40',panels:'M6 6 H42 V42 H6Z M24 6 V42 M6 24 H24',face:'M24 6 a18 18 0 1 0 0.1 0 M17 19 v2 M31 19 v2 M15 29 Q24 38 33 29',pose:'M24 6 a4 4 0 1 0 0.1 0 M24 14 V28 M24 18 L12 12 M24 18 L36 24 M24 28 L16 42 M24 28 L34 40',palette:'M24 6 Q42 6 42 22 Q42 30 34 30 H30 Q26 30 28 36 Q30 42 24 42 Q6 42 6 24 Q6 6 24 6Z M16 18 a2 2 0 1 0 0.1 0 M24 13 a2 2 0 1 0 0.1 0 M32 18 a2 2 0 1 0 0.1 0',zoomin:'M20 6 a14 14 0 1 0 0.1 0 M30 30 L42 42 M14 20 H26 M20 14 V26',zoomout:'M20 6 a14 14 0 1 0 0.1 0 M30 30 L42 42 M14 20 H26',hat:'M8 32 H40 M14 32 Q14 12 24 12 Q34 12 34 32',plus:'M24 8 V40 M8 24 H40',back:'M30 8 L14 24 L30 40',up:'M24 40 V10 M12 22 L24 10 L36 22',down:'M24 8 V38 M12 26 L24 38 L36 26',rotate:'M38 24 A14 14 0 1 1 30 11 M30 4 V12 H38',hand:'M16 40 V20 Q16 16 20 16 Q24 16 24 20 V14 Q24 10 28 10 Q32 10 32 14 V22 Q36 20 38 24 V30 Q38 42 26 42 Z',paw:'M14 30 a6 6 0 1 0 0.1 0 M34 30 a6 6 0 1 0 0.1 0 M24 22 a6 6 0 1 0 0.1 0 M24 36 Q14 44 18 40 Q24 32 30 40 Q34 44 24 36',sound:'M8 18 H16 L28 8 V40 L16 30 H8Z M34 16 Q40 24 34 32',box:'M8 16 L24 8 L40 16 V34 L24 42 L8 34Z M8 16 L24 24 L40 16 M24 24 V42',body:'M24 6 a5 5 0 1 0 0.1 0 M16 18 H32 L30 32 H18Z M18 32 L16 44 M30 32 L32 44',hair:'M10 30 Q8 8 24 8 Q40 8 38 30 M14 22 Q24 14 34 22',exit:'M20 8 H8 V40 H20 M18 24 H40 M32 16 L40 24 L32 32',globe:'M24 6 a18 18 0 1 0 0.1 0 M6 24 H42 M24 6 Q14 24 24 42 M24 6 Q34 24 24 42',close:'M12 12 L36 36 M36 12 L12 36',check:'M10 24 L20 34 L38 14',wider:'M6 24 H42 M12 18 L6 24 L12 30 M36 18 L42 24 L36 30',narrower:'M6 24 H18 M30 24 H42 M12 18 L18 24 L12 30 M36 18 L30 24 L36 30',shoe:'M6 30 Q6 20 14 18 L22 16 Q26 24 34 26 Q42 28 42 34 V38 H6Z M6 34 H42',redo:'M34 18 H18 Q8 18 8 28 Q8 38 18 38 H30 M34 18 l-8 -8 M34 18 l-8 8',photo:'M6 16 H14 L18 10 H30 L34 16 H42 V40 H6Z M24 20 a8 8 0 1 0 0.1 0',copy:'M16 16 H40 V42 H16Z M8 34 V6 H32',clip:'M14 10 H34 V42 H14Z M19 6 H29 V14 H19Z M19 24 H29 M19 32 H29',lock:'M14 22 H34 V42 H14Z M18 22 V15 Q18 8 24 8 Q30 8 30 15 V22',unlock:'M14 22 H34 V42 H14Z M18 22 V15 Q18 8 24 8 Q30 8 30 13',center:'M24 4 V44 M12 16 H36 V32 H12Z',shadow:'M24 6 a8 8 0 1 0 0.1 0 M24 22 V32 M6 40 Q24 32 42 40 Q24 47 6 40Z',eye:'M4 24 Q24 6 44 24 Q24 42 4 24Z M24 18 a6 6 0 1 0 0.1 0',eyeoff:'M4 24 Q24 6 44 24 Q24 42 4 24Z M8 8 L40 40',bend:'M8 40 Q8 8 40 8 M32 4 L40 8 L34 14',tail2:'M8 8 H40 V28 H8Z M14 28 L8 42 M34 28 L40 42'};
const ic=k=>`<svg viewBox="0 0 48 48" class="ic"><path d="${ICON[k]||''}"/></svg>`;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const clone=o=>JSON.parse(JSON.stringify(o));
const uid=()=>Math.random().toString(36).slice(2,9);

/* ---------- storage (wrapped: may be unavailable) ---------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}};

/* ---------- i18n ---------- */
const S={lang:store.get('comics.lang',null),proj:null,pg:0,pi:0,sel:null,undo:[],redo:[],clip:null,resize:false,snap:false,screen:'home'};
const I=window.I18N;
const t=k=>{const e=I.ui[k];return e?(e[S.lang]||e.ru):k;};
const L2=(arr,ru)=>S.lang==='ru'||!arr?ru:(S.lang==='en'?arr[0]:arr[1]);
const poseName=k=>L2(I.poses[k],CE.POSES[k].n);
const bgName=k=>L2(I.bgs[k],CE.BG[k].n);
const propName=k=>L2(I.props[k],CE.PROPS[k][0]);
const foodName=k=>L2((I.food||{})[k],CE.FOOD[k]);
const animalName=k=>L2(I.animals[k],CE.ANIMALS[k][0]);
const lmap=(m,k)=>{const e=m[k];return e?(e[S.lang]||e.ru):k;};
const TR={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya','қ':'q','ғ':'g','ҳ':'h','ў':'o','ә':'a','і':'i','ң':'ng','ө':'o','ұ':'u','ү':'u'};
const translit=s=>S.lang==='ru'?s:s.split('').map(ch=>{const lo=ch.toLowerCase(),r=TR[lo];if(r===undefined)return ch;return ch===lo?r:(r.charAt(0).toUpperCase()+r.slice(1));}).join('');
const countryName=c=>L2(I.countries[c],c);

/* ---------- native bridge ---------- */
const IS_IOS=!!(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.native);
const Native={
 call(cmd,data){
  try{
   if(window.AndroidBridge&&typeof window.AndroidBridge[cmd]==='function'){window.AndroidBridge[cmd](data==null?'':String(data));return true;}
   if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.native){window.webkit.messageHandlers.native.postMessage({cmd:cmd,data:data==null?'':String(data)});return true;}
  }catch(e){}
  return false;
 }
};

/* ---------- toast ---------- */
let toastT=0;
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),1800);}

/* ---------- text measurement ---------- */
const COMIC="Pangolin, 'Comic Sans MS', sans-serif";
const FONTS={sans:{f:'sans-serif',w:'bold',k:1},comic:{f:COMIC,w:'normal',k:1.12},loud:{f:"Impact, 'Arial Black', sans-serif",w:'900',k:1.06,up:1},type:{f:"'Courier New', monospace",w:'bold',k:1}};
const fontOf=it=>(it.font&&FONTS[it.font])?FONTS[it.font]:(it.kind==='title'?FONTS.comic:FONTS.sans);
const plain=s=>String(s).replace(/[*~]/g,'');
const mctx=document.createElement('canvas').getContext('2d');
function textW(s,fs,F){F=F||FONTS.sans;mctx.font=`${F.w} ${fs*F.k}px ${F.f}`;return mctx.measureText(plain(s)).width;}
function wrap(text,maxW,fs,F){
 const out=[];
 String(text||'').split('\n').forEach(par=>{
  const words=par.split(/\s+/).filter(Boolean);
  if(!words.length){out.push('');return;}
  let line='';
  words.forEach(w=>{
   const tryL=line?line+' '+w:w;
   if(textW(tryL,fs,F)<=maxW||!line) line=tryL; else {out.push(line);line=w;}
   while(textW(line,fs,F)>maxW&&line.length>1){ // break very long word
    let i=line.length-1; while(i>1&&textW(line.slice(0,i),fs,F)>maxW) i--;
    out.push(line.slice(0,i)); line=line.slice(i);
   }
  });
  out.push(line);
 });
 return out;
}
/* *bold* and ~red~ inside bubble text */
function richLine(ln,st){
 let out='',buf='';
 const flush=()=>{if(!buf)return;out+=(st.b||st.c)?`<tspan${st.b?' font-weight="900"':''}${st.c?' fill="#c0392b"':''}>${esc(buf)}</tspan>`:esc(buf);buf='';};
 for(const ch of ln){if(ch==='*'){flush();st.b=!st.b;}else if(ch==='~'){flush();st.c=!st.c;}else buf+=ch;}
 flush();return out;
}

/* ---------- rendering ---------- */
const f1=n=>(+n).toFixed(1);
let PSEQ=0;
const XDEFS='<filter id="cmBlur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="7"/></filter>'+
 '<filter id="cmSepia"><feColorMatrix type="matrix" values=".393 .769 .189 0 0 .349 .686 .168 0 0 .272 .534 .131 0 0 0 0 0 1 0"/></filter>'+
 '<filter id="cmBw"><feColorMatrix type="saturate" values="0"/></filter>'+
 '<radialGradient id="cmVig" cx=".5" cy=".5" r=".72"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient>'+
 '<pattern id="cmDots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.2" fill="#1b1b1b"/></pattern>';
const IMG={};
function imgData(id){if(!(id in IMG))IMG[id]=store.get('comics.img.'+id,'');return IMG[id];}
function bgSvg(bg,w,h){
 if(!bg||bg.charAt(0)==='#') return `<rect width="${w}" height="${h}" fill="${bg||'#fdfefe'}"/>`;
 if(bg.indexOf('img:')===0){const d=imgData(bg.slice(4));return d?`<image href="${d}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`:`<rect width="${w}" height="${h}" fill="#fdfefe"/>`;}
 if(bg.indexOf('wf:')===0){ // plain wall / floor backgrounds: wf:wall:floor:stripes
  const [,wl,fl,st]=bg.split(':'),fy=fl==='-'?h:h*0.72;let s=`<rect width="${w}" height="${h}" fill="${wl}"/>`;
  if(st==='s') for(let x=0;x<w;x+=46) s+=`<rect x="${x}" width="20" height="${f1(fy)}" fill="#fff" opacity=".2"/>`;
  if(fl!=='-'){s+=`<rect y="${f1(fy)}" width="${w}" height="${f1(h-fy)}" fill="${fl}"/>`;for(let i=1;i<4;i++){const y=fy+(h-fy)*i*i/10;s+=`<path d="M0 ${f1(y)} H${w}" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`;}
   if(wl!==fl) s+=`<rect y="${f1(fy-12)}" width="${w}" height="14" fill="#fff" stroke="#1b1b1b" stroke-width="3"/>`;}
  return s;
 }
 const b=CE.BG[bg]; if(!b) return `<rect width="${w}" height="${h}" fill="#fdfefe"/>`;
 return `<svg width="${w}" height="${h}" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMax slice">${b.s}</svg>`;
}
function fxUnder(fx,w,h){
 const cx=w/2,cy=h*0.45,R=Math.hypot(w,h);let s='';
 if(fx==='speed'){const r0=Math.min(w,h)*0.3;for(let i=0;i<44;i++){const a=i/44*Math.PI*2+(i%3)*0.02,da=0.018+(i%4)*0.006,r1=r0*(0.85+(i*37%10)/25);
  s+=`<path d="M${f1(cx+r1*Math.cos(a))} ${f1(cy+r1*Math.sin(a))} L${f1(cx+R*Math.cos(a-da))} ${f1(cy+R*Math.sin(a-da))} L${f1(cx+R*Math.cos(a+da))} ${f1(cy+R*Math.sin(a+da))}Z" fill="#1b1b1b" opacity=".55"/>`;}}
 if(fx==='flash'){let p='';for(let i=0;i<32;i++){const a=i/32*Math.PI*2,r=i%2?Math.min(w,h)*0.3:R*0.75;p+=`${f1(cx+r*Math.cos(a))},${f1(cy+r*Math.sin(a))} `;}
  s+=`<polygon points="${p}" fill="#fff3a8" opacity=".92"/><ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(Math.min(w,h)*0.32)}" ry="${f1(Math.min(w,h)*0.32)}" fill="#fffde8"/>`;}
 return s;
}
function fxOver(fx,w,h){
 if(fx==='vignette') return `<rect width="${w}" height="${h}" fill="url(#cmVig)"/>`;
 if(fx==='dark') return `<rect width="${w}" height="${h}" fill="#0b1a3a" opacity=".42"/>`;
 if(fx==='dots') return `<rect width="${w}" height="${h}" fill="url(#cmDots)" opacity=".16"/>`;
 return '';
}
function tailPath(x,y,rx,ry,tx,ty,bend){
 const a=Math.atan2(ty-y,tx-x),bx=x+rx*0.75*Math.cos(a),by=y+ry*0.75*Math.sin(a),px=-Math.sin(a)*Math.min(26,rx*0.25),py=Math.cos(a)*Math.min(26,ry*0.25);
 let d;
 if(bend){const L=Math.hypot(tx-bx,ty-by)*0.4*bend,nx=-Math.sin(a),ny=Math.cos(a);
  d=`M${f1(bx+px)} ${f1(by+py)} Q${f1((bx+px+tx)/2+nx*L)} ${f1((by+py+ty)/2+ny*L)} ${f1(tx)} ${f1(ty)} Q${f1((bx-px+tx)/2+nx*L)} ${f1((by-py+ty)/2+ny*L)} ${f1(bx-px)} ${f1(by-py)}Z`;}
 else d=`M${f1(bx+px)} ${f1(by+py)} L${f1(tx)} ${f1(ty)} L${f1(bx-px)} ${f1(by-py)}Z`;
 return {d,cover:`M${f1(bx+px*0.7)} ${f1(by+py*0.7)} L${f1(bx-px*0.7)} ${f1(by-py*0.7)}`};
}
function bubbleGeom(it){
 const fs=it.fs||30, F=fontOf(it), rect=(it.kind==='caption'||it.kind==='radio'||it.kind==='rsquare'||it.kind==='title');
 const maxW=it.w*(rect?0.88:0.72), txt=F.up?String(it.text||'').toUpperCase():it.text;
 const lines=wrap(txt,maxW,fs,F), th=lines.length*fs*1.2;
 const h=Math.max(it.h, rect? th+fs*1.1 : th/0.66+fs*0.6);
 return {fs,lines,th,h,rect,F};
}
function bubbleSvg(it){
 const g=bubbleGeom(it), {fs,lines,th,h,F}=g, w=it.w, x=it.x, y=it.y, rx=w/2, ry=h/2;
 const L='stroke="#1b1b1b" stroke-width="5" stroke-linejoin="round"';
 const tips=[[x+(it.tdx||0),y+(it.tdy||0)]];if(it.t2) tips.push([x+it.t2[0],y+it.t2[1]]);
 const tails=tips.map(([tx,ty])=>tailPath(x,y,rx,ry,tx,ty,it.bend||0));
 const T=dash=>tails.map(tl=>`<path d="${tl.d}" fill="#fff" ${L}${dash?' stroke-dasharray="10 8"':''}/>`).join('');
 const C=k=>tails.map(tl=>`<path d="${tl.cover}" stroke="#fff" stroke-width="${k}"/>`).join('');
 let s='';
 if(it.kind==='think'){
  tips.forEach(([tx,ty])=>[0.3,0.55].forEach((f,i)=>{s+=`<circle cx="${f1(tx+(x-tx)*f*0.6)}" cy="${f1(ty+(y-ty)*f*0.6)}" r="${7+i*6}" fill="#fff" ${L}/>`;}));
  for(let i=0;i<12;i++){const an=i/12*Math.PI*2;s+=`<circle cx="${f1(x+rx*0.84*Math.cos(an))}" cy="${f1(y+ry*0.84*Math.sin(an))}" r="${f1(Math.min(rx,ry)*0.42)}" fill="#fff" ${L}/>`;}
  s+=`<ellipse cx="${x}" cy="${y}" rx="${f1(rx*0.93)}" ry="${f1(ry*0.86)}" fill="#fff"/>`;
 } else if(it.kind==='shout'){
  s+=T();let p='';for(let i=0;i<22;i++){const an=i/22*Math.PI*2,r=i%2?0.8:1.08;p+=`${f1(x+rx*r*Math.cos(an))},${f1(y+ry*r*Math.sin(an))} `;}
  s+=`<polygon points="${p}" fill="#fff" ${L}/>`;
 } else if(it.kind==='whisper'){
  s+=T(1)+`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${f1(ry)}" fill="#fff" ${L} stroke-dasharray="10 8"/>`;
 } else if(it.kind==='caption'){
  s+=`<rect x="${f1(x-rx)}" y="${f1(y-ry)}" width="${w}" height="${f1(h)}" fill="#f9e79f" ${L}/>`;
 } else if(it.kind==='rsquare'){
  s+=T()+`<rect x="${f1(x-rx)}" y="${f1(y-ry)}" width="${w}" height="${f1(h)}" rx="${f1(Math.min(28,ry*0.45))}" fill="#fff" ${L}/>`+C(9);
 } else if(it.kind==='title'){
 } else if(it.kind==='radio'){
  const [tx,ty]=tips[0];s+=`<path d="M${f1(x-rx)} ${f1(y-ry)} H${f1(x+rx)} V${f1(y+ry)} H${f1(x+rx*0.2)} L${f1(tx)} ${f1(ty)} L${f1(x-rx*0.1)} ${f1(y+ry)} H${f1(x-rx)}Z" fill="#fff" ${L}/>`;
 } else {
  s+=T()+`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${f1(ry)}" fill="#fff" ${L}/>`+C(9);
 }
 const fz=Math.round(fs*F.k), st={b:false,c:false};
 lines.forEach((ln,i)=>{const ty2=f1(y-th/2+fs*0.95+i*fs*1.2), a=`x="${x}" y="${ty2}" text-anchor="middle" font-family="${F.f}" font-weight="${F.w}" font-size="${fz}"`;
  if(it.kind==='title') s+=`<text ${a} fill="#fff" stroke="#fff" stroke-width="${f1(fz*0.34)}" stroke-linejoin="round">${esc(plain(ln))}</text>`;
  s+=`<text ${a} fill="#1b1b1b">${richLine(ln,st)}</text>`;});
 return s;
}
function sfxSvg(it){
 const txt=it.text||'', fs=txt.length>6?26:(txt.length>4?30:40);
 return `<g transform="translate(${it.x} ${it.y}) rotate(${it.r||0}) scale(${it.s})">${CE.burst(0,0,92,it.bg||'#f4d03f')}<text x="0" y="${fs*0.35}" text-anchor="middle" font-family="sans-serif" font-size="${fs}" font-weight="bold" fill="${it.fg||'#c0392b'}" stroke="#1b1b1b" stroke-width="2">${esc(txt)}</text></g>`;
}
const NOSHADOW=['fly','drive','passenger','ride','ride_moto','ride_kick','stand_in','lie','fall','jump'];
const shadow=(x,y,rx)=>`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(rx*0.15)}" fill="#000" opacity=".17"/>`;
function imgShape(it,W,H){const sh=it.shape||'rect';
 if(sh==='circle') return `<circle cx="0" cy="0" r="${f1(Math.min(W,H)/2)}"/>`;
 if(sh==='oval') return `<ellipse cx="0" cy="0" rx="${f1(W/2)}" ry="${f1(H/2)}"/>`;
 return `<rect x="${f1(-W/2)}" y="${f1(-H/2)}" width="${f1(W)}" height="${f1(H)}" rx="${sh==='round'?28:0}"/>`;}
function itemSvg(it){
 if(it.t==='char'){
  const p=Object.assign({},CE.POSES[it.pose]||CE.POSES.stand); if(it.face) p.face=it.face;
  const o={}; if(it.fx) o.fx=it.fx; if(it.prop){o.propF=it.prop;p.hF='hold';} else if(it.prop===false&&p.hF==='hold'){p.propF=null;p.hF='fist';} if(it.ps) o.propS=it.ps; if(it.seat) o.noSeat=1; if(it.hf) o.hflip=1; if(it.ht) o.hrAdd=it.ht; if(it.sw) o.swap=1;
  const sh=(it.sh!==false&&!it.seat&&(!it.frame||it.frame==='full')&&NOSHADOW.indexOf(it.pose)<0)?shadow(it.x,it.y-4,105*it.s):'';
  return sh+`<g transform="translate(${it.x} ${it.y}) scale(${it.flip?-it.s:it.s} ${it.s}) translate(-300 -900)">${CE.figure(p,it.cfg,o)}</g>`;
 }
 if(it.t==='prop'){const pr=CE.PROPS[it.k];if(!pr)return '';const body=it.color?pr[1].split('#e74c3d').join(it.color):pr[1];return `<g transform="translate(${it.x} ${it.y}) rotate(${it.r||0}) scale(${it.flip?-it.s:it.s} ${it.s}) translate(-100 -100)">${body}</g>`;}
 if(it.t==='animal'){const an=CE.ANIMALS[it.k];if(!an)return '';return (it.sh!==false?shadow(it.x,it.y-3,115*it.s):'')+`<g transform="translate(${it.x} ${it.y}) scale(${it.flip?-it.s:it.s} ${it.s}) translate(-150 -225)">${an[1]}</g>`;}
 if(it.t==='food') return (it.sh!==false?shadow(it.x,it.y-3,90*it.s):'')+`<g transform="translate(${it.x} ${it.y}) scale(${it.flip?-it.s:it.s} ${it.s}) translate(-150 -292)">${CE.food(it.k,it.face,it.arms)}</g>`;
 if(it.t==='sfx') return sfxSvg(it);
 if(it.t==='bub') return bubbleSvg(it);
 if(it.t==='img'){const d=imgData(it.k);if(!d)return '';const W=300,H=300/(it.ar||1),el=imgShape(it,W,H),cid='ci'+it.id+'_'+(++PSEQ);
  return `<g transform="translate(${f1(it.x)} ${f1(it.y)}) rotate(${it.r||0}) scale(${it.flip?-it.s:it.s} ${it.s})"><clipPath id="${cid}">${el}</clipPath><image href="${d}" x="${f1(-W/2)}" y="${f1(-H/2)}" width="${W}" height="${f1(H)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${cid})"/>${it.border!==false?el.replace('/>',' fill="none" stroke="#1b1b1b" stroke-width="7"/>'):''}</g>`;}
 return '';
}
function panelInner(panel,w,h,withIds){
 const full=`<rect width="${w}" height="${h}" fill="none"/>`; // gives filtered groups the full panel size
 let s=bgSvg(panel.bg,w,h);
 if(panel.blur) s=`<g filter="url(#cmBlur)">${full}${s}</g>`;
 s+=fxUnder(panel.fx,w,h);
 panel.items.forEach(it=>{
  if(it.hid){if(withIds) s+=`<g class="it hid" data-id="${it.id}" opacity=".25" pointer-events="none">${itemSvg(it)}</g>`;return;}
  s+=withIds?`<g class="it" data-id="${it.id}"${it.lock?' pointer-events="none"':''}>${itemSvg(it)}</g>`:itemSvg(it);});
 s+=fxOver(panel.fx,w,h);
 if(panel.flt) s=`<g filter="url(#${panel.flt==='bw'?'cmBw':'cmSepia'})">${full}${s}</g>`;
 return s;
}
/* page geometry: margins, gutters, custom sizes */
function pstyle(page){return Object.assign({m:20,g:20,bw:8,bc:'#1b1b1b',r:0},page.style||{});}
function baseRects(page){return page.rects||LAYOUTS[page.layout];}
function effRects(page){const st=pstyle(page),m=st.m,g=st.g,kx=(PAGE_W-2*m+g)/(PAGE_W-20-20+20),ky=(PAGE_H-2*m+g)/(PAGE_H-20-20+20);
 return baseRects(page).map(([x,y,w,h])=>[m+(x-20)*kx,m+(y-20)*ky,(w+20)*kx-g,(h+20)*ky-g]);}
function shapeEl(x,y,w,h,sh,r){
 if(sh==='circle') return `<ellipse cx="${f1(x+w/2)}" cy="${f1(y+h/2)}" rx="${f1(w/2)}" ry="${f1(h/2)}"/>`;
 if(sh==='slantL') return `<polygon points="${f1(x+w*0.12)},${f1(y)} ${f1(x+w)},${f1(y)} ${f1(x+w)},${f1(y+h)} ${f1(x)},${f1(y+h)}"/>`;
 if(sh==='slantR') return `<polygon points="${f1(x)},${f1(y)} ${f1(x+w)},${f1(y)} ${f1(x+w*0.88)},${f1(y+h)} ${f1(x)},${f1(y+h)}"/>`;
 const rr=sh==='round'?Math.min(w,h)*0.1:r;
 return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"${rr?` rx="${f1(rr)}"`:''}/>`;
}
function pageSvg(page,forExport){
 const R=effRects(page),st=pstyle(page),q='pc'+(++PSEQ)+'_';
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PAGE_W} ${PAGE_H}" width="${PAGE_W}" height="${PAGE_H}">${forExport?CE.DEFS+XDEFS:''}<rect width="${PAGE_W}" height="${PAGE_H}" fill="${page.paper||'#ffffff'}"/>`;
 R.forEach(([x,y,w,h],i)=>{const pn=page.panels[i];if(!pn)return;const sh=pn.shape||'rect';
  s+=`<clipPath id="${q}${i}">${shapeEl(x,y,w,h,sh,st.r)}</clipPath><g clip-path="url(#${q}${i})"><g transform="translate(${f1(x)} ${f1(y)})">${panelInner(pn,w,h,false)}</g></g>`;
  if(sh!=='none'&&st.bw>0) s+=shapeEl(x,y,w,h,sh,st.r).replace('/>',` fill="none" stroke="${st.bc}" stroke-width="${st.bw}" stroke-linejoin="round"/>`);
  if(!forExport) s+=`<rect class="pnl" data-pi="${i}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="#fff" fill-opacity="0"/>`;
 });
 return s+'</svg>';
}

/* ---------- projects ---------- */
function normalize(p){if(p&&!p.pages){p.pages=[{layout:p.layout||'1',panels:p.panels||[{bg:'#fdfefe',items:[]}]}];delete p.layout;delete p.panels;}return p;}
function projects(){return store.get('comics.projects',[]).map(normalize);}
const pg=()=>S.proj.pages[S.pg];
function saveProject(silent){
 const p=S.proj;if(!p)return;p.updated=Date.now();
 const list=projects().filter(x=>x.id!==p.id);list.unshift(p);
 const ok=store.set('comics.projects',list);
 if(!silent) toast(ok?t('saved'):t('noSpace')); else if(!ok&&!saveProject.warned){saveProject.warned=1;toast(t('noSpace'));}
 makeThumb(p);
}
let thumbT=0;
function makeThumb(p){clearTimeout(thumbT);thumbT=setTimeout(()=>{renderPng(p.pages[0],200).then(d=>{const th=store.get('comics.thumbs',{});th[p.id]=d;store.set('comics.thumbs',th);}).catch(()=>{});},1500);}
function newPage(layout){return {layout,panels:LAYOUTS[layout].map(()=>({bg:'#fdfefe',items:[]}))};}
function newProject(layout,title){return {id:uid()+Date.now().toString(36),title:title||t('untitled'),updated:Date.now(),pages:[newPage(layout)]};}
function openProject(p){S.proj=p;S.pg=0;S.pi=0;S.sel=null;S.undo=[];S.redo=[];S.resize=false;}
function imgIds(p){const ids=[];p.pages.forEach(page=>page.panels.forEach(pn=>{if(pn.bg&&pn.bg.indexOf('img:')===0)ids.push(pn.bg.slice(4));pn.items.forEach(it=>{if(it.t==='img')ids.push(it.k);});}));return ids;}
function deleteProject(id){
 const all=projects(),p=all.find(x=>x.id===id),rest=all.filter(x=>x.id!==id);
 store.set('comics.projects',rest);const th=store.get('comics.thumbs',{});delete th[id];store.set('comics.thumbs',th);
 if(p){const keep=new Set([].concat(...rest.map(imgIds)));imgIds(p).forEach(k=>{if(!keep.has(k)){try{localStorage.removeItem('comics.img.'+k);}catch(e){}delete IMG[k];}});}
}
/* undo / redo: whole comic (all pages) */
const snap=()=>JSON.stringify({pages:S.proj.pages,pg:S.pg});
function pushUndo(){S.undo.push(snap());if(S.undo.length>60)S.undo.shift();S.redo=[];}
function restore(js){const o=JSON.parse(js);S.proj.pages=o.pages;S.pg=Math.min(o.pg,o.pages.length-1);S.sel=null;saveProject(true);
 if(S.screen==='panel'){if(S.pi>=pg().panels.length)S.pi=0;renderPanel();}else renderPage();}
function undo(){if(!S.undo.length){toast(t('nothingUndo'));return;}S.redo.push(snap());restore(S.undo.pop());}
function redo(){if(!S.redo.length){toast(t('nothingRedo'));return;}S.undo.push(snap());restore(S.redo.pop());}
/* own pictures: downscaled JPEG kept in local storage */
function pickImage(cb){
 const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.style.cssText='position:fixed;left:-999px;top:0';document.body.appendChild(inp);
 inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.remove();if(!f)return;const rd=new FileReader();
  rd.onload=()=>{const im=new Image();im.onload=()=>{const M=900,k=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));
   const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
   const d=c.toDataURL('image/jpeg',0.8),id=uid()+Date.now().toString(36);
   if(!store.set('comics.img.'+id,d)){toast(t('noSpace'));return;}IMG[id]=d;cb(id,c.width/c.height);};
   im.onerror=()=>toast(t('badImage'));im.src=rd.result;};
  rd.readAsDataURL(f);};
 inp.click();
}

/* ---------- export: PNG / JPG / PDF (all pages) / story 9:16 ---------- */
function renderCanvas(page,width){
 if(document.fonts&&!renderCanvas.f){renderCanvas.f=1;return document.fonts.load('40px Pangolin','АбвAbc').catch(()=>{}).then(()=>renderCanvas(page,width));}
 const svg=pageSvg(page,true), c=document.createElement('canvas');c.width=width;c.height=Math.round(width*PAGE_H/PAGE_W);
 const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
 if(window.Canvg){ // draw with JS renderer: identical result on every phone (WebView SVG-to-image is unreliable on Android)
  const v=window.Canvg.fromString(x,svg,{ignoreAnimation:true,ignoreMouse:true,ignoreClear:true});
  v.resize(c.width,c.height,'xMidYMid meet');
  return v.render().then(()=>c);
 }
 return new Promise((res,rej)=>{const img=new Image();
  img.onload=()=>{try{x.drawImage(img,0,0,c.width,c.height);res(c);}catch(e){rej(e);}};
  img.onerror=rej; img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});
}
function renderPng(page,width){return renderCanvas(page,width).then(c=>c.toDataURL('image/png'));}
function makePdf(imgs){ // imgs: [{b64 (jpeg), w, h}] -> one A4 page per image
 const PW=595.28,PH=841.89,M=18,objs=['<< /Type /Catalog /Pages 2 0 R >>',''],kids=[];
 imgs.forEach(im=>{const raw=atob(im.b64),k=Math.min((PW-2*M)/im.w,(PH-2*M)/im.h),dw=im.w*k,dh=im.h*k,dx=(PW-dw)/2,dy=(PH-dh)/2,n=objs.length+1;
  const content=`q ${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${dx.toFixed(2)} ${dy.toFixed(2)} cm /Im0 Do Q`;kids.push(n+' 0 R');
  objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 ${n+1} 0 R >> >> /Contents ${n+2} 0 R >>`);
  objs.push(`<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${raw.length} >>\nstream\n${raw}\nendstream`);
  objs.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);});
 objs[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${imgs.length} >>`;
 let out='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';const off=[];
 objs.forEach((o,i)=>{off.push(out.length);out+=`${i+1} 0 obj\n${o}\nendobj\n`;});
 const xref=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('');
 out+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 let b='';for(let i=0;i<out.length;i+=98304){let ch='';const part=out.slice(i,i+98304);for(let j=0;j<part.length;j++)ch+=String.fromCharCode(part.charCodeAt(j)&255);b+=btoa(ch);}
 return b;
}
function storyCanvas(src){ // 1080x1920 picture for Telegram / Instagram stories, with the app watermark
 const c=document.createElement('canvas');c.width=1080;c.height=1920;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,0,1920);g.addColorStop(0,'#fde68a');g.addColorStop(1,'#f4b63f');x.fillStyle=g;x.fillRect(0,0,1080,1920);
 x.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<40;i++){x.beginPath();x.arc((i*263)%1080,(i*471)%1920,8+(i%5)*4,0,7);x.fill();}
 const k=Math.min(960/src.width,1580/src.height),w=src.width*k,h=src.height*k,X=(1080-w)/2,Y=(1790-h)/2;
 x.fillStyle='rgba(0,0,0,.25)';x.fillRect(X+4,Y+18,w+16,h+16);x.fillStyle='#1b1b1b';x.fillRect(X-8,Y-8,w+16,h+16);x.drawImage(src,X,Y,w,h);
 x.textAlign='center';x.fillStyle='#1b1b1b';x.font="44px Pangolin, 'Comic Sans MS', sans-serif";x.fillText('✏️ '+t('madeWith'),540,1862);
 return c;
}
const FMT={png:{mime:'image/png',ext:'png'},jpg:{mime:'image/jpeg',ext:'jpg'},pdf:{mime:'application/pdf',ext:'pdf'},story:{mime:'image/png',ext:'png'}};
function exportFile(fmt,share){
 Native.call('showInterstitial');toast(t('exporting'));
 let job;
 if(fmt==='pdf') job=S.proj.pages.reduce((pr,page)=>pr.then(a=>renderCanvas(page,1654).then(c=>{a.push({b64:c.toDataURL('image/jpeg',0.9).split(',')[1],w:c.width,h:c.height});return a;})),Promise.resolve([])).then(makePdf);
 else if(fmt==='story') job=renderCanvas(pg(),1100).then(c=>storyCanvas(c).toDataURL('image/png').split(',')[1]);
 else job=renderCanvas(pg(),2480).then(c=>fmt==='png'?c.toDataURL('image/png').split(',')[1]:c.toDataURL('image/jpeg',0.92).split(',')[1]);
 job.then(b64=>{
  const f=FMT[fmt],base=(S.proj.title||'comic').replace(/[^\wа-яёА-ЯЁ -]/g,'').trim()||'comic',
   name=base+(fmt==='story'?'_story':'')+(fmt!=='pdf'&&S.proj.pages.length>1?'_'+(S.pg+1):'')+'.'+f.ext;
  if(Native.call(share?'shareFile':'saveFile',JSON.stringify({b64:b64,mime:f.mime,name:name,text:t('shareText')+(IS_IOS?' https://aresti-labs.web.app':' https://play.google.com/store/apps/details?id=com.comicmaker.app')}))) {if(!share) toast(t('exported'));}
  else {const anchor=()=>{const a=document.createElement('a');a.href='data:'+f.mime+';base64,'+b64;a.download=name;document.body.appendChild(a);a.click();a.remove();toast(t('exported'));};
   if(window.claude&&typeof window.claude.use==='function'){ // test page published inside Claude: downloads go through its save dialog
    const raw=atob(b64),bin=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bin[i]=raw.charCodeAt(i);
    window.claude.use('downloads').then(dl=>{if(!dl)return anchor();return dl.save({filename:name,data:new Blob([bin])}).then(()=>toast(t('exported')),e=>{if(!e||e.code!=='declined')toast('!');});}).catch(anchor);}
   else anchor();}
 }).catch(()=>toast('!'));
}
function fmtBadge(txt,col){return `<svg viewBox="0 0 120 120"><path d="M28 10 H78 L98 30 V110 H28Z" fill="#fff" stroke="#1b1b1b" stroke-width="6" stroke-linejoin="round"/><path d="M78 10 V30 H98" fill="none" stroke="#1b1b1b" stroke-width="6" stroke-linejoin="round"/><rect x="14" y="56" width="92" height="36" rx="8" fill="${col}" stroke="#1b1b1b" stroke-width="5"/><text x="60" y="83" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="800" fill="#fff">${txt}</text></svg>`;}
function pickFormat(share){sheet(share?t('share'):t('saveAs'),[{v:'story',svg:fmtBadge('9:16','#8e44ad'),label:t('fmtStory')},{v:'png',svg:fmtBadge('PNG','#2e86c1'),label:t('fmtPng')},{v:'jpg',svg:fmtBadge('JPG','#27ae60'),label:t('fmtJpg')},{v:'pdf',svg:fmtBadge('PDF','#c0392b'),label:S.proj.pages.length>1?t('fmtPdfAll'):t('fmtPdf')}],fmt=>exportFile(fmt,share));}
function exportPng(share){pickFormat(share);}

/* ---------- screens ---------- */
function show(id){$$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));S.screen=id;}
function setLang(l){S.lang=l;store.set('comics.lang',l);document.documentElement.lang=l;renderHome();show('home');}
function renderLang(){
 $('#lang').innerHTML=`<div class="center"><div class="logo">${ic('bubble')}</div><h1>Comic Maker</h1><p>${['Выберите язык','Choose language','Tilni tanlang'].join(' · ')}</p>
 <button class="big" data-l="ru">Русский</button><button class="big" data-l="uz">O‘zbekcha</button><button class="big" data-l="en">English</button></div>`;
 $$('#lang [data-l]').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
}

/* ---------- cross-promo: other ARESTI Labs apps (Android only — the iOS build has no Play Store links) ---------- */
const PROMO=[
 ['com.chesspuzzledaily.app','♟️','Шахматная задача — Ход дня','Chess Puzzle of the Day','Shaxmat masalasi — Kun yurishi'],
 ['com.nardygame.app','🎲','Нарды','Backgammon','Nardi'],
 ['com.checkersgame.app','⚪','Шашки','Checkers','Shashka'],
 ['com.dominogame.app','🀄','Домино','Dominoes','Domino'],
 ['com.durakgame.app','🃏','Дурак','Durak','Durak'],
 ['com.trueorlie.quiz','🤔','Правда или Ложь?','True or Lie?','Rost yoki yolg‘on?'],
 ['com.rareanimals.quiz','🦁','Редкие животные','Rare Animals','Noyob hayvonlar'],
 ['com.flagsquiz.quiz','🏳️','Флаги мира','World Flags','Dunyo bayroqlari'],
 ['com.capitalsquiz.quiz','🌍','Столицы мира','World Capitals','Dunyo poytaxtlari'],
 ['com.catsquiz.quiz','🐱','Породы кошек','Cat Breeds','Mushuk zotlari'],
 ['com.dogsquiz.quiz','🐶','Породы собак','Dog Breeds','It zotlari'],
 ['com.dinoquiz.quiz','🦖','Динозавры','Dinosaurs','Dinozavrlar'],
 ['com.seacreaturesquiz.quiz','🐠','Морские обитатели','Sea Creatures','Dengiz jonzotlari'],
 ['com.weaponsquiz.quiz','⚔️','Холодное оружие','Edged Weapons','Sovuq qurol'],
 ['com.actorquiz.quiz','🎬','Звёзды кино','Movie Stars','Kino yulduzlari'],
 ['com.authorsquiz.quiz','📚','Авторы и произведения','Authors & Works','Mualliflar va asarlar'],
 ['com.myfamilytree.app','🌳','Моё древо','My Family Tree','Mening daraxtim'],
 ['com.myoffice.app','🏢','MyOffice','MyOffice','MyOffice'],
 ['com.pickles.app','🥒','Соленья и маринады','Pickles & Marinades','Tuzlamalar va marinadlar'],
 ['com.autoindicator.app','🚨','Авто: ошибки на табло','Dashboard Warning Lights','Avto: panel chiroqlari'],
 ['com.buildpc.app','🖥️','Мастер ПК','PC Builder','Kompyuter ustasi'],
 ['com.builder.app','🏠','Строитель','Builder','Quruvchi'],
];
function promoHtml(){
 if(IS_IOS) return `<div class="promo"><div class="promo-t">${t('moreGames')}</div><div class="promo-row"><button class="promo-chip" id="bSite"><span>🌐</span>${t('allApps')}</button></div></div>`;
 if(!window.AndroidBridge||typeof window.AndroidBridge.openStore!=='function') return '';
 const li={ru:2,en:3,uz:4}[S.lang]||3;
 return `<div class="promo"><div class="promo-t">${t('moreGames')}</div><div class="promo-row">${PROMO.map(p=>`<button class="promo-chip" data-pkg="${p[0]}"><span>${p[1]}</span>${p[li]}</button>`).join('')}<button class="promo-chip" id="bSite"><span>🌐</span>${t('allApps')}</button></div></div>`;
}
function renderHome(){
 const th=dailyTheme();
 $('#home').innerHTML=`<div class="center"><div class="logo">${ic('bubble')}</div><h1>${t('app')}</h1>
 <div class="daycard"><div class="dayt">${ic('star')}${t('dayTheme')}</div><div class="dayq">${esc(th)}</div><button class="big primary" id="bDay">${t('dayGo')}</button></div>
 <button class="big primary" id="bNew">${ic('plus')}${t('newComic')}</button>
 <button class="big" id="bMy">${ic('panels')}${t('myComics')}</button>
 <button class="big" id="bLang">${ic('globe')}${t('language')}</button>
 <button class="big" id="bTheme">${ic('palette')}${t('uiTheme')}</button>
 <button class="big" id="bHelp">${ic('help')}${t('help')}</button>
 <button class="big" id="bOrient">${ic('rotate')}${t('orient')}: ${t('or_'+orient())}</button>
 ${IS_IOS?'':`<button class="big" id="bExit">${ic('exit')}${t('exit')}</button>`}${promoHtml()}</div>`;
 $$('#home .promo-chip[data-pkg]').forEach(b=>b.onclick=()=>Native.call('openStore',b.dataset.pkg));const bs=$('#bSite');if(bs)bs.onclick=()=>Native.call('openSite','');
 $('#bNew').onclick=()=>renderLayouts('new'); $('#bMy').onclick=renderMy; $('#bLang').onclick=()=>{renderLang();show('lang');};
 $('#bDay').onclick=()=>renderLayouts('new',th);
 if($('#bExit'))$('#bExit').onclick=()=>{if(!Native.call('exitApp')) toast(t('exit'));};
 $('#bTheme').onclick=pickUiTheme;$('#bHelp').onclick=showHelp;
 $('#bOrient').onclick=()=>{const o=['portrait','landscape','auto'],n=o[(o.indexOf(orient())+1)%3];store.set('comics.orient',n);applyOrient();renderHome();};
}
const UI_THEMES={sun:['#fffdf6','#f4d03f','#2e86c1','#fff4c9'],sky:['#f4f9ff','#7fc8f8','#1f6fb2','#dcefff'],mint:['#f3fff8','#7ee0a8','#16a085','#d9f7e6'],rose:['#fff6f8','#f8a5c2','#c2185b','#ffe0ea'],lavender:['#f9f6ff','#c3aef5','#6c3fc5','#ece4ff'],orange:['#fff8f1','#ffad5c','#d35400','#ffe6cc'],stone:['#f6f6f4','#b8c2cc','#34495e','#e6e9ec']};
function applyUiTheme(){const v=UI_THEMES[store.get('comics.theme','sun')]||UI_THEMES.sun,r=document.documentElement.style;['--paper','--accent','--accent2','--bar'].forEach((k,i)=>r.setProperty(k,v[i]));}
const HELP={"ru": [["🎬", "Новый комикс", "Нажмите «Новый комикс» и выберите раскладку кадров или готовую историю. Готовые истории можно только смотреть: нажмите «Сделать свой комикс», введите название — и получите свою копию для редактирования."], ["🖼️", "Кадр", "Нажмите на кадр, чтобы открыть его. Кнопка «+» добавляет персонажа, пузырь с текстом, предмет, животное, еду, звук или своё фото. В меню кадра — фон, эффекты, форма и копирование кадра."], ["🧍", "Персонажи", "Перетаскивайте героя пальцем, меняйте размер и поворот. Выделите героя — в меню появятся поза, лицо, одежда, головной убор, обувь, телосложение, рост, поворот головы, тень и отражение."], ["💬", "Пузыри и текст", "Добавьте пузырь (речь, мысль, крик, шёпот, плашка автора) и впишите текст. Хвостик тянется к герою. Слово между звёздочками *так* будет выделено. Можно добавить второй хвост и изогнуть его."], ["📚", "Страницы", "Внизу переключаются страницы: можно добавить обложку, новую страницу, удалить лишнюю. Границы кадров можно тянуть, чтобы менять их размер."], ["🧩", "Удобства", "Слои и выравнивание, блокировка элемента, копирование и вставка. Кнопки «Отменить» и «Повторить». Комикс сохраняется автоматически."], ["📤", "Сохранить и поделиться", "Сохраните страницу в PNG или JPG, весь комикс — в PDF, или сделайте картинку для сторис 9:16 и поделитесь ею."], ["⭐", "Ещё", "«Тема дня» подскажет идею для истории. В «Цветовой теме» можно выбрать оформление приложения, а также сменить язык и ориентацию экрана."]], "en": [["🎬", "New comic", "Tap “New comic” and choose a panel layout or a ready-made story. Ready-made stories are view-only: tap “Make my own comic”, enter a title and you get your own copy to edit."], ["🖼️", "Panels", "Tap a panel to open it. The “+” button adds a character, a speech bubble, a prop, an animal, food, a sound effect or your own photo. The panel menu has backgrounds, effects, shapes and copying."], ["🧍", "Characters", "Drag a character with your finger, change its size and rotation. Select a character to get pose, face, outfit, headwear, shoes, build, height, head turn, shadow and flip."], ["💬", "Bubbles and text", "Add a bubble (speech, thought, shout, whisper, caption) and type your text. The tail points to the character. A word between asterisks *like this* is highlighted. You can add a second tail and bend it."], ["📚", "Pages", "Switch pages at the bottom: add a cover, add a new page or delete one. Drag panel borders to resize panels."], ["🧩", "Handy tools", "Layers and alignment, locking, copy and paste. Undo and Redo buttons. Your comic is saved automatically."], ["📤", "Save and share", "Save a page as PNG or JPG, the whole comic as PDF, or make a 9:16 story image and share it."], ["⭐", "More", "“Theme of the day” suggests a story idea. In “Color theme” you can choose the app’s look, and you can also change the language and screen orientation."]], "uz": [["🎬", "Yangi komiks", "“Yangi komiks”ni bosing va kadrlar joylashuvini yoki tayyor hikoyani tanlang. Tayyor hikoyalarni faqat ko‘rish mumkin: “O‘z komiksimni yaratish”ni bosing, nom kiriting — tahrirlash uchun o‘z nusxangiz tayyor."], ["🖼️", "Kadr", "Kadrni ochish uchun ustiga bosing. “+” tugmasi qahramon, matnli pufak, buyum, hayvon, taom, tovush yoki o‘z rasmingizni qo‘shadi. Kadr menyusida fon, effektlar, shakl va nusxalash bor."], ["🧍", "Qahramonlar", "Qahramonni barmoq bilan suring, o‘lchami va burilishini o‘zgartiring. Qahramonni tanlasangiz: holat, yuz, kiyim, bosh kiyim, poyabzal, gavda, bo‘y, bosh burilishi, soya va aks ettirish."], ["💬", "Pufak va matn", "Pufak qo‘shing (nutq, o‘y, qichqiriq, shivir, muallif yozuvi) va matn yozing. Dumcha qahramonga qaraydi. Yulduzchalar orasidagi *so‘z* ajratib ko‘rsatiladi. Ikkinchi dumcha qo‘shish va egish mumkin."], ["📚", "Sahifalar", "Pastda sahifalar almashadi: muqova, yangi sahifa qo‘shing yoki keraksizini o‘chiring. Kadr chegaralarini surib, o‘lchamini o‘zgartiring."], ["🧩", "Qulayliklar", "Qatlamlar va tekislash, qulflash, nusxa olish va qo‘yish. “Bekor qilish” va “Qaytarish” tugmalari. Komiks avtomatik saqlanadi."], ["📤", "Saqlash va ulashish", "Sahifani PNG yoki JPG, butun komiksni PDF qilib saqlang yoki 9:16 storis rasmini yasab ulashing."], ["⭐", "Yana", "“Kun mavzusi” hikoya g‘oyasini beradi. “Rang mavzusi”da ilova ko‘rinishini tanlash, shuningdek til va ekran yo‘nalishini o‘zgartirish mumkin."]]};
function showHelp(){const el=$('#sheet'),L=HELP[S.lang]||HELP.en;
 el.innerHTML=`<div class="sheetbox"><div class="sheethead"><span>${t('help')}</span><button class="tb" id="shClose">${ic('close')}</button></div><div class="helpbox">${L.map(([e,h,p])=>`<div class="helpitem"><div class="helpe">${e}</div><div><b>${esc(h)}</b><p>${esc(p)}</p></div></div>`).join('')}</div></div>`;
 el.classList.add('on');const close=()=>{el.classList.remove('on');el.innerHTML='';};$('#shClose').onclick=close;el.onclick=e=>{if(e.target===el)close();};}
function pickUiTheme(){sheet(t('uiTheme'),Object.keys(UI_THEMES).map(k=>{const v=UI_THEMES[k];return {v:k,label:t('th_'+k),svg:`<svg viewBox="0 0 60 60"><rect x="4" y="4" width="52" height="52" rx="12" fill="${v[0]}" stroke="#1b1b1b" stroke-width="3"/><circle cx="22" cy="24" r="10" fill="${v[1]}" stroke="#1b1b1b" stroke-width="3"/><rect x="14" y="40" width="32" height="8" rx="4" fill="${v[2]}"/><rect x="36" y="14" width="12" height="20" rx="3" fill="${v[3]}" stroke="#1b1b1b" stroke-width="2"/></svg>`};}),k=>{if(!k)return;store.set('comics.theme',k);applyUiTheme();renderHome();});}
function orient(){return store.get('comics.orient','portrait');}
function applyOrient(){Native.call('setOrientation',orient());}
function layoutThumb(k){const r=LAYOUTS[k];return `<svg viewBox="0 0 ${PAGE_W} ${PAGE_H}" class="lt"><rect width="${PAGE_W}" height="${PAGE_H}" fill="#fff"/>${r.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f9e79f" stroke="#1b1b1b" stroke-width="16"/>`).join('')}</svg>`;}
function plural(n){if(S.lang==='ru'){const f=n%10===1&&n%100!==11?'кадр':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'кадра':'кадров');return n+' '+f;}return n+' '+t('panelsN');}
/* mode: 'new' = new comic (with story templates), 'add' = add a page to the open comic */
function renderLayouts(mode,title){
 const add=mode==='add';
 $('#layouts').innerHTML=`<div class="topbar"><button class="tb" id="lBack">${ic('back')}</button><div class="ttl">${add?t('addPage'):(title?esc(title):t('chooseLayout'))}</div></div><div class="lscroll">
 ${add||title?'':`<div class="sect">${t('templates')} · ${TEMPLATES.length}</div><div class="catrow">${TCATS.map(c=>`<button class="chip${(S.tcat||'all')===c?' on':''}" data-cat="${c}">${t('cat_'+c)}</button>`).join('')}</div><div class="tgrid">${TEMPLATES.map((T,i)=>(S.tcat&&S.tcat!=='all'&&T.cat!==S.tcat)?'':`<button class="tcard" data-t="${i}"><span class="temo">${T.e}</span><b>${esc(L3(T.title))}</b><small>${esc(L3(T.sub))} · ${T.panels.length} ${t('panelsShort')}${T.panels.length>4?' · '+Math.ceil(T.panels.length/4)+' '+t('pagesN'):''}</small></button>`).join('')}</div><div class="sect">${t('blank')}</div>`}
 <div class="lgrid">${['1','2h','2v','3','4','6'].map(k=>`<button class="lcard" data-k="${k}">${layoutThumb(k)}<span>${plural(LAYOUTS[k].length)}</span></button>`).join('')}</div></div>`;
 $('#lBack').onclick=()=>{if(add){renderPage();show('page');}else show('home');};
 $$('#layouts [data-t]').forEach(b=>b.onclick=()=>previewTemplate(+b.dataset.t));
 $$('#layouts [data-cat]').forEach(b=>b.onclick=()=>{S.tcat=b.dataset.cat;const y=$('.lscroll').scrollTop;renderLayouts(mode,title);$('.lscroll').scrollTop=y;});
 $$('#layouts [data-k]').forEach(b=>b.onclick=()=>{
  if(add){pushUndo();S.proj.pages.splice(S.pg+1,0,newPage(b.dataset.k));S.pg++;saveProject(true);renderPage();show('page');return;}
  openProject(newProject(b.dataset.k,title));saveProject(true);renderPage();show('page');});
 show('layouts');
}
/* read-only preview of a story template; the user works on a named copy */
function previewTemplate(i){
 const T=TEMPLATES[i],tp=buildTemplate(T);let k=0;S.tplv=true;
 const draw=()=>{const n=tp.pages.length;
  $('#layouts').innerHTML=`<div class="topbar"><button class="tb" id="tvBack">${ic('back')}</button><div class="ttl">${T.e} ${esc(L3(T.title))}</div></div>
  <div class="pnav"><button class="tb" id="tvPrev"${k?'':' disabled'}>‹</button><span class="pgl">${t('page')} ${k+1}/${n}</span><button class="tb" id="tvNext"${k<n-1?'':' disabled'}>›</button><span class="sp"></span><span class="ro">${ic('lock')}${t('readOnly')}</span></div>
  <div class="pagewrap tview">${pageSvg(tp.pages[k],false)}</div><div class="hint">${t('tplInfo')}</div>
  <div class="navrow"><button class="big primary" id="tvUse">${ic('plus')}${t('tplUse')}</button></div>`;
  $('#tvBack').onclick=()=>{S.tplv=false;renderLayouts('new');};
  $('#tvPrev').onclick=()=>{if(k>0){k--;draw();}};$('#tvNext').onclick=()=>{if(k<n-1){k++;draw();}};
  $('#tvUse').onclick=()=>textBox(t('tplName'),L3(T.title),v=>{const p=buildTemplate(T);p.title=v.trim()||L3(T.title);S.tplv=false;openProject(p);saveProject(true);renderPage();show('page');toast(t('tplHint'));});};
 draw();show('layouts');
}
function renderMy(){
 const list=projects(), th=store.get('comics.thumbs',{});
 $('#my').innerHTML=`<div class="topbar"><button class="tb" id="mBack">${ic('back')}</button><div class="ttl">${t('myComics')}</div></div>
 <div class="mylist">${list.length?list.map(p=>`<div class="mycard" data-id="${p.id}"><div class="mth">${th[p.id]?`<img src="${th[p.id]}" alt="">`:layoutThumb(p.pages[0].layout)}</div><div class="mtt">${esc(p.title)}<small>${new Date(p.updated).toLocaleDateString()}${p.pages.length>1?' · '+p.pages.length+' '+t('pagesN'):''}</small></div><button class="tb" data-dup="${p.id}">${ic('copy')}</button><button class="tb del" data-del="${p.id}">${ic('trash')}</button></div>`).join(''):`<p class="empty">${t('empty')}</p>`}</div>`;
 $('#mBack').onclick=()=>show('home');
 $$('#my .mycard').forEach(c=>c.onclick=e=>{if(e.target.closest('[data-del],[data-dup]'))return;const p=projects().find(x=>x.id===c.dataset.id);if(p){openProject(p);renderPage();show('page');}});
 $$('#my [data-dup]').forEach(b=>b.onclick=()=>{const p=projects().find(x=>x.id===b.dataset.dup);if(!p)return;const c=clone(p);c.id=uid()+Date.now().toString(36);c.title=p.title+' (2)';c.updated=Date.now();const l=projects();l.unshift(c);if(!store.set('comics.projects',l))toast(t('noSpace'));renderMy();});
 $$('#my [data-del]').forEach(b=>b.onclick=()=>confirmBox(t('deleteQ'),()=>{deleteProject(b.dataset.del);renderMy();}));
 show('my');
}
function renderPage(){
 const p=S.proj,n=p.pages.length;if(S.pg>=n)S.pg=n-1;
 $('#page').innerHTML=`<div class="topbar"><button class="tb" id="pBack">${ic('back')}</button><button class="ttl edit" id="pTitle">${esc(p.title)}</button><button class="tb" id="pUndo">${ic('undo')}</button><button class="tb" id="pRedo">${ic('redo')}</button><button class="tb" id="pSave">${ic('save')}</button></div>
 <div class="pnav"><button class="tb" id="pgPrev"${S.pg?'':' disabled'}>‹</button><span class="pgl">${pg().cover?t('cover'):t('page')+' '+(S.pg+1)+'/'+n}</span><button class="tb" id="pgNext"${S.pg<n-1?'':' disabled'}>›</button><span class="sp"></span><button class="chip" id="pgAdd">${ic('plus')}${t('addPage')}</button>${n>1?`<button class="tb" id="pgDel">${ic('trash')}</button>`:''}</div>
 <div class="pagewrap${S.resize?' resizing':''}" id="pageWrap">${pageSvg(pg(),false)}</div><div class="hint">${S.resize?t('resizeHint'):t('tapPanel')}</div>
 <div class="bar"><button class="btn" id="pExport">${ic('download')}<span>${t('export')}</span></button><button class="btn" id="pShare">${ic('share')}<span>${t('share')}</span></button><button class="btn" id="pFrames">${ic('frame')}<span>${t('frames')}</span></button><button class="btn${S.resize?' on':''}" id="pResize">${ic('wider')}<span>${S.resize?t('done'):t('resize')}</span></button><button class="btn" id="pCover">${ic('star')}<span>${t('cover')}</span></button></div>`;
 $('#pBack').onclick=()=>{S.resize=false;saveProject(true);renderHome();show('home');};
 $('#pSave').onclick=()=>saveProject(false);
 $('#pUndo').onclick=undo;$('#pRedo').onclick=redo;
 $('#pTitle').onclick=()=>textBox(t('rename'),p.title,v=>{p.title=v.trim()||t('untitled');saveProject(true);renderPage();});
 $('#pExport').onclick=()=>{saveProject(true);exportPng(false);};
 $('#pShare').onclick=()=>{saveProject(true);exportPng(true);};
 $('#pFrames').onclick=framesBox;
 $('#pResize').onclick=()=>{S.resize=!S.resize;renderPage();};
 $('#pCover').onclick=addCover;
 $('#pgPrev').onclick=()=>{if(S.pg>0){S.pg--;renderPage();}};
 $('#pgNext').onclick=()=>{if(S.pg<n-1){S.pg++;renderPage();}};
 $('#pgAdd').onclick=()=>renderLayouts('add');
 if($('#pgDel')) $('#pgDel').onclick=()=>confirmBox(t('delPageQ'),()=>{pushUndo();p.pages.splice(S.pg,1);S.pg=Math.max(0,S.pg-1);saveProject(true);renderPage();});
 if(S.resize) bindResize();
 else $$('#pageWrap .pnl').forEach(el=>el.addEventListener('click',()=>{S.pi=+el.dataset.pi;S.sel=null;renderPanel();show('panel');}));
}
/* drag the gutters between panels to change panel sizes */
function bindResize(){
 const sv=$('#pageWrap>svg'),page=pg(),base=baseRects(page),R=effRects(page);let hs='';
 const near=(a,b)=>Math.abs(a-b)<6;
 R.forEach(([x,y,w,h],i)=>{const [bx,by,bw,bh]=base[i];
  if(bx+bw<PAGE_W-30) hs+=`<g class="rh" data-i="${i}" data-e="r"><rect x="${f1(x+w-16)}" y="${f1(y+h/2-60)}" width="32" height="120" rx="14" fill="#2e86c1" stroke="#fff" stroke-width="4"/></g>`;
  if(by+bh<PAGE_H-30) hs+=`<g class="rh" data-i="${i}" data-e="b"><rect x="${f1(x+w/2-60)}" y="${f1(y+h-16)}" width="120" height="32" rx="14" fill="#2e86c1" stroke="#fff" stroke-width="4"/></g>`;});
 sv.insertAdjacentHTML('beforeend',hs);
 let d=null;
 const pt=e=>{const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(sv.getScreenCTM().inverse());};
 $$('#pageWrap .rh').forEach(h=>h.addEventListener('pointerdown',e=>{e.preventDefault();sv.setPointerCapture(e.pointerId);
  const i=+h.dataset.i,ed=h.dataset.e,r=base.map(a=>a.slice()),[x,y,w,hh]=r[i],edge=ed==='r'?x+w:y+hh;
  // panels whose right/bottom edge is on the same line, and panels starting just after it
  const before=[],after=[];r.forEach((q,j)=>{if(ed==='r'){if(near(q[0]+q[2],edge))before.push(j);if(near(q[0],edge+20))after.push(j);}
   else {if(near(q[1]+q[3],edge))before.push(j);if(near(q[1],edge+20))after.push(j);}});
  d={ed,r,before,after,p0:pt(e)};pushUndo();}));
 sv.addEventListener('pointermove',e=>{if(!d)return;const p=pt(e);let dv=d.ed==='r'?p.x-d.p0.x:p.y-d.p0.y;
  const k=d.ed==='r'?2:3;d.before.forEach(j=>{dv=Math.max(dv,140-d.r[j][k]);});d.after.forEach(j=>{dv=Math.min(dv,d.r[j][k]-140);});
  page.rects=d.r.map(a=>a.slice());d.before.forEach(j=>{page.rects[j][k]+=dv;});d.after.forEach(j=>{page.rects[j][k-2]+=dv;page.rects[j][k]-=dv;});
  sv.innerHTML=pageSvg(page,false).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');});
 const up=()=>{if(!d)return;d=null;saveProject(true);renderPage();};
 sv.addEventListener('pointerup',up);sv.addEventListener('pointercancel',up);
}
function addCover(){
 const p=S.proj;if(p.pages[0].cover){S.pg=0;renderPage();return;}
 textBox(t('authorQ'),store.get('comics.author',''),au=>{
  au=au.trim();if(au)store.set('comics.author',au);pushUndo();
  const page=newPage('1');page.cover=1;const [,,w,h]=LAYOUTS['1'][0],P=page.panels[0];P.bg='#f4d03f';P.fx='speed';
  P.items.push({id:uid(),t:'bub',kind:'title',text:p.title,font:'loud',x:w/2,y:h*0.2,w:w*0.92,h:140,fs:78,tdx:0,tdy:0});
  if(au) P.items.push({id:uid(),t:'bub',kind:'caption',text:t('by')+' '+au,x:w/2,y:h*0.92,w:w*0.7,h:70,fs:36,tdx:0,tdy:0});
  p.pages.unshift(page);S.pg=0;saveProject(true);renderPage();toast(t('coverHint'));});
}
/* page frame style: gutters, margins, border width / colour / corners */
function framesBox(){
 const page=pg(),G=[
  ['g',t('gutters'),[[0,'0'],[10,'S'],[20,'M'],[40,'L']]],
  ['m',t('margins'),[[0,'0'],[20,'M'],[50,'L']]],
  ['bw',t('border'),[[0,t('none')],[4,'S'],[8,'M'],[14,'L']]],
  ['bc',t('borderColor'),['#1b1b1b','#7f8c8d','#c0392b','#2e86c1','#27ae60','#8e44ad'].map(c=>[c,`<i class="sw" style="background:${c}"></i>`])],
  ['r',t('corners'),[[0,'▢'],[16,'▢ ·'],[36,'◯']]],
  ['paper',t('paper'),['#ffffff','#1b1b1b','#fff4c9','#d6eaf8'].map(c=>[c,`<i class="sw" style="background:${c}"></i>`])]];
 const draw=()=>{const st=Object.assign(pstyle(page),{paper:page.paper||'#ffffff'});
  $('#modal').innerHTML=`<div class="mbox"><div class="mt">${t('frames')}</div>${G.map(([k,l,o])=>`<div class="og"><div class="ol">${l}</div><div class="orow">${o.map(([v,lab])=>`<button class="chip${st[k]===v?' on':''}" data-k="${k}" data-v="${v}">${lab}</button>`).join('')}</div></div>`).join('')}
  <div class="mrow"><button class="big primary" id="mOk">${t('ok')}</button></div></div>`;
  $('#modal').classList.add('on');
  $$('#modal [data-k]').forEach(b=>b.onclick=()=>{pushUndo();const k=b.dataset.k,v=isNaN(+b.dataset.v)?b.dataset.v:+b.dataset.v;
   if(k==='paper')page.paper=v;else page.style=Object.assign({},page.style||{},{[k]:v});saveProject(true);renderPage();draw();});
  $('#mOk').onclick=closeModal;};
 draw();
}
function closeModal(){$('#modal').classList.remove('on');$('#modal').innerHTML='';}

/* ---------- story templates & theme of the day ---------- */
const L3=a=>a?(a[{ru:0,en:1,uz:2}[S.lang]]||a[0]):'';
/* panel: bg, fx, c:[[charId,pose,x,face,flip,fx]], o:[[type,key,x,y,scale]], b:[[kind,lineIdx,x,y,charIdx]] */
const TEMPLATES=[
 {e:'🏫',title:['Утро в школу','Morning rush','Maktabga tong'],sub:['Комедия, 4 кадра','Comedy, 4 panels','Komediya, 4 kadr'],lines:[
  ['Алишер, вставай! Опоздаешь в школу!','Alisher, get up! You’ll be late for school!','Alisher, tur! Maktabga kechikasan!'],
  ['Ещё пять минуточек…','Just five more minutes…','Yana besh daqiqa…'],
  ['Через пять минут…','Five minutes later…','Besh daqiqadan keyin…'],
  ['Успею! Успею!','I’ll make it! I’ll make it!','Ulguraman! Ulguraman!'],
  ['А где все?..','Where is everyone?..','Hamma qayerda?..'],
  ['Внучек, сегодня же *воскресенье*!','Sweetie, today is *Sunday*!','Nevaraginam, bugun *yakshanba*-ku!'],
  ['ВЖУХ!','ZOOM!','VJUX!'],
  ['Ну раз воскресенье — поможем бабушке?','Since it’s Sunday — shall we help Grandma?','Yakshanba ekan — buvimga yordam beraymi?'],
  ['Конечно! Сначала польём цветы.','Of course! First, let’s water the flowers.','Albatta! Avval gullarni sug‘oramiz.'],
  ['А потом испечём лепёшки!','And then we’ll bake bread!','Keyin non yopamiz!'],
  ['Лучшее воскресенье — с бабушкой!','The best Sunday is with Grandma!','Eng zo‘r yakshanba — buvim bilan!']],
  panels:[{bg:'bedroom',c:[['karima','point',.3,'concerned'],['alisher','scratch',.74,'tired',1,'zzz']],b:[['speech',0,.33,.13,0],['think',1,.72,.3,1]]},
   {bg:'mahalla',fx:'speed',c:[['alisher','run',.5,'driven',0,'sweat']],b:[['caption',2,.5,.07],['shout',3,.5,.25,0]],o:[['sfx',6,.2,.55,.8]]},
   {bg:'school',c:[['alisher','shrug',.5,'concernedFear',0,'question']],b:[['think',4,.5,.2,0]]},
   {bg:'mahalla',c:[['karima','facepalm',.3,'smileLOL'],['alisher','facepalm',.74,'awe',1,'shock']],b:[['speech',5,.4,.13,0]]},
   {bg:'mahalla',c:[['alisher','explain',.3,'smile'],['karima','stand',.72,'smileBig',1]],b:[['speech',7,.33,.13,0]]},
   {bg:'mahalla',c:[['karima','point',.3,'smile'],['alisher','squat',.72,'smileBig',1]],b:[['speech',8,.35,.13,0]],o:[['prop','bucket',.55,.88,.4],['prop','plant',.85,.85,.45]]},
   {bg:'kitchen',c:[['karima','explain',.3,'explaining'],['alisher','hooray',.72,'smileLOL',1]],b:[['speech',9,.35,.13,0]],o:[['prop','non',.52,.88,.5]]},
   {bg:'home',fx:'flash',c:[['karima','hug',.35,'lovingGrin1',0,'hearts'],['alisher','hug',.66,'smileBig',1]],b:[['speech',10,.5,.13,1]]}]},
 {e:'☕',title:['В кафе','At the café','Kafeda'],sub:['Кто платит? 4 кадра','Who pays? 4 panels','Kim to‘laydi? 4 kadr'],lines:[
  ['Привет! Давно не виделись!','Hi! Long time no see!','Salom! Ko‘rishmaganimizga ancha bo‘ldi!'],
  ['Садись, я угощаю!','Sit down, it’s my treat!','O‘tir, men mehmon qilaman!'],
  ['Что будете заказывать?','What would you like?','Nima buyurasiz?'],
  ['Мне… всё меню!','I’ll have… the whole menu!','Menga… butun menyu!'],
  ['Через час…','An hour later…','Bir soatdan keyin…'],
  ['Вкуснотища!','Delicious!','Juda mazali!'],
  ['Э-э… а кто платит?','Um… who’s paying?','E-e… kim to‘laydi?'],
  ['Ты же сказала — *угощаешь*!','You said it’s *your treat*!','O‘zing *mehmon qilaman* deding-ku!'],
  ['Ладно, шучу! Давай заплатим *пополам*.','OK, just kidding! Let’s split the bill *half and half*.','Mayli, hazillashdim! Kelinglar, *teng* to‘laymiz.'],
  ['Вот это по-честному!','Now that’s fair!','Mana bu adolatli!'],
  ['Спасибо! Приходите ещё!','Thank you! Come again!','Rahmat! Yana keling!'],
  ['Друзья — это когда *честно* и весело!','Friendship means being *fair* and having fun!','Do‘stlik — bu *halollik* va quvonch!']],
  panels:[{bg:'cafe',c:[['aziz','wave',.3,'smileBig'],['natasha','wave',.72,'smile',1]],b:[['speech',0,.3,.12,0],['speech',1,.7,.3,1]]},
   {bg:'cafe',c:[['ulugbek','explain',.3,'explaining'],['aziz','think',.72,'cheeky',1]],b:[['speech',2,.3,.12,0],['speech',3,.7,.3,1]]},
   {bg:'cafe',c:[['aziz','hooray',.3,'eatingHappy',0,'hearts'],['natasha','think',.72,'concerned',1,'sweatdrop']],b:[['caption',4,.5,.07],['shout',5,.3,.24,0],['think',6,.72,.36,1]],o:[['prop','pizza',.5,.82,.6]]},
   {bg:'cafe',c:[['aziz','shrug',.3,'cheeky'],['natasha','facepalm',.72,'tired',1,'anger']],b:[['speech',7,.4,.13,0]]},
   {bg:'cafe',c:[['aziz','explain',.3,'smileBig'],['natasha','stand',.72,'awe',1]],b:[['speech',8,.35,.13,0]],o:[['prop','money',.52,.85,.4]]},
   {bg:'cafe',c:[['natasha','thumbsup',.5,'smileBig',0,'sparkle']],b:[['speech',9,.5,.14,0]]},
   {bg:'cafe',c:[['ulugbek','wave',.5,'smile']],b:[['speech',10,.5,.14,0]]},
   {bg:'city',c:[['aziz','walk',.3,'smileLOL'],['natasha','walk',.72,'smileBig']],b:[['caption',11,.5,.08]]}]},
 {e:'🎂',title:['Сюрприз','The surprise','Syurpriz'],sub:['День рождения, 4 кадра','Birthday, 4 panels','Tug‘ilgan kun, 4 kadr'],lines:[
  ['Тсс! Она идёт!','Shh! She’s coming!','Tss! U kelyapti!'],
  ['Почему так тихо?..','Why is it so quiet?..','Nega bunchalik jimjitlik?..'],
  ['СЮРПРИЗ!!!','SURPRISE!!!','SYURPRIZ!!!'],
  ['Спасибо, друзья! Это *лучший* день!','Thank you, friends! The *best* day ever!','Rahmat, do‘stlar! Bu *eng zo‘r* kun!'],
  ['УРА!','HOORAY!','URA!'],
  ['Загадай желание и задуй свечи!','Make a wish and blow out the candles!','Orzu qil va shamlarni o‘chir!'],
  ['Фууух!','Whoooosh!','Puuuf!'],
  ['А что ты загадала?','What did you wish for?','Nima orzu qilding?'],
  ['Чтобы мы *всегда* были друзьями!','That we’ll *always* be friends!','*Doim* do‘st bo‘lib qolishimizni!']],
  panels:[{bg:'livingroom',c:[['dima','sneak',.3,'cheeky'],['sabina','sneak',.72,'smile',1]],b:[['whisper',0,.5,.14,0]]},
   {bg:'livingroom',fx:'dark',c:[['madina','walk',.5,'concerned',0,'question']],b:[['think',1,.5,.18,0]]},
   {bg:'livingroom',fx:'flash',c:[['dima','hooray',.22,'smileBig'],['madina','stand',.52,'awe',0,'exclaim'],['sabina','hooray',.82,'smileLOL',1]],b:[['shout',2,.5,.13,1]],o:[['sfx',4,.8,.5,.7]]},
   {bg:'livingroom',c:[['madina','hug',.35,'lovingGrin1',0,'hearts'],['sabina','hug',.68,'smileBig',1]],b:[['speech',3,.5,.13,0]],o:[['prop','cake',.5,.85,.7]]},
   {bg:'livingroom',c:[['dima','point',.3,'smileBig'],['madina','stand',.72,'cute',1,'sparkle']],b:[['speech',5,.35,.13,0]],o:[['prop','cake',.55,.88,.6]]},
   {bg:'livingroom',fx:'speed',c:[['madina','stand',.5,'cheeky']],o:[['prop','candle',.75,.75,.5],['sfx',6,.75,.35,.7]]},
   {bg:'livingroom',c:[['sabina','explain',.3,'cute'],['madina','think',.72,'smile',1]],b:[['speech',7,.33,.13,0]]},
   {bg:'livingroom',fx:'flash',c:[['dima','hug',.2,'smileBig'],['madina','hug',.5,'lovingGrin1',0,'hearts'],['sabina','hug',.8,'smileBig',1]],b:[['speech',8,.5,.12,1]]}]},
 {e:'⚽',title:['Ссора и мир','Fight & make up','Janjal va yarashuv'],sub:['О дружбе, 4 кадра','Friendship, 4 panels','Do‘stlik haqida, 4 kadr'],lines:[
  ['Это *мой* мяч!','That’s *my* ball!','Bu *mening* to‘pim!'],
  ['Нет, *мой*!','No, *mine*!','Yo‘q, *meniki*!'],
  ['Целый день они не разговаривали…','They didn’t talk all day…','Kun bo‘yi gaplashishmadi…'],
  ['Скучно одному…','It’s boring alone…','Yolg‘iz zerikarli…'],
  ['Мир? Давай играть вместе!','Friends again? Let’s play together!','Yarashamizmi? Birga o‘ynaymiz!'],
  ['Мир!','Friends!','Yarashdik!'],
  ['Кстати, мяч — *общий*. Нам его папа подарил.','By the way, the ball is *ours*. Dad gave it to both of us.','Aytgancha, to‘p — *ikkalamizniki*. Uni bizga dadam sovg‘a qilgan.'],
  ['Ой… точно! Прости меня.','Oh… right! I’m sorry.','Voy… rost! Kechir meni.'],
  ['Давай играть *по очереди*!','Let’s take *turns*!','*Navbatma-navbat* o‘ynaymiz!'],
  ['Вместе играть веселее!','Playing together is more fun!','Birga o‘ynash qiziqroq!']],
  panels:[{bg:'park',c:[['alisher','point',.3,'veryAngry',0,'anger'],['timur','akimbo',.72,'rage',1]],b:[['shout',0,.3,.12,0],['shout',1,.72,.3,1]],o:[['prop','ball',.5,.88,.45]]},
   {bg:'park',flt:'bw',c:[['alisher','cross',.28,'serious',1],['timur','cross',.74,'serious']],b:[['caption',2,.5,.08]]},
   {bg:'park',c:[['alisher','scratch',.5,'concerned']],b:[['think',3,.5,.18,0]]},
   {bg:'park',c:[['alisher','hug',.36,'smileBig',0,'hearts'],['timur','hug',.66,'smile',1]],b:[['speech',4,.3,.12,0],['speech',5,.78,.3,1]],o:[['prop','ball',.5,.9,.45]]},
   {bg:'park',c:[['timur','explain',.3,'smile'],['alisher','stand',.72,'awe',1]],b:[['speech',6,.35,.13,0]],o:[['prop','ball',.5,.9,.45]]},
   {bg:'park',c:[['alisher','scratch',.5,'concerned',0,'blush']],b:[['speech',7,.5,.14,0]]},
   {bg:'playground',c:[['alisher','kick',.3,'smileBig'],['timur','hooray',.72,'smileLOL',1]],b:[['speech',8,.7,.13,1]],o:[['prop','ball',.5,.8,.4]]},
   {bg:'playground',fx:'flash',c:[['alisher','hooray',.3,'smileLOL'],['timur','hooray',.72,'smileBig',1]],b:[['shout',9,.5,.13,0]]}]},
 {e:'🧙',title:['Иван и Баба-Яга','Ivan & Baba Yaga','Ivan va Baba-Yaga'],sub:['Сказка, 4 кадра','Fairy tale, 4 panels','Ertak, 4 kadr'],lines:[
  ['Жил-был Иван. Шёл он через тёмный лес…','Once upon a time Ivan walked through a dark forest…','Bir bor ekan, Ivan qorong‘i o‘rmondan o‘tib borardi…'],
  ['Кто это в мой лес пожаловал?','Who dares to enter my forest?','Mening o‘rmonimga kim keldi?'],
  ['Ой-ой-ой…','Oh no…','Voy-voy…'],
  ['Бабушка, я заблудился. Помогите!','Granny, I’m lost. Please help!','Buvijon, adashib qoldim. Yordam bering!'],
  ['Ну так и быть! Иди по тропинке — выйдешь к дому.','Very well! Follow the path and you’ll get home.','Mayli! So‘qmoqdan yur — uyingga chiqasan.'],
  ['Спасибо, бабушка!','Thank you, granny!','Rahmat, buvijon!'],
  ['Иван шёл по тропинке и увидел зайчонка в ловушке.','On the path Ivan saw a little hare caught in a trap.','So‘qmoqda Ivan tuzoqqa tushgan quyonchani ko‘rdi.'],
  ['Не бойся, малыш, я тебя освобожу!','Don’t be scared, little one, I’ll set you free!','Qo‘rqma, kichkintoy, seni ozod qilaman!'],
  ['А вот и мой дом!','And here is my home!','Mana mening uyim!'],
  ['Добро всегда возвращается добром.','Kindness always comes back to you.','Yaxshilik doim yaxshilik bilan qaytadi.']],
  panels:[{bg:'forest',c:[['ivan','walk',.5,'calm']],b:[['caption',0,.5,.08]]},
   {bg:'forest_night',c:[['baba_yaga','point',.3,'cheeky'],['ivan','stand',.74,'fear',1,'sweat']],b:[['speech',1,.33,.13,0],['whisper',2,.74,.34,1]]},
   {bg:'forest_night',c:[['ivan','explain',.3,'explaining'],['baba_yaga','think',.72,'suspicious',1]],b:[['speech',3,.35,.13,0]]},
   {bg:'forest',c:[['baba_yaga','wave',.3,'smileBig'],['ivan','bow',.74,'smile',1]],b:[['speech',4,.38,.13,0],['speech',5,.74,.4,1]]},
   {bg:'forest',c:[['ivan','walk',.4,'concerned']],b:[['caption',6,.5,.08]],o:[['animal','rabbit',.8,1,.4]]},
   {bg:'forest',c:[['ivan','squat',.4,'smile',0,'hearts']],b:[['speech',7,.4,.14,0]],o:[['animal','rabbit',.75,1,.4]]},
   {bg:'kishlak',c:[['ivan','hooray',.4,'smileBig']],b:[['speech',8,.4,.14,0]],o:[['animal','rabbit',.78,1,.35]]},
   {bg:'kishlak',fx:'flash',c:[['ivan','wave',.5,'smile']],b:[['caption',9,.5,.08]]}]},
 {e:'🍉',title:['Насреддин на базаре','Nasreddin at the bazaar','Nasriddin bozorda'],sub:['Притча, 4 кадра','Parable, 4 panels','Masal, 4 kadr'],lines:[
  ['Однажды Ходжа Насреддин пришёл на базар…','One day Nasreddin came to the bazaar…','Bir kuni Xo‘ja Nasriddin bozorga keldi…'],
  ['Ходжа, купи арбуз! Самый *сладкий*!','Hodja, buy a melon! The *sweetest* one!','Xo‘ja, tarvuz ol! Eng *shirini*!'],
  ['А если не сладкий?','And if it isn’t sweet?','Agar shirin bo‘lmasa-chi?'],
  ['Тогда — *бесплатно*!','Then it’s *free*!','Unda — *tekin*!'],
  ['Хм… *несладкий*!','Hmm… *not sweet*!','Hm… *shirin emas*!'],
  ['ХА-ХА!','HA-HA!','XA-XA!'],
  ['Шучу! Арбуз *сладкий*. Вот деньги — держи.','Just joking! The melon is *sweet*. Here’s your money.','Hazillashdim! Tarvuz *shirin*. Mana pulingiz.'],
  ['Ха! Ну и шутник ты, Ходжа!','Ha! What a joker you are, Hodja!','Xa! Hazilkashsan-da, Xo‘ja!'],
  ['Пойду угощу соседей — арбуз большой!','I’ll share it with the neighbours — it’s a big one!','Qo‘shnilarni mehmon qilay — tarvuz katta!'],
  ['Честность и щедрость — лучшее украшение человека.','Honesty and generosity make a person beautiful.','Halollik va saxiylik — insonning eng yaxshi ziynati.']],
  panels:[{bg:'bazaar',c:[['nasreddin','walk',.4,'calm']],b:[['caption',0,.5,.08]],o:[['animal','donkey',.82,1,.75]]},
   {bg:'bazaar',c:[['shavkat','explain',.3,'cheeky'],['nasreddin','think',.72,'suspicious',1]],b:[['speech',1,.35,.13,0]],o:[['prop','watermelon',.3,.86,.6]]},
   {bg:'bazaar',c:[['nasreddin','scratch',.3,'cheeky'],['shavkat','cross',.72,'smile',1]],b:[['speech',2,.3,.12,0],['speech',3,.72,.3,1]]},
   {bg:'bazaar',c:[['nasreddin','eat',.3,'eatingHappy'],['shavkat','facepalm',.72,'tired',1,'sweatdrop']],b:[['speech',4,.3,.12,0]],o:[['sfx',5,.75,.2,.6]]},
   {bg:'bazaar',c:[['nasreddin','explain',.3,'smileBig'],['shavkat','stand',.72,'awe',1]],b:[['speech',6,.35,.13,0]],o:[['prop','money',.52,.82,.4]]},
   {bg:'bazaar',c:[['shavkat','hooray',.5,'smileLOL']],b:[['speech',7,.5,.14,0]]},
   {bg:'mahalla',c:[['nasreddin','walk',.4,'smile']],b:[['speech',8,.4,.14,0]],o:[['prop','watermelon',.75,.86,.6],['animal','donkey',.85,1,.6]]},
   {bg:'mahalla',c:[['nasreddin','explain',.3,'smile'],['rahim','eat',.72,'eatingHappy',1]],b:[['caption',9,.5,.08]],o:[['prop','watermelon',.52,.9,.5]]}]},
 {e:'🌷',title:['Навруз в махалле','Navruz in the mahalla','Mahalladagi Navro‘z'],sub:['Праздник, 4 кадра','Holiday, 4 panels','Bayram, 4 kadr'],lines:[
  ['Весна! Махалля готовится к Наврузу.','Spring! The mahalla gets ready for Navruz.','Bahor! Mahalla Navro‘zga tayyorlanmoqda.'],
  ['Дети, помогайте!','Kids, come and help!','Bolalar, yordam beringlar!'],
  ['Сумаляк варят *всю ночь*!','Sumalak cooks *all night long*!','Sumalak *tun bo‘yi* qaynatiladi!'],
  ['Всю ночь?!','All night?!','Tun bo‘yi?!'],
  ['Только бы не уснуть…','Must… not… fall asleep…','Faqat uxlab qolmasam bo‘ldi…'],
  ['С праздником Навруз!','Happy Navruz!','Navro‘z bayrami muborak!'],
  ['Утро. Сумаляк готов!','Morning. The sumalak is ready!','Tong. Sumalak tayyor!'],
  ['Угощаем всех соседей!','Let’s treat all the neighbours!','Hamma qo‘shnilarni mehmon qilamiz!'],
  ['А теперь — запускаем *воздушного змея*!','And now — let’s fly a *kite*!','Endi esa — *varrak* uchiramiz!'],
  ['Пусть весна принесёт всем добро!','May spring bring goodness to everyone!','Bahor hammaga ezgulik olib kelsin!']],
  panels:[{bg:'mahalla',c:[['rahim','wave',.5,'smileBig']],b:[['caption',0,.5,.08],['speech',1,.5,.24,0]]},
   {bg:'kitchen',c:[['karima','explain',.3,'explaining'],['lola','stand',.72,'awe',1,'exclaim']],b:[['speech',2,.33,.13,0],['shout',3,.72,.36,1]],o:[['prop','kazan',.5,.88,.7]]},
   {bg:'mahalla_night',c:[['timur','think',.5,'tired',0,'zzz']],b:[['think',4,.5,.18,0]]},
   {bg:'mahalla',fx:'flash',c:[['rahim','hooray',.2,'smileBig'],['lola','hooray',.5,'smileLOL'],['timur','hooray',.8,'smile',1]],b:[['shout',5,.5,.12,1]]},
   {bg:'mahalla',fx:'flash',c:[['karima','hooray',.5,'smileBig']],b:[['caption',6,.5,.08]],o:[['prop','kazan',.8,.85,.6]]},
   {bg:'mahalla',c:[['lola','explain',.3,'smile'],['rahim','eat',.72,'eatingHappy',1]],b:[['speech',7,.35,.13,0]],o:[['prop','piala',.52,.88,.4]]},
   {bg:'park',c:[['timur','run',.4,'smileLOL']],b:[['shout',8,.4,.14,0]],o:[['prop','kite',.8,.3,.6]]},
   {bg:'park',c:[['rahim','wave',.2,'smile'],['lola','wave',.5,'smileBig'],['timur','wave',.8,'smile',1]],b:[['speech',9,.5,.12,1]],o:[['prop','kite',.85,.25,.5]]}]},
 {e:'🩺',title:['У врача','At the doctor’s','Shifokor qabulida'],sub:['Анекдот, 4 кадра','Joke, 4 panels','Latifa, 4 kadr'],lines:[
  ['Доктор, у меня *всё* болит!','Doctor, *everything* hurts!','Doktor, *hamma joyim* og‘riyapti!'],
  ['Что именно?','What exactly?','Aynan qayeringiz?'],
  ['Трогаю голову — больно! Живот — больно! Колено — тоже!','I touch my head — ouch! My belly — ouch! My knee — ouch!','Boshimga tegsam — og‘riydi! Qornimga — og‘riydi! Tizzamga ham!'],
  ['Хм…','Hmm…','Hm…'],
  ['У вас просто *сломан палец*!','You just have a *broken finger*!','Sizning shunchaki *barmog‘ingiz singan*!'],
  ['Вот так. Через неделю будет как новенький!','There. In a week it’ll be as good as new!','Mana. Bir haftada yap-yangidek bo‘ladi!'],
  ['А можно мне такую же повязку, как у супергероя?','Can I have a bandage like a superhero?','Menga ham superqahramonnikidek bog‘ich bo‘ladimi?'],
  ['Конечно! И главное правило: не бойся врачей.','Sure! And the main rule: don’t be afraid of doctors.','Albatta! Asosiy qoida: shifokordan qo‘rqma.'],
  ['Спасибо, доктор! Я больше не боюсь!','Thank you, doctor! I’m not scared anymore!','Rahmat, doktor! Endi qo‘rqmayman!']],
  panels:[{bg:'hospital',c:[['dima','cry',.3,'concerned',0,'tears'],['petr','explain',.72,'calm',1]],b:[['speech',0,.3,.12,0],['speech',1,.72,.32,1]]},
   {bg:'hospital',c:[['dima','point',.5,'hectic',0,'sweat']],b:[['speech',2,.5,.14,0]]},
   {bg:'hospital',c:[['petr','scratch',.5,'suspicious',0,'question']],b:[['think',3,.5,.18,0]]},
   {bg:'hospital',c:[['petr','explain',.3,'smileBig'],['dima','facepalm',.72,'awe',1,'shock']],b:[['speech',4,.35,.13,0]]},
   {bg:'hospital',c:[['petr','explain',.3,'smile'],['dima','stand',.72,'calm',1]],b:[['speech',5,.35,.13,0]],o:[['prop','firstaid',.52,.85,.4]]},
   {bg:'hospital',c:[['dima','explain',.5,'cheeky',0,'sparkle']],b:[['speech',6,.5,.14,0]]},
   {bg:'hospital',c:[['petr','thumbsup',.5,'smileBig']],b:[['speech',7,.5,.14,0]]},
   {bg:'city',fx:'flash',c:[['dima','hooray',.4,'smileLOL'],['petr','wave',.78,'smile',1]],b:[['shout',8,.4,.13,0]]}]},
 {e:'🎄',title:['Новогоднее чудо','New Year’s magic','Yangi yil mo‘jizasi'],sub:['Праздник, 4 кадра','Holiday, 4 panels','Bayram, 4 kadr'],lines:[
  ['31 декабря…','December 31st…','31-dekabr…'],
  ['Дедушка Мороз, ты *настоящий*?','Grandfather Frost, are you *real*?','Qorbobo, siz *haqiqiymisiz*?'],
  ['Конечно, настоящий!','Of course I am!','Albatta, haqiqiyman!'],
  ['А как ты успеваешь ко *всем* детям за одну ночь?','How do you visit *all* the children in one night?','Qanday qilib bir kechada *hamma* bolalarga ulgurasiz?'],
  ['Это *волшебство*! А ещё я ему помогаю!','It’s *magic*! And I help him too!','Bu *sehr*! Men ham unga yordam beraman!'],
  ['С Новым годом!!!','Happy New Year!!!','Yangi yil muborak!!!'],
  ['УРА!','HOORAY!','URA!'],
  ['А ты загадала желание?','Have you made a wish?','Orzu qildingmi?'],
  ['Хочу, чтобы бабушка была *здорова*!','I wish for Grandma to be *healthy*!','Buvim *sog‘* bo‘lishlarini xohlayman!'],
  ['Какое доброе желание! Оно обязательно сбудется.','What a kind wish! It will surely come true.','Qanday ezgu orzu! U albatta amalga oshadi.'],
  ['Под ёлкой — подарки для всех!','Presents under the tree for everyone!','Archa tagida — hammaga sovg‘alar!']],
  panels:[{bg:'winter',c:[['sabina','wave',.3,'cute'],['ded_moroz','wave',.72,'smileBig',1]],b:[['caption',0,.5,.07],['speech',1,.3,.22,0],['speech',2,.72,.4,1]]},
   {bg:'winter',c:[['sabina','point',.3,'cute',0,'question'],['ded_moroz','think',.72,'smile',1,'sparkle']],b:[['speech',3,.35,.13,0]]},
   {bg:'winter',c:[['snegurochka','explain',.3,'smileBig',0,'sparkle'],['ded_moroz','thumbsup',.72,'smileBig',1]],b:[['speech',4,.35,.13,0]]},
   {bg:'winter',fx:'flash',c:[['sabina','hooray',.2,'smileLOL'],['ded_moroz','hooray',.5,'smileBig'],['snegurochka','hooray',.8,'smile',1]],b:[['shout',5,.5,.12,1]],o:[['sfx',6,.85,.4,.6]]},
   {bg:'winter',c:[['snegurochka','explain',.3,'smile'],['sabina','think',.72,'cute',1]],b:[['speech',7,.35,.13,0]]},
   {bg:'winter',c:[['sabina','explain',.5,'smileBig',0,'hearts']],b:[['speech',8,.5,.14,0]]},
   {bg:'winter',c:[['ded_moroz','thumbsup',.5,'lovingGrin1',0,'sparkle']],b:[['speech',9,.5,.14,0]]},
   {bg:'livingroom',fx:'flash',c:[['sabina','hooray',.3,'smileLOL'],['karima','hug',.72,'lovingGrin1',1,'hearts']],b:[['caption',10,.5,.08]],o:[['prop','gift',.52,.88,.5]]}]},
 {e:'🎣',title:['Рыбалка','Gone fishing','Baliq ovi'],sub:['Комедия, 4 кадра','Comedy, 4 panels','Komediya, 4 kadr'],lines:[
  ['Утро. Озеро. Тишина.','Morning. A lake. Silence.','Tong. Ko‘l. Jimjitlik.'],
  ['Три часа — и ни одной рыбки…','Three hours and not a single fish…','Uch soat — birorta ham baliq yo‘q…'],
  ['КЛЮЁТ! Тяни!','A BITE! Pull!','TUTDI! Tort!'],
  ['Ну хоть кот доволен.','Well, at least the cat is happy.','Hech bo‘lmasa mushuk xursand.'],
  ['ПЛЮХ!','SPLASH!','SHALOP!'],
  ['Давай отпустим рыбку — она ещё маленькая.','Let’s let the fish go — it’s still small.','Baliqchani qo‘yib yuboraylik — u hali kichkina.'],
  ['Плыви, рыбка! Подрастай!','Swim away, little fish! Grow big!','Suz, baliqcha! Katta bo‘l!'],
  ['Зато у нас есть бутерброды!','At least we have sandwiches!','Hech bo‘lmasa buterbrodlarimiz bor!'],
  ['Главное — не улов, а *день вместе*.','What matters isn’t the catch — it’s the *day together*.','Asosiysi — ov emas, *birga o‘tkazgan kun*.']],
  panels:[{bg:'lake',c:[['andrey','sitfloor',.35,'calm'],['oleg','sitfloor',.7,'smile',1]],b:[['caption',0,.5,.08]]},
   {bg:'lake',c:[['oleg','sitfloor',.5,'tired',0,'zzz']],b:[['think',1,.5,.2,0]]},
   {bg:'lake',fx:'speed',c:[['andrey','jump',.5,'driven',0,'exclaim']],b:[['shout',2,.5,.14,0]],o:[['sfx',4,.8,.6,.6]]},
   {bg:'lake',c:[['andrey','facepalm',.25,'tired'],['oleg','shrug',.62,'smileTeethGap',1]],b:[['speech',3,.55,.13,1]],o:[['animal','blackcat',.86,1,.5]]},
   {bg:'lake',c:[['oleg','explain',.3,'smile'],['andrey','stand',.72,'calm',1]],b:[['speech',5,.35,.13,0]],o:[['animal','fish',.55,.8,.3]]},
   {bg:'lake',c:[['andrey','wave',.4,'smileBig',0,'hearts']],b:[['speech',6,.4,.14,0]],o:[['animal','fish',.8,.85,.3]]},
   {bg:'lake',c:[['oleg','eat',.3,'eatingHappy'],['andrey','eat',.72,'smileBig',1]],b:[['speech',7,.5,.13,0]],o:[['prop','bread',.52,.88,.4]]},
   {bg:'lake',fx:'vignette',c:[['oleg','sitfloor',.3,'smile'],['andrey','sitfloor',.7,'smile',1]],b:[['caption',8,.5,.08]]}]},
 {e:'🚀',title:['Космический ужин','Space dinner','Koinotda kechki ovqat'],sub:['Фантастика, 4 кадра','Sci-fi, 4 panels','Fantastika, 4 kadr'],lines:[
  ['Космическая станция. 2050 год.','A space station. Year 2050.','Kosmik stansiya. 2050-yil.'],
  ['Смотри — Земля!','Look — Earth!','Qara — Yer!'],
  ['А где наш дом?','Where’s our house?','Bizning uyimiz qayerda?'],
  ['Вон там, под облаками.','Right there, under the clouds.','Ana u yerda, bulutlar ostida.'],
  ['Мама сказала вернуться к ужину…','Mum said to be home for dinner…','Oyim kechki ovqatga qayting degan edi…'],
  ['До ужина — *400 000 км*!','Dinner is *400,000 km* away!','Kechki ovqatgacha — *400 000 km*!'],
  ['Командир! Есть ужин в тюбиках!','Commander! There’s dinner in tubes!','Komandir! Tyubikda kechki ovqat bor!'],
  ['Плов… в тюбике?!','Plov… in a tube?!','Palov… tyubikdami?!'],
  ['Ням! Почти как мамин!','Yum! Almost like Mum’s!','Mazza! Deyarli oyimnikidek!'],
  ['Мама, привет с орбиты! Ужинаем!','Hi Mum, greetings from orbit! We’re having dinner!','Oyi, orbitadan salom! Kechki ovqat qilyapmiz!']],
  panels:[{bg:'space',c:[['minji','fly',.5,'awe']],b:[['caption',0,.5,.08],['shout',1,.5,.26,0]]},
   {bg:'space',c:[['pierre','fly',.3,'smile'],['minji','point',.72,'explaining',1]],b:[['speech',2,.3,.12,0],['speech',3,.72,.32,1]]},
   {bg:'space',c:[['pierre','think',.5,'concerned',0,'sweatdrop']],b:[['think',4,.5,.18,0]]},
   {bg:'space',fx:'dots',c:[['minji','facepalm',.3,'smileLOL'],['pierre','cry',.72,'concernedFear',1,'tears']],b:[['speech',5,.35,.13,0]]},
   {bg:'space',c:[['minji','explain',.4,'smileBig']],b:[['speech',6,.4,.14,0]],o:[['prop','waterbottle',.8,.6,.4]]},
   {bg:'space',c:[['pierre','stand',.5,'awe',0,'question']],b:[['shout',7,.5,.14,0]]},
   {bg:'space',c:[['pierre','eat',.3,'eatingHappy',0,'hearts'],['minji','eat',.72,'smileLOL',1]],b:[['speech',8,.35,.13,0]]},
   {bg:'space',fx:'flash',c:[['minji','wave',.3,'smileBig'],['pierre','wave',.72,'smileBig',1]],b:[['speech',9,.5,.12,0]],o:[['prop','tablet',.52,.6,.4]]}]},
 {e:'📝',title:['Контрольная','The test','Nazorat ishi'],sub:['Школа, 4 кадра','School, 4 panels','Maktab, 4 kadr'],lines:[
  ['Сегодня — *контрольная*!','Today we have a *test*!','Bugun — *nazorat ishi*!'],
  ['Как?! Сегодня?!','What?! Today?!','Qanday?! Bugunmi?!'],
  ['Что же такое фотосинтез?..','What on earth is photosynthesis?..','Fotosintez o‘zi nima edi?..'],
  ['Подсказать?','Need a hint?','Aytib yuboraymi?'],
  ['Нет! Я *сам*!','No! I’ll do it *myself*!','Yo‘q! O‘zim *yechaman*!'],
  ['Бекзод — пятёрка! Молодец, сам решил!','Bekzod gets an A! Well done, all by yourself!','Bekzod — besh! Barakalla, o‘zing yechibsan!'],
  ['Как ты так хорошо подготовился?','How did you prepare so well?','Qanday qilib bunchalik yaxshi tayyorlanding?'],
  ['Каждый день читал по *одной* странице!','I read *one* page every day!','Har kuni *bitta* sahifadan o‘qidim!'],
  ['Давай вместе готовиться к следующей!','Let’s study together for the next one!','Keyingisiga birga tayyorlanamiz!'],
  ['Учиться вместе — это здорово!','Learning together is great!','Birga o‘qish — zo‘r!']],
  panels:[{bg:'classroom',c:[['natalya','explain',.3,'serious'],['bekzod:teen','stand',.72,'awe',1,'shock']],b:[['speech',0,.33,.13,0],['shout',1,.72,.36,1]]},
   {bg:'classroom',c:[['bekzod:teen','think',.5,'concernedFear',0,'sweat']],b:[['think',2,.5,.18,0]]},
   {bg:'classroom',c:[['madina','sneak',.3,'cheeky'],['bekzod:teen','stop',.72,'driven',1]],b:[['whisper',3,.3,.13,0],['speech',4,.72,.32,1]]},
   {bg:'classroom',fx:'flash',c:[['natalya','thumbsup',.3,'smileBig'],['bekzod:teen','hooray',.72,'smileLOL',1,'sparkle']],b:[['speech',5,.38,.13,0]]},
   {bg:'school',c:[['madina','explain',.3,'awe'],['bekzod:teen','stand',.72,'smile',1]],b:[['speech',6,.35,.13,0]]},
   {bg:'school',c:[['bekzod:teen','explain',.5,'smileBig',0,'idea']],b:[['speech',7,.5,.14,0]],o:[['prop','book',.8,.6,.4]]},
   {bg:'library',c:[['madina','point',.3,'smile'],['bekzod:teen','thumbsup',.72,'smileBig',1]],b:[['speech',8,.35,.13,0]],o:[['prop','book',.52,.82,.4]]},
   {bg:'library',fx:'flash',c:[['madina','hooray',.3,'smileLOL'],['bekzod:teen','hooray',.72,'smileBig',1]],b:[['caption',9,.5,.08]]}]},
 {e:'🐶',title:['Где Тузик?','Where’s Buddy?','Tuzik qayerda?'],sub:['Добрая история, 4 кадра','Feel-good, 4 panels','Iliq hikoya, 4 kadr'],lines:[
  ['Мой Тузик потерялся!','My dog Buddy is lost!','Tuzigim yo‘qolib qoldi!'],
  ['Не плачьте, найдём!','Don’t cry, we’ll find him!','Yig‘lamang, topamiz!'],
  ['Вон он — у мороженого!','There he is — by the ice cream!','Ana u — muzqaymoq yonida!'],
  ['Тузик! Больше не убегай!','Buddy! Never run away again!','Tuzik! Boshqa qochib ketma!'],
  ['Тузику нужен ошейник с адресом!','Buddy needs a collar with our address!','Tuzikka manzil yozilgan bo‘yinbog‘ kerak!'],
  ['Теперь его всегда найдут и вернут.','Now he’ll always be found and brought home.','Endi uni doim topib, qaytarishadi.'],
  ['И гулять будем только *на поводке*!','And we’ll walk him only *on a lead*!','Endi faqat *bog‘ich* bilan sayr qilamiz!'],
  ['Гав!','Woof!','Vov!']],
  panels:[{bg:'city',c:[['aigerim','cry',.5,'concerned',0,'tears']],b:[['shout',0,.5,.14,0]]},
   {bg:'city',c:[['ulugbek','salute',.3,'serious'],['aigerim','stand',.72,'concerned',1]],b:[['speech',1,.3,.13,0]]},
   {bg:'park',c:[['ulugbek','point',.3,'smileBig']],b:[['speech',2,.35,.13,0]],o:[['prop','icecream',.8,.7,.5],['animal','dog',.78,1,.85]]},
   {bg:'park',c:[['aigerim','hug',.4,'lovingGrin1',0,'hearts']],b:[['speech',3,.45,.13,0]],o:[['animal','dog',.78,1,.85]]},
   {bg:'livingroom',c:[['aigerim','explain',.4,'smile']],b:[['speech',4,.4,.14,0]],o:[['animal','dog',.78,1,.85]]},
   {bg:'livingroom',c:[['ulugbek','thumbsup',.4,'smile']],b:[['speech',5,.4,.14,0]],o:[['animal','dog',.78,1,.85]]},
   {bg:'park',c:[['aigerim','walk',.35,'smileBig']],b:[['speech',6,.38,.14,0]],o:[['animal','dog',.75,1,.85]]},
   {bg:'park',fx:'flash',c:[['aigerim','hug',.35,'lovingGrin1',0,'hearts']],o:[['animal','dog',.72,1,.85],['sfx',7,.75,.35,.6]]}]},
 {e:'🦸',title:['Супергерой','The superhero','Superqahramon'],sub:['Комедия, 4 кадра','Comedy, 4 panels','Komediya, 4 kadr'],lines:[
  ['Ой! Мой кот на дереве!','Oh no! My cat is up a tree!','Voy! Mushugim daraxtga chiqib qoldi!'],
  ['Не бойтесь! Я спасу!','Fear not! I’ll save him!','Qo‘rqmang! Men qutqaraman!'],
  ['ВЖУХ!','WHOOSH!','VJUX!'],
  ['БАМ!','BAM!','BAM!'],
  ['А кот спустился сам.','Meanwhile, the cat climbed down by itself.','Mushuk esa o‘zi tushib keldi.'],
  ['Спасибо, сынок!','Thank you, sonny!','Rahmat, o‘g‘lim!'],
  ['Выпей чаю, сынок. Ты не ушибся?','Have some tea, sonny. Are you hurt?','Choy ich, o‘g‘lim. Lat yemadingmi?'],
  ['Немножко… Я хотел помочь.','A little… I wanted to help.','Ozgina… Yordam bermoqchi edim.'],
  ['Ты и помог: ты *добрый*. А это важнее всего!','And you did: you’re *kind*. That matters most!','Yordam berding ham: sen *mehribonsan*. Bu eng muhimi!'],
  ['Настоящий герой — тот, кто добр к людям!','A real hero is someone who is kind to people!','Haqiqiy qahramon — odamlarga mehribon kishi!']],
  panels:[{bg:'park',c:[['karima','lookup',.3,'concernedFear',0,'exclaim']],b:[['shout',0,.32,.12,0]],o:[['prop','tree',.75,.6,1.4],['animal','cat',.75,.42,.35]]},
   {bg:'city',fx:'speed',c:[['ruslan','fly',.5,'driven']],b:[['speech',1,.5,.13,0]],o:[['sfx',2,.82,.62,.6]]},
   {bg:'park',c:[['ruslan','fall',.5,'concernedFear',0,'dizzy']],o:[['prop','tree',.5,.55,1.4],['sfx',3,.75,.25,.7]]},
   {bg:'park',c:[['karima','hug',.3,'lovingGrin1',0,'hearts'],['ruslan','lie',.62,'tired',1,'dizzy']],b:[['caption',4,.5,.07],['speech',5,.33,.24,0]],o:[['animal','cat',.42,1,.35]]},
   {bg:'cozyroom',c:[['karima','explain',.3,'concerned'],['ruslan','sitfloor',.72,'tired',1,'dizzy']],b:[['speech',6,.35,.13,0]],o:[['prop','piala',.52,.88,.4]]},
   {bg:'cozyroom',c:[['ruslan','scratch',.5,'concerned',0,'blush']],b:[['speech',7,.5,.14,0]]},
   {bg:'cozyroom',c:[['karima','hug',.4,'lovingGrin1',0,'hearts']],b:[['speech',8,.4,.14,0]],o:[['animal','cat',.8,1,.35]]},
   {bg:'city',fx:'flash',c:[['ruslan','salute',.5,'smileBig',0,'sparkle']],b:[['caption',9,.5,.08]]}]},
 {cat:'nature',e:'⛰️',title:['Поход в горы','A hike in the mountains','Toqqa sayohat'],sub:['Классный поход','Class trip','Sinf sayohati'],lines:[
  ['Наш класс идёт в поход!','Our class is going on a hike!','Sinfimiz sayohatga chiqmoqda!'],
  ['Держимся вместе и не отстаём!','Stay together, nobody falls behind!','Birga yuramiz, hech kim orqada qolmasin!'],
  ['Далеко ещё?..','Are we there yet?..','Hali uzoqmi?..'],
  ['Смотрите, какая *красота*!','Look how *beautiful* it is!','Qaranglar, qanday *go‘zal*!'],
  ['Мы дошли до вершины!','We made it to the top!','Cho‘qqiga chiqdik!'],
  ['Привал! Пьём воду и отдыхаем.','Rest stop! Drink some water and rest.','Dam olamiz! Suv ichib, hordiq chiqaramiz.'],
  ['Смотрите — *орёл*!','Look — an *eagle*!','Qaranglar — *burgut*!'],
  ['Ставим палатки, скоро стемнеет.','Let’s pitch the tents, it’ll be dark soon.','Chodir tikamiz, tez orada qorong‘i tushadi.'],
  ['Сколько звёзд! Лучший поход в моей жизни!','So many stars! Best trip of my life!','Qancha yulduz! Hayotimdagi eng zo‘r sayohat!']],
  panels:[{bg:'mountains',c:[['natalya','point',.3,'smile'],['alisher','walk',.72,'smileBig',1]],b:[['caption',0,.5,.07],['speech',1,.33,.24,0]]},
   {bg:'mountains',c:[['alisher','walk',.5,'tired',0,'sweat']],b:[['speech',2,.5,.14,0]]},
   {bg:'mountains',c:[['madina','point',.5,'awe',0,'sparkle']],b:[['shout',3,.5,.14,0]]},
   {bg:'sky',fx:'flash',c:[['natalya','hooray',.2,'smileBig'],['alisher','hooray',.5,'smileLOL'],['madina','hooray',.8,'smile',1]],b:[['shout',4,.5,.12,1]]},
   {bg:'mountains',c:[['natalya','explain',.3,'smile'],['alisher','sitfloor',.72,'tired',1,'sweat']],b:[['speech',5,.38,.13,0]],o:[['prop','waterbottle',.85,.8,.35]]},
   {bg:'mountains',c:[['madina','lookup',.35,'awe',0,'exclaim']],b:[['shout',6,.35,.13,0]],o:[['animal','eagle',.75,.4,.45]]},
   {bg:'forest',c:[['alisher','explain',.3,'driven'],['madina','squat',.72,'smile',1]],b:[['speech',7,.38,.13,0]],o:[['prop','tent',.62,.62,.9]]},
   {bg:'forest_night',c:[['alisher','sitfloor',.25,'smileBig'],['natalya','sitfloor',.52,'smile'],['madina','sitfloor',.8,'awe',1,'sparkle']],b:[['speech',8,.5,.12,2]],o:[['prop','campfire',.52,.92,.5]]}]},
 {cat:'nature',e:'🏞️',title:['На речке','At the river','Daryo bo‘yida'],sub:['Правила у воды','Safety by water','Suvdagi qoidalar'],lines:[
  ['Летом мы поехали на речку.','In summer we went to the river.','Yozda daryoga bordik.'],
  ['Кто первый в воду?','Last one in is a rotten egg!','Kim birinchi suvga tushadi?'],
  ['Стой! Здесь *глубоко*! Купаемся только со взрослыми!','Stop! It’s *deep* here! Only swim with grown-ups!','To‘xta! Bu yer *chuqur*! Faqat kattalar bilan cho‘milamiz!'],
  ['Хорошо! Буду плавать у берега, рядом с папой.','OK! I’ll swim near the shore, next to Dad.','Mayli! Qirg‘oq yonida, dadam bilan suzaman.'],
  ['А я построю замок из песка!','And I’ll build a sand castle!','Men esa qumdan qal’a quraman!'],
  ['Проголодались? Время *пикника*!','Hungry? Time for a *picnic*!','Qorningiz ochdimi? *Piknik* vaqti!'],
  ['Арбуз — самый *летний* фрукт!','Watermelon is the most *summery* fruit!','Tarvuz — eng *yozgi* meva!'],
  ['Мусор не оставляем — забираем с собой!','We don’t leave rubbish — we take it with us!','Axlatni qoldirmaymiz — o‘zimiz bilan olib ketamiz!'],
  ['Какой хороший день! Приедем ещё!','What a great day! Let’s come again!','Qanday yaxshi kun! Yana kelamiz!']],
  panels:[{bg:'lake',c:[['aziz','wave',.3,'smileBig'],['dilnoza','wave',.72,'smile',1]],b:[['caption',0,.5,.08]]},
   {bg:'lake',fx:'speed',c:[['aziz','run',.5,'driven']],b:[['shout',1,.5,.14,0]]},
   {bg:'lake',c:[['sanjar','stop',.3,'serious'],['aziz','stand',.72,'concerned',1,'sweatdrop']],b:[['speech',2,.35,.13,0]]},
   {bg:'lake',c:[['aziz','thumbsup',.3,'smile'],['dilnoza','squat',.72,'smileBig',1]],b:[['speech',3,.32,.12,0],['speech',4,.72,.36,1]]},
   {bg:'lake',c:[['sanjar','explain',.3,'smileBig'],['aziz','hooray',.72,'smileLOL',1]],b:[['speech',5,.35,.13,0]],o:[['prop','dishes',.52,.88,.5]]},
   {bg:'lake',c:[['aziz','eat',.4,'eatingHappy',0,'hearts']],b:[['speech',6,.42,.13,0]],o:[['prop','watermelon',.8,.85,.5]]},
   {bg:'lake',c:[['dilnoza','point',.3,'serious'],['aziz','thumbsup',.72,'smile',1]],b:[['speech',7,.35,.13,0]],o:[['prop','shopbag',.55,.88,.45]]},
   {bg:'lake',fx:'vignette',c:[['sanjar','wave',.2,'smile'],['aziz','wave',.5,'smileBig'],['dilnoza','wave',.8,'smile',1]],b:[['speech',8,.5,.12,1]]}]},
 {cat:'nature',e:'🏕️',title:['Береги лес','Protect the forest','O‘rmonni asra'],sub:['Экология','Ecology','Ekologiya'],lines:[
  ['Вечер. Мы с папой в лесу у костра.','Evening. We’re by the campfire with Dad.','Kechqurun. Dadam bilan o‘rmonda gulxan yonidamiz.'],
  ['Давай оставим мусор тут, никто не увидит.','Let’s leave the rubbish here, nobody will see.','Axlatni shu yerda qoldiraylik, hech kim ko‘rmaydi.'],
  ['Нет! Природу нужно *беречь*!','No! We must *protect* nature!','Yo‘q! Tabiatni *asrash* kerak!'],
  ['Соберём всё в пакет и потушим костёр.','Let’s bag everything and put out the fire.','Hammasini paketga yig‘amiz va gulxanni o‘chiramiz.'],
  ['Лес сказал бы нам *спасибо*!','The forest would say *thank you*!','O‘rmon bizga *rahmat* derdi!'],
  ['Утром мы нашли птенца, выпавшего из гнезда.','In the morning we found a chick that fell from its nest.','Ertalab uyadan tushib qolgan qushchani topdik.'],
  ['Аккуратно вернём его в гнездо.','Let’s gently put it back in the nest.','Uni ehtiyotlab uyasiga qaytaramiz.'],
  ['Чик-чирик!','Tweet-tweet!','Chiq-chiriq!'],
  ['Мы друзья леса!','We’re friends of the forest!','Biz o‘rmonning do‘stlarimiz!']],
  panels:[{bg:'forest_night',c:[['timur','sitfloor',.2,'smile'],['sanjar','sitfloor',.5,'smile'],['alisher','sitfloor',.8,'smile',1]],b:[['caption',0,.5,.08]],o:[['prop','campfire',.35,.9,.5],['prop','tent',.82,.55,.7]]},
   {bg:'forest',c:[['timur','shrug',.3,'cheeky'],['alisher','stop',.72,'serious',1]],b:[['speech',1,.3,.12,0],['shout',2,.72,.34,1]]},
   {bg:'forest',c:[['alisher','squat',.5,'driven']],b:[['speech',3,.5,.14,0]],o:[['prop','shopbag',.75,.85,.5]]},
   {bg:'forest',fx:'flash',c:[['timur','thumbsup',.3,'smileBig'],['alisher','thumbsup',.72,'smileBig',1]],b:[['speech',4,.5,.13,0]]},
   {bg:'forest',c:[['timur','squat',.4,'concerned']],b:[['caption',5,.5,.08]],o:[['animal','sparrow',.75,1,.3]]},
   {bg:'forest',c:[['sanjar','explain',.3,'smile'],['timur','stand',.72,'smile',1]],b:[['speech',6,.35,.13,0]],o:[['prop','ladder',.55,.7,.7]]},
   {bg:'forest',c:[['timur','lookup',.4,'smileBig',0,'hearts']],o:[['animal','sparrow',.75,.35,.35],['sfx',7,.75,.6,.6]]},
   {bg:'forest',fx:'flash',c:[['timur','hooray',.25,'smileLOL'],['sanjar','thumbsup',.52,'smile'],['alisher','hooray',.8,'smileBig',1]],b:[['shout',8,.5,.12,0]]}]},
 {cat:'nature',e:'🐄',title:['Каникулы на ферме','Holidays on the farm','Fermadagi ta’til'],sub:['Деревня, животные','Village, animals','Qishloq, hayvonlar'],lines:[
  ['Каникулы у дедушки в кишлаке.','Holidays at Grandpa’s in the village.','Ta’til — bobomnikida, qishloqda.'],
  ['Корова даёт нам молоко, а куры — яйца.','The cow gives us milk and the hens give eggs.','Sigir bizga sut, tovuqlar esa tuxum beradi.'],
  ['Ух ты! А можно покормить?','Wow! Can I feed them?','Voy! Boqsam bo‘ladimi?'],
  ['Помогите! *Гусь* за мной гонится!','Help! The *goose* is chasing me!','Yordam bering! *G‘oz* meni quvlayapti!'],
  ['Зато цыплята со мной дружат!','At least the chicks like me!','Jo‘jalar esa men bilan do‘st!'],
  ['КУКАРЕКУ!','COCK-A-DOODLE-DOO!','QU-QU-RI-QU!'],
  ['В деревне утро начинается *очень* рано…','In the village mornings start *very* early…','Qishloqda tong *juda* erta boshlanadi…'],
  ['Помогаю дедушке в огороде!','I’m helping Grandpa in the garden!','Bobomga tomorqada yordam beryapman!'],
  ['Я обязательно приеду *следующим летом*!','I’ll definitely come back *next summer*!','*Keyingi yozda* albatta kelaman!']],
  panels:[{bg:'kishlak',c:[['rahim','wave',.3,'smileBig'],['sabina','wave',.72,'smile',1]],b:[['caption',0,.5,.08]]},
   {bg:'farm',c:[['rahim','explain',.3,'explaining'],['sabina','stand',.72,'awe',1]],b:[['speech',1,.33,.13,0],['speech',2,.72,.36,1]],o:[['animal','cow',.55,1,.6]]},
   {bg:'farm',fx:'speed',c:[['sabina','run',.35,'fear',0,'sweat']],b:[['shout',3,.4,.14,0]],o:[['animal','goose',.8,1,.5]]},
   {bg:'farm',c:[['sabina','sitfloor',.45,'smileLOL',0,'hearts']],b:[['speech',4,.45,.15,0]],o:[['animal','chick',.2,1,.3],['animal','chick',.78,1,.3]]},
   {bg:'kishlak',c:[['sabina','stand',.35,'tired',0,'zzz']],b:[['think',6,.4,.14,0]],o:[['animal','rooster',.78,1,.5],['sfx',5,.78,.3,.7]]},
   {bg:'farm',c:[['rahim','point',.3,'smile'],['sabina','squat',.72,'smileBig',1]],b:[['speech',7,.68,.13,1]],o:[['prop','shovel',.5,.75,.6],['prop','carrot',.85,.88,.35]]},
   {bg:'kishlak',c:[['sabina','hooray',.3,'smileLOL',0,'hearts']],o:[['animal','donkey',.72,1,.8]]},
   {bg:'kishlak',c:[['rahim','hug',.3,'lovingGrin1'],['sabina','hug',.66,'smileBig',1,'hearts']],b:[['speech',8,.5,.13,1]]}]},
 {cat:'nature',e:'🦒',title:['В зоопарке','At the zoo','Hayvonot bog‘ida'],sub:['Экскурсия','School trip','Ekskursiya'],lines:[
  ['Экскурсия в зоопарк!','A trip to the zoo!','Hayvonot bog‘iga ekskursiya!'],
  ['Какой *длинный* жираф!','What a *tall* giraffe!','Qanday *baland* jirafa!'],
  ['Можно дать обезьянке банан?','Can I give the monkey a banana?','Maymunchaga banan bersam bo‘ladimi?'],
  ['Нет! Животных кормить *нельзя* — им это вредно.','No! Feeding the animals is *not allowed* — it’s bad for them.','Yo‘q! Hayvonlarni boqish *mumkin emas* — bu ularga zarar.'],
  ['Понятно! Тогда я её нарисую!','Got it! Then I’ll draw her instead!','Tushundim! Unda uni rasmini chizaman!'],
  ['Слон — самое большое животное на суше!','The elephant is the biggest land animal!','Fil — quruqlikdagi eng katta hayvon!'],
  ['Пингвины не умеют летать, но отлично *плавают*!','Penguins can’t fly, but they’re great *swimmers*!','Pingvinlar ucholmaydi, lekin zo‘r *suzadi*!'],
  ['Р-Р-Р!','R-R-ROAR!','R-R-R!'],
  ['Домой мы ехали усталые, но счастливые.','We rode home tired but happy.','Uyga charchagan, lekin xursand qaytdik.']],
  panels:[{bg:'park',c:[['natalya','point',.3,'smile'],['timur','hooray',.72,'smileBig',1]],b:[['shout',0,.33,.13,0]]},
   {bg:'park',c:[['timur','lookup',.3,'awe',0,'exclaim']],b:[['shout',1,.3,.13,0]],o:[['animal','giraffe',.72,1,1.1]]},
   {bg:'park',c:[['madina','explain',.3,'cute'],['natalya','stop',.72,'serious',1]],b:[['speech',2,.3,.12,0],['speech',3,.68,.34,1]],o:[['animal','monkey',.5,1,.4]]},
   {bg:'park',c:[['madina','thumbsup',.4,'smileBig',0,'idea']],b:[['speech',4,.4,.14,0]],o:[['prop','palette',.72,.75,.5],['animal','monkey',.82,1,.4]]},
   {bg:'park',c:[['natalya','explain',.3,'explaining']],b:[['speech',5,.35,.13,0]],o:[['animal','elephant',.7,1,1.6]]},
   {bg:'beach',c:[['timur','point',.3,'awe']],b:[['speech',6,.4,.13,0]],o:[['animal','penguin',.75,1,.6]]},
   {bg:'park',fx:'speed',c:[['madina','jump',.3,'fear',0,'shock']],o:[['animal','lion',.72,1,.8],['sfx',7,.75,.25,.7]]},
   {bg:'bus',c:[['timur','sit',.3,'tired',0,'zzz'],['madina','sit',.72,'smile',1,'hearts']],b:[['caption',8,.5,.08]]}]},
 {cat:'city',e:'🏛️',title:['Поход в музей','A visit to the museum','Muzeyga sayohat'],sub:['История, экскурсия','History trip','Tarix, ekskursiya'],lines:[
  ['Экскурсия в исторический музей.','A trip to the history museum.','Tarix muzeyiga ekskursiya.'],
  ['Этой карте больше *трёхсот лет*!','This map is over *300 years old*!','Bu xarita *300 yildan* ham eski!'],
  ['Ого! А можно потрогать?','Wow! Can I touch it?','Voy! Ushlab ko‘rsam bo‘ladimi?'],
  ['В музее экспонаты *руками не трогают*.','In a museum we *don’t touch* the exhibits.','Muzeyda eksponatlarga *qo‘l tekkizilmaydi*.'],
  ['Решено: я стану *археологом*!','That’s it: I’m going to be an *archaeologist*!','Qaror qildim: men *arxeolog* bo‘laman!'],
  ['А это — *древняя посуда*. В ней варили плов!','And this is *ancient pottery*. They cooked plov in it!','Bu esa — *qadimiy idish*. Unda palov pishirishgan!'],
  ['Можно сфотографировать?','May I take a photo?','Suratga olsam bo‘ladimi?'],
  ['Можно, только *без вспышки*.','Yes, but *no flash*.','Mumkin, faqat *chaqnoqsiz*.'],
  ['Мама, я столько узнал! Пойдём в музей вместе?','Mum, I learned so much! Let’s go to the museum together?','Oyi, juda ko‘p narsa bildim! Muzeyga birga boramizmi?']],
  panels:[{bg:'wf:#f5e6c8:#a0703c',c:[['natalya','explain',.3,'smile'],['dima','stand',.72,'smile',1]],b:[['caption',0,.5,.08]],o:[['prop','globe',.5,.62,.6]]},
   {bg:'wf:#f5e6c8:#a0703c',c:[['natalya','point',.3,'explaining']],b:[['speech',1,.38,.13,0]],o:[['prop','map',.74,.5,.9]]},
   {bg:'wf:#f5e6c8:#a0703c',c:[['dima','point',.3,'awe'],['natalya','stop',.72,'serious',1]],b:[['speech',2,.3,.12,0],['speech',3,.7,.33,1]],o:[['prop','map',.5,.45,.6]]},
   {bg:'wf:#f5e6c8:#a0703c',fx:'flash',c:[['dima','hooray',.5,'smileBig',0,'idea']],b:[['shout',4,.5,.14,0]]},
   {bg:'wf:#f5e6c8:#a0703c',c:[['natalya','explain',.3,'explaining'],['dima','stand',.72,'awe',1]],b:[['speech',5,.38,.13,0]],o:[['prop','kazan',.55,.82,.6]]},
   {bg:'wf:#f5e6c8:#a0703c',c:[['dima','explain',.3,'cute'],['natalya','thumbsup',.72,'smile',1]],b:[['speech',6,.3,.12,0],['speech',7,.7,.33,1]],o:[['prop','camera',.5,.62,.35]]},
   {bg:'wf:#f5e6c8:#a0703c',fx:'flash',c:[['dima','stand',.5,'smileBig',0,'sparkle']],o:[['prop','camera',.68,.5,.45]]},
   {bg:'livingroom',c:[['dima','explain',.3,'smileBig'],['lola','stand',.72,'smile',1]],b:[['speech',8,.38,.13,0]]}]},
 {cat:'city',e:'💊',title:['В аптеке','At the pharmacy','Dorixonada'],sub:['Забота о близких','Caring for family','Yaqinlarga g‘amxo‘rlik'],lines:[
  ['У бабушки разболелась голова…','Grandma has a headache…','Buvimning boshi og‘rib qoldi…'],
  ['Здравствуйте! Мне нужно лекарство для бабушки.','Hello! I need some medicine for my grandma.','Assalomu alaykum! Buvim uchun dori kerak.'],
  ['Вот. Но лекарства даёт только *взрослый* — отдай маме.','Here. But only a *grown-up* gives medicine — give it to Mum.','Mana. Lekin dorini faqat *kattalar* beradi — oyingga ber.'],
  ['Мама, вот лекарство. А я заварила бабушке чай!','Mum, here’s the medicine. And I made Grandma some tea!','Oyi, mana dori. Men buvimga choy damladim!'],
  ['Спасибо, внученька! Мне уже лучше.','Thank you, sweetheart! I feel better already.','Rahmat, nevarajonim! Ancha yaxshi bo‘ldim.'],
  ['Через три дня…','Three days later…','Uch kundan keyin…'],
  ['Бабушка, ты *выздоровела*!','Grandma, you’re *better*!','Buvijon, *tuzaldingiz*!'],
  ['Это потому, что ты обо мне заботилась!','That’s because you looked after me!','Chunki sen menga g‘amxo‘rlik qilding!'],
  ['Пойдём гулять в парк!','Let’s go for a walk in the park!','Parkka sayr qilgani boramiz!']],
  panels:[{bg:'cozyroom',c:[['karima','facepalm',.3,'tired',0,'sick'],['sabina','stand',.72,'concerned',1]],b:[['caption',0,.5,.08]]},
   {bg:'shop',c:[['sabina','explain',.3,'smile'],['shahnoza','stand',.72,'smile',1]],b:[['speech',1,.33,.13,0]]},
   {bg:'shop',c:[['shahnoza','explain',.5,'explaining']],b:[['speech',2,.5,.14,0]],o:[['prop','pills',.8,.75,.5]]},
   {bg:'cozyroom',c:[['sabina','explain',.3,'smileBig'],['karima','hug',.72,'lovingGrin1',1,'hearts']],b:[['speech',3,.3,.12,0],['speech',4,.72,.36,1]],o:[['prop','piala',.5,.88,.4]]},
   {bg:'cozyroom',c:[['karima','stand',.5,'smile']],b:[['caption',5,.5,.08]]},
   {bg:'cozyroom',c:[['sabina','hooray',.3,'smileBig'],['karima','wave',.72,'smileBig',1]],b:[['shout',6,.33,.13,0]]},
   {bg:'cozyroom',c:[['karima','hug',.4,'lovingGrin1',0,'hearts']],b:[['speech',7,.42,.14,0]]},
   {bg:'park',fx:'flash',c:[['karima','walk',.3,'smile'],['sabina','walk',.66,'smileLOL']],b:[['speech',8,.5,.12,1]]}]},
 {cat:'city',e:'🦷',title:['У стоматолога','At the dentist','Tish shifokorida'],sub:['Не бойся врача','Don’t fear the doctor','Shifokordan qo‘rqma'],lines:[
  ['Ой! Зуб болит!','Ouch! My tooth hurts!','Voy! Tishim og‘riyapti!'],
  ['Открой рот. Не бойся, я только посмотрю.','Open wide. Don’t worry, I’ll just take a look.','Og‘zingni och. Qo‘rqma, faqat ko‘raman.'],
  ['ВЖЖЖ!','BZZZ!','VJJJ!'],
  ['И это всё? Совсем *не больно*!','Is that it? It didn’t *hurt* at all!','Shumi? Umuman *og‘rimadi*!'],
  ['Чисти зубы утром и вечером — и приходи только в гости!','Brush morning and night — and come back just to say hi!','Ertalab va kechqurun tish yuv — faqat mehmonga kel!'],
  ['Вечером…','That evening…','Kechqurun…'],
  ['Чистим зубы *две минуты*: сверху и снизу!','Brush for *two minutes*: top and bottom!','Tishni *ikki daqiqa* yuvamiz: yuqori va pastini!'],
  ['И поменьше сладкого!','And not too many sweets!','Shirinlikni esa kamroq!'],
  ['Какая красивая улыбка!','What a beautiful smile!','Qanday chiroyli tabassum!']],
  panels:[{bg:'kidsroom',c:[['alisher','cry',.5,'concerned',0,'tears']],b:[['shout',0,.5,.14,0]]},
   {bg:'hospital',c:[['shahnoza','explain',.3,'calm'],['alisher','stand',.72,'fear',1,'sweat']],b:[['speech',1,.35,.13,0]]},
   {bg:'hospital',fx:'vignette',c:[['alisher','stand',.5,'eyesClosed',0,'sweatdrop']],o:[['sfx',2,.75,.3,.7]]},
   {bg:'hospital',c:[['alisher','thumbsup',.3,'smileBig',0,'sparkle'],['shahnoza','wave',.72,'smile',1]],b:[['speech',3,.3,.12,0],['speech',4,.68,.35,1]]},
   {bg:'kidsroom',c:[['alisher','stand',.5,'smile']],b:[['caption',5,.5,.08]]},
   {bg:'kidsroom',c:[['alisher','explain',.5,'smileBig',0,'sparkle']],b:[['speech',6,.5,.14,0]],o:[['prop','cup',.8,.75,.35]]},
   {bg:'kitchen',c:[['lola','stop',.3,'smile'],['alisher','shrug',.72,'cheeky',1]],b:[['speech',7,.35,.13,0]],o:[['prop','icecream',.52,.75,.4]]},
   {bg:'kidsroom',fx:'flash',c:[['lola','thumbsup',.3,'smileBig'],['alisher','hooray',.72,'smileTeethGap',1,'sparkle']],b:[['speech',8,.35,.13,0]]}]},
 {cat:'city',e:'📚',title:['В библиотеке','At the library','Kutubxonada'],sub:['Правила, книги','Rules & books','Qoidalar, kitoblar'],lines:[
  ['МАДИНА! ПРИВЕТ!','MADINA! HI!','MADINA! SALOM!'],
  ['Тсс! В библиотеке говорят *шёпотом*.','Shh! In the library we *whisper*.','Tss! Kutubxonada *pichirlab* gapiriladi.'],
  ['Давай возьмём книгу про космос?','Shall we borrow a book about space?','Koinot haqida kitob olaylikmi?'],
  ['Читать — это *интересно*!','Reading is *fun*!','Kitob o‘qish — *qiziq*!'],
  ['Дома читаем вместе с младшим братом.','At home we read together with my little brother.','Uyda ukam bilan birga o‘qiymiz.'],
  ['А правда, что на Луне есть следы людей?','Is it true there are footprints on the Moon?','Oyda odamlarning izlari bormi, rostmi?'],
  ['Правда! Здесь всё написано.','It’s true! It’s all written here.','Rost! Hammasi shu yerda yozilgan.'],
  ['Книги — это окна в огромный мир!','Books are windows to a huge world!','Kitoblar — ulkan dunyoga ochilgan derazalar!']],
  panels:[{bg:'library',c:[['aziz','wave',.3,'smileBig'],['madina','stand',.72,'awe',1]],b:[['shout',0,.33,.13,0]]},
   {bg:'library',c:[['natalya','stop',.5,'serious']],b:[['whisper',1,.5,.14,0]]},
   {bg:'library',c:[['madina','explain',.3,'cute'],['aziz','think',.72,'smile',1]],b:[['whisper',2,.33,.13,0]],o:[['prop','book',.72,.55,.4]]},
   {bg:'library',c:[['aziz','stand',.3,'smile'],['madina','stand',.72,'smileBig',1,'sparkle']],b:[['speech',3,.5,.13,1]],o:[['prop','book',.5,.75,.5]]},
   {bg:'kidsroom',c:[['aziz','stand',.3,'smile'],['timur','stand',.72,'cute',1]],b:[['caption',4,.5,.08]],o:[['prop','book',.52,.75,.4]]},
   {bg:'kidsroom',c:[['timur','explain',.5,'awe',0,'question']],b:[['speech',5,.5,.14,0]]},
   {bg:'kidsroom',c:[['aziz','explain',.5,'smileBig',0,'idea']],b:[['speech',6,.5,.14,0]],o:[['prop','book',.8,.65,.4]]},
   {bg:'space',fx:'flash',c:[['aziz','fly',.3,'smileLOL'],['timur','fly',.7,'smileBig',1]],b:[['caption',7,.5,.08]]}]},
 {cat:'city',e:'🚦',title:['Красный свет','Red light!','Qizil chiroq'],sub:['Правила дорожного движения','Road safety','Yo‘l harakati qoidalari'],lines:[
  ['Опаздываю! Побегу так!','I’m late! I’ll just run across!','Kechikyapman! Shunday yugurib o‘taman!'],
  ['*Стой!* Горит красный свет!','*Stop!* The light is red!','*To‘xta!* Qizil chiroq yonyapti!'],
  ['Переходим дорогу только на *зелёный* и по зебре.','We cross only on *green* and at the zebra crossing.','Yo‘ldan faqat *yashil*da va piyodalar yo‘lagidan o‘tamiz.'],
  ['Понял! Лучше опоздать, чем не прийти!','Got it! Better late than never!','Tushundim! Kech qolgan yaxshi, kelmay qolgandan!'],
  ['Что ещё важно на дороге?','What else is important on the road?','Yo‘lda yana nima muhim?'],
  ['Смотри налево, потом направо. И никаких телефонов!','Look left, then right. And no phones!','Avval chapga, keyin o‘ngga qara. Telefon esa yo‘q!'],
  ['А вечером — светящийся значок на рюкзаке.','And in the evening — a reflector on your backpack.','Kechqurun esa — ryukzakda nur qaytargich.'],
  ['Я расскажу правила всему классу!','I’ll teach the rules to my whole class!','Qoidalarni butun sinfga aytib beraman!']],
  panels:[{bg:'city',fx:'speed',c:[['timur','run',.5,'driven',0,'sweat']],b:[['shout',0,.5,.14,0]]},
   {bg:'road',c:[['ulugbek','stop',.3,'serious'],['timur','stand',.72,'awe',1,'exclaim']],b:[['shout',1,.33,.13,0]],o:[['prop','trafficlight',.5,.6,.9]]},
   {bg:'road',c:[['ulugbek','explain',.5,'explaining']],b:[['speech',2,.5,.14,0]]},
   {bg:'city',c:[['ulugbek','thumbsup',.3,'smile'],['timur','salute',.72,'smileBig',1]],b:[['speech',3,.68,.13,1]]},
   {bg:'road',c:[['timur','explain',.5,'cute',0,'question']],b:[['speech',4,.5,.14,0]]},
   {bg:'road',c:[['ulugbek','point',.5,'explaining']],b:[['speech',5,.5,.14,0]],o:[['prop','phone',.82,.7,.3]]},
   {bg:'city_night',c:[['ulugbek','explain',.3,'smile'],['timur','stand',.72,'smile',1]],b:[['speech',6,.35,.13,0]],o:[['prop','backpack',.55,.8,.4]]},
   {bg:'classroom',fx:'flash',c:[['timur','explain',.4,'smileBig',0,'sparkle']],b:[['speech',7,.4,.14,0]],o:[['prop','trafficlight',.82,.6,.7]]}]},
 {cat:'city',e:'🛒',title:['В магазин за покупками','Shopping trip','Do‘konga xaridga'],sub:['Задача на счёт','Maths challenge','Hisob masalasi'],lines:[
  ['Мама дала список: хлеб, молоко и яблоки.','Mum gave me a list: bread, milk and apples.','Oyim ro‘yxat berdi: non, sut va olma.'],
  ['Хлеб — 4000, молоко — 9000, яблоки — 12000 сум.','Bread 4000, milk 9000, apples 12000 sum.','Non — 4000, sut — 9000, olma — 12000 so‘m.'],
  ['У меня 30 000. Хватит? Посчитаю…','I have 30,000. Is it enough? Let me count…','Menda 30 000 bor. Yetadimi? Hisoblayman…'],
  ['Сдача — *5000 сум*! Я справилась!','*5000 sum* change! I did it!','Qaytim — *5000 so‘m*! Uddaladim!'],
  ['Мама, вот покупки и *5000 сдачи*!','Mum, here’s the shopping and *5000 change*!','Oyi, mana xaridlar va *5000 qaytim*!'],
  ['Умница! Сдачу положи в копилку.','Clever girl! Put the change in your piggy bank.','Barakalla! Qaytimni cho‘chqa-qutichangga sol.'],
  ['Буду копить на велосипед!','I’ll save up for a bike!','Velosipedga yig‘aman!'],
  ['Через полгода…','Six months later…','Olti oydan keyin…'],
  ['Ура! Я накопила *сама*!','Hooray! I saved up *myself*!','Ura! *O‘zim* yig‘dim!']],
  panels:[{bg:'kitchen',c:[['lola','explain',.3,'smile'],['sabina','stand',.72,'smile',1]],b:[['speech',0,.35,.13,0]]},
   {bg:'shop',c:[['fazyl','explain',.5,'smile']],b:[['speech',1,.5,.14,0]],o:[['prop','bread',.2,.8,.4],['prop','milk',.82,.8,.4]]},
   {bg:'shop',c:[['sabina','think',.5,'concerned',0,'question']],b:[['think',2,.5,.16,0]],o:[['prop','calculator',.8,.65,.4]]},
   {bg:'shop',fx:'flash',c:[['sabina','hooray',.5,'smileBig',0,'sparkle']],b:[['shout',3,.5,.14,0]],o:[['prop','shopbag',.82,.85,.5]]},
   {bg:'kitchen',c:[['sabina','explain',.3,'smileBig'],['lola','stand',.72,'smile',1]],b:[['speech',4,.35,.13,0]],o:[['prop','shopbag',.52,.88,.45]]},
   {bg:'kitchen',c:[['lola','thumbsup',.5,'smileBig']],b:[['speech',5,.5,.14,0]],o:[['prop','money',.8,.75,.35]]},
   {bg:'kidsroom',c:[['sabina','think',.45,'smile',0,'idea']],b:[['think',6,.45,.14,0]],o:[['prop','bicycle',.8,.7,.45]]},
   {bg:'park',fx:'flash',c:[['sabina','hooray',.35,'smileLOL',0,'sparkle']],b:[['caption',7,.5,.08],['shout',8,.35,.26,0]],o:[['prop','bicycle',.75,.75,.6]]}]},
 {cat:'city',e:'🚌',title:['В автобусе','On the bus','Avtobusda'],sub:['Вежливость','Good manners','Odob'],lines:[
  ['Утром автобус был полный.','The bus was packed in the morning.','Ertalab avtobus to‘la edi.'],
  ['Бабушке тяжело стоять…','It’s hard for Grandma to stand…','Buvijonga tik turish qiyin…'],
  ['Садитесь, пожалуйста!','Please, take my seat!','O‘tiring, marhamat!'],
  ['Спасибо, какой *воспитанный* мальчик!','Thank you, what a *polite* boy!','Rahmat, qanday *odobli* bola!'],
  ['В школе…','At school…','Maktabda…'],
  ['Азиз, мне бабушка рассказала, как ты уступил место!','Aziz, Grandma told me how you gave up your seat!','Aziz, buvim sen joy berganingni aytib berdi!'],
  ['Это же моя бабушка!','That was my grandma!','U mening buvim-ku!'],
  ['Вежливость — это *просто*, но очень важно.','Being polite is *easy*, but very important.','Odob — bu *oddiy*, lekin juda muhim.']],
  panels:[{bg:'bus',c:[['aziz','sit',.5,'calm']],b:[['caption',0,.5,.08]]},
   {bg:'bus',c:[['karima','stand',.3,'tired',0,'sweat'],['aziz','sit',.72,'concerned',1]],b:[['think',1,.72,.3,1]]},
   {bg:'bus',c:[['aziz','explain',.5,'smile']],b:[['speech',2,.5,.14,0]]},
   {bg:'bus',c:[['karima','sit',.3,'lovingGrin1',0,'hearts'],['aziz','stand',.72,'smileBig',1,'blush']],b:[['speech',3,.35,.13,0]]},
   {bg:'school',c:[['aziz','walk',.4,'smile']],b:[['caption',4,.5,.08]]},
   {bg:'school',c:[['madina','explain',.3,'smileBig'],['aziz','stand',.72,'awe',1]],b:[['speech',5,.35,.13,0]]},
   {bg:'school',c:[['madina','hooray',.3,'smileLOL'],['aziz','scratch',.72,'smileBig',1,'blush']],b:[['shout',6,.3,.13,0]]},
   {bg:'classroom',fx:'flash',c:[['natalya','thumbsup',.3,'smileBig'],['aziz','stand',.72,'smile',1,'sparkle']],b:[['speech',7,.38,.13,0]]}]},
 {cat:'school',e:'⚽',title:['Финал турнира','The big final','Turnir finali'],sub:['Спорт','Sport','Sport'],lines:[
  ['Финал школьного турнира по футболу!','The school football final!','Maktab futbol turnirining finali!'],
  ['Давай, Тимур! Ты сможешь!','Come on, Timur! You can do it!','Qani, Temur! Sen uddalaysan!'],
  ['БАМ!','BAM!','BAM!'],
  ['ГОООЛ!!!','GOOOAL!!!','GOOOL!!!'],
  ['Победила *дружба*! И наша команда!','*Friendship* won! And so did our team!','*Do‘stlik* g‘alaba qildi! Va bizning jamoa!'],
  ['А ребята из другой команды грустят…','But the other team looks sad…','Boshqa jamoa bolalari esa xafa…'],
  ['Вы отлично играли! Пожмём руки?','You played great! Shall we shake hands?','Zo‘r o‘ynadingiz! Qo‘l berishamizmi?'],
  ['Спасибо! В следующий раз мы вас обыграем!','Thanks! Next time we’ll beat you!','Rahmat! Keyingi safar biz yutamiz!'],
  ['Спорт — это дружба!','Sport means friendship!','Sport — bu do‘stlik!']],
  panels:[{bg:'stadium',c:[['madina','hooray',.3,'smileBig'],['sabina','hooray',.72,'smile',1]],b:[['caption',0,.5,.08],['shout',1,.5,.26,0]]},
   {bg:'stadium',fx:'speed',c:[['timur','kick',.4,'driven']],o:[['prop','ball',.75,.75,.35],['sfx',2,.82,.4,.6]]},
   {bg:'stadium',fx:'flash',c:[['timur','hooray',.5,'smileLOL',0,'sparkle']],b:[['shout',3,.5,.14,0]]},
   {bg:'stadium',c:[['timur','hug',.3,'smileBig'],['alisher','hug',.66,'smileBig',1]],b:[['speech',4,.5,.13,0]],o:[['prop','trophy',.5,.88,.5]]},
   {bg:'stadium',c:[['dima','sitfloor',.5,'concerned',0,'tears']],b:[['caption',5,.5,.08]]},
   {bg:'stadium',c:[['timur','explain',.3,'smile'],['dima','stand',.72,'concerned',1]],b:[['speech',6,.35,.13,0]]},
   {bg:'stadium',c:[['dima','thumbsup',.5,'smileBig']],b:[['speech',7,.5,.14,0]]},
   {bg:'stadium',fx:'flash',c:[['timur','hug',.25,'smileBig'],['dima','hug',.52,'smileLOL'],['alisher','hooray',.8,'smileBig',1]],b:[['shout',8,.5,.12,1]]}]},
 {cat:'school',e:'🎒',title:['Новенькая','The new girl','Yangi o‘quvchi'],sub:['Дружба','Friendship','Do‘stlik'],lines:[
  ['1 сентября. Новая школа.','September 1st. A new school.','1-sentabr. Yangi maktab.'],
  ['Я здесь никого не знаю…','I don’t know anyone here…','Men bu yerda hech kimni tanimayman…'],
  ['Привет! Я Мадина. Давай *дружить*?','Hi! I’m Madina. Want to be *friends*?','Salom! Men Madina. *Do‘st* bo‘lamizmi?'],
  ['Садись со мной за парту!','Sit next to me!','Men bilan bir partada o‘tir!'],
  ['Лучший первый день!','Best first day ever!','Eng zo‘r birinchi kun!'],
  ['На перемене…','At break time…','Tanaffusda…'],
  ['Хочешь, покажу нашу школу?','Want me to show you our school?','Maktabimizni ko‘rsataymi?'],
  ['А это — наша библиотека и спортзал!','And this is our library and gym!','Bu esa — kutubxonamiz va sport zalimiz!'],
  ['Как хорошо, когда есть друг!','It’s so good to have a friend!','Do‘sting bo‘lsa qanday yaxshi!']],
  panels:[{bg:'school',c:[['sabina','stand',.5,'concerned',0,'sweatdrop']],b:[['caption',0,.5,.08],['think',1,.5,.26,0]]},
   {bg:'school',c:[['madina','wave',.3,'smileBig'],['sabina','stand',.72,'cute',1,'blush']],b:[['speech',2,.35,.13,0]]},
   {bg:'classroom',c:[['madina','point',.3,'smile'],['sabina','stand',.72,'smile',1]],b:[['speech',3,.33,.13,0]]},
   {bg:'school',fx:'flash',c:[['madina','hooray',.3,'smileLOL'],['sabina','hooray',.72,'smileBig',1,'hearts']],b:[['shout',4,.5,.13,1]]},
   {bg:'school',c:[['sabina','stand',.3,'smile'],['madina','stand',.72,'smile',1]],b:[['caption',5,.5,.08]]},
   {bg:'school',c:[['madina','explain',.5,'smileBig']],b:[['speech',6,.5,.14,0]]},
   {bg:'library',c:[['madina','point',.3,'explaining'],['sabina','stand',.72,'awe',1]],b:[['speech',7,.35,.13,0]]},
   {bg:'playground',fx:'flash',c:[['madina','hug',.35,'smileBig'],['sabina','hug',.66,'lovingGrin1',1,'hearts']],b:[['speech',8,.5,.13,1]]}]},
 {cat:'school',e:'📖',title:['Домашнее задание','Homework','Uy vazifasi'],sub:['Математика везде','Maths is everywhere','Matematika hamma joyda'],lines:[
  ['Алишер, уроки сделал?','Alisher, have you done your homework?','Alisher, darslaringni qildingmi?'],
  ['Почти… Математика скучная.','Almost… Maths is boring.','Deyarli… Matematika zerikarli.'],
  ['А сколько очков в твоей игре? Посчитай — это тоже математика!','How many points in your game? Count them — that’s maths too!','O‘yiningda nechta ochko bor? Hisobla — bu ham matematika!'],
  ['Ого! *Математика везде!*','Whoa! *Maths is everywhere!*','Voy! *Matematika hamma joyda!*'],
  ['Задача: в игре 3 уровня по 25 очков. Сколько всего?','Problem: 3 levels with 25 points each. How many in total?','Masala: o‘yinda 3 bosqich, har birida 25 ochko. Jami nechta?'],
  ['25 + 25 + 25… = *75*!','25 + 25 + 25… = *75*!','25 + 25 + 25… = *75*!'],
  ['Правильно! Уроки сделаны — можно и поиграть полчаса.','Correct! Homework’s done — you can play for half an hour.','To‘g‘ri! Darslar tayyor — yarim soat o‘ynasang bo‘ladi.'],
  ['Сначала дело — потом игра!','Work first — then play!','Avval ish — keyin o‘yin!']],
  panels:[{bg:'kidsroom',c:[['lola','point',.3,'suspicious'],['alisher','shrug',.72,'cheeky',1]],b:[['speech',0,.33,.13,0],['speech',1,.72,.36,1]],o:[['prop','gamepad',.72,.8,.35]]},
   {bg:'kidsroom',c:[['alisher','think',.5,'tired',0,'zzz']],b:[['think',1,.5,.16,0]],o:[['prop','notebook',.8,.8,.4]]},
   {bg:'kidsroom',c:[['lola','explain',.5,'explaining']],b:[['speech',2,.5,.14,0]]},
   {bg:'kidsroom',fx:'flash',c:[['alisher','hooray',.5,'smileBig',0,'idea']],b:[['shout',3,.5,.14,0]],o:[['prop','calculator',.82,.8,.4]]},
   {bg:'kidsroom',c:[['alisher','think',.45,'concerned',0,'question']],b:[['caption',4,.5,.08]],o:[['prop','notebook',.8,.8,.4]]},
   {bg:'kidsroom',c:[['alisher','explain',.5,'smileBig',0,'idea']],b:[['speech',5,.5,.14,0]],o:[['prop','calculator',.82,.75,.35]]},
   {bg:'kidsroom',c:[['lola','thumbsup',.3,'smileBig'],['alisher','hooray',.72,'smileLOL',1]],b:[['speech',6,.35,.13,0]]},
   {bg:'kidsroom',fx:'flash',c:[['alisher','stand',.4,'smileBig',0,'sparkle']],b:[['caption',7,.5,.08]],o:[['prop','gamepad',.75,.75,.4]]}]},
 {cat:'school',e:'🧹',title:['Субботник','Clean-up day','Shanbalik'],sub:['Всем классом','The whole class','Butun sinf bilan'],lines:[
  ['Субботник во дворе школы!','Clean-up day in the school yard!','Maktab hovlisida shanbalik!'],
  ['Я подметаю дорожки!','I’m sweeping the paths!','Men yo‘laklarni supuraman!'],
  ['А я сажаю *дерево*!','And I’m planting a *tree*!','Men esa *daraxt* ekaman!'],
  ['Наш двор — *самый чистый*!','Our yard is *the cleanest*!','Bizning hovli — *eng toza*!'],
  ['После работы — чай для всех!','After work — tea for everyone!','Ishdan keyin — hammaga choy!'],
  ['А это дерево будет расти *сто лет*!','And this tree will grow for *a hundred years*!','Bu daraxt *yuz yil* o‘sadi!'],
  ['Будем поливать его каждую неделю!','We’ll water it every week!','Uni har hafta sug‘oramiz!'],
  ['Чистота начинается с *нас*!','Cleanliness starts with *us*!','Tozalik *bizdan* boshlanadi!']],
  panels:[{bg:'school',c:[['natalya','explain',.5,'smile']],b:[['shout',0,.5,.14,0]]},
   {bg:'school',c:[['timur','stand',.5,'driven',0,'sweat']],b:[['speech',1,.5,.14,0]],o:[['prop','broom',.65,.7,.7]]},
   {bg:'school',c:[['madina','squat',.4,'smileBig']],b:[['speech',2,.45,.14,0]],o:[['prop','plant',.75,.8,.5]]},
   {bg:'school',fx:'flash',c:[['timur','hooray',.25,'smileBig'],['natalya','thumbsup',.52,'smile'],['madina','hooray',.8,'smileLOL',1]],b:[['shout',3,.5,.13,1]]},
   {bg:'school',c:[['natalya','explain',.3,'smileBig'],['timur','stand',.72,'smile',1]],b:[['speech',4,.35,.13,0]],o:[['prop','teapot',.55,.85,.45]]},
   {bg:'school',c:[['madina','point',.4,'awe']],b:[['speech',5,.4,.14,0]],o:[['prop','plant',.78,.8,.55]]},
   {bg:'school',c:[['timur','squat',.4,'smileBig']],b:[['speech',6,.4,.14,0]],o:[['prop','bucket',.75,.85,.45]]},
   {bg:'school',fx:'flash',c:[['timur','thumbsup',.3,'smileBig'],['madina','thumbsup',.72,'smileBig',1]],b:[['shout',7,.5,.13,0]]}]},
 {cat:'school',e:'🌋',title:['Научный опыт','Science experiment','Ilmiy tajriba'],sub:['Вулкан из соды','Baking-soda volcano','Sodadan vulqon'],lines:[
  ['Сегодня делаем вулкан из *соды и уксуса*!','Today we’re making a *baking-soda* volcano!','Bugun *soda va sirka*dan vulqon yasaymiz!'],
  ['Добавляю уксус… *чуть-чуть*…','Adding vinegar… *just a little*…','Sirka qo‘shyapman… *ozgina*…'],
  ['БУМ!','BOOM!','BUM!'],
  ['Опыт удался… немного *слишком*!','The experiment worked… a bit *too* well!','Tajriba chiqdi… biroz *haddan tashqari*!'],
  ['Важно: опыты делаем только *с учителем* и в защитных очках!','Important: experiments only *with a teacher* and with safety goggles!','Muhim: tajribalar faqat *o‘qituvchi bilan* va himoya ko‘zoynagida!'],
  ['Почему вулкан зашипел?','Why did the volcano fizz?','Vulqon nega vishilladi?'],
  ['Сода и уксус дают *углекислый газ* — он и пенится!','Soda and vinegar make *carbon dioxide* — that’s the foam!','Soda va sirka *karbonat angidrid* hosil qiladi — ko‘pik shundan!'],
  ['Наука — это интересно, когда безопасно!','Science is fun when it’s safe!','Fan qiziq — xavfsiz bo‘lsa!']],
  panels:[{bg:'classroom',c:[['natalya','explain',.3,'explaining'],['dima','stand',.72,'awe',1]],b:[['speech',0,.35,.13,0]]},
   {bg:'classroom',c:[['dima','stand',.5,'concerned',0,'sweatdrop']],b:[['speech',1,.5,.14,0]],o:[['prop','bucket',.75,.8,.5]]},
   {bg:'classroom',fx:'flash',c:[['dima','fall',.5,'awe',0,'shock']],o:[['sfx',2,.5,.3,1]]},
   {bg:'classroom',c:[['natalya','facepalm',.3,'smileLOL'],['dima','shrug',.72,'cheeky',1,'dizzy']],b:[['speech',3,.5,.13,1]]},
   {bg:'classroom',c:[['natalya','point',.5,'serious',0,'exclaim']],b:[['speech',4,.5,.14,0]],o:[['prop','glasses',.82,.65,.35]]},
   {bg:'classroom',c:[['dima','think',.5,'cute',0,'question']],b:[['speech',5,.5,.14,0]]},
   {bg:'classroom',c:[['natalya','explain',.3,'explaining'],['dima','stand',.72,'awe',1,'idea']],b:[['speech',6,.35,.13,0]],o:[['prop','chalkboard',.55,.55,.6]]},
   {bg:'classroom',fx:'flash',c:[['natalya','thumbsup',.3,'smileBig'],['dima','hooray',.72,'smileLOL',1]],b:[['caption',7,.5,.08]]}]},
 {cat:'school',e:'🎤',title:['Концерт','The school concert','Maktab konserti'],sub:['Смелость','Being brave','Jasorat'],lines:[
  ['Я *забуду* слова…','I’ll *forget* the words…','So‘zlarni *unutib qo‘yaman*…'],
  ['Просто смотри на меня — я рядом!','Just look at me — I’m right here!','Menga qara — men yoningdaman!'],
  ['♪ Ля-ля-ля! ♪','♪ La-la-la! ♪','♪ La-la-la! ♪'],
  ['Браво! Браво!','Bravo! Bravo!','Barakalla! Barakalla!'],
  ['Ты была *такой смелой*!','You were *so brave*!','Sen *shunday jasur* eding!'],
  ['Мне было страшно, но ты помогла.','I was scared, but you helped me.','Qo‘rqqandim, lekin sen yordam berding.'],
  ['Внучка, я тобой горжусь!','Sweetheart, I’m so proud of you!','Nevarajonim, sen bilan faxrlanaman!'],
  ['Страшно бывает всем. Главное — *попробовать*!','Everyone gets scared. The main thing is to *try*!','Hamma qo‘rqadi. Asosiysi — *harakat qilish*!']],
  panels:[{bg:'stage',c:[['sabina','stand',.5,'concernedFear',0,'sweat']],b:[['think',0,.5,.16,0]]},
   {bg:'stage',c:[['madina','thumbsup',.3,'smileBig'],['sabina','stand',.72,'concerned',1]],b:[['speech',1,.33,.13,0]]},
   {bg:'stage',fx:'flash',c:[['sabina','dance',.5,'smileBig',0,'music']],b:[['speech',2,.5,.14,0]],o:[['prop','mic',.72,.6,.4]]},
   {bg:'stage',c:[['natalya','clap',.2,'smileBig'],['karima','clap',.5,'lovingGrin1'],['madina','clap',.8,'smileLOL',1]],b:[['shout',3,.5,.13,1]]},
   {bg:'stage',c:[['madina','hooray',.3,'smileBig'],['sabina','stand',.72,'smile',1,'blush']],b:[['speech',4,.33,.13,0]]},
   {bg:'stage',c:[['sabina','hug',.4,'lovingGrin1',0,'hearts']],b:[['speech',5,.42,.14,0]]},
   {bg:'stage',c:[['karima','hug',.3,'lovingGrin1'],['sabina','hug',.66,'smileBig',1]],b:[['speech',6,.35,.13,0]],o:[['prop','bouquet',.5,.75,.4]]},
   {bg:'stage',fx:'flash',c:[['sabina','thumbsup',.5,'smileBig',0,'sparkle']],b:[['caption',7,.5,.08]]}]},
 {cat:'holiday',e:'💐',title:['День учителя','Teachers’ Day','O‘qituvchilar kuni'],sub:['Праздник в школе','School holiday','Maktab bayrami'],lines:[
  ['1 октября — День учителя!','October 1st — Teachers’ Day!','1-oktabr — O‘qituvchilar kuni!'],
  ['Тсс! Это *сюрприз*!','Shh! It’s a *surprise*!','Tss! Bu *syurpriz*!'],
  ['С праздником, Наталья Петровна!','Happy Teachers’ Day, Natalya Petrovna!','Bayramingiz muborak, Natalya Petrovna!'],
  ['Спасибо, мои *дорогие*!','Thank you, my *dear* ones!','Rahmat, *azizlarim*!'],
  ['А почему вы стали учителем?','Why did you become a teacher?','Nega o‘qituvchi bo‘ldingiz?'],
  ['Потому что люблю, когда вы *узнаёте новое*!','Because I love it when you *learn new things*!','Chunki siz *yangi narsa o‘rganganingizni* yaxshi ko‘raman!'],
  ['Я тоже хочу стать учителем!','I want to be a teacher too!','Men ham o‘qituvchi bo‘lmoqchiman!'],
  ['Спасибо учителям за их труд!','Thank you, teachers, for all your work!','Mehnatingiz uchun rahmat, ustozlar!']],
  panels:[{bg:'school',c:[['alisher','wave',.3,'smileBig'],['madina','wave',.72,'smile',1]],b:[['caption',0,.5,.08]]},
   {bg:'classroom',c:[['alisher','sneak',.3,'cheeky'],['madina','sneak',.72,'cheeky',1]],b:[['whisper',1,.5,.13,0]],o:[['prop','bouquet',.5,.7,.5]]},
   {bg:'classroom',fx:'flash',c:[['alisher','hooray',.25,'smileBig'],['natalya','stand',.52,'awe',0,'exclaim'],['madina','hooray',.8,'smileLOL',1]],b:[['shout',2,.5,.13,0]]},
   {bg:'classroom',c:[['natalya','hug',.5,'lovingGrin1',0,'hearts']],b:[['speech',3,.5,.14,0]],o:[['prop','bouquet',.75,.7,.5]]},
   {bg:'classroom',c:[['madina','explain',.4,'cute',0,'question']],b:[['speech',4,.4,.14,0]]},
   {bg:'classroom',c:[['natalya','explain',.5,'lovingGrin1',0,'hearts']],b:[['speech',5,.5,.14,0]]},
   {bg:'classroom',c:[['alisher','hooray',.5,'smileBig',0,'idea']],b:[['shout',6,.5,.14,0]]},
   {bg:'school',fx:'flash',c:[['alisher','wave',.2,'smileBig'],['natalya','wave',.5,'smile'],['madina','wave',.8,'smileBig',1]],b:[['caption',7,.5,.08]]}]},
 {cat:'family',e:'🍚',title:['Готовим плов','Cooking plov','Palov pishiramiz'],sub:['Помогаю маме','Helping Mum','Oyimga yordam'],lines:[
  ['Поможешь приготовить плов?','Will you help me cook plov?','Palov pishirishga yordam berasanmi?'],
  ['Да! Я буду *шефом*!','Yes! I’ll be the *chef*!','Ha! Men *oshpaz* bo‘laman!'],
  ['Морковь режем *соломкой*.','We cut the carrots into *thin strips*.','Sabzini *somoncha* qilib to‘g‘raymiz.'],
  ['ПШШШ!','SIZZLE!','JIZZ!'],
  ['Самый вкусный плов — который *сделал сам*!','The tastiest plov is the one *you made yourself*!','Eng mazali palov — *o‘zing pishirgan* palov!'],
  ['После ужина — помогаем мыть посуду.','After dinner — we help wash the dishes.','Kechki ovqatdan keyin — idish yuvishga yordam beramiz.'],
  ['Я вытираю, а ты ставишь на полку!','I’ll dry, you put them on the shelf!','Men artaman, sen tokchaga qo‘yasan!'],
  ['Какие у меня *хорошие* помощники!','What *good* helpers I have!','Qanday *yaxshi* yordamchilarim bor!'],
  ['В семье всё делаем *вместе*!','In our family we do everything *together*!','Oilada hammasini *birga* qilamiz!']],
  panels:[{bg:'kitchen',c:[['lola','explain',.3,'smile'],['sabina','hooray',.72,'smileBig',1]],b:[['speech',0,.33,.12,0],['speech',1,.72,.34,1]]},
   {bg:'kitchen',c:[['lola','point',.5,'explaining']],b:[['speech',2,.5,.14,0]],o:[['prop','carrot',.82,.8,.4]]},
   {bg:'kitchen',fx:'speed',c:[['sabina','stand',.4,'awe',0,'steam']],o:[['prop','kazan',.75,.85,.6],['sfx',3,.75,.4,.6]]},
   {bg:'home',c:[['rahim','eat',.25,'eatingHappy'],['sabina','eat',.52,'smileBig'],['lola','eat',.8,'smile',1]],b:[['speech',4,.5,.12,0]],o:[['prop','plov',.5,.9,.6]]},
   {bg:'kitchen',c:[['sabina','stand',.5,'smile']],b:[['caption',5,.5,.08]],o:[['prop','dishes',.8,.8,.5]]},
   {bg:'kitchen',c:[['sabina','explain',.3,'smileBig'],['timur','stand',.72,'smile',1]],b:[['speech',6,.35,.13,0]]},
   {bg:'kitchen',c:[['lola','hug',.4,'lovingGrin1',0,'hearts']],b:[['speech',7,.42,.14,0]]},
   {bg:'home',fx:'flash',c:[['rahim','wave',.2,'smile'],['lola','wave',.5,'smileBig'],['sabina','wave',.8,'smileLOL',1]],b:[['caption',8,.5,.08]]}]},
 {cat:'family',e:'🐱',title:['Мой котёнок','My kitten','Mening mushukcham'],sub:['Питомец','A pet','Uy hayvoni'],lines:[
  ['У меня для тебя подарок!','I’ve got a present for you!','Senga sovg‘am bor!'],
  ['*Котёнок!* Спасибо, дедушка!','*A kitten!* Thank you, Grandpa!','*Mushukcha!* Rahmat, bobojon!'],
  ['Буду кормить его и убирать за ним каждый день!','I’ll feed him and clean up after him every day!','Uni har kuni boqaman va tozalayman!'],
  ['Через неделю…','A week later…','Bir haftadan keyin…'],
  ['Эй! Это моя *тетрадь*!','Hey! That’s my *exercise book*!','Hoy! Bu mening *daftarim*!'],
  ['Котёнок, тебе тоже нужно своё место!','Kitty, you need a spot of your own too!','Mushukcha, senga ham o‘z joying kerak!'],
  ['Вот — мягкая коробка-кроватка.','Here — a soft box bed.','Mana — yumshoq quti-to‘shak.'],
  ['Мур-мур!','Purr-purr!','Mur-mur!'],
  ['Заботиться о питомце — это *ответственность*.','Caring for a pet is a *responsibility*.','Uy hayvoniga qarash — bu *mas’uliyat*.']],
  panels:[{bg:'livingroom',c:[['rahim','explain',.3,'smileBig'],['aziz','stand',.72,'awe',1]],b:[['speech',0,.35,.13,0]],o:[['prop','gift',.5,.85,.5]]},
   {bg:'livingroom',c:[['aziz','hooray',.4,'smileLOL',0,'hearts']],b:[['shout',1,.45,.14,0]],o:[['animal','cat',.78,1,.45]]},
   {bg:'kidsroom',c:[['aziz','explain',.4,'smile']],b:[['speech',2,.45,.14,0]],o:[['animal','cat',.78,1,.45]]},
   {bg:'kidsroom',c:[['aziz','facepalm',.35,'smileLOL']],b:[['caption',3,.5,.08],['shout',4,.4,.25,0]],o:[['prop','notebook',.75,.85,.5],['animal','cat',.75,.8,.4]]},
   {bg:'kidsroom',c:[['aziz','explain',.4,'smile']],b:[['speech',5,.4,.14,0]],o:[['animal','cat',.78,1,.45]]},
   {bg:'kidsroom',c:[['aziz','squat',.4,'smileBig']],b:[['speech',6,.4,.14,0]],o:[['prop','box',.78,.85,.5]]},
   {bg:'kidsroom',c:[['aziz','stand',.4,'lovingGrin1',0,'hearts']],o:[['prop','box',.75,.88,.5],['animal','cat',.75,.85,.4],['sfx',7,.75,.45,.6]]},
   {bg:'livingroom',fx:'flash',c:[['rahim','thumbsup',.3,'smile'],['aziz','hug',.72,'smileBig',1]],b:[['caption',8,.5,.08]],o:[['animal','cat',.52,1,.4]]}]},
 {cat:'family',e:'🧸',title:['Уборка в комнате','Tidying my room','Xonani yig‘ishtirish'],sub:['Порядок дома','Keeping tidy','Uydagi tartib'],lines:[
  ['Бекзод, наведи порядок в комнате!','Bekzod, tidy up your room!','Bekzod, xonangni yig‘ishtir!'],
  ['Ну мааам…','Oh, Mu-um…','Oyi-i…'],
  ['Ура! Мой мишка! Я его *год* искал!','Yay! My teddy! I’ve been looking for him for a *year*!','Ura! Ayiqcham! Uni *bir yil* qidirgandim!'],
  ['Вот это *порядок*! Молодец!','Now *that’s* tidy! Well done!','Mana bu *tartib*! Barakalla!'],
  ['Каждая вещь — на *своё место*!','Everything goes in *its own place*!','Har bir narsa — *o‘z joyiga*!'],
  ['Книги — на полку, игрушки — в коробку.','Books on the shelf, toys in the box.','Kitoblar — tokchaga, o‘yinchoqlar — qutiga.'],
  ['Ого, теперь можно найти всё за минуту!','Wow, now I can find anything in a minute!','Voy, endi hammasini bir daqiqada topaman!'],
  ['Порядок — это удобно!','Being tidy makes life easier!','Tartib — bu qulay!']],
  panels:[{bg:'kidsroom',c:[['lola','point',.3,'serious'],['bekzod:teen','shrug',.72,'tired',1]],b:[['speech',0,.33,.12,0],['speech',1,.72,.36,1]],o:[['prop','box',.5,.88,.4]]},
   {bg:'kidsroom',fx:'speed',c:[['bekzod:teen','stand',.5,'driven',0,'sweat']],o:[['prop','broom',.7,.7,.7]]},
   {bg:'kidsroom',fx:'flash',c:[['bekzod:teen','hooray',.45,'smileBig',0,'hearts']],b:[['shout',2,.45,.14,0]],o:[['prop','teddy',.8,.8,.5]]},
   {bg:'kidsroom',c:[['lola','thumbsup',.3,'smileBig'],['bekzod:teen','stand',.72,'smile',1,'sparkle']],b:[['speech',3,.35,.13,0]]},
   {bg:'kidsroom',c:[['lola','explain',.4,'explaining']],b:[['speech',4,.4,.14,0]]},
   {bg:'kidsroom',c:[['bekzod:teen','squat',.4,'driven']],b:[['speech',5,.4,.14,0]],o:[['prop','book',.75,.8,.4],['prop','box',.88,.88,.4]]},
   {bg:'kidsroom',c:[['bekzod:teen','hooray',.45,'smileBig',0,'idea']],b:[['speech',6,.45,.14,0]]},
   {bg:'kidsroom',fx:'flash',c:[['lola','hug',.3,'lovingGrin1'],['bekzod:teen','hug',.66,'smileBig',1]],b:[['caption',7,.5,.08]]}]},
 {cat:'holiday',e:'💌',title:['Открытка для мамы','A card for Mum','Oyimga otkritka'],sub:['8 Марта','Mother’s Day','8-mart'],lines:[
  ['Сделаем маме открытку? Только тихо!','Shall we make Mum a card? Quietly!','Oyimga otkritka yasaymizmi? Faqat sekin!'],
  ['Я нарисую цветы, а ты — сердечко!','I’ll draw flowers and you draw a heart!','Men gul chizaman, sen — yurakcha!'],
  ['С праздником, мама!','Happy holiday, Mum!','Bayramingiz muborak, oyijon!'],
  ['Это самый *лучший* подарок!','This is the *best* present!','Bu *eng yaxshi* sovg‘a!'],
  ['А ещё сделаем *завтрак* для мамы!','And let’s make *breakfast* for Mum too!','Oyimga *nonushta* ham tayyorlaymiz!'],
  ['Чай, лепёшка и яблоко. Готово!','Tea, bread and an apple. Done!','Choy, non va olma. Tayyor!'],
  ['Мои дорогие… Я вас так люблю!','My dears… I love you so much!','Azizlarim… Sizlarni juda yaxshi ko‘raman!'],
  ['Маму радовать можно *каждый день*!','We can make Mum happy *every day*!','Oyimizni *har kuni* xursand qilsa bo‘ladi!']],
  panels:[{bg:'kidsroom',c:[['alisher','sneak',.3,'cheeky'],['sabina','sneak',.72,'smile',1]],b:[['whisper',0,.5,.13,0]]},
   {bg:'kidsroom',c:[['sabina','explain',.4,'smileBig']],b:[['speech',1,.45,.14,0]],o:[['prop','paper',.7,.8,.5],['prop','pencil',.85,.8,.4]]},
   {bg:'livingroom',fx:'flash',c:[['alisher','hooray',.25,'smileBig'],['lola','stand',.52,'awe',0,'exclaim'],['sabina','hooray',.8,'smileLOL',1]],b:[['shout',2,.5,.13,0]],o:[['prop','heart',.5,.75,.4]]},
   {bg:'livingroom',c:[['lola','hug',.5,'lovingGrin1',0,'hearts']],b:[['speech',3,.5,.14,0]]},
   {bg:'kidsroom',c:[['alisher','explain',.3,'smileBig',0,'idea'],['sabina','hooray',.72,'smileLOL',1]],b:[['speech',4,.35,.13,0]]},
   {bg:'kitchen',c:[['sabina','stand',.4,'smile']],b:[['speech',5,.4,.14,0]],o:[['prop','teapot',.72,.85,.4],['prop','apple',.88,.88,.3]]},
   {bg:'kitchen',c:[['lola','hug',.4,'lovingGrin1',0,'tears']],b:[['speech',6,.42,.14,0]]},
   {bg:'livingroom',fx:'flash',c:[['alisher','hug',.25,'smileBig'],['lola','hug',.5,'lovingGrin1'],['sabina','hug',.78,'smileBig',1]],b:[['caption',7,.5,.08]]}]},
 {cat:'holiday',e:'💃',title:['Свадьба в махалле','A mahalla wedding','Mahalladagi to‘y'],sub:['Традиции','Traditions','An’analar'],lines:[
  ['Сегодня свадьба у моего старшего брата!','Today is my big brother’s wedding!','Bugun akamning to‘yi!'],
  ['Все танцуют!','Everyone is dancing!','Hamma raqs tushmoqda!'],
  ['А плов на свадьбе — *самый вкусный*!','And wedding plov is *the tastiest*!','To‘y oshi esa — *eng mazali*!'],
  ['Пусть будут счастливы!','May they be happy!','Baxtli bo‘lishsin!'],
  ['Бабушка, а как была твоя свадьба?','Grandma, what was your wedding like?','Buvijon, sizning to‘yingiz qanday bo‘lgan?'],
  ['Ох, вся махалля пела и танцевала три дня!','Oh, the whole mahalla sang and danced for three days!','Oh, butun mahalla uch kun qo‘shiq aytib, raqs tushgan!'],
  ['Традиции соединяют поколения.','Traditions bring generations together.','An’analar avlodlarni bog‘laydi.'],
  ['Я тоже буду беречь наши традиции!','I’ll take care of our traditions too!','Men ham an’analarimizni asrayman!']],
  panels:[{bg:'mahalla',c:[['timur','wave',.5,'smileBig']],b:[['speech',0,.5,.14,0]]},
   {bg:'toyhall',fx:'flash',c:[['aizhan','dance',.3,'smileBig',0,'music'],['sanjar','dance',.72,'smileLOL',1,'music']],b:[['caption',1,.5,.08]]},
   {bg:'toyhall',c:[['timur','eat',.4,'eatingHappy',0,'hearts']],b:[['speech',2,.45,.14,0]],o:[['prop','plov',.78,.85,.5]]},
   {bg:'toyhall',c:[['rahim','explain',.3,'lovingGrin1'],['karima','clap',.72,'smileBig',1]],b:[['speech',3,.35,.13,0]]},
   {bg:'toyhall',c:[['timur','explain',.3,'cute',0,'question'],['karima','stand',.72,'smile',1]],b:[['speech',4,.35,.13,0]]},
   {bg:'toyhall',fx:'flash',c:[['karima','dance',.45,'smileBig',0,'music']],b:[['speech',5,.45,.14,0]],o:[['prop','doira',.8,.6,.45]]},
   {bg:'mahalla_night',c:[['rahim','hug',.3,'lovingGrin1'],['timur','hug',.66,'smileBig',1]],b:[['caption',6,.5,.08]]},
   {bg:'mahalla',fx:'flash',c:[['timur','hooray',.5,'smileBig',0,'sparkle']],b:[['shout',7,.5,.14,0]]}]},
 {cat:'tale',e:'🐟',title:['Сказка о рыбаке и рыбке','The Fisherman and the Golden Fish','Baliqchi va oltin baliq haqida ertak'],sub:['По сказке А. С. Пушкина, 6 страниц','After A. Pushkin’s tale, 6 pages','A. Pushkin ertagi asosida, 6 sahifa'],lines:[
  ['Жил старик со старухой у самого синего моря.','An old man and his wife lived by the blue sea.','Ko‘k dengiz bo‘yida chol bilan kampir yashardi.'],
  ['Старик ловил неводом рыбу.','The old man fished with his net.','Chol to‘r bilan baliq tutardi.'],
  ['Пришёл невод с рыбкой — да не простою, а золотою!','The net brought a fish — a golden one!','To‘rga baliq ilindi — oltin baliq!'],
  ['Отпусти меня, старче, в море! Дам за себя откуп!','Let me go, old man! I’ll pay you a ransom!','Meni qo‘yib yubor, chol! Evazini beraman!'],
  ['Ступай себе, рыбка! Откупа мне не надо.','Off you go, little fish! I need nothing.','Bor, baliqcha! Menga hech narsa kerak emas.'],
  ['Дурачина ты, простофиля! Взял бы хоть корыто — наше раскололось!','You fool! At least ask for a trough — ours is broken!','Ey anqov! Hech bo‘lmasa tog‘ora so‘ra — biznikisi singan!'],
  ['Смилуйся, рыбка! Старухе нужно новое корыто.','Have mercy, fish! My wife needs a new trough.','Rahm qil, baliq! Kampirga yangi tog‘ora kerak.'],
  ['Не печалься, ступай с Богом. Будет вам корыто.','Don’t be sad, go home. You’ll have a trough.','Xafa bo‘lma, uyingga bor. Tog‘ora bo‘ladi.'],
  ['Выпросил корыто, дурачина! Проси у рыбки избу!','Just a trough, you fool! Ask the fish for a house!','Faqat tog‘ora-ya, anqov! Baliqdan uy so‘ra!'],
  ['Помутилося синее море.','The blue sea grew cloudy.','Ko‘k dengiz loyqalandi.'],
  ['Смилуйся, рыбка! Старуха избу просит.','Have mercy, fish! My wife wants a house.','Rahm qil, baliq! Kampir uy so‘rayapti.'],
  ['Не печалься, ступай с Богом. Будет вам изба.','Don’t be sad, go home. You’ll have a house.','Xafa bo‘lma, uyingga bor. Uy bo‘ladi.'],
  ['А старуха бранится пуще прежнего…','But the old woman scolds even more…','Kampir esa battar so‘kinadi…'],
  ['Хочу быть столбовою дворянкой!','I want to be a noble lady!','Zodagon xonim bo‘lmoqchiman!'],
  ['Неспокойно синее море.','The blue sea grew restless.','Ko‘k dengiz notinch bo‘ldi.'],
  ['Смилуйся, рыбка! Старуха хочет быть дворянкой.','Have mercy, fish! She wants to be a noble lady.','Rahm qil, baliq! U zodagon xonim bo‘lmoqchi.'],
  ['Не печалься, ступай себе с Богом.','Don’t be sad, go home in peace.','Xafa bo‘lma, uyingga bor.'],
  ['Стала старуха дворянкой, слуги ей кланяются.','She became a noble lady, servants bow to her.','Kampir zodagon xonim bo‘ldi, xizmatkorlar ta’zim qiladi.'],
  ['Не хочу быть дворянкой! Хочу быть царицей!','I don’t want to be a lady! I want to be queen!','Xonim bo‘lishni istamayman! Malika bo‘lmoqchiman!'],
  ['Что ты, баба, белены объелась?','Woman, have you lost your mind?','Ey xotin, aqldan ozdingmi?'],
  ['Почернело синее море.','The blue sea turned black.','Ko‘k dengiz qorayib ketdi.'],
  ['Смилуйся, рыбка! Старуха хочет быть царицей.','Have mercy, fish! She wants to be queen.','Rahm qil, baliq! U malika bo‘lmoqchi.'],
  ['Не печалься! Будет старуха царицей!','Don’t be sad! She will be queen!','Xafa bo‘lma! Kampir malika bo‘ladi!'],
  ['Сидит старуха царицей, кругом грозная стража.','She sits as queen, fierce guards all around.','Kampir malika bo‘lib o‘tiribdi, atrofda soqchilar.'],
  ['Хочу быть владычицей морскою, чтоб рыбка мне служила!','I want to rule the sea and have the fish serve me!','Dengiz hukmdori bo‘lay, baliq menga xizmat qilsin!'],
  ['На море чёрная буря.','A black storm rages on the sea.','Dengizda qora bo‘ron.'],
  ['Смилуйся, рыбка! Хочет старуха быть владычицей морскою…','Have mercy, fish! She wants to rule the sea…','Rahm qil, baliq! U dengiz hukmdori bo‘lmoqchi…'],
  ['Ничего не сказала рыбка и уплыла в глубокое море.','The fish said nothing and swam into the deep sea.','Baliq hech narsa demadi va chuqur dengizga suzib ketdi.'],
  ['Плеск!','Splash!','Shalp!'],
  ['Воротился старик к старухе. Глядь…','The old man went home. And look…','Chol uyiga qaytdi. Qarasa…'],
  ['…опять землянка, а перед старухой — разбитое корыто.','…the old dugout again, and the broken trough.','…yana yertola va singan tog‘ora.'],
  ['Жадность до добра не доводит!','Greed leads to no good!','Ochko‘zlik yaxshilikka olib bormaydi!'],
  ['Плюх!','Splash!','Shalp!']],
  panels:[{bg:'dugout',c:[['petr','stand',.62,'smile',1,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}],['natalya:fem','stand',.86,'calm',1,null,{torso:'#c0392b',sleeve:'#fdfefe',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#5d4037',hat:'platok',head:{accessoriesProbability:0}}]],b:[['caption',0,.5,.08]],o:[['prop','trough_broken',.4,.93,.45]]},
   {bg:'sea1',c:[['petr','stand',.3,'calm',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',1,.5,.08]],o:[['prop','fishnet',.62,.66,.6]]},
   {bg:'sea1',c:[['petr','stand',.28,'awe',0,'sparkle',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',2,.5,.08]],o:[['prop','fishnet',.66,.7,.55],['animal','goldfish',.66,.6,.55],['sfx',32,.8,.32,.6]]},
   {bg:'sea1',c:[['petr','stand',.25,'awe',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',3,.62,.2]],o:[['animal','goldfish',.74,.62,.7]]},
   {bg:'sea1',c:[['petr','wave',.3,'smile',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',4,.6,.14,0]],o:[['animal','goldfish',.78,.62,.35]]},
   {bg:'dugout',c:[['natalya:fem','akimbo',.55,'veryAngry',0,null,{torso:'#7f8c8d',sleeve:'#bdc3c7',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#5d4037',hat:'platok',head:{accessoriesProbability:0}}],['petr','stand',.85,'concerned',1,'sweat',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['shout',5,.45,.15,0]],o:[['prop','trough_broken',.25,.93,.45]]},
   {bg:'sea2',c:[['petr','bow',.3,'concerned',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',6,.62,.14,0]],o:[['animal','goldfish',.78,.62,.6]]},
   {bg:'sea2',c:[['petr','stand',.25,'smile',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',7,.65,.2]],o:[['animal','goldfish',.74,.62,.7]]},
   {bg:'dugout',c:[['natalya:fem','point',.5,'rage',0,null,{torso:'#7f8c8d',sleeve:'#bdc3c7',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#5d4037',hat:'platok',head:{accessoriesProbability:0}}],['petr','stand',.84,'concerned',1,'sweat',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['shout',8,.45,.15,0]],o:[['prop','trough',.22,.93,.45]]},
   {bg:'sea3',c:[['petr','bow',.3,'concerned',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',9,.5,.08],['speech',10,.62,.3,0]],o:[['animal','goldfish',.8,.62,.6]]},
   {bg:'sea3',c:[['petr','stand',.25,'smile',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',11,.65,.2]],o:[['animal','goldfish',.74,.62,.7]]},
   {bg:'izba',c:[['natalya:fem','akimbo',.25,'veryAngry',0,null,{torso:'#c0392b',sleeve:'#fdfefe',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#5d4037',hat:'platok',head:{accessoriesProbability:0}}],['petr','stand',.82,'concerned',1,'sweat',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',12,.5,.08],['shout',13,.4,.3,0]]},
   {bg:'sea4',c:[['petr','bow',.3,'concerned',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',14,.5,.08],['speech',15,.62,.3,0]],o:[['animal','goldfish',.8,.62,.6]]},
   {bg:'sea4',c:[['petr','stand',.25,'concerned',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',16,.65,.2]],o:[['animal','goldfish',.74,.62,.7]]},
   {bg:'terem',c:[['ivan','bow',.15,'calm',0,null,{outfit:'tsar',hat:'ushanka'}],['natalya:fem','stand',.5,'suspicious',0,'sparkle',{torso:'#1f618d',sleeve:'#f5cba7',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#c0392b',hat:'kokoshnik',head:{accessoriesProbability:0}}],['petr','stand',.85,'awe',1,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',17,.5,.08]]},
   {bg:'terem',c:[['natalya:fem','point',.3,'rage',0,null,{torso:'#1f618d',sleeve:'#f5cba7',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#c0392b',hat:'kokoshnik',head:{accessoriesProbability:0}}],['petr','facepalm',.78,'concerned',1,'sweat',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['shout',18,.35,.14,0],['speech',19,.7,.4,1]]},
   {bg:'sea5',c:[['petr','bow',.3,'fear',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',20,.5,.08],['speech',21,.62,.3,0]],o:[['animal','goldfish',.8,.62,.6]]},
   {bg:'sea5',c:[['petr','stand',.25,'concerned',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['speech',22,.65,.2]],o:[['animal','goldfish',.74,.62,.7]]},
   {bg:'palace',c:[['ruslan','stand',.12,'serious',0,null,{outfit:'knight',hat:'helmet'}],['natalya:fem','stand',.5,'suspicious',0,'sparkle',{outfit:'queen',hat:'crown',head:{accessoriesProbability:0}}],['ruslan','stand',.88,'serious',1,null,{outfit:'knight',hat:'helmet'}]],b:[['caption',23,.5,.08]],o:[['prop','battleaxe',.2,.8,.6],['prop','battleaxe',.8,.8,.6]]},
   {bg:'palace',c:[['natalya:fem','point',.32,'veryAngry',0,null,{outfit:'queen',hat:'crown',head:{accessoriesProbability:0}}],['petr','kneel',.78,'fear',1,'sweat',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['shout',24,.4,.14,0]]},
   {bg:'sea6',fx:'vignette',c:[['petr','kneel',.3,'fear',0,'sweat',{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',25,.5,.08],['speech',26,.62,.32,0]],o:[['animal','goldfish',.8,.62,.6]]},
   {bg:'sea6',fx:'vignette',c:[['petr','stand',.25,'awe',0,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',27,.5,.08]],o:[['animal','goldfish',.7,.62,.6],['sfx',28,.75,.4,.6]]},
   {bg:'sea1',c:[['petr','walk',.5,'tired',1,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',29,.5,.08]]},
   {bg:'dugout',c:[['natalya:fem','sitfloor',.55,'concerned',0,'tears',{torso:'#7f8c8d',sleeve:'#bdc3c7',deco:'sarafan',long:'dress',len:'ankle',pants:'SKIN',shoe:'#5d4037',hat:'platok',head:{accessoriesProbability:0}}],['petr','facepalm',.85,'tired',1,null,{torso:'#f5f0dc',sleeve:'#f5f0dc',deco:'kosov',long:null,len:null,pants:'#5d6d7e',shoe:'#c9a27a',shoeType:'sandal',boots:null,hat:null,beard:'#f2f3f4'}]],b:[['caption',30,.5,.08],['caption',31,.5,.92]],o:[['prop','trough_broken',.3,.93,.5]]}]},
 {cat:'tale',e:'🧜',title:['Русалочка и акула','The mermaid and the shark','Suv parisi va akula'],sub:['Морская сказка','Sea tale','Dengiz ertagi'],lines:[
  ['Глубоко в море жила Русалочка.','Deep in the sea lived a little mermaid.','Dengiz tubida kichkina suv parisi yashardi.'],
  ['Привет, рыбки! Привет, черепаха!','Hello, fish! Hello, turtle!','Salom, baliqchalar! Salom, toshbaqa!'],
  ['Ой… *акула*!','Uh-oh… a *shark*!','Voy… *akula*!'],
  ['Не бойтесь! Я ем *только водоросли*!','Don’t be scared! I only eat *seaweed*!','Qo‘rqmanglar! Men *faqat suvo‘t* yeyman!'],
  ['Акула и Русалочка стали друзьями.','The shark and the mermaid became friends.','Akula va suv parisi do‘st bo‘lishdi.'],
  ['Смотри, в море *мусор*! Рыбкам плохо.','Look, there’s *rubbish* in the sea! It’s bad for the fish.','Qara, dengizda *axlat*! Baliqchalarga yomon.'],
  ['Соберём его вместе!','Let’s pick it up together!','Uni birga yig‘amiz!'],
  ['Чистое море — счастливые жители!','A clean sea means happy sea creatures!','Toza dengiz — baxtli aholi!']],
  panels:[{bg:'underwater',c:[['rusalka','wave',.5,'smile']],b:[['caption',0,.5,.08]],o:[['animal','clownfish',.2,.5,.35]]},
   {bg:'underwater',c:[['rusalka','wave',.3,'smileBig',0,'hearts']],b:[['speech',1,.35,.13,0]],o:[['animal','turtle',.78,1,.9],['animal','fish',.75,.4,.3]]},
   {bg:'underwater',fx:'dark',c:[['rusalka','stand',.3,'fear',0,'sweat']],b:[['whisper',2,.3,.13,0]],o:[['animal','shark',.7,.72,1.8]]},
   {bg:'underwater',fx:'flash',c:[['rusalka','hug',.3,'smileLOL']],b:[['speech',3,.62,.13,null]],o:[['animal','shark',.7,.72,1.8]]},
   {bg:'underwater',c:[['rusalka','wave',.3,'smileBig']],b:[['caption',4,.5,.08]],o:[['animal','shark',.7,.72,1.8]]},
   {bg:'underwater',c:[['rusalka','point',.35,'concerned',0,'exclaim']],b:[['speech',5,.38,.14,0]],o:[['prop','waterbottle',.75,.85,.35],['prop','box',.88,.9,.35]]},
   {bg:'underwater',c:[['rusalka','squat',.35,'driven']],b:[['speech',6,.38,.14,0]],o:[['prop','shopbag',.62,.88,.4],['animal','octopus',.82,1,.5]]},
   {bg:'underwater',fx:'flash',c:[['rusalka','hooray',.4,'smileLOL',0,'hearts']],b:[['caption',7,.5,.08]],o:[['animal','clownfish',.8,.5,.4],['animal','turtle',.8,1,.8]]}]}
];
['school','fun','holiday','school','tale','tale','holiday','city','holiday','nature','fun','school','city','fun'].forEach((c,i)=>{if(TEMPLATES[i]&&!TEMPLATES[i].cat)TEMPLATES[i].cat=c;});
const TCATS=['all','school','nature','city','family','holiday','tale','fun'];
function tplOverride(cfg,ov){const o=OUTFIT_X.find(x=>x[0]===ov.outfit);if(o)applyOutfit(cfg,o[1]);Object.keys(ov).forEach(k=>{if(k==='outfit')return;if(k==='head'){cfg.head=Object.assign({},cfg.head,ov.head);return;}if(ov[k]==null)delete cfg[k];else cfg[k]=ov[k];});}
function buildTemplate(T){
 const p=newProject('4',L3(T.title));p.pages=[];
 for(let k=0;k<T.panels.length;k+=4){const n=Math.min(4,T.panels.length-k);p.pages.push(newPage({1:'1',2:'2h',3:'3',4:'4'}[n]));}
 T.panels.forEach((d,j)=>{const page=p.pages[Math.floor(j/4)],i=j%4,R=LAYOUTS[page.layout],[,,w,h]=R[i],P=page.panels[i];P.bg=d.bg;if(d.fx)P.fx=d.fx;if(d.flt)P.flt=d.flt;
  const ds=Math.min(h*0.82/780,w*0.9/420)*(d.c.length>2?0.62:d.c.length>1?0.78:0.92);
  (d.o||[]).filter(o=>o[0]!=='sfx').forEach(([ty,k,x,y,sc])=>{if(ty==='prop'&&CE.PROPS[k])P.items.push({id:uid(),t:'prop',k,x:w*x,y:h*y,s:ds*sc*1.6,r:0,flip:false});if(ty==='animal'&&CE.ANIMALS[k])P.items.push({id:uid(),t:'animal',k,x:w*x,y:Math.min(h-18,h*y),s:ds*sc,flip:true,sh:y>=1});});
  const chars=d.c.map(([idb,pose,x,face,flip,fx,ov])=>{const [id,body]=idb.split(':'),c=CE.CHARS.find(z=>z.id===id);if(!c)return null;const cfg=clone(c.config);if(body)cfg.body=body;if(ov)tplOverride(cfg,ov);const it={id:uid(),t:'char',nm:c.name,cfg,pose:CE.POSES[pose]?pose:'stand',face:face||null,fx:fx||null,prop:null,x:w*x,y:h-18,s:ds,flip:!!flip};P.items.push(it);return it;});
  // objects in front of the people (cakes, balls…) go after them
  P.items.sort((a,b)=>(a.t==='prop'&&a.y>h*0.8?1:0)-(b.t==='prop'&&b.y>h*0.8?1:0));
  const placed=[],bb=(d.b||[]).slice().sort((p,q)=>(q[0]==='caption')-(p[0]==='caption'));
  bb.forEach(([kind,li,x,y,ci])=>{const cap=kind==='caption',fs=Math.round(Math.max(22,Math.min(28,w/18)));
   const it={id:uid(),t:'bub',kind,text:L3(T.lines[li]),x:w*x,y:h*y,w:cap?w*0.9:Math.min(w*0.62,420),h:cap?60:100,fs,tdx:0,tdy:0};
   const ch=ci!=null?chars[ci]:null,g=bubbleGeom(it);
   if(ch&&!cap){if(it.y+g.h/2>ch.y-700*ch.s) it.y=Math.max(g.h/2+8,ch.y-700*ch.s-g.h/2-30);}
   // keep clear of captions / earlier bubbles that overlap horizontally
   placed.forEach(r=>{if(Math.abs(r.x-it.x)<(r.w+it.w)/2-10&&it.y-g.h/2<r.y+r.h/2+8&&it.y+g.h/2>r.y-r.h/2) it.y=r.y+r.h/2+g.h/2+10;});
   if(ch&&!cap){it.tdx=ch.x-it.x;it.tdy=Math.max(g.h/2+30,(ch.y-690*ch.s)-it.y);}
   placed.push({x:it.x,y:it.y,w:it.w,h:g.h});P.items.push(it);});
  (d.o||[]).filter(o=>o[0]==='sfx').forEach(([,li,x,y,sc])=>P.items.push({id:uid(),t:'sfx',text:L3(T.lines[li]),bg:'#f4d03f',fg:'#c0392b',x:w*x,y:h*y,s:ds*sc*1.4,r:-8}));
 });
 return p;
}
const THEMES=[
 ['Кот-повар готовит плов','A cat chef cooks plov','Mushuk oshpaz palov pishiradi'],
 ['Первый день в новой школе','First day at a new school','Yangi maktabdagi birinchi kun'],
 ['Робот учится танцевать','A robot learns to dance','Robot raqs tushishni o‘rganadi'],
 ['Потерянный ключ','The lost key','Yo‘qolgan kalit'],
 ['Путешествие на ковре-самолёте','A trip on a flying carpet','Uchar gilamda sayohat'],
 ['Собака, которая боялась кошек','The dog who was afraid of cats','Mushuklardan qo‘rqadigan it'],
 ['Сосед шумит ночью','The noisy neighbour','Kechasi shovqin qilgan qo‘shni'],
 ['Супергерой на пенсии','A retired superhero','Nafaqadagi superqahramon'],
 ['День наоборот','Opposite day','Teskari kun'],
 ['Первый раз за рулём','First time behind the wheel','Birinchi marta rulda'],
 ['Пришелец на базаре','An alien at the bazaar','Bozordagi o‘zga sayyoralik'],
 ['Как я готовил обед для всей семьи','Cooking lunch for the whole family','Butun oila uchun tushlik tayyorladim'],
 ['Снежная битва','The snowball fight','Qorbo‘ron jangi'],
 ['Говорящий арбуз','The talking watermelon','Gapiradigan tarvuz'],
 ['Опоздал на автобус','Missed the bus','Avtobusga kechikdim'],
 ['Свадьба в махалле','A wedding in the mahalla','Mahalladagi to‘y'],
 ['Пропавший кот','The missing cat','Yo‘qolgan mushuk'],
 ['Экзамен, к которому я не готов','The exam I wasn’t ready for','Tayyor bo‘lmagan imtihonim'],
 ['Динозавр в городе','A dinosaur in the city','Shahardagi dinozavr'],
 ['Бабушка осваивает смартфон','Grandma learns to use a smartphone','Buvim smartfonni o‘rganmoqda'],
 ['Поход в горы','A hike in the mountains','Toqqa sayohat'],
 ['Футбольный матч во дворе','Football in the yard','Hovlidagi futbol o‘yini'],
 ['Волшебная лампа','The magic lamp','Sehrli chiroq'],
 ['День рождения папы','Dad’s birthday','Dadamning tug‘ilgan kuni'],
 ['Космонавт на кухне','An astronaut in the kitchen','Oshxonadagi kosmonavt'],
 ['Урок, на котором все уснули','The lesson where everyone fell asleep','Hamma uxlab qolgan dars'],
 ['Как Насреддин помог соседу','How Nasreddin helped a neighbour','Nasriddin qo‘shnisiga qanday yordam berdi'],
 ['Мой лучший друг — попугай','My best friend is a parrot','Eng yaqin do‘stim — to‘tiqush'],
 ['Чайхана и большой секрет','The tea house and a big secret','Choyxona va katta sir'],
 ['Неудачная рыбалка','The worst fishing trip','Omadsiz baliq ovi']
];
function dailyTheme(){const d=new Date(),n=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);return L3(THEMES[n%THEMES.length]);}

/* ---------- panel editor ---------- */
const curPanel=()=>pg().panels[S.pi];
const curRect=()=>effRects(pg())[S.pi];
const selItem=()=>S.sel?curPanel().items.find(i=>i.id===S.sel):null;
function renderPanel(){
 const [,,w,h]=curRect(), n=pg().panels.length;
 $('#panel').innerHTML=`<div class="topbar"><button class="tb" id="eBack">${ic('back')}</button><div class="ttl">${t('panel')} ${S.pi+1}/${n}${S.proj.pages.length>1?' · '+t('page')+' '+(S.pg+1):''}</div>
 <button class="tb" id="eLayers">${ic('layers')}</button><button class="tb" id="eUndo">${ic('undo')}</button><button class="tb" id="eRedo">${ic('redo')}</button></div>
 <div class="stagewrap"><svg id="stage" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet"></svg><div class="zoombar"><button class="zb" id="zIn">+</button><button class="zb" id="zOut">−</button><button class="zb zf" id="zFit">1:1</button></div></div>
 <div class="bar ctx" id="ctx"></div>
 <div class="bar add" id="addbar">
  <button class="btn" data-a="char">${ic('person')}<span>${t('addChar')}</span></button>
  <button class="btn" data-a="bub">${ic('bubble')}<span>${t('addBubble')}</span></button>
  <button class="btn" data-a="prop">${ic('box')}<span>${t('addProp')}</span></button>
  <button class="btn" data-a="animal">${ic('paw')}<span>${t('addAnimal')}</span></button>
  <button class="btn" data-a="food">${ic('food')}<span>${t('addFood')}</span></button>
  <button class="btn" data-a="sfx">${ic('sound')}<span>${t('addSfx')}</span></button>
  <button class="btn" data-a="photo">${ic('photo')}<span>${t('addPhoto')}</span></button>
  <button class="btn" data-a="bg">${ic('image')}<span>${t('background')}</span></button>
  <button class="btn" data-a="pmenu">${ic('panels')}<span>${t('panelMenu')}</span></button></div>
 <div class="navrow"><button class="big" id="nPrev">‹ ${t('back')}</button><button class="big primary" id="nNext">${S.pi<n-1?t('next')+' ›':'✓ '+t('ok')}</button></div>`;
 const toPage=()=>{S.sel=null;saveProject(true);renderPage();show('page');};
 $('#eBack').onclick=toPage;
 $('#nPrev').onclick=()=>{if(S.pi>0){S.pi--;S.sel=null;saveProject(true);renderPanel();}else toPage();};
 $('#nNext').onclick=()=>{if(S.pi<n-1){S.pi++;S.sel=null;saveProject(true);renderPanel();}else toPage();};
 $('#eUndo').onclick=undo;$('#eRedo').onclick=redo;$('#eLayers').onclick=layersBox;
 $$('#addbar [data-a]').forEach(b=>b.onclick=()=>addAction(b.dataset.a));
 S.view={z:1,cx:w/2,cy:h/2};
 $('#zIn').onclick=()=>zoomBtn(1.4);$('#zOut').onclick=()=>zoomBtn(1/1.4);$('#zFit').onclick=()=>{S.view={z:1,cx:w/2,cy:h/2};applyView();};
 fitStage(); drawStage(); bindStage(); applyView();
}
function applyView(){const st=$('#stage');if(!st||!S.view)return;const [,,w,h]=curRect(),v=S.view;v.z=Math.max(1,Math.min(5,v.z));const vw=w/v.z,vh=h/v.z;
 v.cx=Math.max(vw/2,Math.min(w-vw/2,v.cx));v.cy=Math.max(vh/2,Math.min(h-vh/2,v.cy));
 st.setAttribute('viewBox',`${(v.cx-vw/2).toFixed(1)} ${(v.cy-vh/2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
 const zf=$('#zFit');if(zf)zf.textContent=v.z>1.01?Math.round(v.z*100)+'%':'1:1';drawSelection();}
function zoomAt(z,cx,cy){const v=S.view,p=svgPt({clientX:cx,clientY:cy});v.z=Math.max(1,Math.min(5,z));applyView();const q=svgPt({clientX:cx,clientY:cy});v.cx+=p.x-q.x;v.cy+=p.y-q.y;applyView();}
function zoomBtn(f){const st=$('#stage'),v=S.view;const it=selItem(),b=it?itemBox(it.id):null;
 if(b&&f>1){v.z=Math.min(5,v.z*f);v.cx=b.x+b.w/2;v.cy=b.y+b.h/2;applyView();return;}
 const r=st.getBoundingClientRect();zoomAt(v.z*f,r.left+r.width/2,r.top+r.height/2);}
function fitStage(){const wr=$('.stagewrap'),st=$('#stage');if(!wr||!st)return;const [,,w,h]=curRect();const aw=wr.clientWidth-8,ah=wr.clientHeight-8;let sw=aw,sh=aw*h/w;if(sh>ah){sh=ah;sw=ah*w/h;}st.style.width=Math.floor(sw)+'px';st.style.height=Math.floor(sh)+'px';}
function drawStage(){
 const [,,w,h]=curRect(), st=$('#stage'), sh=curPanel().shape||'rect';
 st.innerHTML=panelInner(curPanel(),w,h,true)+(sh!=='rect'&&sh!=='none'?shapeEl(0,0,w,h,sh,0).replace('/>',` fill="none" stroke="#c0392b" stroke-width="${f1(w/220)}" stroke-dasharray="${f1(w/50)} ${f1(w/70)}" pointer-events="none"/>`):'')+`<g id="selov"></g>`;
 drawSelection(); renderCtx();
}
function svgPt(e){const st=$('#stage'),p=st.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(st.getScreenCTM().inverse());}
function itemBox(id){
 const st=$('#stage'),el=st.querySelector(`.it[data-id="${id}"]`);if(!el)return null;
 const r=el.getBoundingClientRect(),m=st.getScreenCTM().inverse(),p1=st.createSVGPoint(),p2=st.createSVGPoint();
 p1.x=r.left;p1.y=r.top;p2.x=r.right;p2.y=r.bottom;const a=p1.matrixTransform(m),b=p2.matrixTransform(m);
 return {x:a.x,y:a.y,w:b.x-a.x,h:b.y-a.y};
}
function drawSelection(){
 const ov=$('#selov');if(!ov)return;ov.innerHTML='';const it=selItem();
 const [,,w,h]=curRect(),k=w/600/((S.view&&S.view.z)||1);
 let s=S.snap?`<path d="M${w/2} 0 V${h}" stroke="#e74c3c" stroke-width="${2*k}" stroke-dasharray="${10*k} ${6*k}" pointer-events="none"/>`:'';
 if(!it){ov.innerHTML=s;return;}
 const b=itemBox(it.id);if(!b){ov.innerHTML=s;return;}
 s+=`<rect x="${b.x-6}" y="${b.y-6}" width="${b.w+12}" height="${b.h+12}" fill="none" stroke="#2e86c1" stroke-width="${3*k}" stroke-dasharray="${12*k} ${8*k}" pointer-events="none"/>`;
 if(it.t==='bub'&&it.kind!=='caption'&&it.kind!=='title'){
  s+=`<circle data-handle="tail" cx="${it.x+(it.tdx||0)}" cy="${it.y+(it.tdy||0)}" r="${18*k}" fill="#2e86c1" fill-opacity=".85" stroke="#fff" stroke-width="${3*k}"/>`;
  if(it.t2) s+=`<circle data-handle="tail2" cx="${it.x+it.t2[0]}" cy="${it.y+it.t2[1]}" r="${18*k}" fill="#8e44ad" fill-opacity=".85" stroke="#fff" stroke-width="${3*k}"/>`;}
 ov.innerHTML=s;
}
let drag=null; const pointers=new Map();
function bindStage(){
 const st=$('#stage');
 st.addEventListener('pointerdown',e=>{
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2&&(!drag||drag.pan||drag.view)){ // pinch-zoom the view
   const ps=[...pointers.values()],mx=(ps[0].x+ps[1].x)/2,my=(ps[0].y+ps[1].y)/2;
   drag={view:true,d0:Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y)||1,z0:S.view.z,pm:svgPt({clientX:mx,clientY:my})};st.setPointerCapture(e.pointerId);e.preventDefault();return;}
  if(pointers.size===2&&drag&&drag.id){ // start pinch
   const ps=[...pointers.values()];drag.pinch={d0:Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),s0:selItem()?selItem().s||1:1};return;
  }
  const h=e.target.closest('[data-handle]'), g=e.target.closest('.it');
  const p=svgPt(e);
  if(h){const it=selItem(),two=h.dataset.handle==='tail2';drag={id:it.id,tail:two?2:1,sx:p.x,sy:p.y,ox:two?it.t2[0]:(it.tdx||0),oy:two?it.t2[1]:(it.tdy||0),moved:false};}
  else if(g){S.sel=g.dataset.id;const it=selItem();drag={id:it.id,sx:p.x,sy:p.y,ox:it.x,oy:it.y,moved:false};drawSelection();renderCtx();}
  else {S.sel=null;drawSelection();renderCtx();drag={pan:true,sx:e.clientX,sy:e.clientY,cx0:S.view.cx,cy0:S.view.cy};}
  st.setPointerCapture(e.pointerId);e.preventDefault();
 });
 st.addEventListener('pointermove',e=>{
  if(pointers.has(e.pointerId)) pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(!drag)return;
  if(drag.view){if(pointers.size<2)return;const ps=[...pointers.values()],d=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),mx=(ps[0].x+ps[1].x)/2,my=(ps[0].y+ps[1].y)/2;
   S.view.z=Math.max(1,Math.min(5,drag.z0*d/drag.d0));applyView();const q=svgPt({clientX:mx,clientY:my});S.view.cx+=drag.pm.x-q.x;S.view.cy+=drag.pm.y-q.y;applyView();return;}
  if(drag.pan){if(S.view.z<=1.001)return;const [,,w]=curRect(),sc=(w/S.view.z)/st.getBoundingClientRect().width;S.view.cx=drag.cx0-(e.clientX-drag.sx)*sc;S.view.cy=drag.cy0-(e.clientY-drag.sy)*sc;applyView();return;}
  const it=curPanel().items.find(i=>i.id===drag.id);if(!it)return;
  if(drag.pinch&&pointers.size>=2){const ps=[...pointers.values()];const d=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y);if(!drag.moved){pushUndo();drag.moved=true;}
   if(it.t==='bub'){it.fs=Math.max(14,Math.min(80,Math.round((drag.pinch.fs0||(drag.pinch.fs0=it.fs||30))*d/drag.pinch.d0)));}else{it.s=Math.max(0.1,Math.min(4,drag.pinch.s0*d/drag.pinch.d0));}
   liveUpdate(it);return;}
  const p=svgPt(e),dx=p.x-drag.sx,dy=p.y-drag.sy;
  if(!drag.moved&&Math.hypot(dx,dy)<4)return;
  if(!drag.moved){pushUndo();drag.moved=true;}
  if(drag.tail===2){it.t2=[drag.ox+dx,drag.oy+dy];}
  else if(drag.tail){it.tdx=drag.ox+dx;it.tdy=drag.oy+dy;}
  else{const [,,w]=curRect();it.x=drag.ox+dx;it.y=drag.oy+dy;S.snap=Math.abs(it.x-w/2)<w*0.018;if(S.snap)it.x=w/2;}
  liveUpdate(it);
 });
 const end=e=>{pointers.delete(e.pointerId);if(pointers.size>0&&drag&&(drag.pinch||drag.view))return;if(drag&&(drag.view||drag.pan)){drag=null;return;}S.snap=false;if(drag&&drag.moved){saveProject(true);drawSelection();}drag=null;};
 st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
 st.addEventListener('wheel',e=>{e.preventDefault();zoomAt(S.view.z*(e.deltaY<0?1.15:1/1.15),e.clientX,e.clientY);},{passive:false});
}
function liveUpdate(it){
 const el=$(`#stage .it[data-id="${it.id}"]`);if(el) el.innerHTML=itemSvg(it);drawSelection();
}
function mutate(fn){pushUndo();fn();saveProject(true);drawStage();}
function renderCtx(){
 const it=selItem(), c=$('#ctx'); if(!c)return;
 if(!it){c.innerHTML=`<div class="hint small">${t('hint')}</div>`;return;}
 const B=(a,icn,lab,on)=>`<button class="btn${on?' on':''}" data-c="${a}">${ic(icn)}<span>${lab}</span></button>`;
 let s='';
 if(it.t==='char') s+=B('pose','pose',t('pose'))+B('face','face',t('emotion'))+B('fx','star',t('effect'))+B('hold','hand',t('holdItem'))+((it.prop||(it.prop!==false&&(CE.POSES[it.pose]||{}).propF))?B('pplus','zoomin',t('itemBig'))+B('pminus','zoomout',t('itemSmall')):'')+B('swap','flip',t('otherHand'),it.sw)+B('head','face',t('headTurn'))+B('outfit','person',t('outfit'))+B('shoes','shoe',t('shoes'))+B('hat','hat',t('hat'))+B('hair','hair',t('hair'))+B('skin','palette',t('skin'))+B('body','body',t('body'))+B('frame','frame',t('frame'));
 if(it.t==='food') s+=B('fface','face',t('emotion'))+B('farms','pose',t('arms'));
 if(it.t==='bub') s+=B('text','text',t('text'))+B('btype','bubble',t('type'))+B('font','font',t('font'))+B('fplus','zoomin',t('fontPlus'))+B('fminus','zoomout',t('fontMinus'))+B('wider','wider',t('wider'))+B('narrower','narrower',t('narrower'))+
  (it.kind!=='caption'&&it.kind!=='title'?B('bend','bend',t('bend'),it.bend)+(it.kind!=='radio'?B('tail2','tail2',t('tail2'),it.t2):''):'');
 if(it.t==='sfx') s+=B('sfxtext','text',t('text'))+B('rot','rotate',t('rotate'));
 if(it.t==='prop') s+=B('rot','rotate',t('rotate'))+((CE.PROPS[it.k]||[,''])[1].indexOf('#e74c3d')>=0?B('pcolor','palette',t('color')):'');
 if(it.t==='img') s+=B('ishape','frame',t('shape'))+B('iborder','box',t('borderLine'),it.border!==false)+B('rot','rotate',t('rotate'));
 if(it.t!=='bub') s+=B('bigger','zoomin',t('bigger'))+B('smaller','zoomout',t('smaller'));
 if(it.t!=='bub'&&it.t!=='sfx') s+=B('flip','flip',t('flip'));
 if(it.t==='char'||it.t==='animal'||it.t==='food') s+=B('shadow','shadow',t('shadow'),it.sh!==false);
 s+=B('dup','copy',t('dup'))+B('copy','clip',t('copyItem'))+B('center','center',t('center'))+B('up','up',t('front'))+B('down','down',t('backward'))+B('lock','lock',t('lock'))+B('del','trash',t('del'));
 c.innerHTML=s;
 $$('#ctx [data-c]').forEach(b=>b.onclick=()=>ctxAction(b.dataset.c));
}
function newIds(items){const map={};items.forEach(i=>{const n=uid();map[i.id]=n;i.id=n;});items.forEach(i=>{if(i.seat)i.seat=map[i.seat]||null;if(!i.seat)delete i.seat;});return items;}
function ctxAction(a){
 const it=selItem();if(!it)return;const P=curPanel();
 switch(a){
  case 'bigger':mutate(()=>{it.s=Math.min(4,(it.s||1)*1.15);});break;
  case 'smaller':mutate(()=>{it.s=Math.max(0.1,(it.s||1)/1.15);});break;
  case 'flip':mutate(()=>{it.flip=!it.flip;});break;
  case 'pcolor':pickColor(c=>mutate(()=>{it.color=c;}));break;
  case 'pplus':mutate(()=>{it.ps=Math.min(4,(it.ps||1)*1.2);});break;
  case 'pminus':mutate(()=>{it.ps=Math.max(0.3,(it.ps||1)/1.2);});break;
  case 'rot':mutate(()=>{it.r=((it.r||0)+15)%360;});break;
  case 'up':mutate(()=>{const i=P.items.indexOf(it);if(i<P.items.length-1){P.items.splice(i,1);P.items.splice(i+1,0,it);}});break;
  case 'down':mutate(()=>{const i=P.items.indexOf(it);if(i>0){P.items.splice(i,1);P.items.splice(i-1,0,it);}});break;
  case 'del':mutate(()=>{P.items.splice(P.items.indexOf(it),1);S.sel=null;});break;
  case 'fplus':mutate(()=>{it.fs=Math.min(80,(it.fs||30)+4);});break;
  case 'fminus':mutate(()=>{it.fs=Math.max(14,(it.fs||30)-4);});break;
  case 'wider':mutate(()=>{it.w=Math.min(curRect()[2]*1.2,it.w*1.15);});break;
  case 'narrower':mutate(()=>{it.w=Math.max(80,it.w/1.15);it.h=Math.max(50,it.h/1.15);});break;
  case 'text':textBox(t('enterText'),it.text,v=>mutate(()=>{it.text=v;}),true);break;
  case 'sfxtext':pickSfx(sf=>mutate(()=>{Object.assign(it,sf);}));break;
  case 'btype':pickBubble(k=>mutate(()=>{it.kind=k;}));break;
  case 'bend':mutate(()=>{it.bend=it.bend===1?-1:(it.bend===-1?0:1);});break;
  case 'tail2':mutate(()=>{if(it.t2)delete it.t2;else it.t2=[-(it.tdx||0)||-it.w*0.4,it.tdy||it.w*0.5];});break;
  case 'shadow':mutate(()=>{it.sh=it.sh===false;});break;
  case 'ishape':sheet(t('shape'),['rect','round','circle','oval'].map(k=>({v:k,svg:`<svg viewBox="-170 -170 340 340">${imgShape({shape:k},300,300/(it.ar||1)).replace('/>',' fill="#d6eaf8" stroke="#1b1b1b" stroke-width="10"/>')}</svg>`,label:t('sh_'+k)})),k=>mutate(()=>{it.shape=k;}),'small');break;
  case 'iborder':mutate(()=>{it.border=it.border===false;});break;
  case 'dup':mutate(()=>{const c=newIds([clone(it)])[0];c.x+=30;c.y+=c.t==='bub'?30:0;delete c.lock;P.items.splice(P.items.indexOf(it)+1,0,c);S.sel=c.id;});break;
  case 'copy':S.clip=clone(it);toast(t('copied'));break;
  case 'center':mutate(()=>{it.x=curRect()[2]/2;});break;
  case 'lock':mutate(()=>{it.lock=true;S.sel=null;});toast(t('lockedHint'));break;
  case 'pose':pickPose(it,k=>mutate(()=>{it.pose=k;it.face=null;delete it.seat;if((CE.POSES[k]||{}).seat&&seatOn(it,curPanel())){}else if(it.frame&&it.frame!=='full')applyFrame(it,it.frame);const veh=curPanel().items.find(c=>c.t==='prop'&&VEH[c.k]&&VEH[c.k].poses.includes(k));if(veh){const n=curPanel().items.filter(c=>c!==it&&c.t==='char'&&(k==='passenger'?c.pose==='passenger':(VEH[veh.k].poses.includes(c.pose)&&c.pose!=='passenger'))).length;seatIn(it,veh,k==='drive'?0:n);}}));break;
  case 'face':pickFace(it,k=>mutate(()=>{it.face=k;}));break;
  case 'fx':pickFx(it,k=>mutate(()=>{it.fx=k;}));break;
  case 'hold':pickProp(t('holdItem'),k=>mutate(()=>{it.prop=k===null?false:k;}),true);break;
  case 'outfit':pickOutfit(it,src=>mutate(()=>applyOutfit(it.cfg,src)));break;
  case 'hat':pickHat(it,k=>mutate(()=>{if(k)it.cfg.hat=k;else delete it.cfg.hat;delete it.cfg.backHat;}));break;
  case 'hair':pickHair(it,k=>mutate(()=>{it.cfg.head=Object.assign({},it.cfg.head,{head:[k]});}));break;
  case 'skin':pickSkin(hex=>mutate(()=>setSkin(it.cfg,hex)));break;
  case 'frame':pickFrame(it,f=>mutate(()=>applyFrame(it,f)));break;
  case 'fface':sheet(t('emotion'),CE.FFACES.map(k=>({v:k,svg:`<svg viewBox="40 20 220 220">${CE.food(it.k,k,it.arms)}</svg>`,label:''})),k=>mutate(()=>{it.face=k;}),'small');break;
  case 'farms':sheet(t('arms'),CE.FARMS.map(k=>({v:k,svg:`<svg viewBox="0 0 300 300">${CE.food(it.k,it.face,k)}</svg>`,label:lmap(I.arms,k)})),k=>mutate(()=>{it.arms=k;}),'small');break;
  case 'font':sheet(t('font'),['sans','comic','loud','type'].map(k=>{const F=FONTS[k];return {v:k,svg:`<svg viewBox="0 0 200 120"><text x="100" y="75" text-anchor="middle" font-family="${F.f}" font-weight="${F.w}" font-size="${Math.round(46*F.k)}" fill="#1b1b1b">${F.up?'АБВ!':'Абв!'}</text></svg>`,label:t('font_'+k)};}),k=>mutate(()=>{it.font=k;}),'small');break;
  case 'body':bodyBox(it);break;
  case 'head':headBox(it);break;
  case 'swap':mutate(()=>{if(it.sw)delete it.sw;else it.sw=1;});break;
  case 'shoes':sheet(t('shoes'),SHOES.map(([k,col,boots])=>{const cf=Object.assign(clone(it.cfg),{shoeType:k==='boots'?'shoe':k,shoe:col});if(boots)cf.boots=1;else delete cf.boots;return {v:k,svg:`<svg viewBox="150 680 300 260">${CE.figure(Object.assign({},CE.POSES.stand),cf,{})}</svg>`,label:t('sh_'+k)};}),k=>mutate(()=>{const e=SHOES.find(x=>x[0]===k);it.cfg.shoeType=k==='boots'?'shoe':k;it.cfg.shoe=e[1];if(e[2])it.cfg.boots=1;else delete it.cfg.boots;}),'small');break;
 }
}
const OUTFIT_KEYS=['torso','sleeve','sleeveW','pants','legW','shoe','shoeType','boots','long','len','deco','trim','skirt','shorts','sleeveLen','crop'];
function applyOutfit(cfg,src){OUTFIT_KEYS.forEach(k=>{if(src[k]!==undefined)cfg[k]=clone(src[k]);else delete cfg[k];});if(src.long==='skirt'||src.pants===src.skin||src.pants==='SKIN')cfg.pants=cfg.skin;if(src.sleeve==='SKIN')cfg.sleeve=cfg.skin;if(src.torso==='SKIN')cfg.torso=cfg.skin;}
const OUTFIT_X=[['tee_shorts',{torso:'#e74c3c',sleeve:'#e74c3c',sleeveLen:'short',pants:'SKIN',shorts:'#2e86c1',legW:38,shoe:'#fdfefe'}],['tank_shorts',{torso:'#f4d03f',sleeve:'#f4d03f',sleeveLen:'none',pants:'SKIN',shorts:'#27ae60',legW:38,shoe:'#e74c3c'}],['tee_jeans',{torso:'#fdfefe',sleeve:'#fdfefe',sleeveLen:'short',pants:'#2471a3',shoe:'#1b1b1b'}],['crop_skirt',{torso:'#f1948a',sleeve:'#f1948a',sleeveLen:'none',crop:1,long:'skirt',skirt:'#5dade2',pants:'SKIN',legW:30,shoe:'#fdfefe'}],['summer_dress',{torso:'#f7dc6f',sleeve:'#f7dc6f',sleeveLen:'short',long:'dress',pants:'SKIN',legW:30,shoe:'#e74c3c'}],['tracksuit',{torso:'#2e86c1',sleeve:'#2e86c1',pants:'#2e86c1',deco:'sport',shoe:'#fdfefe'}],['sweater',{torso:'#7d3c98',sleeve:'#7d3c98',pants:'#2c3e50',shoe:'#5d4037'}],['shirt_trousers',{torso:'#aed6f1',sleeve:'#aed6f1',pants:'#566573',shoe:'#1b1b1b'}],
 ['jacket',{torso:'#5d6d7e',sleeve:'#5d6d7e',deco:'jacket',trim:'#fdfefe',pants:'#2471a3',shoe:'#3b2a20',shoeType:'shoe'}],
 ['jacket_brown',{torso:'#8d5524',sleeve:'#8d5524',deco:'jacket',trim:'#f9e79f',pants:'#2c3e50',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['vest',{torso:'#7b241c',sleeve:'#fdfefe',deco:'vest',trim:'#fdfefe',pants:'#2c3e50',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['uniform_boy',{torso:'#1f3a68',sleeve:'#1f3a68',deco:'school',pants:'#1f3a68',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['uniform_girl',{torso:'#fdfefe',sleeve:'#fdfefe',deco:'schoolgirl',long:'skirt',skirt:'#1f3a68',pants:'SKIN',legW:30,shoe:'#1b1b1b',shoeType:'shoe'}],
 ['parka',{torso:'#2e86c1',sleeve:'#2e86c1',sleeveW:40,deco:'parka',pants:'#2c3e50',shoe:'#1b1b1b',shoeType:'shoe',boots:1}],
 ['north',{torso:'#8d6e63',sleeve:'#8d6e63',sleeveW:42,long:'coat',len:'knee',deco:'north',pants:'#5d4037',shoe:'#5d4037',shoeType:'shoe',boots:1}],
 ['native',{torso:'#c8a165',sleeve:'#c8a165',long:'tunic',deco:'native',pants:'#8d6e63',shoe:'#8d6e63',shoeType:'shoe'}],
 ['kimono',{torso:'url(#kim)',sleeve:'url(#kim)',sleeveW:50,long:'dress',len:'ankle',deco:'kimono',pants:'#1b2a49',shoe:'#fdfefe',shoeType:'sandal'}],
 ['kurta',{torso:'#fdebd0',sleeve:'#fdebd0',long:'tunic',deco:'kurta',pants:'#fdfefe',shoe:'#8d5524',shoeType:'sandal'}],
 ['sari',{torso:'url(#sari)',sleeve:'SKIN',sleeveW:26,long:'dress',len:'ankle',deco:'sari',pants:'#e67e22',shoe:'#d4ac0d',shoeType:'sandal'}],
 ['doctor',{torso:'#fdfefe',sleeve:'#fdfefe',long:'coat',deco:'doctor',pants:'#2e86c1',shoe:'#fdfefe',shoeType:'shoe'}],
 ['nurse',{torso:'#fdfefe',sleeve:'#fdfefe',sleeveW:34,long:'dress',len:'knee',deco:'nurse',pants:'SKIN',shoe:'#fdfefe',shoeType:'shoe'}],
 ['surgeon',{torso:'#48c9b0',sleeve:'#48c9b0',sleeveW:34,deco:'scrubs',pants:'#48c9b0',shoe:'#fdfefe',shoeType:'sneaker'}],
 ['chef',{torso:'#fdfefe',sleeve:'#fdfefe',deco:'chef',pants:'url(#check)',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['builder',{torso:'#5d6d7e',sleeve:'#5d6d7e',deco:'hivis',pants:'#2e6da4',shoe:'#5d4037',shoeType:'shoe',boots:1}],
 ['miner',{torso:'#2c3e50',sleeve:'#2c3e50',deco:'miner',pants:'#2c3e50',shoe:'#1b1b1b',shoeType:'shoe',boots:1}],
 ['scuba',{torso:'#1b1b1b',sleeve:'#1b1b1b',deco:'scuba',pants:'#1b1b1b',shoe:'#f4d03f',shoeType:'flippers'}],
 ['navy',{torso:'#fdfefe',sleeve:'#fdfefe',deco:'navy',pants:'#1b2a49',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['pilot',{torso:'#1b2a49',sleeve:'#1b2a49',deco:'pilot',pants:'#1b2a49',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['military',{torso:'url(#camo)',sleeve:'url(#camo)',deco:'military',pants:'url(#camo)',shoe:'#1b1b1b',shoeType:'shoe',boots:1}],
 ['firefighter',{torso:'#34495e',sleeve:'#34495e',deco:'fire',pants:'#34495e',shoe:'#1b1b1b',shoeType:'shoe',boots:1}],
 ['policeman',{torso:'#85c1e9',sleeve:'#85c1e9',deco:'police',pants:'#1f3a68',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['pirate',{torso:'#922b21',sleeve:'#922b21',sleeveW:40,long:'coat',len:'knee',deco:'pirate',pants:'#1b1b1b',shoe:'#1b1b1b',shoeType:'shoe',boots:1}],
 ['sailor',{torso:'url(#strp)',sleeve:'url(#strp)',deco:'sailor',pants:'#5d6d7e',shoe:'#1b1b1b',shoeType:'shoe',boots:1}],
 ['viking',{torso:'#7e5109',sleeve:'#7e5109',sleeveW:40,long:'tunic',deco:'viking',pants:'#5d4037',shoe:'#3b2a20',shoeType:'shoe',boots:1}],
 ['astro',{torso:'#fdfefe',sleeve:'#fdfefe',sleeveW:44,deco:'astro',pants:'#fdfefe',legW:52,shoe:'#d5d8dc',shoeType:'shoe',boots:1}],
 ['samurai',{torso:'#1b2a49',sleeve:'#1b2a49',sleeveW:42,long:'tunic',deco:'samurai',pants:'#5d6d7e',shoe:'#3b2a20',shoeType:'sandal'}],
 ['wizard',{torso:'#1f3a93',sleeve:'#1f3a93',sleeveW:46,long:'dress',len:'ankle',deco:'wizard',pants:'#1f3a93',shoe:'#5d4037',shoeType:'shoe'}],
 ['sultan',{torso:'#1a5276',sleeve:'#1a5276',sleeveW:42,long:'coat',len:'ankle',deco:'sultan',pants:'#fdfefe',shoe:'#d4ac0d',shoeType:'shoe'}],
 ['cowboy',{torso:'#f4d03f',sleeve:'#f4d03f',deco:'cowboy',pants:'#2471a3',shoe:'#8b5a2b',shoeType:'shoe',boots:1}],
 ['knight_full',{torso:'#aab7b8',sleeve:'#aab7b8',sleeveW:42,deco:'plate',pants:'#aab7b8',legW:50,shoe:'#7f8c8d',shoeType:'shoe',boots:1}],
 ['caveman',{torso:'SKIN',sleeve:'SKIN',sleeveLen:'none',long:'tunic',deco:'caveman',pants:'SKIN',shoe:'#8d6e63',shoeType:'shoe'}],
 ['toga',{torso:'#fdfefe',sleeve:'SKIN',sleeveLen:'none',long:'dress',len:'ankle',deco:'toga',pants:'SKIN',shoe:'#8d5524',shoeType:'sandal'}],
 ['egypt',{torso:'SKIN',sleeve:'SKIN',sleeveLen:'none',long:'tunic',deco:'egypt',pants:'SKIN',shoe:'#d4ac0d',shoeType:'sandal'}],
 ['egyptw',{torso:'#fdfefe',sleeve:'SKIN',sleeveLen:'none',long:'dress',len:'ankle',deco:'egyptw',pants:'SKIN',shoe:'#d4ac0d',shoeType:'sandal'}],
 ['king',{torso:'#922b21',sleeve:'#922b21',sleeveW:42,long:'coat',len:'ankle',deco:'royal',pants:'#1b1b1b',shoe:'#1b1b1b',shoeType:'shoe'}],
 ['queen',{torso:'#5b2c6f',sleeve:'#5b2c6f',long:'dress',len:'ankle',deco:'royal',pants:'SKIN',shoe:'#d4ac0d',shoeType:'shoe'}],
 ['tsar',{torso:'url(#zar)',sleeve:'url(#zar)',sleeveW:42,long:'coat',len:'ankle',deco:'tsar',pants:'#c0392b',shoe:'#c0392b',shoeType:'shoe',boots:1}],
 ['knight',{torso:'#aab7b8',sleeve:'#aab7b8',sleeveW:40,deco:'armor',pants:'#7f8c8d',legW:48,shoe:'#566573',shoeType:'shoe',boots:1}],
 ['football',{torso:'#c0392b',sleeve:'#c0392b',sleeveLen:'short',deco:'sport',pants:'SKIN',shorts:'#fdfefe',legW:38,shoe:'#1b1b1b',shoeType:'sneaker'}]];
function setSkin(cfg,hex){const old=cfg.skin;cfg.skin='#'+hex;cfg.head=Object.assign({},cfg.head,{skinColor:[hex]});if(cfg.pants===old)cfg.pants=cfg.skin;if(cfg.sleeve===old)cfg.sleeve=cfg.skin;}
function defaultScale(){const [,,w,h]=curRect();return Math.min(h*0.82/780,w*0.9/420);}
const SEAT={chair:{y:98,g:185,x:[100]},sofa:{y:108,g:180,x:[62,138]},bench:{y:118,g:182,x:[55,100,145]},armchair:{y:110,g:184,x:[100]},sofa_big:{y:134,g:183,x:[48,100,152]},stool:{y:108,g:184,x:[100]}};
function seatOn(it,P){ // put a seated character on the nearest free seat prop in the panel
 const seats=P.items.filter(c=>c.t==='prop'&&SEAT[c.k]);if(!seats.length)return false;
 let best=null;seats.forEach(sp=>{const d=Math.abs(sp.x-it.x);if(!best||d<best.d)best={sp,d};});
 const sp=best.sp,g=SEAT[sp.k],pose=CE.POSES[it.pose],hip=900-pose.H[1]-18;
 if(!sp.fit){const gy=sp.y+(g.g-100)*sp.s;sp.s=hip*it.s/(g.g-g.y);sp.y=gy-(g.g-100)*sp.s;sp.fit=1;} else it.s=(g.g-g.y)*sp.s/hip;
 const slots=g.x.map(x=>sp.x+(x-100)*sp.s*(sp.flip?-1:1));
 const taken=P.items.filter(c=>c!==it&&c.t==='char'&&c.seat===sp.id).map(c=>c.slot);
 let si=slots.map((x,i)=>i).filter(i=>!taken.includes(i)).sort((a,b)=>Math.abs(slots[a]-it.x)-Math.abs(slots[b]-it.x))[0];if(si===undefined)si=0;
 it.slot=si;it.seat=sp.id;it.frame=null;
 it.x=slots[si]-(pose.H[0]-300)*it.s*(it.flip?-1:1);it.y=sp.y+(g.g-100)*sp.s-(g.g-g.y)*sp.s+(hip)*it.s;
 const i=P.items.indexOf(it),j=P.items.indexOf(sp);if(i<j){P.items.splice(i,1);P.items.splice(P.items.indexOf(sp)+1,0,it);}
 return true;}
function charTop(cfg){ // head top of this character standing, without hat (figure coords)
 const sv=document.createElementNS('http://www.w3.org/2000/svg','svg');sv.setAttribute('width','10');sv.setAttribute('height','10');sv.style.cssText='position:absolute;left:-9999px;top:0';document.body.appendChild(sv);
 const c=clone(cfg);delete c.hat;delete c.backHat;sv.innerHTML='<g>'+CE.figure(Object.assign({},CE.POSES.stand),c,{})+'</g>';let y=200;try{y=sv.firstChild.getBBox().y;}catch(e){}sv.remove();return y;}
function applyFrame(it,f){
 const [,,w,h]=curRect();it.frame=f;
 if(f==='full'){it.s=defaultScale();it.y=h-18;return;}
 const r=(900-charTop(it.cfg))/700, hy=900-(900-(CE.POSES[it.pose]||CE.POSES.stand).H[1])*r, top=hy-395*r;
 if(f==='waist'){const b=hy+40*r;it.s=0.72*h/(b-top);it.y=h+(900-b)*it.s;}
 else {const b=hy-80*r;it.s=0.66*h/(b-top);it.y=h+(900-b)*it.s;}
}
function pickFrame(it,cb){
 const r=(900-charTop(it.cfg))/700, hy=900-(900-(CE.POSES[it.pose]||CE.POSES.stand).H[1])*r, top=hy-395*r;
 const vb={full:'80 60 540 880',waist:`${300-250*r} ${top-150*r} ${500*r} ${hy+40*r-top+150*r}`,close:`${300-200*r} ${top-100*r} ${400*r} ${hy-80*r-top+100*r}`};
 const p=Object.assign({},CE.POSES[it.pose]||CE.POSES.stand);if(it.face)p.face=it.face;
 sheet(t('frame'),['full','waist','close'].map(k=>({v:k,svg:`<svg viewBox="${vb[k]}" preserveAspectRatio="xMidYMin slice">${CE.figure(p,it.cfg,{})}</svg>`,label:t('fr_'+k)})),cb,'tall');
}
function addAction(a){
 const [,,w,h]=curRect(), P=curPanel();
 if(a==='bg') return pickBg(k=>{if(k==='photo')return pickImage(id=>mutate(()=>{P.bg='img:'+id;}));mutate(()=>{P.bg=k;});});
 if(a==='pmenu') return panelMenu();
 if(a==='photo') return pickImage((id,ar)=>mutate(()=>{const it={id:uid(),t:'img',k:id,ar,shape:'rect',x:w/2,y:h/2,s:Math.min(w*0.5/300,h*0.5/(300/ar)),r:0,flip:false};P.items.push(it);S.sel=it.id;}));
 if(a==='char') return pickChar(c=>mutate(()=>{const it={id:uid(),t:'char',nm:c.name,cfg:clone(c.config),pose:c.defaultPose||'stand',face:null,fx:null,prop:null,x:w*[0.3,0.7,0.5,0.15,0.85][P.items.filter(i=>i.t==='char').length%5],y:h-18,s:defaultScale(),flip:P.items.filter(i=>i.t==='char').length%2===1};P.items.push(it);S.sel=it.id;}));
 if(a==='bub') return pickBubble(k=>mutate(()=>{const bw=Math.min(w*0.55,420);const it={id:uid(),t:'bub',kind:k,text:t('helloBubble'),x:w/2,y:Math.max(90,h*0.16),w:bw,h:110,fs:Math.round(Math.max(22,Math.min(34,w/22))),tdx:0,tdy:(k==='caption'||k==='title')?0:h*0.18};if(k==='title'){it.text=t('titleSample');it.fs=Math.round(it.fs*1.4);}P.items.push(it);S.sel=it.id;}));
 if(a==='prop') return pickProp(t('addProp'),k=>{if(!k)return;mutate(()=>{const it={id:uid(),t:'prop',k,x:w/2,y:h*0.7,s:defaultScale()*0.9,r:0,flip:false};if(/^table_(front|cloth)/.test(k)){it.s=w*1.04/200;it.x=w/2;it.y=h*0.86-50*it.s;}const vh=VEH[k];if(vh){it.s=Math.min(defaultScale()*vh.k*0.85,w*0.98/200);it.y=vh.air?h*0.45:h-18-92*it.s;}P.items.push(it);S.sel=it.id;if(vh)seatAll(it);});});
 if(a==='animal') return pickAnimal(k=>mutate(()=>{const it={id:uid(),t:'animal',k,x:w/2,y:h-18,s:defaultScale()*0.9,flip:false};P.items.push(it);S.sel=it.id;}));
 if(a==='food') return sheet(t('addFood'),Object.keys(CE.FOOD).map(k=>({v:k,svg:`<svg viewBox="0 0 300 300">${CE.food(k,'smile','down')}</svg>`,label:foodName(k)})),k=>mutate(()=>{const it={id:uid(),t:'food',k,face:'smile',arms:'down',x:w*[0.3,0.7,0.5][P.items.filter(i=>i.t==='food').length%3],y:h-18,s:Math.min(h*0.62/290,w*0.45/300),flip:P.items.filter(i=>i.t==='food').length%2===1};P.items.push(it);S.sel=it.id;}));
 if(a==='sfx') return pickSfx(sf=>mutate(()=>{const it=Object.assign({id:uid(),t:'sfx',x:w/2,y:h*0.3,s:defaultScale()*0.9,r:-8},sf);P.items.push(it);S.sel=it.id;}));
}
/* previous panel (also the last panel of the previous page) */
function prevPanel(){if(S.pi>0)return [pg().panels[S.pi-1],effRects(pg())[S.pi-1]];if(S.pg>0){const pp=S.proj.pages[S.pg-1],n=pp.panels.length;return [pp.panels[n-1],effRects(pp)[n-1]];}return null;}
function copyInto(src,srcRect){ // replace this panel with a copy of src, scaled to this panel's size
 const [,,w,h]=curRect(),kx=w/srcRect[2],ky=h/srcRect[3],ks=Math.min(kx,ky),P=curPanel(),c=clone(src);
 c.items.forEach(i=>{i.x*=kx;i.y*=ky;if(i.s)i.s*=ks;if(i.t==='bub'){i.w*=ks;i.h*=ks;i.fs=Math.round((i.fs||30)*ks);i.tdx=(i.tdx||0)*kx;i.tdy=(i.tdy||0)*ky;if(i.t2)i.t2=[i.t2[0]*kx,i.t2[1]*ky];}});
 newIds(c.items);Object.keys(P).forEach(k=>delete P[k]);Object.assign(P,c);
}
function panelMenu(){
 const P=curPanel(),pv=prevPanel(),A=[];
 const cell=(v,icn,label)=>({v,svg:`<svg viewBox="0 0 48 48" class="ic"><path d="${ICON[icn]}"/></svg>`,label});
 if(pv) A.push(cell('copyPrev','copy',t('copyPrev')));
 if(S.clip) A.push(cell('paste','clip',t('paste')));
 A.push(cell('shape','frame',t('panelShape')),cell('fx','star',t('panelFx')),cell('filter','palette',t('filter')),cell('blur','image',P.blur?t('blurOff'):t('blurOn')),cell('mirror','flip',t('mirror')),cell('clear','trash',t('clearPanel')));
 sheet(t('panelMenu'),A,v=>{
  if(v==='copyPrev'){const go=()=>mutate(()=>copyInto(pv[0],pv[1]));if(P.items.length)confirmBox(t('replaceQ'),go);else go();}
  if(v==='paste') mutate(()=>{const c=newIds([clone(S.clip)])[0];delete c.seat;delete c.lock;delete c.hid;P.items.push(c);S.sel=c.id;});
  if(v==='shape') sheet(t('panelShape'),['rect','round','slantL','slantR','circle','none'].map(k=>({v:k,svg:`<svg viewBox="-10 -10 220 160">${shapeEl(0,0,200,140,k,0).replace('/>',` fill="#f9e79f" stroke="#1b1b1b" stroke-width="${k==='none'?0:8}"/>`)}</svg>`,label:t('ps_'+k)})),k=>mutate(()=>{if(k==='rect')delete P.shape;else P.shape=k;}),'small');
  if(v==='fx') sheet(t('panelFx'),['none','speed','flash','vignette','dark','dots'].map(k=>({v:k,svg:`<svg viewBox="0 0 300 210"><rect width="300" height="210" fill="#d6eaf8"/>${fxUnder(k,300,210)}<circle cx="150" cy="110" r="34" fill="#f4d03f" stroke="#1b1b1b" stroke-width="5"/>${fxOver(k,300,210)}</svg>`,label:t('pfx_'+k)})),k=>mutate(()=>{if(k==='none')delete P.fx;else P.fx=k;}),'wide');
  if(v==='filter') sheet(t('filter'),['none','sepia','bw'].map(k=>({v:k,svg:`<svg viewBox="0 0 300 210"><g${k==='none'?'':` filter="url(#${k==='bw'?'cmBw':'cmSepia'})"`}><rect width="300" height="210" fill="#5dade2"/><rect y="140" width="300" height="70" fill="#27ae60"/><circle cx="230" cy="55" r="30" fill="#f4d03f"/><rect x="60" y="80" width="80" height="80" fill="#e74c3c" stroke="#1b1b1b" stroke-width="5"/></g></svg>`,label:t('flt_'+k)})),k=>mutate(()=>{if(k==='none')delete P.flt;else P.flt=k;}),'wide');
  if(v==='blur') mutate(()=>{if(P.blur)delete P.blur;else P.blur=1;});
  if(v==='mirror') mutate(()=>{const [,,w]=curRect();P.items.forEach(i=>{i.x=w-i.x;if(i.t==='bub'){i.tdx=-(i.tdx||0);if(i.t2)i.t2=[-i.t2[0],i.t2[1]];}else if(i.t!=='sfx')i.flip=!i.flip;if(i.r)i.r=(360-i.r)%360;});});
  if(v==='clear') confirmBox(t('clearQ'),()=>mutate(()=>{P.items=[];S.sel=null;}));
 });
}
function itemLabel(it){
 if(it.t==='char') return it.nm?translit(it.nm):t('addChar');
 if(it.t==='bub') return '“'+plain(it.text||'').slice(0,22)+((it.text||'').length>22?'…':'')+'”';
 if(it.t==='prop') return propName(it.k);
 if(it.t==='animal') return animalName(it.k);
 if(it.t==='food') return foodName(it.k);
 if(it.t==='sfx') return it.text;
 if(it.t==='img') return t('addPhoto');
 return '?';
}
const LICON={char:'person',bub:'bubble',prop:'box',animal:'paw',food:'food',sfx:'sound',img:'photo'};
function layersBox(){
 const P=curPanel(),m=$('#modal');
 const draw=()=>{const L=P.items.slice().reverse();
  m.innerHTML=`<div class="mbox lbox"><div class="mt">${t('layers')}</div><div class="llist">${L.length?L.map(it=>`<div class="lrow${it.id===S.sel?' sel':''}${it.hid?' off':''}" data-id="${it.id}">${ic(LICON[it.t]||'box')}<span class="ln">${esc(itemLabel(it))}</span>
   <button class="tb" data-l="hid">${ic(it.hid?'eyeoff':'eye')}</button><button class="tb" data-l="lock">${ic(it.lock?'lock':'unlock')}</button><button class="tb" data-l="up">${ic('up')}</button><button class="tb" data-l="down">${ic('down')}</button></div>`).join(''):`<p class="empty">${t('noItems')}</p>`}</div>
   <div class="mrow"><button class="big primary" id="mOk">${t('ok')}</button></div></div>`;
  m.classList.add('on');$('#mOk').onclick=closeModal;
  $$('#modal .lrow').forEach(r=>r.onclick=e=>{const it=P.items.find(i=>i.id===r.dataset.id);if(!it)return;const b=e.target.closest('[data-l]');
   if(!b){if(it.hid||it.lock){pushUndo();delete it.hid;delete it.lock;saveProject(true);}S.sel=it.id;closeModal();drawStage();return;}
   pushUndo();const l=b.dataset.l,i=P.items.indexOf(it);
   if(l==='hid'){if(it.hid)delete it.hid;else{it.hid=true;if(S.sel===it.id)S.sel=null;}}
   if(l==='lock'){if(it.lock)delete it.lock;else{it.lock=true;if(S.sel===it.id)S.sel=null;}}
   if(l==='up'&&i<P.items.length-1){P.items.splice(i,1);P.items.splice(i+1,0,it);}
   if(l==='down'&&i>0){P.items.splice(i,1);P.items.splice(i-1,0,it);}
   saveProject(true);drawStage();draw();});};
 draw();
}

/* ---------- pickers ---------- */
function sheet(title,cells,onPick,cls){
 const el=$('#sheet');
 el.innerHTML=`<div class="sheetbox"><div class="sheethead"><span>${title}</span><button class="tb" id="shClose">${ic('close')}</button></div><div class="sgrid ${cls||''}">${cells.map((c,i)=>`<button class="cell" data-i="${i}">${c.svg}<span>${esc(c.label||'')}</span></button>`).join('')}</div></div>`;
 el.classList.add('on');
 const close=()=>{el.classList.remove('on');el.innerHTML='';};
 $('#shClose').onclick=close; el.onclick=e=>{if(e.target===el)close();};
 $$('#sheet .cell').forEach(b=>b.onclick=()=>{const c=cells[+b.dataset.i];close();onPick(c.v);});
}
const fig=(pose,cfg,vb,o)=>`<svg viewBox="${vb||'80 60 540 880'}">${CE.figure(Object.assign({},CE.POSES[pose]),cfg,o||{})}</svg>`;
const HEADVB='170 90 300 300';
function pickChar(cb){sheet(t('addChar'),CE.CHARS.map(c=>({v:c,svg:fig('stand',c.config),label:translit(c.name)+' · '+countryName(c.country)})),cb,'tall');}
function pickPose(it,cb){sheet(t('pose'),Object.keys(CE.POSES).map(k=>({v:k,svg:fig(k,it.cfg,'20 40 660 900'),label:poseName(k)})),cb,'tall');}
function pickFace(it,cb){sheet(t('emotion'),CE.FACES.map(k=>({v:k,svg:`<svg viewBox="${HEADVB}">${CE.figure(Object.assign({},CE.POSES.stand,{face:k}),it.cfg,{})}</svg>`,label:''})),cb,'small');}
function pickFx(it,cb){const ks=Object.keys(CE.FX);sheet(t('effect'),[{v:null,svg:`<svg viewBox="0 0 48 48" class="ic">${'<path d="'+ICON.close+'"/>'}</svg>`,label:t('none')}].concat(ks.map(k=>({v:k,svg:`<svg viewBox="100 20 440 400">${CE.figure(Object.assign({},CE.POSES.stand),it.cfg,{fx:k})}</svg>`,label:lmap(I.fx,k)}))),cb,'small');}
function pickProp(title,cb,allowNone){const cells=Object.keys(CE.PROPS).map(k=>({v:k,svg:`<svg viewBox="0 0 200 200">${CE.PROPS[k][1]}</svg>`,label:propName(k)}));if(allowNone)cells.unshift({v:null,svg:`<svg viewBox="0 0 48 48" class="ic"><path d="${ICON.close}"/></svg>`,label:t('none')});sheet(title,cells,cb,'small');}
function pickAnimal(cb){sheet(t('addAnimal'),Object.keys(CE.ANIMALS).map(k=>({v:k,svg:`<svg viewBox="0 0 300 240">${CE.ANIMALS[k][1]}</svg>`,label:animalName(k)})),cb);}
const WF=[['wf:#f5e6c8:#a0703c','wallFloor'],['wf:#d6eaf8:#7f8c8d','wallFloor'],['wf:#d5f5e3:#c8a165','wallFloor'],['wf:#fadbd8:#b9805a','wallFloor'],['wf:#e8daef:#e8daef:s','wallOnly'],['wf:#f9e79f:#f9e79f:s','wallOnly'],['wf:#d6eaf8:#82c46c','floorOnly'],['wf:#fdfefe:#c8a165','floorOnly']];
function pickBg(cb){const cols=['#fdfefe','#f9e79f','#d6eaf8','#fadbd8','#d5f5e3','#e8daef','#1b2a49'];sheet(t('background'),[{v:'photo',svg:`<svg viewBox="0 0 1000 700"><rect width="1000" height="700" fill="#eaf2f8"/><g transform="translate(260 110) scale(10)" fill="none" stroke="#1b1b1b" stroke-width="3.5" stroke-linejoin="round"><path d="${ICON.photo}"/></g></svg>`,label:t('bgPhoto')}].concat(WF.map(([k,l])=>({v:k,svg:`<svg viewBox="0 0 1000 700">${bgSvg(k,1000,700)}</svg>`,label:t(l)})),Object.keys(CE.BG).map(k=>({v:k,svg:`<svg viewBox="0 0 1000 700">${CE.BG[k].s}</svg>`,label:bgName(k)}))).concat(cols.map(c=>({v:c,svg:`<svg viewBox="0 0 10 7"><rect width="10" height="7" fill="${c}" stroke="#1b1b1b" stroke-width=".3"/></svg>`,label:t('colors')}))),cb,'wide');}
function pickBubble(cb){const kinds=['speech','rsquare','think','shout','whisper','caption','radio','title'];sheet(t('type'),kinds.map(k=>({v:k,svg:`<svg viewBox="0 0 300 230">${bubbleSvg({kind:k,text:'',x:150,y:95,w:250,h:130,tdx:-50,tdy:110})}</svg>`,label:lmap(I.bubbles,k)})),cb);}
function pickSfx(cb){const cells=CE.SFX.map(([tx,b,f])=>({v:{text:tx,bg:b,fg:f},svg:`<svg viewBox="-150 -110 300 220">${CE.burst(0,0,92,b)}<text x="0" y="12" text-anchor="middle" font-family="sans-serif" font-size="${tx.length>4?30:40}" font-weight="bold" fill="${f}" stroke="#1b1b1b" stroke-width="2">${esc(tx)}</text></svg>`,label:''}));cells.push({v:'custom',svg:`<svg viewBox="0 0 48 48" class="ic"><path d="${ICON.text}"/></svg>`,label:t('customText')});
 sheet(t('addSfx'),cells,v=>{if(v==='custom')textBox(t('enterText'),'',tx=>{if(tx.trim())cb({text:tx.trim().toUpperCase(),bg:'#f4d03f',fg:'#c0392b'});});else cb(v);});}
function pickOutfit(it,cb){sheet(t('outfit'),OUTFIT_X.map(([k,o])=>{const pv=clone(it.cfg);applyOutfit(pv,o);return {v:o,svg:fig('stand',pv),label:lmap(I.outfitX,k)};}).concat(CE.CHARS.map(c=>{const pv=clone(it.cfg);applyOutfit(pv,c.config);return {v:c.config,svg:fig('stand',pv),label:(I.outfit&&I.outfit[c.id])?lmap(I.outfit,c.id):translit(c.name)};})),cb,'tall');}
function pickHat(it,cb){const ks=Object.keys(CE.HATS).filter(k=>k!=='veil');sheet(t('hat'),[{v:null,svg:`<svg viewBox="40 -90 470 470">${CE.figure(Object.assign({},CE.POSES.stand),Object.assign({},it.cfg,{hat:undefined,backHat:undefined}),{})}</svg>`,label:t('none')}].concat(ks.map(k=>({v:k,svg:`<svg viewBox="170 40 300 350">${CE.figure(Object.assign({},CE.POSES.stand),Object.assign({},it.cfg,{hat:k,backHat:undefined}),{})}</svg>`,label:''}))),cb,'small');}
function pickHair(it,cb){sheet(t('hair'),CE.HEADS.map(k=>({v:k,svg:`<svg viewBox="60 -15 440 440">${CE.figure(Object.assign({},CE.POSES.stand),Object.assign({},it.cfg,{hat:undefined,backHat:undefined,head:Object.assign({},it.cfg.head,{head:[k]})}),{})}</svg>`,label:''})),cb,'small');}
// vehicles: where the character goes (box coords of the 200x200 prop), k = vehicle/character size ratio
const CARP=['drive','passenger'],RIDE=['ride','ride_moto'];
const VEH={car_sedan:{m:'hip',d:120,p:80,y:150,k:7.2,b:1,poses:CARP},car_hatch:{m:'hip',d:112,p:76,y:146,k:7.2,b:1,poses:CARP},car_jeep:{m:'hip',d:126,p:88,y:144,k:7.2,b:1,poses:CARP},car_van:{m:'hip',d:132,p:92,y:146,k:7.2,b:1,poses:CARP},car_cabrio:{m:'hip',d:118,p:70,y:150,k:7.2,b:1,poses:CARP},car_truck:{m:'hip',d:146,p:146,y:150,k:7.2,b:1,poses:CARP},car_taxi:{m:'hip',d:120,p:80,y:150,k:7.2,b:1,poses:CARP},car_police:{m:'hip',d:120,p:80,y:150,k:7.2,b:1,poses:CARP},
 bicycle:{m:'hip',d:70,p:70,y:118,k:3.4,poses:RIDE},scooter:{m:'hip',d:70,p:70,y:118,k:3.4,poses:RIDE},moto:{m:'hip',d:70,p:70,y:118,k:3.4,poses:RIDE},atv:{m:'hip',d:70,p:70,y:118,k:3.4,poses:RIDE},
 kickscooter:{m:'feet',d:75,p:75,y:176,k:3.4,poses:['ride_kick']},
 helicopter:{m:'hip',d:122,p:112,y:140,k:7.2,b:1,air:1,poses:CARP},plane:{m:'hip',d:121,p:121,y:120,k:10,b:1,air:1,poses:CARP},
 aerostat:{m:'feet',d:100,p:100,y:188,k:9.5,b:1,air:1,poses:['stand_in']},stupa:{m:'feet',d:100,p:100,y:182,k:8.7,b:1,air:1,poses:['stand_in']},
 carpet:{m:'hip',d:100,p:60,y:160,k:3.5,air:1,poses:['sitfloor','teasit','eatsit']},boat:{m:'hip',d:120,p:70,y:150,k:6,b:1,poses:['passenger','sitfloor']}};
function seatIn(ch,veh,n){
 const v=VEH[veh.k];if(!v)return;const P=curPanel(),dir=veh.flip?-1:1,pz=CE.POSES[ch.pose]||CE.POSES.stand;
 const sx=ch.pose==='passenger'?v.p-n*28:(n===0?v.d:v.p-(n-1)*28);
 ch.s=veh.s/v.k;ch.flip=!!veh.flip;
 ch.x=veh.x+dir*(sx-100)*veh.s-dir*(pz.H[0]-300)*ch.s;
 ch.y=veh.y+(v.y-100)*veh.s+(v.m==='hip'?(900-pz.H[1])*ch.s:0);
 const i=P.items.indexOf(ch);P.items.splice(i,1);const j=P.items.indexOf(veh);P.items.splice(v.b?j:j+1,0,ch);
}
function seatAll(veh){let n=0,np=0;const v=VEH[veh.k];if(!v)return;curPanel().items.filter(c=>c.t==='char'&&v.poses.includes(c.pose)).forEach(c=>seatIn(c,veh,c.pose==='passenger'?np++:n++));}
function pickColor(cb){const cols=['#e74c3d','#2e86c1','#27ae60','#f4d03f','#e67e22','#8e44ad','#1b1b1b','#fdfefe','#7f8c8d','#5dade2','#922b21','#f1948a'];sheet(t('color'),cols.map(h=>({v:h,svg:`<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.4" fill="${h}" stroke="#1b1b1b" stroke-width=".4"/></svg>`,label:''})),cb,'small');}
function pickSkin(cb){const tones=['ffdbb4','f2d3b1','edb98a','e0b07f','d08b5b','c48a5a','ae5d29','694d3d'];sheet(t('skin'),tones.map(h=>({v:h,svg:`<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.4" fill="#${h}" stroke="#1b1b1b" stroke-width=".4"/></svg>`,label:''})),cb,'small');}
/* body: age (adult / teen / child) + build (thin … fat); gender comes from the character */
const FEMB=['fem','girl','teenf'];
const SHOES=[['sneaker','#f5f5f5'],['shoe','#3b2a20'],['sandal','#8d5524'],['boots','#1b1b1b',1],['flippers','#f4d03f']];
function headBox(it){
 const draw=()=>{$('#modal').innerHTML=`<div class="mbox"><div class="mt">${t('headTurn')}</div>
  <div class="og"><div class="ol">${t('look')}</div><div class="orow"><button class="chip${it.hf?'':' on'}" data-hf="0">${t('lookFwd')}</button><button class="chip${it.hf?' on':''}" data-hf="1">${t('lookBack')}</button></div></div>
  <div class="og"><div class="ol">${t('tilt')}</div><div class="orow">${[[-18,'tiltUp'],[0,'tiltNone'],[16,'tiltDown']].map(([v,l])=>`<button class="chip${(it.ht||0)===v?' on':''}" data-ht="${v}">${t(l)}</button>`).join('')}</div></div>
  <div class="mrow"><button class="big primary" id="mOk">${t('ok')}</button></div></div>`;
  $('#modal').classList.add('on');$('#mOk').onclick=closeModal;
  $$('#modal [data-hf]').forEach(b=>b.onclick=()=>{mutate(()=>{if(b.dataset.hf==='1')it.hf=1;else delete it.hf;});draw();});
  $$('#modal [data-ht]').forEach(b=>b.onclick=()=>{mutate(()=>{const v=+b.dataset.ht;if(v)it.ht=v;else delete it.ht;});draw();});};
 draw();
}
function bodyBox(it){
 const c=it.cfg;if(typeof c.body==='string'&&CE.BUILD&&CE.BUILD[c.body]){c.build=c.build||c.body;delete c.body;}
 const fem=()=>FEMB.includes(c.body)||(c.body&&typeof c.body==='object'&&c.body.f);
 const age=()=>c.body==='teen'||c.body==='teenf'?'teen':(c.body==='child'||c.body==='girl'?'child':'adult');
 const setAge=a=>{const f=fem(),m=f?{adult:'fem',teen:'teenf',child:'girl'}:{adult:null,teen:'teen',child:'child'};if(m[a])c.body=m[a];else delete c.body;};
 const draw=()=>{const ag=age(),bu=c.build||'normal';
  $('#modal').innerHTML=`<div class="mbox"><div class="mt">${t('body')}</div>
  <div class="og"><div class="ol">${t('age')}</div><div class="orow">${['adult','teen','child'].map(a=>`<button class="chip${ag===a?' on':''}" data-age="${a}">${t('age_'+a)}</button>`).join('')}</div></div>
  <div class="og"><div class="ol">${t('build')}</div><div class="orow">${['vthin','thin','normal','strong','heavy','fat'].map(b=>`<button class="chip${bu===b?' on':''}" data-b="${b}">${t('b_'+b)}</button>`).join('')}</div></div>
  ${ag==='adult'?`<div class="og"><div class="ol">${t('height')}</div><div class="orow">${['short','mid','tall'].map(h=>`<button class="chip${(c.height||'mid')===h?' on':''}" data-h="${h}">${t('h_'+h)}</button>`).join('')}</div></div>`:''}
  <div class="mrow"><button class="big primary" id="mOk">${t('ok')}</button></div></div>`;
  $('#modal').classList.add('on');$('#mOk').onclick=closeModal;
  $$('#modal [data-h]').forEach(b=>b.onclick=()=>{mutate(()=>{if(b.dataset.h==='mid')delete c.height;else c.height=b.dataset.h;});draw();});
  $$('#modal [data-age]').forEach(b=>b.onclick=()=>{mutate(()=>{const was=age();setAge(b.dataset.age);if(was!==b.dataset.age&&(!it.frame||it.frame==='full'))it.y=curRect()[3]-18;});draw();});
  $$('#modal [data-b]').forEach(b=>b.onclick=()=>{mutate(()=>{if(b.dataset.b==='normal')delete c.build;else c.build=b.dataset.b;});draw();});};
 draw();
}
function pickBody(it,cb){const ks=['adult','fem','teen','child','girl','heavy','fat','thin','vthin'];sheet(t('body'),ks.map(k=>{const c=Object.assign({},it.cfg);if(k==='adult')delete c.body;else c.body=k;return {v:k,svg:fig('stand',c),label:lmap(I.body,k)};}),cb,'tall');}

/* ---------- modal helpers ---------- */
function textBox(title,val,cb,rich){
 const m=$('#modal');m.innerHTML=`<div class="mbox"><div class="mt">${title}</div><textarea id="mIn" rows="4" maxlength="300">${esc(val||'')}</textarea>${rich?`<div class="orow"><button class="chip" data-w="*"><b>${t('bold')}</b></button><button class="chip" data-w="~"><b style="color:#c0392b">${t('redWord')}</b></button><span class="rhint">${t('richHint')}</span></div>`:''}<div class="mrow"><button class="big" id="mNo">${t('cancel')}</button><button class="big primary" id="mOk">${t('ok')}</button></div></div>`;
 m.classList.add('on');const ta=$('#mIn');setTimeout(()=>{ta.focus();ta.select();},50);
 $$('#modal [data-w]').forEach(b=>b.onclick=()=>{const k=b.dataset.w,a=ta.selectionStart,z=ta.selectionEnd,v=ta.value;
  if(a===z){ // no selection: wrap the word under the cursor
   let s=a,e=a;while(s>0&&!/\s/.test(v[s-1]))s--;while(e<v.length&&!/\s/.test(v[e]))e++;ta.value=v.slice(0,s)+k+v.slice(s,e)+k+v.slice(e);}
  else ta.value=v.slice(0,a)+k+v.slice(a,z)+k+v.slice(z);ta.focus();});
 $('#mNo').onclick=closeModal;$('#mOk').onclick=()=>{const v=ta.value;closeModal();cb(v);};
}
function confirmBox(q,cb){
 const m=$('#modal');m.innerHTML=`<div class="mbox"><div class="mt">${q}</div><div class="mrow"><button class="big" id="mNo">${t('no')}</button><button class="big primary" id="mOk">${t('yes')}</button></div></div>`;
 m.classList.add('on');
 $('#mNo').onclick=closeModal;$('#mOk').onclick=()=>{closeModal();cb();};
}

/* ---------- system back button (called by native) ---------- */
window.ComicApp={
 back(){
  if($('#modal').classList.contains('on')){closeModal();return true;}
  if($('#sheet').classList.contains('on')){$('#sheet').classList.remove('on');$('#sheet').innerHTML='';return true;}
  if(S.screen==='panel'){S.sel=null;saveProject(true);renderPage();show('page');return true;}
  if(S.screen==='page'&&S.resize){S.resize=false;renderPage();return true;}
  if(S.screen==='page'){saveProject(true);renderHome();show('home');return true;}
  if(S.screen==='layouts'&&S.tplv){S.tplv=false;renderLayouts('new');return true;}
  if(S.screen==='layouts'&&$('#lBack')){$('#lBack').click();return true;}
  if(S.screen==='my'||(S.screen==='lang'&&S.lang)){renderHome();show('home');return true;}
  return false;
 },
 state(){return S;},
 svg(i,exp){return pageSvg(S.proj.pages[i],exp!==false);}
};
window.addEventListener('resize',()=>{if(S.screen==='panel'){fitStage();drawSelection();}});
/* autosave when the app goes to background */
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.proj&&(S.screen==='panel'||S.screen==='page'))saveProject(true);});
window.addEventListener('pagehide',()=>{if(S.proj&&(S.screen==='panel'||S.screen==='page'))saveProject(true);});

/* ---------- start ---------- */
document.getElementById('defs').innerHTML=CE.DEFS+XDEFS;
applyOrient();applyUiTheme();
if(!S.lang){renderLang();show('lang');}else{document.documentElement.lang=S.lang;renderHome();show('home');}
})();
