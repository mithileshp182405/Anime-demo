/* ============================================================
   MK Player
   - MP4 / WebM / MOV (direct links, your own CDN, or uploaded files)
   - HLS .m3u8 (hls.js loaded on demand; native on Safari/iOS)
   - Audio menu  : original / embedded tracks / dub links
   - Subtitles   : .vtt (and .srt) links, embedded tracks, or a local file
   - Seek-bar preview + episode list with video thumbnails
   Uses globals from script.js at call time only (byId, pickSource,
   settings, ls, idbGet, idbPut, esc, t, LANGNAME, toast).
   URL templates: {ep} -> 5, {ep2} -> 05 (in video, dub and subtitle links)
   ============================================================ */
(()=>{
const HLS_CDN="https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
const svg=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="${p}"/></svg>`;
const IC={
  play:svg("M8 5v14l11-7z"),pause:svg("M6 5h4v14H6zm8 0h4v14h-4z"),
  vol:svg("M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"),
  mute:svg("M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4z"),
  back:svg("M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"),
  fwd:svg("M12 5V1l5 5-5 5V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"),
  audio:svg("M12 3a9 9 0 0 0-9 9v7a2 2 0 0 0 2 2h2v-8H5v-1a7 7 0 0 1 14 0v1h-2v8h2a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z"),
  cc:svg("M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM11 11H9.5v-.5h-2v3h2V13H11v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1z"),
  pip:svg("M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"),
  fs:svg("M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"),
  gear:svg("M19.4 13a7.9 7.9 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 2.9a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.9 7.9 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1L11 21h4l.4-2.9c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z")
};
const fmt=s=>{if(!isFinite(s)||s<0)return"0:00";s=Math.floor(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=String(s%60).padStart(2,"0");return h?`${h}:${String(m).padStart(2,"0")}:${x}`:`${m}:${x}`};
const kindOf=u=>String(u).startsWith("idb:")?"idb":/\.m3u8(\?|#|$)/i.test(u)?"hls":"file";
const srt2vtt=s=>{s=String(s).replace(/^\uFEFF/,"").replace(/\r/g,"");return /^WEBVTT/.test(s)?s:"WEBVTT\n\n"+s.replace(/(\d+:\d\d:\d\d),(\d{3})/g,"$1.$2")};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

let hlsLib=null;
function loadHls(){
  if(window.Hls)return Promise.resolve(window.Hls);
  return hlsLib||(hlsLib=new Promise((ok,no)=>{const s=document.createElement("script");s.src=HLS_CDN;s.onload=()=>window.Hls?ok(window.Hls):no(new Error("hls"));s.onerror=()=>{hlsLib=null;no(new Error("hls"))};document.head.appendChild(s)}));
}

/* ---------- saved positions ---------- */
const POS="av_pos";
const getPos=k=>(ls.get(POS,{})||{})[k]||0;
function setPos(k,s){const o=ls.get(POS,{})||{};if(s>5)o[k]=Math.floor(s);else delete o[k];const ks=Object.keys(o);if(ks.length>150)delete o[ks[0]];ls.set(POS,o)}

/* ---------- player ---------- */
let cur=null;
function Player(root,a,n){
  const ep=(a.eps&&a.eps[n])||{},key=a.id+"/"+n;
  const fill=u=>String(u||"").replace(/\{ep2\}/g,String(n).padStart(2,"0")).replace(/\{ep\}/g,n);
  const offs=[],on=(el,ev,fn,o)=>{el.addEventListener(ev,fn,o);offs.push(()=>el.removeEventListener(ev,fn,o))};
  let main=ep.v?{url:ep.v,q:null,avail:[]}:pickSource(a,true);
  let audioSel=settings.audio,hls=null,objUrl=null,token=0,pv=null,pvBusy=false,pvWant=null,idle=0,nextT=0,posT=0,menuKind="";
  const dubs=a.dubs||{},dubLangs=["en","ta","hi"].filter(k=>dubs[k]);
  if(audioSel!=="ja"&&!dubs[audioSel])audioSel="ja";

  root.innerHTML=`<video playsinline preload="metadata"></video>
   <div class="mkp-spin" hidden></div>
   <button class="mkp-big" data-a="play" aria-label="Play">${IC.play}</button>
   <div class="mkp-msg" hidden></div>
   <div class="mkp-next" hidden><b>Next episode in <span>5</span>s</b><div><button class="btn primary sm" data-a="go">Play now</button><button class="btn sm" data-a="stay">Cancel</button></div></div>
   <div class="mkp-bar">
    <div class="mkp-seek" role="slider" aria-label="Seek" tabindex="0"><div class="mkp-buf"></div><div class="mkp-pl"></div><div class="mkp-knob"></div><div class="mkp-tip"><canvas width="160" height="90"></canvas><span>0:00</span></div></div>
    <div class="mkp-row">
     <button data-a="play" aria-label="Play / pause">${IC.play}</button>
     <button data-a="back" class="hide-s" aria-label="Back 10 seconds" title="Back 10s (J)">${IC.back}</button>
     <button data-a="fwd" class="hide-s" aria-label="Forward 10 seconds" title="Forward 10s (L)">${IC.fwd}</button>
     <button data-a="mute" class="hide-s" aria-label="Mute">${IC.vol}</button><input class="mkp-vol hide-s" type="range" min="0" max="1" step=".02" value="1" aria-label="Volume">
     <span class="mkp-time">0:00 / 0:00</span><i class="mkp-gap"></i>
     <button data-a="audio" aria-label="${esc(t("audio"))}" title="${esc(t("audio"))}">${IC.audio}</button>
     <button data-a="subs" aria-label="${esc(t("subtitles"))}" title="${esc(t("subtitles"))} (C)">${IC.cc}</button>
     <button data-a="qual" class="txt" aria-label="${esc(t("quality"))}" title="${esc(t("quality"))}">${IC.gear}<span>${esc(t("auto"))}</span></button>
     <button data-a="speed" class="txt hide-s" aria-label="Speed" title="Speed"><span>1×</span></button>
     <button data-a="pip" class="hide-s" aria-label="Picture in picture">${IC.pip}</button>
     <button data-a="fs" aria-label="Fullscreen" title="Fullscreen (F)">${IC.fs}</button>
    </div></div>
   <div class="mkp-menu" hidden></div>
   <input class="mkp-file" type="file" accept=".vtt,.srt,text/vtt" hidden>`;
  const q=s=>root.querySelector(s),qa=s=>[...root.querySelectorAll(s)];
  const v=q("video"),spin=q(".mkp-spin"),msg=q(".mkp-msg"),menu=q(".mkp-menu"),seek=q(".mkp-seek"),tip=q(".mkp-tip"),tipC=tip.querySelector("canvas"),tipT=tip.querySelector("span"),nextBox=q(".mkp-next");

  const showMsg=m=>{msg.textContent=m;msg.hidden=!m;if(m)spin.hidden=true};
  const act=n2=>qa(`[data-a="${n2}"]`);

  /* ----- source loading (file / blob / HLS) ----- */
  const srcUrl=()=>audioSel!=="ja"&&dubs[audioSel]?fill(dubs[audioSel]):fill(main.url);
  function cleanup(){
    if(hls){try{hls.destroy()}catch(e){}hls=null}
    if(objUrl){URL.revokeObjectURL(objUrl);objUrl=null}
    if(pv){pv.removeAttribute("src");pv.load();pv=null}
  }
  async function load(t0,play){
    const my=++token;showMsg("");spin.hidden=false;cleanup();
    const url=srcUrl(),k=kindOf(url);
    const resume=()=>{const go=()=>{if(my!==token)return;let s=t0||0;if(isFinite(v.duration)&&s>v.duration*.97)s=0;if(s>1)v.currentTime=s;if(play)v.play().catch(()=>{})};v.readyState>=1?go():v.addEventListener("loadedmetadata",go,{once:true})};
    try{
      if(k==="idb"){const b=await idbGet(url.slice(4));if(my!==token)return;if(!b)return showMsg("This uploaded video is not stored on this device. Upload it again in Admin, or use a link.");objUrl=URL.createObjectURL(b);v.src=objUrl;resume()}
      else if(k==="hls"){
        let H=null;try{H=await loadHls()}catch(e){}
        if(my!==token)return;
        if(H&&H.isSupported()){
          hls=new H({startPosition:t0>1?t0:-1,maxBufferLength:40,enableWorker:true});
          hls.on(H.Events.MANIFEST_PARSED,()=>{updQual();if(play)v.play().catch(()=>{})});
          hls.on(H.Events.LEVEL_SWITCHED,updQual);
          hls.on(H.Events.AUDIO_TRACKS_UPDATED,()=>{if(menuKind==="audio")openMenu("audio")});
          hls.on(H.Events.SUBTITLE_TRACKS_UPDATED,()=>{if(menuKind==="subs")openMenu("subs")});
          hls.on(H.Events.ERROR,(e,d)=>{if(!d.fatal)return;
            if(d.type===H.ErrorTypes.NETWORK_ERROR){showMsg("Network problem loading the stream — retrying…");setTimeout(()=>{if(my===token&&hls){showMsg("");hls.startLoad()}},2500)}
            else if(d.type===H.ErrorTypes.MEDIA_ERROR){hls.recoverMediaError()}
            else showMsg("This stream could not be played. Check the .m3u8 link and that your host allows CORS.")});
          hls.loadSource(url);hls.attachMedia(v);
        }else if(v.canPlayType("application/vnd.apple.mpegurl")){v.src=url;resume()}
        else showMsg("This browser cannot play HLS streams, and the HLS library could not be loaded.");
      }else{v.src=url;resume()}
    }catch(e){showMsg("Could not start this video.")}
    updQual();
  }

  /* ----- subtitles ----- */
  const subTracks=()=>[...v.textTracks].filter(t=>t.kind==="subtitles"||t.kind==="captions");
  const subsOff=()=>{subTracks().forEach(t=>t.mode="disabled");if(hls)hls.subtitleTrack=-1};
  async function addSub(label,lang,srcOrText,isText,show){
    try{
      let txt=srcOrText;
      if(!isText){const r=await fetch(srcOrText,{credentials:"omit"});if(!r.ok)throw 0;txt=await r.text()}
      const url=URL.createObjectURL(new Blob([srt2vtt(txt)],{type:"text/vtt"}));offs.push(()=>URL.revokeObjectURL(url));
      const tr=document.createElement("track");tr.kind="subtitles";tr.label=label;tr.srclang=lang;tr.src=url;tr.dataset.mk="1";v.appendChild(tr);
      if(show){subsOff();tr.track.mode="showing"}else tr.track.mode="disabled";
      return tr;
    }catch(e){toast("Could not load "+label+" subtitles — check the link (it must allow CORS).");return null}
  }
  async function initSubs(){
    const S=a.subs||{};
    for(const k of ["en","ta","hi"]){if(S[k])await addSub(LANGNAME[k],k,fill(S[k]),false,settings.sub===k)}
  }

  /* ----- menus ----- */
  const embAudio=()=>hls&&hls.audioTracks&&hls.audioTracks.length>1?{type:"hls",list:hls.audioTracks.map((t2,i)=>({i,label:t2.name||t2.lang||"Track "+(i+1),on:hls.audioTrack===i}))}:(v.audioTracks&&v.audioTracks.length>1?{type:"nat",list:[...v.audioTracks].map((t2,i)=>({i,label:t2.label||t2.language||"Track "+(i+1),on:t2.enabled}))}:null);
  function items(kind){
    if(kind==="audio"){
      const out=[],em=embAudio();
      if(em){em.list.forEach(x=>out.push({l:x.label,on:audioSel==="ja"&&x.on,f:()=>{if(audioSel!=="ja"){audioSel="ja";settings.audio="ja";ls.set("av_settings",settings);return switchSrc().then(()=>setEmb(em.type,x.i))}setEmb(em.type,x.i)}}))}
      else out.push({l:t("original"),on:audioSel==="ja",f:()=>{if(audioSel==="ja")return;audioSel="ja";settings.audio="ja";ls.set("av_settings",settings);return switchSrc()}});
      dubLangs.forEach(k=>out.push({l:LANGNAME[k],on:audioSel===k,f:()=>{if(audioSel===k)return;audioSel=k;settings.audio=k;ls.set("av_settings",settings);return switchSrc()}}));
      if(!em&&!dubLangs.length)out.push({note:"No other audio yet. Add dub links in Admin → Quality, subtitle and dub sources."});
      return out;
    }
    if(kind==="subs"){
      const out=[],tr=subTracks(),any=tr.some(t2=>t2.mode==="showing")||(hls&&hls.subtitleTrack>=0);
      out.push({l:t("off"),on:!any,f:()=>{subsOff();settings.sub="off";ls.set("av_settings",settings)}});
      tr.forEach(t2=>out.push({l:t2.label||t2.language||"Track",on:t2.mode==="showing",f:()=>{subsOff();t2.mode="showing";const k=["en","ta","hi"].find(x=>t2.language===x);if(k){settings.sub=k;ls.set("av_settings",settings)}}}));
      if(hls&&hls.subtitleTracks)hls.subtitleTracks.forEach((t2,i)=>out.push({l:t2.name||t2.lang||"Track "+(i+1),on:hls.subtitleTrack===i,f:()=>{subsOff();hls.subtitleTrack=i;hls.subtitleDisplay=true}}));
      out.push({l:"＋ Load subtitle file (.vtt / .srt)…",f:()=>q(".mkp-file").click(),keep:1});
      return out;
    }
    if(kind==="qual"){
      if(hls&&hls.levels&&hls.levels.length){
        const out=[{l:t("auto"),on:hls.autoLevelEnabled,f:()=>{hls.currentLevel=-1}}];
        hls.levels.map((L,i)=>({L,i})).sort((x,y)=>y.L.height-x.L.height).forEach(({L,i})=>out.push({l:(L.height?L.height+"p":Math.round(L.bitrate/1000)+" kbps"),on:!hls.autoLevelEnabled&&hls.currentLevel===i,f:()=>{hls.currentLevel=i}}));
        return out;
      }
      if(main.avail&&main.avail.length>1){
        const out=[{l:t("auto"),on:settings.quality==="auto",f:()=>setQual("auto")}];
        main.avail.forEach(h=>out.push({l:h+"p",on:settings.quality!=="auto"&&main.q===h,f:()=>setQual(String(h))}));
        return out;
      }
      return [{note:"Only one quality is available for this video."}];
    }
    if(kind==="speed")return [.5,.75,1,1.25,1.5,2].map(r=>({l:r+"×",on:v.playbackRate===r,f:()=>{v.playbackRate=r;act("speed")[0].querySelector("span").textContent=r+"×"}}));
    return [];
  }
  const TITLES={audio:"Audio",subs:"Subtitles",qual:"Quality",speed:"Speed"};
  function openMenu(kind){
    menuKind=kind;const its=items(kind);
    menu.innerHTML=`<h5>${TITLES[kind]}</h5>`+its.map((x,i)=>x.note?`<p>${esc(x.note)}</p>`:`<button class="${x.on?"on":""}" data-i="${i}" role="menuitemradio" aria-checked="${!!x.on}">${esc(x.l)}</button>`).join("");
    menu.hidden=false;menu._its=its;root.classList.remove("idle");
  }
  const closeMenu=()=>{menu.hidden=true;menuKind=""};
  on(menu,"click",async e=>{const b=e.target.closest("button[data-i]");if(!b)return;const it=menu._its[+b.dataset.i];e.stopPropagation();const keep=it.keep;try{await it.f()}catch(x){}if(!keep)closeMenu();else closeMenu();updQual()});
  async function switchSrc(){const tm=v.currentTime,pl=!v.paused;await load(tm,pl);await sleep(0)}
  function setEmb(type,i){if(type==="hls"){hls.audioTrack=i}else{[...v.audioTracks].forEach((t2,k)=>t2.enabled=k===i)}}
  function setQual(val){settings.quality=val;ls.set("av_settings",settings);main=ep.v?main:pickSource(a,true);return switchSrc()}
  function updQual(){
    const s=act("qual")[0].querySelector("span");
    if(hls&&hls.levels&&hls.levels.length){const L=hls.levels[hls.currentLevel>=0?hls.currentLevel:(hls.loadLevel>=0?hls.loadLevel:0)];s.textContent=hls.autoLevelEnabled?t("auto")+(L&&L.height?" · "+L.height+"p":""):(L&&L.height?L.height+"p":t("auto"))}
    else s.textContent=main.q&&settings.quality!=="auto"?main.q+"p":(main.q?main.q+"p":t("auto"));
  }

  /* ----- seek bar + preview ----- */
  const frac=e=>{const r=seek.getBoundingClientRect();return Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))};
  let drag=false;
  const scrub=f=>{if(isFinite(v.duration)){v.currentTime=f*v.duration;paint()}};
  on(seek,"pointerdown",e=>{drag=true;seek.setPointerCapture(e.pointerId);scrub(frac(e));e.preventDefault()});
  on(seek,"pointermove",e=>{const f=frac(e);showTip(f,e);if(drag)scrub(f)});
  on(seek,"pointerup",()=>{drag=false});
  on(seek,"pointerleave",()=>{if(!drag)tip.classList.remove("on")});
  on(seek,"keydown",e=>{if(e.key==="ArrowLeft"){v.currentTime-=5;e.preventDefault();e.stopPropagation()}else if(e.key==="ArrowRight"){v.currentTime+=5;e.preventDefault();e.stopPropagation()}});
  function showTip(f,e){
    if(!isFinite(v.duration))return;
    const r=seek.getBoundingClientRect(),w=tip.offsetWidth||160,x=Math.min(r.width-w/2,Math.max(w/2,f*r.width));
    tip.style.left=x+"px";tipT.textContent=fmt(f*v.duration);tip.classList.add("on");
    const k=kindOf(srcUrl());if(k==="hls")return tipC.style.display="none";
    pvSeek(f*v.duration);
  }
  function pvSeek(tm){
    if(!pv){pv=document.createElement("video");pv.muted=true;pv.preload="auto";pv.playsInline=true;
      const u=objUrl||srcUrl();if(!objUrl&&kindOf(u)==="file")pv.src=u;else if(objUrl)pv.src=objUrl;else return;
      pv.addEventListener("seeked",()=>{try{tipC.style.display="block";tipC.getContext("2d").drawImage(pv,0,0,160,90)}catch(e){}pvBusy=false;if(pvWant!=null){const w=pvWant;pvWant=null;pvSeek(w)}});
      pv.addEventListener("error",()=>{tipC.style.display="none"})}
    if(pv.readyState<1){pvWant=tm;pv.addEventListener("loadedmetadata",()=>{if(pvWant!=null){const w=pvWant;pvWant=null;pvSeek(w)}},{once:true});return}
    if(pvBusy){pvWant=tm;return}
    pvBusy=true;try{pv.currentTime=tm}catch(e){pvBusy=false}
  }
  function paint(){
    const d=v.duration,c=v.currentTime,f=isFinite(d)&&d>0?c/d:0;
    q(".mkp-pl").style.width=f*100+"%";q(".mkp-knob").style.left=f*100+"%";
    let b=0;try{for(let i=0;i<v.buffered.length;i++)if(v.buffered.start(i)<=c&&v.buffered.end(i)>=c)b=v.buffered.end(i)}catch(e){}
    q(".mkp-buf").style.width=(isFinite(d)&&d>0?b/d*100:0)+"%";
    q(".mkp-time").textContent=fmt(c)+" / "+(isFinite(d)?fmt(d):"LIVE");
    seek.setAttribute("aria-valuenow",Math.round(f*100));
  }

  /* ----- actions ----- */
  const toggle=()=>v.paused?v.play().catch(()=>{}):v.pause();
  const skip=s=>{if(isFinite(v.duration))v.currentTime=Math.min(v.duration,Math.max(0,v.currentTime+s))};
  const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
  function toggleFs(){
    if(fsEl()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}
    else if(root.requestFullscreen||root.webkitRequestFullscreen){(root.requestFullscreen||root.webkitRequestFullscreen).call(root)}
    else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();
  }
  const hasNext=n<a.episodes;
  const goNext=()=>{if(!hasNext)return;window.__autoplay=true;location.hash="/watch/"+a.id+"/"+(n+1)};
  const tryNext=()=>{
    if(!hasNext)return;let c=5;nextBox.hidden=false;nextBox.querySelector("span").textContent=c;
    nextT=setInterval(()=>{c--;nextBox.querySelector("span").textContent=c;if(c<=0){clearInterval(nextT);goNext()}},1000);
  };
  const stopNext=()=>{clearInterval(nextT);nextBox.hidden=true};
  on(root,"click",e=>{
    const b=e.target.closest("[data-a]");
    if(b){const k=b.dataset.a;
      if(k==="play")toggle();else if(k==="back")skip(-10);else if(k==="fwd")skip(10);
      else if(k==="mute"){v.muted=!v.muted}
      else if(k==="fs")toggleFs();
      else if(k==="pip"){if(document.pictureInPictureElement)document.exitPictureInPicture();else if(v.requestPictureInPicture)v.requestPictureInPicture().catch(()=>toast("Picture-in-picture is not available"));else toast("Picture-in-picture is not supported here")}
      else if(k==="go")goNext();else if(k==="stay")stopNext();
      else if(["audio","subs","qual","speed"].includes(k)){menuKind===k&&!menu.hidden?closeMenu():openMenu(k)}
      return;
    }
    if(e.target.closest(".mkp-menu,.mkp-bar,.mkp-next"))return;
    if(!menu.hidden){closeMenu();return}
    if(e.target!==v&&!e.target.closest(".mkp-msg"))return;
    if(touch&&root.classList.contains("idle")){root.classList.remove("idle");wake();return}
    toggle();
  });
  let touch=false;on(root,"pointerdown",e=>{touch=e.pointerType==="touch"});
  on(root,"dblclick",e=>{if(e.target!==v)return;const r=root.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;if(x<.33)skip(-10);else if(x>.67)skip(10);else toggleFs()});
  on(q(".mkp-vol"),"input",e=>{v.volume=+e.target.value;v.muted=v.volume===0});
  on(q(".mkp-file"),"change",async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;if(!/\.(vtt|srt)$/i.test(f.name))return toast("Choose a .vtt or .srt file");
    const tr=await addSub(f.name.replace(/\.[^.]+$/,""),"und",await f.text(),true,true);if(tr)toast("Subtitles loaded")});

  /* ----- video events ----- */
  const setPlayIcon=()=>{const p=!v.paused;root.classList.toggle("playing",p);act("play").forEach(b=>{if(!b.classList.contains("mkp-big"))b.innerHTML=p?IC.pause:IC.play})};
  on(v,"play",()=>{stopNext();setPlayIcon();wake()});on(v,"pause",()=>{setPlayIcon();root.classList.remove("idle")});
  on(v,"waiting",()=>{spin.hidden=false});on(v,"playing",()=>{spin.hidden=true;showMsg("")});on(v,"canplay",()=>{spin.hidden=true});
  on(v,"loadedmetadata",()=>{spin.hidden=true;paint()});on(v,"durationchange",paint);on(v,"progress",paint);
  on(v,"timeupdate",()=>{if(!drag)paint();const now=Date.now();if(now-posT>5000){posT=now;if(v.duration&&v.currentTime<v.duration-15)setPos(key,v.currentTime)}});
  on(v,"volumechange",()=>{act("mute")[0].innerHTML=v.muted||v.volume===0?IC.mute:IC.vol;q(".mkp-vol").value=v.muted?0:v.volume});
  on(v,"ended",()=>{setPos(key,0);root.classList.remove("idle");tryNext()});
  on(v,"error",()=>{if(hls)return;const c=v.error&&v.error.code;
    showMsg(c===4?"This video format or link can't be played. Use MP4 (H.264/AAC), WebM or an HLS .m3u8 link; .mkv does not play in browsers.":"The video failed to load. Check the link, and that your host allows direct playback.")});
  if(v.audioTracks){try{v.audioTracks.addEventListener("addtrack",()=>{if(menuKind==="audio")openMenu("audio")})}catch(e){}}
  on(v,"enterpictureinpicture",()=>root.classList.add("pip"));on(v,"leavepictureinpicture",()=>root.classList.remove("pip"));
  on(document,"fullscreenchange",()=>root.classList.toggle("fs",fsEl()===root));
  on(document,"webkitfullscreenchange",()=>root.classList.toggle("fs",fsEl()===root));

  /* ----- idle hide + keyboard ----- */
  function wake(){root.classList.remove("idle");clearTimeout(idle);if(!v.paused&&menu.hidden)idle=setTimeout(()=>{if(!v.paused&&menu.hidden&&!root.matches(":focus-within .mkp-bar:hover"))root.classList.add("idle")},2800)}
  on(root,"pointermove",wake);on(root,"focusin",wake);
  on(document,"click",e=>{if(!menu.hidden&&!root.contains(e.target))closeMenu()});
  on(document,"keydown",e=>{
    if(e.target.closest&&e.target.closest("input,textarea,select,[contenteditable]")&&!e.target.classList.contains("mkp-vol"))return;
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const k=e.key.toLowerCase();let h=true;
    if(k===" "||k==="k"){if(e.target.closest&&e.target.closest("button,a,.mkp-seek")&&k===" "&&e.target.tagName==="BUTTON")return;toggle()}
    else if(k==="arrowleft")skip(-5);else if(k==="arrowright")skip(5);
    else if(k==="j")skip(-10);else if(k==="l")skip(10);
    else if(k==="arrowup"){v.volume=Math.min(1,v.volume+.05);v.muted=false}else if(k==="arrowdown")v.volume=Math.max(0,v.volume-.05);
    else if(k==="m")v.muted=!v.muted;else if(k==="f")toggleFs();
    else if(k==="c"){const tr=subTracks(),sh=tr.find(t2=>t2.mode==="showing");if(sh)subsOff();else if(tr[0]){tr[0].mode="showing"}else toast("No subtitles loaded")}
    else if(k==="n"&&e.shiftKey)goNext();
    else if(k==="<"||k===","&&e.shiftKey){v.playbackRate=Math.max(.25,v.playbackRate-.25)}else if(k===">"||k==="."&&e.shiftKey){v.playbackRate=Math.min(3,v.playbackRate+.25)}
    else if(/^[0-9]$/.test(k)&&isFinite(v.duration))v.currentTime=v.duration*(+k/10);
    else h=false;
    if(h){e.preventDefault();wake()}
  });

  this.destroy=()=>{token++;clearTimeout(idle);clearInterval(nextT);try{if(v.currentTime>5&&v.duration&&v.currentTime<v.duration-15)setPos(key,v.currentTime)}catch(e){}
    cleanup();offs.forEach(f=>{try{f()}catch(e){}});try{v.pause()}catch(e){}};

  /* ----- start ----- */
  const start=getPos(key),auto=!!window.__autoplay;window.__autoplay=false;
  setPlayIcon();paint();
  load(start,auto).then(initSubs);
}

/* ---------- episode list: thumbnails from the videos ---------- */
let thumbQ=Promise.resolve(),epObs=null;
function frameOf(url){
  return new Promise(async(ok,no)=>{
    const idb=String(url).startsWith("idb:");let src=url,blobUrl=null;
    try{
      if(idb){const b=await idbGet(url.slice(4));if(!b)return no();blobUrl=src=URL.createObjectURL(b)}
      const v=document.createElement("video");v.muted=true;v.preload="metadata";v.playsInline=true;if(!idb)v.crossOrigin="anonymous";
      const done=(fn,x)=>{clearTimeout(to);v.removeAttribute("src");v.load();if(blobUrl)URL.revokeObjectURL(blobUrl);fn(x)};
      const to=setTimeout(()=>done(no),12000);
      v.addEventListener("error",()=>done(no));
      v.addEventListener("loadedmetadata",()=>{const d=v.duration;v.currentTime=isFinite(d)?Math.min(Math.max(d*.1,1),Math.max(d-.2,0)):1});
      v.addEventListener("seeked",()=>{try{const c=document.createElement("canvas");c.width=320;c.height=180;const x=c.getContext("2d"),r=v.videoWidth/v.videoHeight||16/9;let w=320,h=180;if(r>16/9)w=180*r;else h=320/r;x.drawImage(v,(320-w)/2,(180-h)/2,w,h);done(ok,{img:c.toDataURL("image/jpeg",.7),dur:v.duration})}catch(e){done(no)}},{once:true});
      v.src=src;
    }catch(e){no()}
  });
}
async function thumbFor(url){
  const k="th_"+url,hit=await idbGet(k);if(hit&&hit.img)return hit;
  const r=await frameOf(url);try{await idbPut(k,r)}catch(e){}return r;
}
function initEpisodeList(){
  const list=document.getElementById("epList");if(!list)return;
  const on=list.querySelector(".epi.on");if(on)list.scrollTop=Math.max(0,on.offsetTop-list.offsetTop-list.clientHeight/2+on.offsetHeight/2);
  if(epObs)epObs.disconnect();
  const a=byId(list.dataset.id);if(!a)return;
  epObs=new IntersectionObserver(es=>es.forEach(en=>{
    if(!en.isIntersecting)return;const el=en.target;epObs.unobserve(el);
    const u=el.dataset.v;if(!u||kindOf(u)==="hls")return;
    thumbQ=thumbQ.then(async()=>{if(!el.isConnected)return;try{const r=await thumbFor(u);if(!el.isConnected)return;const th=el.querySelector(".th");th.style.backgroundImage=`url(${r.img})`;th.classList.add("has");if(isFinite(r.dur)){const d=th.querySelector(".dur");d.textContent=fmt(r.dur);d.hidden=false}}catch(e){}});
  }),{root:list,rootMargin:"120px"});
  list.querySelectorAll(".epi[data-v]").forEach(el=>epObs.observe(el));
}

/* ---------- public hooks used by script.js ---------- */
window.initPlayer=()=>{
  destroyPlayer();
  initEpisodeList();
  const root=document.getElementById("mkp"),pl=window.__pl;if(!root||!pl)return;
  const a=byId(pl.id);if(a)cur=new Player(root,a,pl.n);
};
window.destroyPlayer=()=>{if(cur){cur.destroy();cur=null}if(epObs){epObs.disconnect();epObs=null}};
/* clicking an episode / next link should start playing straight away */
document.addEventListener("click",e=>{const l=e.target.closest(".pl-eps a,.player-bar a.primary");if(l)window.__autoplay=true});
})();
