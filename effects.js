/* Gold & black floating water. Click / tap anywhere = a gold drop falls and splashes into the water. */
(()=>{
const cv=document.createElement("canvas");cv.id="water";cv.setAttribute("aria-hidden","true");document.body.prepend(cv);
const x=cv.getContext("2d"),RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
let W,H,mob,blobs=[],bubs=[],drops=[],rings=[],parts=[],bumps=[],mx=.5,my=.5,t=0;
const light=()=>document.documentElement.getAttribute("data-theme")==="light";
const R=(a,b)=>a+Math.random()*(b-a);
const gold=(a,l)=>`hsla(${l?42:45},${l?85:95}%,${l?42:58}%,${a})`;
const base=()=>H-(mob?96:56);
const surf=px=>{let y=base()+Math.sin(px*.011+t*1.1)*5+Math.sin(px*.021-t*.8)*3;
  for(const b of bumps)y+=b.a*Math.exp(-((px-b.x)**2)/(2*(40+b.age*140)**2))*Math.sin(b.age*28-1)*Math.max(0,1-b.age);return y};
const newBub=init=>({x:R(0,W),y:init?R(0,H):H+20,r:R(2,8),v:R(.15,.5),w:R(0,6.28)});
function size(){
  const D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;mob=W<720;
  cv.width=W*D;cv.height=H*D;cv.style.width=W+"px";cv.style.height=H+"px";x.setTransform(D,0,0,D,0,0);
  blobs=Array.from({length:mob?4:7},()=>({x:R(0,W),y:R(0,H),r:(mob?150:230)+R(0,150),p:R(0,6.28),s:R(.12,.3)}));
  bubs=Array.from({length:mob?14:30},()=>newBub(true));
  if(RM)frame();
}
function addDrop(px,py,big){drops.push({x:px,y:py,vx:R(-.6,.6)*(big?0:2),vy:big?0:R(-3,-1),r:big?R(7,9):R(2,4)})}
function splash(px,py,r){
  rings.push({x:px,y:py,r:2,a:.7,s:2.4});rings.push({x:px,y:py,r:2,a:.4,s:1.4});
  bumps.push({x:px,a:r*2.2,age:0});
  for(let i=0;i<(mob?5:8);i++)parts.push({x:px,y:py,vx:R(-2.5,2.5),vy:-R(2,5.5),r:R(1.5,3.2),life:1});
}
function drop(px,py,r){ // teardrop
  const g=x.createRadialGradient(px-r*.3,py-r*.3,1,px,py,r*1.4);
  g.addColorStop(0,"#fff6c8");g.addColorStop(.35,"#ffd24a");g.addColorStop(1,"#a77a08");
  x.fillStyle=g;x.beginPath();x.moveTo(px,py-r*2.6);x.quadraticCurveTo(px+r*.9,py-r*.7,px+r,py);
  x.arc(px,py,r,0,Math.PI);x.quadraticCurveTo(px-r*.9,py-r*.7,px,py-r*2.6);x.fill();
}
function frame(){
  const L=light();t+=.012;x.clearRect(0,0,W,H);
  // floating liquid-gold glows
  for(const b of blobs){
    b.p+=b.s*.01;const bx=b.x+Math.sin(b.p*3)*60+(mx-.5)*40,by=b.y+Math.cos(b.p*2.3)*50+(my-.5)*40;
    const g=x.createRadialGradient(bx,by,0,bx,by,b.r);
    g.addColorStop(0,gold(L?.2:.16,L));g.addColorStop(1,gold(0,L));x.fillStyle=g;x.fillRect(bx-b.r,by-b.r,b.r*2,b.r*2);
  }
  // rising bubbles
  for(const b of bubs){
    b.y-=b.v;b.w+=.02;const bx=b.x+Math.sin(b.w)*14;if(b.y<-20)Object.assign(b,newBub(false));
    x.strokeStyle=gold(.5,L);x.lineWidth=1;x.beginPath();x.arc(bx,b.y,b.r,0,6.28);x.stroke();
    x.fillStyle=gold(.1,L);x.fill();x.fillStyle="rgba(255,250,220,.55)";x.beginPath();x.arc(bx-b.r*.3,b.y-b.r*.3,b.r*.22,0,6.28);x.fill();
  }
  // water surface (two floating layers)
  for(let k=0;k<2;k++){
    x.beginPath();x.moveTo(0,H);
    for(let px=0;px<=W+8;px+=8)x.lineTo(px,surf(px)+k*7);
    x.lineTo(W,H);x.closePath();
    const g=x.createLinearGradient(0,base()-20,0,H);g.addColorStop(0,gold(k?.2:.34,L));g.addColorStop(1,gold(k?.04:.08,L));x.fillStyle=g;x.fill();
    if(!k){x.strokeStyle=gold(.7,L);x.lineWidth=1.5;x.beginPath();for(let px=0;px<=W+8;px+=8)px?x.lineTo(px,surf(px)):x.moveTo(px,surf(px));x.stroke()}
  }
  // falling drops
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i];d.vy+=.32;d.x+=d.vx;d.y+=d.vy;drop(d.x,d.y,d.r);
    if(d.y>=surf(d.x)){splash(d.x,surf(d.x),d.r);drops.splice(i,1)}
  }
  // splash particles
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i];p.vy+=.25;p.x+=p.vx;p.y+=p.vy;p.life-=.02;
    x.fillStyle=gold(Math.max(p.life,0),L);x.beginPath();x.arc(p.x,p.y,p.r,0,6.28);x.fill();
    if(p.life<=0||p.y>surf(p.x)+4&&p.vy>0)parts.splice(i,1);
  }
  // ripples
  for(let i=rings.length-1;i>=0;i--){
    const r=rings[i];r.r+=r.s;r.a-=.012;if(r.a<=0){rings.splice(i,1);continue}
    x.strokeStyle=gold(r.a,L);x.lineWidth=1.6;x.beginPath();x.ellipse(r.x,r.y,r.r,r.r*(r.y>base()-8?.28:1),0,0,6.28);x.stroke();
  }
  for(let i=bumps.length-1;i>=0;i--){bumps[i].age+=.012;if(bumps[i].age>=1)bumps.splice(i,1)}
  if(!RM)requestAnimationFrame(frame);
}
addEventListener("pointerdown",e=>{
  if(drops.length>14)return;
  rings.push({x:e.clientX,y:e.clientY,r:4,a:.8,s:3});         // ripple where you tapped
  addDrop(e.clientX,e.clientY,true);                           // the big drop that falls
  for(let i=0;i<(mob?2:4);i++)addDrop(e.clientX,e.clientY,false); // little droplets
  if(RM)setTimeout(frame,0);
},{passive:true});
addEventListener("pointermove",e=>{mx=e.clientX/W;my=e.clientY/H},{passive:true});
addEventListener("resize",size);
new MutationObserver(()=>RM&&frame()).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
size();if(!RM)requestAnimationFrame(frame);
})();
