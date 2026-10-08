/* ---------- storage ---------- */
const ls={
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
};
const GENRES=["Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Slice of Life","Sports","Supernatural"];
const GICON={"Action":"⚔️","Adventure":"🧭","Comedy":"😄","Drama":"🎭","Fantasy":"🔮","Horror":"👁️","Mystery":"🕵️","Romance":"💞","Sci-Fi":"🚀","Slice of Life":"🌸","Sports":"🏀","Supernatural":"👻"};

/* Original sample titles — replace them from the Admin page with anime you have the rights to show. */
const SEED=[
 {id:"a1",title:"Crimson Meridian",genres:["Action","Fantasy","Adventure"],year:2024,rating:9.1,episodes:12,type:"TV",status:"Ongoing",hue:262,featured:true,desc:"A debt-ridden courier discovers a hidden compass that opens gates to a second world — and every gate demands a price paid in memories."},
 {id:"a2",title:"Ashen Blade Chronicles",genres:["Action","Fantasy","Supernatural"],year:2022,rating:8.8,episodes:76,type:"TV",status:"Completed",hue:160,featured:true,desc:"After a night of fire takes his village, a young swordsman bonds with a blade that only cuts what he truly fears."},
 {id:"a3",title:"Starfall Academy",genres:["Sci-Fi","Comedy","Slice of Life"],year:2023,rating:8.4,episodes:24,type:"TV",status:"Completed",hue:200,featured:true,desc:"Students at an orbital school learn that detention means repairing the station's oldest, grumpiest AI."},
 {id:"a4",title:"Neon Ronin",genres:["Action","Sci-Fi","Drama"],year:2021,rating:9.0,episodes:87,type:"TV",status:"Completed",hue:300,featured:true,desc:"In a rain-soaked megacity, a masterless samurai-for-hire takes one job too many and uncovers a conspiracy in the city's code."},
 {id:"a5",title:"Hollow Lantern",genres:["Horror","Mystery","Supernatural"],year:2024,rating:8.2,episodes:13,type:"TV",status:"Ongoing",hue:20,desc:"A lantern-maker's apprentice learns each lamp holds a lingering spirit — and one of them wants out."},
 {id:"a6",title:"Skybound Strikers",genres:["Sports","Comedy","Drama"],year:2020,rating:8.6,episodes:50,type:"TV",status:"Completed",hue:210,desc:"A scrappy volleyball club on a mountain campus has one season to prove that height isn't everything."},
 {id:"a7",title:"Tide of Eternity",genres:["Fantasy","Romance","Drama"],year:2023,rating:8.7,episodes:26,type:"TV",status:"Completed",hue:185,desc:"A lighthouse keeper and a sea spirit meet every full moon, but the tide is rising for the last time."},
 {id:"a8",title:"Kitsune Café",genres:["Slice of Life","Comedy","Supernatural"],year:2024,rating:8.0,episodes:12,type:"TV",status:"Ongoing",hue:35,desc:"A burned-out office worker inherits a tiny café staffed entirely by shape-shifting foxes."},
 {id:"a9",title:"Iron Saint",genres:["Action","Sci-Fi","Drama"],year:2019,rating:8.9,episodes:48,type:"TV",status:"Completed",hue:215,desc:"A retired mech pilot is dragged back to the front when the war he ended quietly begins again."},
 {id:"a10",title:"Moonlit Cipher",genres:["Mystery","Romance","Drama"],year:2022,rating:8.3,episodes:11,type:"TV",status:"Completed",hue:275,desc:"A night-shift librarian and a rival codebreaker trade riddles across the stacks — until the riddles turn real."},
 {id:"a11",title:"Voidwalker Protocol",genres:["Sci-Fi","Action","Horror"],year:2025,rating:8.5,episodes:10,type:"TV",status:"Ongoing",hue:340,desc:"A salvage crew boards a silent ship that keeps rewriting its own logs."},
 {id:"a12",title:"Petal & Thunder",genres:["Romance","Comedy","Fantasy"],year:2021,rating:7.9,episodes:20,type:"TV",status:"Completed",hue:330,desc:"A storm-god exiled to a flower shop learns that gentleness is harder than lightning."},
 {id:"a13",title:"Last Orbit",genres:["Sci-Fi","Drama","Adventure"],year:2018,rating:9.2,episodes:1120,type:"TV",status:"Ongoing",hue:25,desc:"The longest voyage in anime: one ship, one crew, and a promise to reach a home nobody remembers."},
 {id:"a14",title:"Spirit Courier",genres:["Adventure","Supernatural","Slice of Life"],year:2023,rating:8.1,episodes:24,type:"TV",status:"Completed",hue:130,desc:"A teenage delivery girl carries letters between the living and the dead, and keeps a few for herself."},
 {id:"a15",title:"Ember Court",genres:["Fantasy","Drama","Mystery"],year:2025,rating:8.4,episodes:12,type:"TV",status:"Ongoing",hue:8,desc:"Politics in a kingdom of fire-bound nobles, seen through the eyes of the court's newest cinder-maid."},
 {id:"a16",title:"Clockwork Hearts",genres:["Romance","Sci-Fi","Slice of Life"],year:2020,rating:7.8,episodes:12,type:"Movie",status:"Completed",hue:48,desc:"A watchmaker builds a companion and slowly learns which of them is the one winding down."}
];
SEED.forEach((a,i)=>{a.added=i; a.videoUrl=a.videoUrl||""; a.embedUrl=a.embedUrl||""; a.sources={}; a.subs={}; a.dubs={}});

/* ---------- state ---------- */
let anime=ls.get("av_anime",null)||SEED.map(a=>({...a}));
let favs=ls.get("av_favs",[]);
let users=ls.get("av_users",[]);
let session=ls.get("av_session",null);
let theme=ls.get("av_theme",null)||"dark";
let settings=Object.assign({lang:"en",quality:"auto",audio:"ja",sub:"off"},ls.get("av_settings",{}));
const I18N={
en:{nav_home:"Home",nav_trending:"Trending",nav_latest:"Latest Releases",nav_library:"Anime Library",short_lib:"Library",nav_genres:"Genres",nav_az:"A - Z",nav_list:"My List",nav_admin:"Admin",genres:"Genres",search_ph:"Search anime or genres…",login:"Login",signup:"Sign Up",logout:"Log out",hi:"Hi",featured:"FEATURED",watch_now:"Watch Now",add_list:"Add to List",in_list:"In My List",episodes:"Episodes",trending_now:"Trending Now",latest_eps:"Latest Episodes",popular_genres:"Popular Genres",recent_added:"Recently Added",view_all:"View all",ep:"Episode",prev:"Previous",next:"Next",now_playing:"Now playing",ready:"Ready to watch",watch_ep1:"Watch Episode 1",more_like:"More like this",settings:"Settings",set_note:"Interface language, video quality and audio/subtitle preferences are saved on this device.",language:"Language",quality:"Video quality",audio:"Audio language",subtitles:"Subtitles",original:"Original (Japanese)",save:"Save",close:"Close",cancel:"Cancel",auto:"Auto",off:"Off",saved:"Settings saved",tagline:"Watch · Explore · Enjoy",quote:"Anime is not just a show… it's a feeling.",welcome:"Welcome back",welcome_sub:"Log in to sync your watchlist on this device.",join:"Join MK AnimeVerse",join_sub:"Create a free account to keep your watchlist.",create_acc:"Create account",name:"Name",email:"Email",password:"Password",no_source:"No video source yet",no_source_sub:"Add a video file link or embed link you're allowed to use from Admin → Edit anime.",q_fallback:"{a}p isn't available for this video, so it's playing at {b}p.",q_playing:"Playing at {q}p",no_dub:"No {l} audio for this video — playing the original audio.",no_sub:"No {l} subtitles for this video.",embed_note:"Quality, audio and subtitles are controlled inside the embedded player.",legal_note:"Only play content you own or have permission to stream. Direct video links (.mp4/.webm) or an official embed link work here."},
ta:{nav_home:"முகப்பு",nav_trending:"டிரெண்டிங்",nav_latest:"புதிய வெளியீடுகள்",nav_library:"அனிமே நூலகம்",short_lib:"நூலகம்",nav_genres:"வகைகள்",nav_az:"A - Z",nav_list:"என் பட்டியல்",nav_admin:"நிர்வாகம்",genres:"வகைகள்",search_ph:"அனிமே அல்லது வகைகளைத் தேடுங்கள்…",login:"உள்நுழை",signup:"பதிவு செய்",logout:"வெளியேறு",hi:"வணக்கம்",featured:"சிறப்பு",watch_now:"இப்போது பாருங்கள்",add_list:"பட்டியலில் சேர்",in_list:"பட்டியலில் உள்ளது",episodes:"அத்தியாயங்கள்",trending_now:"இப்போது டிரெண்டிங்",latest_eps:"புதிய அத்தியாயங்கள்",popular_genres:"பிரபல வகைகள்",recent_added:"சமீபத்தில் சேர்க்கப்பட்டவை",view_all:"அனைத்தையும் பார்",ep:"அத்தியாயம்",prev:"முந்தையது",next:"அடுத்தது",now_playing:"இப்போது ஓடுகிறது",ready:"பார்க்கத் தயார்",watch_ep1:"அத்தியாயம் 1 பாருங்கள்",more_like:"இதைப் போன்றவை",settings:"அமைப்புகள்",set_note:"இடைமுக மொழி, வீடியோ தரம், ஆடியோ/வசன விருப்பங்கள் இந்தச் சாதனத்தில் சேமிக்கப்படும்.",language:"மொழி",quality:"வீடியோ தரம்",audio:"ஆடியோ மொழி",subtitles:"வசனங்கள்",original:"மூலம் (ஜப்பானிய)",save:"சேமி",close:"மூடு",cancel:"ரத்து செய்",auto:"தானியங்கி",off:"அணை",saved:"அமைப்புகள் சேமிக்கப்பட்டன",tagline:"பாருங்கள் · ஆராயுங்கள் · ரசியுங்கள்",quote:"அனிமே என்பது வெறும் தொடர் அல்ல… அது ஒரு உணர்வு.",welcome:"மீண்டும் வருக",welcome_sub:"உங்கள் பட்டியலைப் பயன்படுத்த உள்நுழையுங்கள்.",join:"MK AnimeVerse-இல் சேருங்கள்",join_sub:"உங்கள் பட்டியலைச் சேமிக்க இலவசக் கணக்கை உருவாக்குங்கள்.",create_acc:"கணக்கை உருவாக்கு",name:"பெயர்",email:"மின்னஞ்சல்",password:"கடவுச்சொல்",no_source:"வீடியோ மூலம் இன்னும் இல்லை",no_source_sub:"நிர்வாகம் → அனிமேவைத் திருத்து பக்கத்தில் வீடியோ அல்லது embed இணைப்பைச் சேர்க்கவும்.",q_fallback:"இந்த வீடியோவுக்கு {a}p இல்லை, எனவே {b}p இல் இயங்குகிறது.",q_playing:"{q}p இல் இயங்குகிறது",no_dub:"இந்த வீடியோவுக்கு {l} ஆடியோ இல்லை — மூல ஆடியோ இயங்குகிறது.",no_sub:"இந்த வீடியோவுக்கு {l} வசனங்கள் இல்லை.",embed_note:"தரம், ஆடியோ, வசனங்கள் embed பிளேயருக்குள் கட்டுப்படுத்தப்படும்.",legal_note:"உங்களுக்குச் சொந்தமான அல்லது ஒளிபரப்ப அனுமதி உள்ள உள்ளடக்கத்தை மட்டும் இயக்குங்கள். நேரடி வீடியோ இணைப்புகள் (.mp4/.webm) அல்லது அதிகாரப்பூர்வ embed இணைப்பு இங்கே வேலை செய்யும்."},
hi:{nav_home:"होम",nav_trending:"ट्रेंडिंग",nav_latest:"नई रिलीज़",nav_library:"एनीमे लाइब्रेरी",short_lib:"लाइब्रेरी",nav_genres:"शैलियाँ",nav_az:"A - Z",nav_list:"मेरी सूची",nav_admin:"एडमिन",genres:"शैलियाँ",search_ph:"एनीमे या शैली खोजें…",login:"लॉगिन",signup:"साइन अप",logout:"लॉग आउट",hi:"नमस्ते",featured:"फ़ीचर्ड",watch_now:"अभी देखें",add_list:"सूची में जोड़ें",in_list:"सूची में है",episodes:"एपिसोड",trending_now:"अभी ट्रेंडिंग",latest_eps:"नए एपिसोड",popular_genres:"लोकप्रिय शैलियाँ",recent_added:"हाल ही में जोड़े गए",view_all:"सभी देखें",ep:"एपिसोड",prev:"पिछला",next:"अगला",now_playing:"अभी चल रहा है",ready:"देखने के लिए तैयार",watch_ep1:"एपिसोड 1 देखें",more_like:"इसी तरह के",settings:"सेटिंग्स",set_note:"इंटरफ़ेस भाषा, वीडियो क्वालिटी और ऑडियो/सबटाइटल पसंद इस डिवाइस पर सहेजी जाती हैं।",language:"भाषा",quality:"वीडियो क्वालिटी",audio:"ऑडियो भाषा",subtitles:"सबटाइटल",original:"मूल (जापानी)",save:"सहेजें",close:"बंद करें",cancel:"रद्द करें",auto:"ऑटो",off:"बंद",saved:"सेटिंग्स सहेजी गईं",tagline:"देखें · खोजें · आनंद लें",quote:"एनीमे सिर्फ़ एक शो नहीं… एक एहसास है।",welcome:"वापसी पर स्वागत है",welcome_sub:"अपनी सूची सिंक करने के लिए लॉगिन करें।",join:"MK AnimeVerse से जुड़ें",join_sub:"अपनी वॉचलिस्ट सहेजने के लिए मुफ़्त खाता बनाएँ।",create_acc:"खाता बनाएँ",name:"नाम",email:"ईमेल",password:"पासवर्ड",no_source:"अभी कोई वीडियो स्रोत नहीं",no_source_sub:"एडमिन → एनीमे संपादित करें में वीडियो या एम्बेड लिंक जोड़ें।",q_fallback:"इस वीडियो के लिए {a}p उपलब्ध नहीं है, इसलिए {b}p पर चल रहा है।",q_playing:"{q}p पर चल रहा है",no_dub:"इस वीडियो के लिए {l} ऑडियो उपलब्ध नहीं है — मूल ऑडियो चल रहा है।",no_sub:"इस वीडियो के लिए {l} सबटाइटल उपलब्ध नहीं हैं।",embed_note:"क्वालिटी, ऑडियो और सबटाइटल एम्बेड प्लेयर के अंदर नियंत्रित होते हैं।",legal_note:"केवल वही सामग्री चलाएँ जो आपकी है या जिसे स्ट्रीम करने की अनुमति है। सीधे वीडियो लिंक (.mp4/.webm) या आधिकारिक एम्बेड लिंक यहाँ काम करते हैं।"}
};
const t=(k,v)=>{let x=(I18N[settings.lang]&&I18N[settings.lang][k])||I18N.en[k]||k;if(v)for(const y in v)x=x.replace("{"+y+"}",v[y]);return x};
const LANGNAME={en:"English",ta:"தமிழ்",hi:"हिन्दी"};
const save=()=>{const ok=ls.set("av_anime",anime);ls.set("av_favs",favs);if(!ok)toast("Storage full — use image links instead of uploads")};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId=id=>anime.find(a=>a.id===id);
const isAdmin=()=>session&&session.role==="admin";

/* ---------- generated poster art (no external images) ---------- */
const artCache={};
function art(a,wide){
  if(wide&&a.cover)return a.cover;if(!wide&&a.poster)return a.poster;
  const key=a.id+a.hue+(wide?"w":"p")+a.title.length;
  if(artCache[key])return artCache[key];
  let h=0;for(const c of a.id+a.title)h=(h*31+c.charCodeAt(0))>>>0;
  const r=n=>{h=(h*1664525+1013904223)>>>0;return h/4294967296*n};
  const h1=a.hue,h2=(a.hue+55)%360,h3=(a.hue+300)%360;
  const W=wide?800:300,H=wide?450:400,cx=wide?W*.7:W/2,base=H;
  let spikes="";const n=7+Math.floor(r(4));
  for(let i=0;i<n;i++){const ang=-Math.PI+Math.PI*(i/(n-1));const len=60+r(50);const x1=cx+Math.cos(ang)*50,y1=H*.46+Math.sin(ang)*50;spikes+=`<polygon points="${x1-12},${y1} ${x1+12},${y1} ${cx+Math.cos(ang)*(50+len)},${H*.46+Math.sin(ang)*(50+len)}" fill="hsl(${h1},40%,10%)"/>`}
  let stars="";for(let i=0;i<28;i++)stars+=`<circle cx="${r(W)}" cy="${r(H*.7)}" r="${.6+r(1.8)}" fill="#fff" opacity="${.25+r(.6)}"/>`;
  const sc=wide?1.15:1;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h1},80%,32%)"/><stop offset=".55" stop-color="hsl(${h2},75%,20%)"/><stop offset="1" stop-color="hsl(${h3},70%,12%)"/></linearGradient>
<radialGradient id="r" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="hsl(${h2},100%,70%)" stop-opacity=".85"/><stop offset="1" stop-color="hsl(${h2},100%,50%)" stop-opacity="0"/></radialGradient>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#05061a" stop-opacity=".75"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>${stars}
<circle cx="${cx}" cy="${H*.4}" r="${H*.42}" fill="url(#r)"/>
<g transform="translate(${cx} ${base}) scale(${sc}) translate(${-cx} ${-base})">${spikes}
<path d="M${cx-130} ${base} C${cx-130} ${H*.8} ${cx-60} ${H*.74} ${cx} ${H*.74} C${cx+60} ${H*.74} ${cx+130} ${H*.8} ${cx+130} ${base}Z" fill="hsl(${h1},45%,9%)"/>
<ellipse cx="${cx}" cy="${H*.52}" rx="52" ry="62" fill="hsl(${h1},35%,13%)"/>
<path d="M${cx-52} ${H*.47} Q${cx} ${H*.36} ${cx+52} ${H*.47} L${cx+46} ${H*.41} Q${cx} ${H*.3} ${cx-46} ${H*.41}Z" fill="hsl(${h1},40%,9%)"/>
<ellipse cx="${cx-19}" cy="${H*.53}" rx="9" ry="5" fill="hsl(${h2},100%,75%)"/><ellipse cx="${cx+19}" cy="${H*.53}" rx="9" ry="5" fill="hsl(${h2},100%,75%)"/></g>
<rect width="${W}" height="${H}" fill="url(#f)"/></svg>`;
  return artCache[key]="data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}

/* ---------- helpers ---------- */
const heart=on=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="${on?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>`;
const gens=a=>a.genres.slice(0,3).map(g=>`<span>${esc(g)}</span>`).join("");
function card(a,rank){
  const f=favs.includes(a.id);
  return `<article class="card"><a href="#/anime/${a.id}" aria-label="${esc(a.title)}"><img class="poster" loading="lazy" src="${art(a)}" alt="${esc(a.title)} poster">${rank?`<span class="rank">${rank}</span>`:""}</a>
  <button class="fav ${f?"on":""}" data-fav="${a.id}" aria-label="${f?"Remove from":"Add to"} My List">${heart(f)}</button>
  <a class="info" href="#/anime/${a.id}"><h3>${esc(a.title)}</h3><div class="gen">${gens(a)}</div><div class="sub"><span class="star">★</span> ${Number(a.rating).toFixed(1)} · ${a.episodes} ${t("episodes")}</div></a></article>`;
}
function secHead(title,icon,href){return `<div class="sec-h"><h2><span>${icon}</span>${title}</h2>${href?`<a href="${href}">${t("view_all")}</a>`:""}</div>`}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),2200)}
const ago=i=>["2h","4h","6h","8h","10h","12h","1d","1d"][i%8]+" ago";
const trending=()=>[...anime].sort((a,b)=>b.rating-a.rating);
const latest=()=>[...anime].sort((a,b)=>b.year-a.year||b.added-a.added);
const recent=()=>[...anime].sort((a,b)=>b.added-a.added);

/* ---------- views ---------- */
let heroTimer;
function homeView(){
  const feat=anime.filter(a=>a.featured).slice(0,5); const list=feat.length?feat:trending().slice(0,5);
  const slides=list.map((a,i)=>`<div class="slide ${i?"":"on"}" data-i="${i}"><div class="bg" style="background-image:url('${art(a,true)}')"></div>
  <div class="in"><span class="tag">${t("featured")}</span><h1>${esc(a.title)}</h1><div class="chips">${a.genres.map(g=>`<span class="chip">${esc(g)}</span>`).join("")}</div>
  <p>${esc(a.desc)}</p><div class="meta"><span><span class="star">★</span> ${Number(a.rating).toFixed(1)}/10</span><span>${a.year}</span><span>${esc(a.type)}</span><span>${a.episodes} ${t("episodes")}</span></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary" href="#/watch/${a.id}/1">▶ ${t("watch_now")}</a><button class="btn" data-fav="${a.id}">${favs.includes(a.id)?"✓ "+t("in_list"):"＋ "+t("add_list")}</button></div></div></div>`).join("");
  const dots=list.map((_,i)=>`<button class="${i?"":"on"}" data-dot="${i}" aria-label="Slide ${i+1}"></button>`).join("");
  const genreCards=GENRES.slice(0,8).map(g=>{const a=anime.find(x=>x.genres.includes(g))||anime[0];return `<a class="gcard" href="#/library?genre=${encodeURIComponent(g)}">${a?`<img loading="lazy" src="${art(a)}" alt="">`:""}<span>${GICON[g]} ${g}</span></a>`}).join("");
  const eps=latest().slice(0,6).map((a,i)=>{const n=Math.max(1,a.episodes-i);return `<a class="ep" href="#/watch/${a.id}/${n}"><div class="th"><img loading="lazy" src="${art(a,true)}" alt=""><span class="play">▶</span></div><div class="t"><b>${esc(a.title)}</b><span>${t("ep")} ${n} · ${ago(i)}</span></div></a>`}).join("");
  return `<section class="hero" aria-roledescription="carousel">${slides}<div class="hero-ctl"><button data-hero="-1" aria-label="Previous">‹</button><button data-hero="1" aria-label="Next">›</button></div><div class="dots">${dots}</div></section>
  <div class="wrap">
   <section class="sec">${secHead(t("trending_now"),"🔥","#/trending")}<div class="row">${trending().slice(0,6).map((a,i)=>card(a,i+1)).join("")}</div></section>
   <section class="sec">${secHead(t("latest_eps"),"▶","#/latest")}<div class="row" style="grid-auto-columns:minmax(210px,1fr)">${eps}</div></section>
   <section class="sec">${secHead(t("popular_genres"),"▦","#/genres")}<div class="row" style="grid-auto-columns:minmax(130px,1fr)">${genreCards}</div></section>
   <section class="sec">${secHead(t("recent_added"),"✨","#/library?sort=new")}<div class="row">${recent().slice(0,6).map(a=>card(a)).join("")}</div></section>
  </div>`;
}
function listPage(title,sub,items,rank){
  return `<div class="page-h"><h1>${title}</h1><p>${sub}</p></div><div class="wrap" style="margin-top:16px">${items.length?`<div class="grid">${items.map((a,i)=>card(a,rank?i+1:0)).join("")}</div>`:`<div class="empty"><b>Nothing here yet</b>Try another search or filter.</div>`}</div>`;
}
function libraryView(p){
  const genre=p.get("genre")||"",year=p.get("year")||"",sort=p.get("sort")||"az",letter=p.get("letter")||"";
  let items=[...anime];
  if(genre)items=items.filter(a=>a.genres.includes(genre));
  if(year)items=items.filter(a=>String(a.year)===year);
  if(letter)items=items.filter(a=>letter==="#"?!/^[a-z]/i.test(a.title):a.title[0].toUpperCase()===letter);
  const sorters={az:(a,b)=>a.title.localeCompare(b.title),za:(a,b)=>b.title.localeCompare(a.title),rating:(a,b)=>b.rating-a.rating,year:(a,b)=>b.year-a.year,new:(a,b)=>b.added-a.added};
  items.sort(sorters[sort]||sorters.az);
  const years=[...new Set(anime.map(a=>a.year))].sort((a,b)=>b-a);
  const opt=(v,l,cur)=>`<option value="${esc(v)}" ${v===cur?"selected":""}>${esc(l)}</option>`;
  const letters=["#",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map(l=>`<button data-letter="${l}" class="${letter===l?"on":""}">${l}</button>`).join("");
  return `<div class="page-h"><h1>${t("nav_library")}</h1><p>${items.length} title${items.length===1?"":"s"}${genre?` in ${esc(genre)}`:""}</p></div>
  <div class="filters">
   <select id="fGenre" aria-label="Genre">${opt("","All genres",genre)}${GENRES.map(g=>opt(g,g,genre)).join("")}</select>
   <select id="fYear" aria-label="Year">${opt("","All years",year)}${years.map(y=>opt(String(y),String(y),year)).join("")}</select>
   <select id="fSort" aria-label="Sort">${opt("az","A → Z",sort)}${opt("za","Z → A",sort)}${opt("rating","Top rated",sort)}${opt("year","Newest year",sort)}${opt("new","Recently added",sort)}</select>
   ${genre||year||letter?`<button class="btn" id="fClear">Clear filters</button>`:""}
  </div><div class="az">${letters}</div>
  <div class="wrap" style="margin-top:10px">${items.length?`<div class="grid">${items.map(a=>card(a)).join("")}</div>`:`<div class="empty"><b>No anime match these filters</b>Clear a filter to see more titles.</div>`}</div>`;
}
function genresView(){
  return `<div class="page-h"><h1>${t("nav_genres")}</h1><p>Pick a mood and dive in.</p></div><div class="wrap" style="margin-top:16px"><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${GENRES.map(g=>{const a=anime.find(x=>x.genres.includes(g));const n=anime.filter(x=>x.genres.includes(g)).length;return `<a class="gcard" href="#/library?genre=${encodeURIComponent(g)}">${a?`<img loading="lazy" src="${art(a)}" alt="">`:""}<span>${GICON[g]} ${g}<br><small style="font:400 12px var(--body);opacity:.8">${n} title${n===1?"":"s"}</small></span></a>`}).join("")}</div></div>`;
}
function listView(){
  const items=favs.map(byId).filter(Boolean);
  return `<div class="page-h"><h1>${t("nav_list")}</h1><p>${items.length?`${items.length} saved on this device`:"Your watchlist"}</p></div><div class="wrap" style="margin-top:16px">${items.length?`<div class="grid">${items.map(a=>card(a)).join("")}</div>`:`<div class="empty"><b>Your list is empty</b>Tap the heart on any anime to save it here.</div>`}</div>`;
}
function detailView(a){
  if(!a)return `<div class="empty"><b>Anime not found</b><a class="btn primary" href="#/library" style="margin-top:12px">Browse the library</a></div>`;
  const f=favs.includes(a.id);const shown=Math.min(a.episodes,48);
  const eps=Array.from({length:shown},(_,i)=>`<a href="#/watch/${a.id}/${i+1}"><span class="n">${i+1}</span><span>${epName(a,i+1)}<small>${a.type==="Movie"?"Feature":t("ready")}</small></span></a>`).join("");
  const rel=anime.filter(x=>x.id!==a.id&&x.genres.some(g=>a.genres.includes(g))).slice(0,6);
  return `<section class="detail"><div class="bg" style="background-image:url('${art(a,true)}')"></div><img class="poster" src="${art(a)}" alt="${esc(a.title)} poster">
  <div><span class="tag">${esc(a.status||"Anime")}</span><h1 style="margin-top:10px">${esc(a.title)}</h1><div class="chips">${a.genres.map(g=>`<a class="chip" href="#/library?genre=${encodeURIComponent(g)}">${esc(g)}</a>`).join("")}</div>
  <div class="stats"><div><b><span class="star">★</span> ${Number(a.rating).toFixed(1)}</b><small>Rating</small></div><div><b>${a.year}</b><small>Year</small></div><div><b>${esc(a.type)}</b><small>Format</small></div><div><b>${a.episodes}</b><small>${t("episodes")}</small></div></div>
  <p>${esc(a.desc)}</p><div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><a class="btn primary" href="#/watch/${a.id}/1">▶ ${t("watch_ep1")}</a><button class="btn" data-fav="${a.id}">${f?"✓ "+t("in_list"):"＋ "+t("add_list")}</button>${isAdmin()?`<a class="btn" href="#/admin?edit=${a.id}">Edit</a>`:""}</div></div></section>
  <div class="wrap"><section class="sec">${secHead("Episodes","▶")}<div class="eps">${eps}</div>${a.episodes>shown?`<p style="color:var(--muted)">Showing the first ${shown} of ${a.episodes} episodes.</p>`:""}</section>
  ${rel.length?`<section class="sec">${secHead(t("more_like"),"✨")}<div class="row">${rel.map(x=>card(x)).join("")}</div></section>`:""}</div>`;
}
function pickSource(a,noDub){
  const S=a.sources||{};
  if(!noDub&&settings.audio!=="ja"&&a.dubs&&a.dubs[settings.audio])return {url:a.dubs[settings.audio],q:null,avail:[]};
  const avail=[1080,720,480,360].filter(q=>S[q]);
  if(!avail.length)return a.videoUrl?{url:a.videoUrl,q:null,avail:[]}:null;
  let target;
  if(settings.quality==="auto"){const c=navigator.connection||{};const px=Math.max(screen.width,screen.height)*(window.devicePixelRatio||1);target=(c.saveData||/2g|3g/.test(c.effectiveType||""))?480:(px>=1500?1080:720)}
  else target=+settings.quality;
  const q=avail.find(x=>x<=target)??avail[avail.length-1];
  return {url:S[q],q,avail};
}
function watchView(a,n){
  if(!a)return detailView(null);
  n=Math.min(Math.max(1,n||1),a.episodes);
  const ep=(a.eps&&a.eps[n])||{};let src=null,embed=a.embedUrl;
  if(ep.v){const em=String(ep.v).startsWith("idb:")?"":toEmbed(ep.v);if(em){embed=em}else{src={url:ep.v,q:null,avail:[]};embed=""}}else src=pickSource(a,true);
  const notes=[];let screen;
  if(src){
    window.__pl={id:a.id,n};
    screen=`<div class="mkp" id="mkp" tabindex="-1"></div>`;
  }else if(embed){
    window.__pl=null;
    screen=`<iframe src="${esc(embed)}" allowfullscreen referrerpolicy="no-referrer" title="${esc(a.title)} ${t("ep")} ${n}"></iframe>`;notes.push(t("embed_note"));
  }else{window.__pl=null;screen=`<div class="ph"><img src="${art(a,true)}" alt=""><div><b>${t("no_source")}</b>${t("no_source_sub")}</div></div>`}
  const dis='aria-disabled="true" style="opacity:.4;pointer-events:none"';
  const list=Array.from({length:Math.min(a.episodes,300)},(_,i)=>{const k=i+1,e=(a.eps&&a.eps[k])||{},own=e.v?String(e.v):"";
    return `<a class="epi${k===n?" on":""}" href="#/watch/${a.id}/${k}" ${own?`data-v="${esc(own)}"`:""} ${k===n?'aria-current="true"':""}><span class="th"><b>${k}</b><i class="dur" hidden></i>${k===n?`<em>▶</em>`:""}</span><span class="tt"><strong>${t("ep")} ${k}</strong><small>${e.t?esc(e.t):(k===n?t("now_playing"):(a.type==="Movie"?"Feature":t("ready")))}</small></span></a>`}).join("");
  return `<div class="player"><div style="margin-bottom:12px"><a href="#/anime/${a.id}" style="color:var(--accent2);font-weight:600">‹ ${esc(a.title)}</a></div>
  <div class="pl-layout"><div class="pl-main">
  <div class="screen">${screen}</div>
  <div class="player-bar"><div><h2 style="font-size:24px">${esc(a.title)}</h2><span style="color:var(--muted)">${t("ep")} ${n} / ${a.episodes}${ep.t?" · "+esc(ep.t):""}</span></div>
   <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" ${n<=1?dis:`href="#/watch/${a.id}/${n-1}"`}>‹ ${t("prev")}</a><a class="btn primary" ${n>=a.episodes?dis:`href="#/watch/${a.id}/${n+1}"`}>${t("next")} ›</a><button class="btn" data-fav="${a.id}">${favs.includes(a.id)?"✓ "+t("in_list"):"＋ "+t("add_list")}</button></div></div>
  ${notes.map(x=>`<div class="pnote">${esc(x)}</div>`).join("")}
  <div class="notice">${t("legal_note")}</div></div>
  <aside class="pl-eps" aria-label="${esc(t("episodes"))}"><h3>${t("episodes")} <small>${a.episodes}</small></h3><div class="epl" id="epList" data-id="${a.id}">${list}</div></aside></div></div>`;
}
let editing=null;
function adminView(p){
  if(!isAdmin())return `<div class="empty"><b>Admin only</b>Log in with the admin account to manage anime.<br><button class="btn primary" style="margin-top:14px" data-open-auth>Log in</button></div>`;
  pendingVid=null;epDraft=JSON.parse(JSON.stringify((eid0(p))||{}));const eid=p.get("edit");if(eid!==null&&eid!==editing)editing=eid||null;
  const a=editing?byId(editing):null;
  const v=k=>esc(a?a[k]:"");
  const sv=(o,k)=>esc((a&&a[o]&&a[o][k])||"");
  return `${initDi(a)}<div class="page-h"><h1>Admin Panel</h1><p>Add and edit your own anime. Changes save in this browser.</p></div>
  <div class="admin" style="margin-top:16px">
   <div class="panel"><h3>${a?"Edit anime":"Add anime"} <span id="autoStat" class="astat">Changes save automatically</span></h3>
    <div class="field"><label for="fTitle">Title</label><input id="fTitle" value="${v("title")}"></div>
    <div class="field"><label for="fGen">Genres (comma separated)</label><input id="fGen" value="${esc(a?a.genres.join(", "):"")}" placeholder="Action, Fantasy"></div>
    <div class="two"><div class="field"><label for="fYr">Year</label><input id="fYr" type="number" value="${a?a.year:new Date().getFullYear()}"></div><div class="field"><label for="fRt">Rating (0–10)</label><input id="fRt" type="number" step="0.1" min="0" max="10" value="${a?a.rating:8}"></div></div>
    <div class="two"><div class="field"><label for="fEp">Episodes</label><input id="fEp" type="number" min="1" value="${a?a.episodes:12}"></div><div class="field"><label for="fTy">Format</label><select id="fTy">${["TV","Movie","OVA","Special"].map(t=>`<option ${a&&a.type===t?"selected":""}>${t}</option>`).join("")}</select></div></div>
    <div class="two"><div class="field"><label for="fSt">Status</label><select id="fSt">${["Ongoing","Completed","Upcoming"].map(t=>`<option ${a&&a.status===t?"selected":""}>${t}</option>`).join("")}</select></div><div class="field"><label for="fHue">Poster colour (0–360)</label><input id="fHue" type="number" min="0" max="360" value="${a?a.hue:Math.floor(Math.random()*360)}"></div></div>
    <div class="two">${imgField("poster","Profile image (poster)","3/4")}${imgField("cover","Back cover image (banner)","16/9")}</div>
    <div class="field"><label for="fDesc">Description</label><textarea id="fDesc">${v("desc")}</textarea></div>
    <div class="field"><label>Main video for ALL episodes — upload a file, or paste ONE link (auto-detected). Episodes below can have their own.</label><label class="drop" id="drop"><input type="file" id="fFile" accept="video/*" hidden><b>⬆ Upload video</b><span>or drag &amp; drop it here</span><small id="dropName">${a&&String(a.videoUrl).startsWith("idb:")?"✓ Uploaded video saved on this device":"mp4 · webm · mov"}</small></label><input id="fLink" value="${esc(a&&!String(a.videoUrl).startsWith("idb:")?(a.videoUrl||a.embedUrl):"")}" placeholder="YouTube, Vimeo, Drive, Dailymotion or .mp4 link…"></div>
    ${epAdminHTML(a?a.episodes:12)}
    <details class="srcs"><summary>Quality, subtitle and dub sources</summary><p style="color:var(--muted);font-size:12.5px;margin:8px 0">Add links only for files you have rights to use. Leave blank to skip. Subtitles must be .vtt files.</p><div class="two">${[["fq","1080","sources","1080p video link"],["fq","720","sources","720p video link"],["fq","480","sources","480p video link"],["fq","360","sources","360p video link"],["fs","en","subs","English subtitles (.vtt)"],["fs","ta","subs","Tamil subtitles (.vtt)"],["fs","hi","subs","Hindi subtitles (.vtt)"],["fd","en","dubs","English dub video link"],["fd","ta","dubs","Tamil dub video link"],["fd","hi","dubs","Hindi dub video link"]].map(([p,k,o,l])=>`<div class="field"><label for="${p}${k}">${l}</label><input id="${p}${k}" value="${sv(o,k)}" placeholder="https://…"></div>`).join("")}</div></details>
    <label style="display:flex;gap:8px;align-items:center;margin-bottom:14px"><input type="checkbox" id="fFeat" ${a&&a.featured?"checked":""}> Show in the home hero</label>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" id="aSave">✓ Done</button></div>
   </div>
   <div class="panel"><h3>Library (${anime.length})</h3>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap"><button class="btn sm" id="aExport">Export JSON</button><button class="btn sm" id="aImport">Import JSON</button></div>
    <textarea id="aJson" style="display:none;width:100%;height:120px;margin-bottom:10px;border-radius:10px;border:1px solid var(--line);background:var(--panel2);padding:10px" aria-label="JSON data"></textarea>
    <details class="srcs"><summary>Website branding (name, tagline, logo)</summary>
     <div class="field" style="margin-top:10px"><label for="sName">Website name</label><input id="sName" value="${esc(site.name)}" placeholder="MK AnimeVerse"></div>
     <div class="field"><label for="sTag">Tagline</label><input id="sTag" value="${esc(site.tagline)}" placeholder="Watch · Explore · Enjoy"></div>
     <div style="max-width:150px">${imgField("logo","Logo","1/1")}</div>
     <p class="pnote">Branding saves automatically.</p></details>
    <div class="alist">${anime.map(x=>`<div class="arow"><img src="${art(x)}" alt=""><div><b>${esc(x.title)}</b><small>${x.year} · ${x.episodes} ep · ${Object.values(x.eps||{}).filter(e=>e.v).length} videos · ★ ${Number(x.rating).toFixed(1)}</small></div><a class="btn sm" href="#/admin?edit=${x.id}">Edit</a><button class="btn sm danger" data-del="${x.id}">Delete</button></div>`).join("")||'<div class="empty">No anime yet. Add your first title.</div>'}</div>
   </div></div>`;
}

/* ---------- router ---------- */
const NAV=[["/","🏠","nav_home"],["/trending","🔥","nav_trending"],["/latest","🗓","nav_latest"],["/library","📚","nav_library"],["/genres","▦","nav_genres"],["/az","🔤","nav_az"],["/list","♥","nav_list"]];
function renderChrome(path){
  $("#nav").innerHTML=NAV.map(([h,i,l])=>`<a href="#${h}" class="${path===h||(h!=="/"&&path.startsWith(h))?"on":""}"><span>${i}</span>${t(l)}</a>`).join("")+(isAdmin()?`<a href="#/admin" class="${path.startsWith("/admin")?"on":""}"><span>🛠</span>${t("nav_admin")}</a>`:"");
  $("#glist").innerHTML=GENRES.map(g=>`<a href="#/library?genre=${encodeURIComponent(g)}"><span>${GICON[g]}</span>${g}</a>`).join("");
  const bn=[["/","🏠","nav_home"],["/library","📚","short_lib"],["/trending","🔥","nav_trending"],["/list","♥","nav_list"]];
  $("#bottom").innerHTML=bn.map(([h,i,l])=>`<a href="#${h}" class="${path===h?"on":""}"><span>${i}</span>${t(l)}</a>`).join("")+`<a href="#" id="bnSet"><span>⚙️</span>${t("settings")}</a>`;
  $("#auth").innerHTML=session?`<span class="hide-sm" style="margin-right:6px;color:var(--muted)">${t("hi")}, ${esc(session.name)}</span><button class="btn" id="logout">${t("logout")}</button>`:`<button class="btn hide-sm" data-open-auth="login">${t("login")}</button><button class="btn primary" data-open-auth="signup">${t("signup")}</button>`;
  $("#themeBtn").textContent=theme==="dark"?"🌙":"☀️";
  $("#q").placeholder=t("search_ph");$("#tagline").textContent=site.tagline||t("tagline");$("#quoteT").textContent=t("quote");$("#genH").textContent=t("genres");
  document.documentElement.lang=settings.lang;
  document.querySelectorAll("[data-i18n]").forEach(e=>{e.textContent=t(e.dataset.i18n)});
  setAuthMode(authMode);
}
function route(){
  clearInterval(heroTimer);window.destroyPlayer&&destroyPlayer();
  const h=location.hash.slice(1)||"/";const [path,qs]=h.split("?");const p=new URLSearchParams(qs||"");const parts=path.split("/").filter(Boolean);
  let html="";
  switch(parts[0]||""){
    case "":html=homeView();break;
    case "trending":html=listPage(t("trending_now"),"Top-rated anime right now",trending().slice(0,24),true);break;
    case "latest":html=listPage(t("nav_latest"),"Newest seasons first",latest().slice(0,24));break;
    case "library":html=libraryView(p);break;
    case "az":p.set("sort","az");html=libraryView(p);break;
    case "genres":html=genresView();break;
    case "list":html=listView();break;
    case "anime":html=detailView(byId(parts[1]));break;
    case "watch":html=watchView(byId(parts[1]),parseInt(parts[2],10));break;
    case "search":html=searchView(p.get("q")||"");break;
    case "admin":html=adminView(p);break;
    default:html=`<div class="empty"><b>Page not found</b><a class="btn primary" href="#/" style="margin-top:12px">Go home</a></div>`;
  }
  $("#view").innerHTML=html;
  renderChrome("/"+(parts[0]||""));applySite();postRender();
  if(parts[0]==="admin"&&p.get("edit")===null)editing=null;
  window.scrollTo(0,0);closeSide();hydrateVids();window.initPlayer&&initPlayer();
  if(!parts[0])startHero();
  document.title=(parts[0]==="anime"&&byId(parts[1])?byId(parts[1]).title+" – ":"")+(site.name||"MK AnimeVerse")+" – "+(site.tagline||"Watch · Explore · Enjoy");
}
let heroI=0;
function showSlide(i){const s=document.querySelectorAll(".slide"),d=document.querySelectorAll(".dots button");if(!s.length)return;heroI=(i+s.length)%s.length;s.forEach((e,k)=>e.classList.toggle("on",k===heroI));d.forEach((e,k)=>e.classList.toggle("on",k===heroI))}
function startHero(){heroI=0;if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;heroTimer=setInterval(()=>showSlide(heroI+1),6500)}

/* ---------- theme / side ---------- */
function applyTheme(){document.documentElement.setAttribute("data-theme",theme)}
function closeSide(){$("#side").classList.remove("open");$("#scrim").classList.remove("on")}

/* ---------- auth ---------- */
let authMode="login";
const hashPw=s=>{let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))>>>0;return h.toString(36)};
function openAuth(mode){setAuthMode(mode||"login");$("#aErr").textContent="";$("#authModal").classList.add("on");setTimeout(()=>$((authMode==="signup"?"#aName":"#aEmail")).focus(),30)}
function setAuthMode(m){authMode=m;$("#tabLogin").classList.toggle("on",m==="login");$("#tabSignup").classList.toggle("on",m==="signup");$("#nameField").style.display=m==="signup"?"flex":"none";$("#authTitle").textContent=m==="signup"?t("join"):t("welcome");$("#authSub").textContent=m==="signup"?t("join_sub"):t("welcome_sub");$("#aGo").textContent=m==="signup"?t("create_acc"):t("login");$("#forgotLink").style.display=m==="login"?"block":"none";$("#codeField").style.display=m==="signup"?"flex":"none";$("#passField2").style.display=m==="signup"?"flex":"none";
  const first=!users.length&&m==="signup";document.querySelector("#authModal .tabs").style.display=users.length?"flex":"none";
  if(first){$("#authTitle").textContent="Set up admin account";$("#authSub").textContent="You are the first user, so this account becomes the admin. Choose your name, email, secret code and password.";$("#aGo").textContent="Create admin account"}}
function submitAuth(){
  const email=$("#aEmail").value.trim().toLowerCase(),pw=$("#aPass").value,name=$("#aName").value.trim();
  if(!/^\S+@\S+\.\S+$/.test(email))return $("#aErr").textContent="Enter a valid email address.";
  if(pw.length<6)return $("#aErr").textContent="Use a password with at least 6 characters.";
  if(authMode==="signup"){
    if(!name)return $("#aErr").textContent="Enter your name.";
    if($("#aPass2").value!==pw)return $("#aErr").textContent="The two passwords do not match.";
    if(users.some(u=>u.email===email))return $("#aErr").textContent="That email already has an account. Log in instead.";
    const code=$("#aCode").value.trim();if(code.length<4)return $("#aErr").textContent="Choose a secret code of at least 4 characters — you need it to reset your password.";
    const u={name,email,pw:hashPw(pw),sc:scHash(email,code),role:users.length?"user":"admin"};users.push(u);ls.set("av_users",users);
    session={name:u.name,email:u.email,role:u.role};
  }else{
    const u=users.find(x=>x.email===email&&x.pw===hashPw(pw));
    if(!u)return $("#aErr").textContent="Email or password is incorrect.";
    session={name:u.name,email:u.email,role:u.role};
  }
  ls.set("av_session",session);$("#authModal").classList.remove("on");$("#aPass").value="";$("#aCode").value="";$("#aPass2").value="";
  toast(session.role==="admin"?(authMode==="signup"?"Admin account created":"Logged in as admin"):"Logged in");route();
}

/* ---------- events ---------- */
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-fav],[data-open-auth],[data-hero],[data-dot],[data-letter],[data-del]");
  if(t){
    if(t.dataset.fav){e.preventDefault();const id=t.dataset.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save();toast(favs.includes(id)?"Added to My List":"Removed from My List");
      const keep=document.querySelector(".slide.on")?heroI:null;route();if(keep!==null){showSlide(keep);clearInterval(heroTimer)}return}
    if(t.hasAttribute("data-open-auth"))return openAuth(t.dataset.openAuth);
    if(t.dataset.hero){clearInterval(heroTimer);return showSlide(heroI+Number(t.dataset.hero))}
    if(t.dataset.dot){clearInterval(heroTimer);return showSlide(Number(t.dataset.dot))}
    if(t.dataset.letter){const p=new URLSearchParams((location.hash.split("?")[1])||"");p.get("letter")===t.dataset.letter?p.delete("letter"):p.set("letter",t.dataset.letter);location.hash="/library?"+p;return}
    if(t.dataset.del){if(confirm("Delete this anime from the library?")){anime=anime.filter(a=>a.id!==t.dataset.del);favs=favs.filter(x=>x!==t.dataset.del);save();toast("Deleted");route()}return}
  }
  const id=e.target.id;
  if(id==="logout"){session=null;ls.set("av_session",null);toast("Logged out");if(location.hash.startsWith("#/admin"))location.hash="/";else route()}
  else if(id==="tabLogin")setAuthMode("login");
  else if(id==="tabSignup")setAuthMode("signup");
  else if(id==="aGo")submitAuth();
  else if(id==="aCancel"||e.target.id==="authModal")$("#authModal").classList.remove("on");
  else if(id==="fClear")location.hash="/library";
  else if(id==="aSave")saveAnime();
  else if(id==="aExport"){const j=$("#aJson");j.style.display="block";j.value=JSON.stringify(anime,null,2);j.select()}
  else if(id==="aImport"){const j=$("#aJson");if(j.style.display==="none"){j.style.display="block";j.value="";j.placeholder="Paste exported JSON here, then press Import JSON again.";return}
    try{const d=JSON.parse(j.value);if(!Array.isArray(d))throw 0;anime=d.map((a,i)=>({id:a.id||"u"+Date.now()+i,title:String(a.title||"Untitled"),genres:Array.isArray(a.genres)?a.genres:[],year:+a.year||2024,rating:+a.rating||0,episodes:+a.episodes||1,type:a.type||"TV",status:a.status||"Completed",hue:+a.hue||0,desc:a.desc||"",featured:!!a.featured,videoUrl:a.videoUrl||"",embedUrl:a.embedUrl||"",sources:a.sources||{},subs:a.subs||{},dubs:a.dubs||{},eps:a.eps||{},poster:a.poster||"",cover:a.cover||"",added:i}));save();toast("Imported "+anime.length+" titles");route()}catch(err){toast("That JSON could not be read")}}
  else if(id==="aReset"){if(confirm("Replace everything with the sample titles?")){anime=SEED.map(a=>({...a}));save();toast("Samples restored");route()}}
});
function rerenderWatch(){
  const v=document.querySelector(".screen video");let tm=0,playing=false;
  if(v){tm=v.currentTime;playing=!v.paused}
  const y=window.scrollY;route();window.scrollTo(0,y);
  const nv=document.querySelector(".screen video");
  if(nv&&tm>0)nv.addEventListener("loadedmetadata",()=>{nv.currentTime=tm;if(playing)nv.play().catch(()=>{})},{once:true});
}
function openSettings(){
  const o=(v,l,c)=>`<option value="${v}" ${String(v)===String(c)?"selected":""}>${l}</option>`;
  $("#sLang").innerHTML=Object.entries(LANGNAME).map(([v,l])=>o(v,l,settings.lang)).join("");
  $("#sQual").innerHTML=[["auto",t("auto")],["1080","1080p"],["720","720p"],["480","480p"],["360","360p"]].map(([v,l])=>o(v,l,settings.quality)).join("");
  $("#sAudio").innerHTML=[["ja",t("original")],["en",LANGNAME.en],["ta",LANGNAME.ta],["hi",LANGNAME.hi]].map(([v,l])=>o(v,l,settings.audio)).join("");
  $("#sSub").innerHTML=[["off",t("off")],["en",LANGNAME.en],["ta",LANGNAME.ta],["hi",LANGNAME.hi]].map(([v,l])=>o(v,l,settings.sub)).join("");
  $("#setModal").classList.add("on");$("#sLang").focus();
}
$("#setBtn").onclick=openSettings;
$("#sClose").onclick=()=>$("#setModal").classList.remove("on");
$("#setModal").addEventListener("click",e=>{if(e.target.id==="setModal")$("#setModal").classList.remove("on")});
$("#sSave").onclick=()=>{
  settings={lang:$("#sLang").value,quality:$("#sQual").value,audio:$("#sAudio").value,sub:$("#sSub").value};
  ls.set("av_settings",settings);$("#setModal").classList.remove("on");
  const y=window.scrollY;route();window.scrollTo(0,y);toast(t("saved"));
};
document.addEventListener("change",e=>{
  if(["pQual","pAud","pSub"].includes(e.target.id)){
    settings={...settings,quality:$("#pQual").value,audio:$("#pAud").value,sub:$("#pSub").value};
    ls.set("av_settings",settings);rerenderWatch();return;
  }
  if(["fGenre","fYear","fSort"].includes(e.target.id)){
    const p=new URLSearchParams((location.hash.split("?")[1])||"");
    [["fGenre","genre"],["fYear","year"],["fSort","sort"]].forEach(([i,k])=>{const v=$("#"+i).value;v?p.set(k,v):p.delete(k)});
    location.hash="/library?"+p;
  }
});
const grab=(ks,p)=>Object.fromEntries(ks.map(k=>[k,$("#"+p+k).value.trim()]).filter(x=>x[1]));
function saveAnime(auto){
  const title=$("#fTitle").value.trim();if(!title)return auto?0:toast("Add a title first");
  const o={title,genres:$("#fGen").value.split(",").map(s=>s.trim()).filter(Boolean),year:+$("#fYr").value||2024,rating:Math.min(10,Math.max(0,+$("#fRt").value||0)),episodes:Math.max(1,+$("#fEp").value||1),type:$("#fTy").value,status:$("#fSt").value,hue:((+$("#fHue").value||0)%361),desc:$("#fDesc").value.trim(),featured:$("#fFeat").checked,sources:grab(["1080","720","480","360"],"fq"),subs:grab(["en","ta","hi"],"fs"),dubs:grab(["en","ta","hi"],"fd")};Object.assign(o,smart(o,auto));o.eps=cleanEps(o.episodes,auto);o.poster=di.poster;o.cover=di.cover;
  if(editing&&byId(editing))Object.assign(byId(editing),o);
  else{const id="u"+Date.now();anime.push({id,added:Math.max(0,...anime.map(a=>a.added))+1,...o});editing=id;history.replaceState(null,"","#/admin?edit="+id)}
  save();
  if(auto){refreshAdminList();const st=$("#autoStat");if(st)st.textContent="✓ Auto-saved"}
  else{editing=null;location.hash="/admin?edit=";route();toast("Saved ✓")}
}
/* search */
const qi=$("#q"),sg=$("#suggest");
qi.addEventListener("input",()=>{
  const t=qi.value.trim().toLowerCase();if(!t){sg.classList.remove("on");return}
  const m=anime.filter(a=>a.title.toLowerCase().includes(t)||a.genres.some(g=>g.toLowerCase().includes(t))).slice(0,6);
  sg.innerHTML=m.length?m.map(a=>`<a href="#/anime/${a.id}"><img src="${art(a)}" alt=""><span><b>${esc(a.title)}</b><br><small>${a.year} · ${a.genres.slice(0,2).join(", ")}</small></span></a>`).join(""):`<div style="padding:14px;color:var(--muted)">No match for “${esc(qi.value)}”. Try a genre or another title.</div>`;
  sg.classList.add("on");
});
qi.addEventListener("keydown",e=>{if(e.key==="Enter"&&qi.value.trim()){sg.classList.remove("on");location.hash="/search?q="+encodeURIComponent(qi.value.trim())}if(e.key==="Escape")sg.classList.remove("on")});
document.addEventListener("click",e=>{if(!e.target.closest(".search"))sg.classList.remove("on");else if(e.target.closest(".suggest a")){sg.classList.remove("on");qi.value=""}});
$("#themeBtn").onclick=()=>{theme=theme==="dark"?"light":"dark";ls.set("av_theme",theme);applyTheme();renderChrome("/"+((location.hash.slice(2)||"").split(/[/?]/)[0]));applySite();postRender()};
$("#menuBtn").onclick=()=>{$("#side").classList.add("open");$("#scrim").classList.add("on")};
$("#scrim").onclick=closeSide;
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#authModal").classList.remove("on");$("#setModal").classList.remove("on");closeSide()}});
window.addEventListener("hashchange",route);
/* ---------- smart video input: upload OR one link, everything else is automatic ---------- */
let pendingVid=null;
const idb=()=>new Promise((ok,no)=>{const r=indexedDB.open("av_videos",1);r.onupgradeneeded=()=>r.result.createObjectStore("v");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const idbPut=(k,b)=>idb().then(d=>new Promise((ok,no)=>{const q=d.transaction("v","readwrite").objectStore("v").put(b,k);q.onsuccess=ok;q.onerror=()=>no(q.error)}));
const idbGet=k=>idb().then(d=>new Promise(ok=>{const q=d.transaction("v").objectStore("v").get(k);q.onsuccess=()=>ok(q.result);q.onerror=()=>ok(null)})).catch(()=>null);
function hydrateVids(){document.querySelectorAll("video[data-idb]").forEach(async v=>{const b=await idbGet(v.dataset.idb);if(b)v.src=URL.createObjectURL(b);else v.insertAdjacentHTML("afterend",'<div class="pnote">Uploaded video not found on this device.</div>')})}
function toEmbed(u){let m;
  if(m=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/))return "https://www.youtube-nocookie.com/embed/"+m[1];
  if(m=u.match(/vimeo\.com\/(?:video\/)?(\d+)/))return "https://player.vimeo.com/video/"+m[1];
  if(m=u.match(/dailymotion\.com\/video\/([a-z0-9]+)/i))return "https://www.dailymotion.com/embed/video/"+m[1];
  if(m=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/))return "https://drive.google.com/file/d/"+m[1]+"/preview";
  return /\.(mp4|webm|ogv|ogg|mov|m4v|m3u8)(\?|#|$)/i.test(u)?"":u}
function smart(o,auto){
  const v=$("#fLink").value.trim()||pendingVid||"",r={videoUrl:"",embedUrl:""};
  if(!v)return r;
  if(v.startsWith("idb:")){r.videoUrl=v;return r}
  if(!/^https?:\/\//i.test(v)){if(auto){const c=byId(editing)||{};return{videoUrl:c.videoUrl||"",embedUrl:c.embedUrl||""}}toast("Link should start with https://");return r}
  const e=toEmbed(v);if(e){r.embedUrl=e;return r}
  r.videoUrl=v;const q=(v.match(/(1080|720|480|360)p/)||[])[1];if(q)r.sources={...o.sources,[q]:v};
  return r}
function takeFile(f){
  if(!f)return;
  if(!/^video\//.test(f.type)&&!/\.(mp4|webm|mov|m4v|ogv)$/i.test(f.name))return toast("Please choose a video file (mp4, webm, mov)");
  const k="v_"+Date.now();$("#dropName").textContent="Processing…";
  idbPut(k,f).then(()=>{pendingVid="idb:"+k;queueAuto();$("#fLink").value="";
    $("#dropName").textContent="✓ "+f.name+" ("+(f.size/1048576).toFixed(1)+" MB) — press Save";
    const ti=$("#fTitle");if(!ti.value.trim())ti.value=f.name.replace(/\.[^.]+$/,"").replace(/[._]+/g," ").replace(/\b(1080|720|480|360)p\b.*$/i,"").trim();
    toast("Video ready — press Save")}).catch(()=>{$("#dropName").textContent="Could not store this file (storage full?)";toast("Upload failed")})}
document.addEventListener("change",e=>{if(e.target.id==="fFile")takeFile(e.target.files[0])});
document.addEventListener("dragover",e=>{if(e.target.closest("#drop")){e.preventDefault();e.target.closest("#drop").classList.add("over")}});
document.addEventListener("dragleave",e=>{const d=e.target.closest&&e.target.closest("#drop");if(d)d.classList.remove("over")});
document.addEventListener("drop",e=>{const d=e.target.closest("#drop");if(d){e.preventDefault();d.classList.remove("over");takeFile(e.dataTransfer.files[0])}});
document.addEventListener("click",e=>{if(e.target.closest("#bnSet")){e.preventDefault();openSettings()}});
/* ---------- episode-wise admin ---------- */
let epDraft={};
const eid0=p=>{const i=p.get("edit");const a=i!==null?(i?byId(i):null):(editing?byId(editing):null);return a&&a.eps};
const epName=(a,n)=>t("ep")+" "+n+((a.eps&&a.eps[n]&&a.eps[n].t)?" · "+esc(a.eps[n].t):"");
const epCount=()=>Math.min(Math.max(1,+($("#fEp")||{}).value||1),300);
const epFilled=()=>Object.values(epDraft).filter(e=>e&&e.v).length;
function epRow(n){const e=epDraft[n]||{},up=String(e.v||"").startsWith("idb:");
  return `<div class="epr"><b>${n}</b><input data-et="${n}" value="${esc(e.t||"")}" placeholder="Title (optional)" aria-label="Episode ${n} title"><input data-ev="${n}" value="${up?"":esc(e.v||"")}" placeholder="${up?"✓ uploaded video":"Paste video link…"}" aria-label="Episode ${n} link"><label class="btn sm" title="Upload video for episode ${n}"><input type="file" accept="video/*" data-ef="${n}" hidden>⬆</label><button class="btn sm danger" data-eclr="${n}" aria-label="Delete episode ${n}">✕</button></div>`}
const epRows=c=>Array.from({length:Math.min(Math.max(1,+c||1),300)},(_,i)=>epRow(i+1)).join("");
function epAdminHTML(c){return `<details class="srcs" open><summary>Episodes — control each one (<span id="epFilled">${epFilled()}</span> with video)</summary><p style="color:var(--muted);font-size:12.5px;margin:8px 0">Give every episode its own title and video (upload or link). Episodes left empty use the default video above.</p>
  <div class="epbulk"><label class="btn sm">⬆ Upload many videos<input type="file" id="epMulti" accept="video/*" multiple hidden></label><button class="btn sm" id="epPasteBtn" type="button">Paste links</button><button class="btn sm danger" id="epClearAll" type="button">🗑 Delete all</button></div>
  <div id="epPasteBox" style="display:none"><textarea id="epPaste" placeholder="One link per line → Episode 1, 2, 3…" aria-label="Links, one per line" style="width:100%;height:100px;margin:8px 0;border-radius:10px;border:1px solid var(--line);background:var(--panel);padding:10px"></textarea><button class="btn sm primary" id="epApply" type="button">Apply to episodes</button></div>
  <p class="pnote" style="margin-top:8px">Tip: file names like <i>Show S01E05.mp4</i> are matched to episode 5 automatically.</p>
  <div class="eprows" id="epRows">${epRows(c)}</div></details>`}
function epRefresh(){queueAuto();$("#epRows").innerHTML=epRows(epCount());$("#epFilled").textContent=epFilled()}
function cleanEps(max,auto){let bad=0;const o={},prev=(byId(editing)||{}).eps||{};for(const n in epDraft){const e=epDraft[n],k=+n;if(!e||k<1||k>max)continue;const v=String(e.v||"").trim(),tt=String(e.t||"").trim();
  if(v&&!v.startsWith("idb:")&&!/^https?:\/\//i.test(v)){bad++;if(auto&&prev[k]){const pv={...(tt?{t:tt}:{}),...(prev[k].v?{v:prev[k].v}:{})};if(pv.t||pv.v)o[k]=pv}continue}
  if(v||tt)o[k]={...(tt?{t:tt}:{}),...(v?{v}:{})}}
  if(bad&&!auto)toast(bad+" episode link(s) skipped — links must start with https://");return o}
const isVid=f=>/^video\//.test(f.type)||/\.(mp4|webm|mov|m4v|ogv)$/i.test(f.name);
function detectEp(name){const b=name.replace(/\.[^.]+$/,"");let m=b.match(/(?:s\d+[\s._-]*e|\bep?(?:isode)?[\s._-]*|#)0*(\d{1,4})(?!\d)/i);if(m)return +m[1];
  const nums=[...b.matchAll(/(\d{1,4})(?![\dp])/g)].map(x=>+x[1]).filter(x=>x>0&&x<1900&&![1080,720,480,360].includes(x));return nums.length?nums[nums.length-1]:null}
const epStore=(n,f)=>{const k="v_"+Date.now()+"_"+n;return idbPut(k,f).then(()=>{epDraft[n]=Object.assign(epDraft[n]||{},{v:"idb:"+k})})};
document.addEventListener("input",e=>{const d=e.target.dataset||{};
  if(d.et!==undefined){(epDraft[d.et]=epDraft[d.et]||{}).t=e.target.value}
  else if(d.ev!==undefined){(epDraft[d.ev]=epDraft[d.ev]||{}).v=e.target.value.trim();$("#epFilled").textContent=epFilled()}
  else if(e.target.id==="fEp"&&$("#epRows"))epRefresh()});
document.addEventListener("change",async e=>{const d=e.target.dataset||{};
  if(d.ef!==undefined){const f=e.target.files[0];if(!f)return;if(!isVid(f))return toast("Please choose a video file");
    try{await epStore(d.ef,f);toast("Episode "+d.ef+" video ready — press Save");epRefresh()}catch(x){toast("Upload failed (storage full?)")}}
  else if(e.target.id==="epMulti"){const fs=[...e.target.files].filter(isVid);if(!fs.length)return toast("No video files chosen");
    const used=new Set(Object.keys(epDraft).filter(k=>epDraft[k]&&epDraft[k].v));let nx=1,max=epCount();const plan=[];
    fs.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
    for(const f of fs){let n=detectEp(f.name);if(!n||plan.some(p=>p[0]===n)){while(used.has(String(nx))||plan.some(p=>p[0]===nx))nx++;n=nx}plan.push([n,f]);max=Math.max(max,n)}
    try{await Promise.all(plan.map(([n,f])=>epStore(n,f)));$("#fEp").value=max;epRefresh();toast(plan.length+" video(s) matched to episodes — press Save")}catch(x){toast("Upload failed (storage full?)")}
    e.target.value=""}});
document.addEventListener("click",e=>{const c=e.target.closest("[data-eclr]");
  if(c){delete epDraft[c.dataset.eclr];epRefresh();return}
  const id=e.target.id;
  if(id==="epPasteBtn"){const b=$("#epPasteBox");b.style.display=b.style.display==="none"?"block":"none"}
  else if(id==="epApply"){const L=$("#epPaste").value.split("\n").map(x=>x.trim()).filter(Boolean);if(!L.length)return toast("Paste at least one link");
    L.forEach((v,i)=>{(epDraft[i+1]=epDraft[i+1]||{}).v=v});if(L.length>epCount())$("#fEp").value=L.length;$("#epPaste").value="";epRefresh();toast(L.length+" link(s) applied — press Save")}
  else if(id==="epClearAll"){if(confirm("Delete all episode titles and videos?")){epDraft={};epRefresh()}}});
/* ---------- images + branding (admin) ---------- */
let di={poster:"",cover:"",logo:""},site=ls.get("av_site",{name:"",tagline:"",logo:""});
const initDi=a=>{di={poster:a&&a.poster||"",cover:a&&a.cover||"",logo:site.logo||""};return ""};
const imgField=(k,label,ar)=>{const v=di[k]||"",lk=/^https?:/i.test(v);return `<div class="field"><label>${label}</label><div class="imgprev" id="pv_${k}" style="aspect-ratio:${ar}">${v?`<img src="${esc(v)}" alt="">`:"<small>Auto artwork</small>"}</div><div class="epbulk"><label class="btn sm">⬆ Upload<input type="file" accept="image/*" id="file_${k}" hidden></label><button class="btn sm danger" type="button" data-imgclr="${k}">🗑 Delete</button></div><input id="url_${k}" placeholder="or paste image link https://…" value="${lk?esc(v):""}"></div>`};
const setImg=(k,v)=>{di[k]=v;queueAuto();const pv=$("#pv_"+k);if(pv)pv.innerHTML=v?`<img src="${esc(v)}" alt="">`:"<small>Auto artwork</small>"};
const IMGSPEC={poster:[480,640,.82],cover:[1280,720,.78],logo:[160,160,1,true]};
function imgFromFile(f,w,h,q,png){return new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),sc=Math.max(w/i.width,h/i.height),dw=i.width*sc,dh=i.height*sc;x.drawImage(i,(w-dw)/2,(h-dh)/2,dw,dh);URL.revokeObjectURL(u);ok(c.toDataURL(png?"image/png":"image/jpeg",q))};i.onerror=()=>no();i.src=u})}
function applySite(){const lm=$(".logo-mark"),b=$(".logo b");if(!lm||!b)return;if(!lm.dataset.o)lm.dataset.o=lm.innerHTML;
  b.textContent=site.name||"MK AnimeVerse";lm.innerHTML=site.logo?`<img src="${esc(site.logo)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`:lm.dataset.o}
document.addEventListener("change",async e=>{const m=(e.target.id||"").match(/^file_(poster|cover|logo)$/);if(!m)return;const f=e.target.files[0];if(!f)return;
  if(!/^image\//.test(f.type))return toast("Please choose an image (jpg, png, webp)");
  try{setImg(m[1],await imgFromFile(f,...IMGSPEC[m[1]]));$("#url_"+m[1]).value="";toast("Image ready"+(m[1]==="logo"?" — press Save branding":" — press Save"))}catch(x){toast("Could not read that image")}});
document.addEventListener("input",e=>{const m=(e.target.id||"").match(/^url_(poster|cover|logo)$/);if(!m)return;const v=e.target.value.trim();if(!v||/^https?:\/\//i.test(v))setImg(m[1],v)});
document.addEventListener("click",e=>{const c=e.target.closest("[data-imgclr]");if(c){setImg(c.dataset.imgclr,"");$("#url_"+c.dataset.imgclr).value="";return}
  if(e.target.id==="siteSave"){site={name:$("#sName").value.trim(),tagline:$("#sTag").value.trim(),logo:di.logo};if(!ls.set("av_site",site))toast("Storage full — use a logo link");else{applySite();$("#tagline").textContent=site.tagline||t("tagline");toast("Branding saved")}}
  else if(e.target.id==="siteReset"){site={name:"",tagline:"",logo:""};ls.set("av_site",site);setImg("logo","");$("#sName").value="";$("#sTag").value="";$("#url_logo").value="";applySite();$("#tagline").textContent=t("tagline");toast("Branding reset")}});
/* ---------- live page editor (admin): edit text & images anywhere ---------- */
let editOn=false,ov=ls.get("av_text",{});
const SKIP=".admin,.modal,#editbar,.toast,.search,.suggest,select,textarea,input,script,style,.field,.tabs";
const ownText=el=>[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.data).join("").trim();
const idFrom=h=>h&&h.getAttribute("href").split("/")[2];
function applyText(){const keys=Object.keys(ov);if(!keys.length)return;
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest("#editbar,textarea,script,style,option"))continue;const k=n.data.trim();if(k&&ov[k]!==undefined)n.data=n.data.replace(k,ov[k])}}
function animeRef(el){let id,f;
  const card=el.closest(".card");if(card){id=idFrom(card.querySelector('a[href^="#/anime/"]'));if(el.matches("h3"))f="title"}
  const sl=el.closest(".slide");if(sl){id=idFrom(sl.querySelector('a[href^="#/watch/"]'));if(el.matches("h1"))f="title";else if(el.matches("p"))f="desc"}
  if(el.closest(".detail")){id=location.hash.split("/")[2];id=id&&id.split("?")[0];if(el.matches("h1"))f="title";else if(el.matches("p"))f="desc"}
  if(el.closest(".player-bar")&&el.matches("h2")){id=location.hash.split("/")[2];f="title"}
  const ep=el.closest(".ep");if(ep&&el.matches("b")){id=idFrom(ep);f="title"}
  return id&&f&&byId(id)?{id,f}:null}
function addImgBtn(host,id,f,label){if(!host||!id||host.querySelector(`:scope>.imgbtn[data-f="${f}"]`))return;const b=document.createElement("button");b.type="button";b.className="imgbtn";b.dataset.id=id;b.dataset.f=f;b.textContent=(f==="del"?"🗑 ":"🖼 ")+label;host.appendChild(b)}
function unmark(){document.body.classList.remove("editing");document.querySelectorAll("[data-ed]").forEach(e=>{e.removeAttribute("contenteditable");delete e.dataset.ed;delete e.dataset.af});document.querySelectorAll(".imgbtn").forEach(b=>b.remove())}
function markEdit(){document.body.classList.add("editing");clearInterval(heroTimer);
  document.querySelectorAll("h1,h2,h3,h4,p,span,small,b,a,.chip,.tag,.quote").forEach(el=>{
    if(el.closest(SKIP)||el.dataset.ed)return;const tx=ownText(el);if(!/\p{L}/u.test(tx)||el.querySelector("h1,h2,h3,h4,p,a,div"))return;
    el.contentEditable="true";el.spellcheck=false;el.dataset.ed="1";el.dataset.orig=tx;const r=animeRef(el);if(r)el.dataset.af=r.id+"|"+r.f});
  document.querySelectorAll("#view .card").forEach(c=>addImgBtn(c,idFrom(c.querySelector('a[href^="#/anime/"]')),"poster","Image"));
  document.querySelectorAll("#view .slide").forEach(sl=>addImgBtn(sl.querySelector(".in"),idFrom(sl.querySelector('a[href^="#/watch/"]')),"cover","Cover"));
  document.querySelectorAll("#view .card").forEach(c=>addImgBtn(c,idFrom(c.querySelector('a[href^="#/anime/"]')),"del","Delete"));
  const dt=document.querySelector("#view .detail");if(dt){const id=(location.hash.split("/")[2]||"").split("?")[0];addImgBtn(dt,id,"poster","Image");addImgBtn(dt,id,"cover","Cover");addImgBtn(dt,id,"del","Delete")}}
function renderEditBar(){let b=$("#editbar");
  if(!isAdmin()){if(b)b.remove();editOn=false;return}
  if(!b){b=document.createElement("div");b.id="editbar";document.body.appendChild(b)}
  b.className=editOn?"on":"";
  b.innerHTML=editOn?`<select id="goSel" aria-label="Go to page"><option value="">Go to…</option><optgroup label="Pages">${[["/","Home"],["/trending","Trending"],["/latest","Latest"],["/library","Library"],["/genres","Genres"],["/list","My List"],["/admin","Admin"]].map(([h,l])=>`<option value="${h}">${l}</option>`).join("")}</optgroup><optgroup label="Anime">${anime.map(a=>`<option value="/anime/${a.id}">${esc(a.title)}</option>`).join("")}</optgroup></select><span class="hint">Tap any text to edit — saves automatically</span><button class="btn sm primary" id="editDone" type="button">✓ Done</button>`:`<button class="btn primary" id="editStart" type="button">✏️ Edit page</button>`}
function postRender(){applyText();renderEditBar();if(editOn&&isAdmin())markEdit();else unmark()}
function commitEdit(el,live){if(!el.dataset||!el.dataset.ed)return;const nt=ownText(el);if(nt===el.dataset.orig)return;
  if(el.dataset.af){const [id,f]=el.dataset.af.split("|");if(!nt){if(!live)el.textContent=el.dataset.orig;return}byId(id)[f]=nt;save();el.dataset.orig=nt;toast("Auto-saved ✓");return}
  if(el.matches(".logo b")){if(!nt)return;site.name=nt;ls.set("av_site",site);el.dataset.orig=nt;toast("Auto-saved ✓");return}
  if(el.matches("#tagline")){if(!nt)return;site.tagline=nt;ls.set("av_site",site);el.dataset.orig=nt;toast("Auto-saved ✓");return}
  if(!nt){if(!live)el.textContent=el.dataset.orig;return}
  const src=Object.keys(ov).find(k=>ov[k]===el.dataset.orig)||el.dataset.orig;
  if(nt===src)delete ov[src];else ov[src]=nt;
  ls.set("av_text",ov);el.dataset.orig=nt;toast("Auto-saved ✓")}
const edT=new WeakMap();
document.addEventListener("focusout",e=>{clearTimeout(edT.get(e.target));commitEdit(e.target,false)});
document.addEventListener("input",e=>{const el=e.target;if(el.dataset&&el.dataset.ed){clearTimeout(edT.get(el));edT.set(el,setTimeout(()=>commitEdit(el,true),1000))}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset&&e.target.dataset.ed){e.preventDefault();e.target.blur()}});
document.addEventListener("paste",e=>{if(e.target.dataset&&e.target.dataset.ed){e.preventDefault();document.execCommand("insertText",false,(e.clipboardData||window.clipboardData).getData("text/plain"))}});
document.addEventListener("click",e=>{
  if(editOn&&!e.target.closest("#editbar,.modal,.admin,.toast,.imgbtn,.suggest")){const a=e.target.closest("a[href^='#']"),f=e.target.closest("[data-fav]");if(a||f){e.preventDefault();e.stopPropagation()}}
},true);
let imgTarget=null;
document.addEventListener("click",e=>{
  const ib=e.target.closest(".imgbtn");if(ib){e.preventDefault();e.stopPropagation();
    if(ib.dataset.f==="del"){if(confirm("Delete this anime permanently?")){const d=ib.dataset.id;anime=anime.filter(a=>a.id!==d);favs=favs.filter(x=>x!==d);save();if(location.hash.includes(d))location.hash="/";else{const y=scrollY;route();scrollTo(0,y)}toast("Deleted")}return}
    imgTarget={id:ib.dataset.id,f:ib.dataset.f};let p=$("#imgPick");if(!p){p=document.createElement("input");p.type="file";p.accept="image/*";p.id="imgPick";p.hidden=true;document.body.appendChild(p)}p.value="";p.click();return}
  const id=e.target.id;
  if(id==="editStart"){editOn=true;postRender();toast("Edit mode on — tap any text")}
  else if(id==="editDone"){editOn=false;const y=scrollY;route();scrollTo(0,y)}
  else if(id==="resetTxt"){if(confirm("Remove all your text edits (anime titles stay)?")){ov={};ls.set("av_text",ov);const y=scrollY;route();scrollTo(0,y);toast("Texts reset")}}});
document.addEventListener("change",async e=>{
  if(e.target.id==="goSel"){if(e.target.value)location.hash=e.target.value;return}
  if(e.target.id!=="imgPick"||!imgTarget)return;const f=e.target.files[0],a=byId(imgTarget.id);if(!f||!a)return;
  if(!/^image\//.test(f.type))return toast("Please choose an image");
  try{a[imgTarget.f]=await imgFromFile(f,...IMGSPEC[imgTarget.f]);save();const y=scrollY;route();scrollTo(0,y);toast("Image updated ✓")}catch(x){toast("Could not read that image")}});
/* ---------- admin autosave (every second after a change) ---------- */
let autoT;
const queueAuto=()=>{clearTimeout(autoT);const st=$("#autoStat");if(st)st.textContent="Saving…";autoT=setTimeout(autoSave,1000)};
const adminRows=()=>anime.map(x=>`<div class="arow"><img src="${art(x)}" alt=""><div><b>${esc(x.title)}</b><small>${x.year} · ${x.episodes} ep · ${Object.values(x.eps||{}).filter(e=>e.v).length} videos · ★ ${Number(x.rating).toFixed(1)}</small></div><a class="btn sm" href="#/admin?edit=${x.id}">Edit</a><button class="btn sm danger" data-del="${x.id}">Delete</button></div>`).join("")||'<div class="empty">No anime yet. Add your first title.</div>';
function refreshAdminList(){const l=$(".alist");if(l)l.innerHTML=adminRows();const h=[...document.querySelectorAll(".panel h3")].find(x=>x.textContent.startsWith("Library"));if(h)h.textContent="Library ("+anime.length+")"}
function autoSave(){if(!isAdmin()||!$("#fTitle"))return;
  if($("#sName")){site={name:$("#sName").value.trim(),tagline:$("#sTag").value.trim(),logo:di.logo};ls.set("av_site",site);applySite();$("#tagline").textContent=site.tagline||t("tagline")}
  saveAnime(true);const st=$("#autoStat");if(st&&st.textContent==="Saving…")st.textContent="✓ Auto-saved"}
["input","change"].forEach(ev=>document.addEventListener(ev,e=>{if(e.target.closest&&e.target.closest(".admin .panel")&&e.target.id!=="fFile"&&!/^(epMulti|file_)/.test(e.target.id||""))queueAuto()}));
/* ---------- show / hide password ---------- */
const resetPw=()=>{document.querySelectorAll("#authModal .pwt").forEach(b=>{const i=$("#"+b.dataset.pwt);i.type="password";b.textContent="👁"});const p=$("#aPass"),b=$("#pwToggle");if(p){p.type="password";b.textContent="👁";b.setAttribute("aria-pressed","false");b.setAttribute("aria-label","Show password")}};
document.addEventListener("click",e=>{
  if(e.target.id==="pwToggle"){const p=$("#aPass"),show=p.type==="password";p.type=show?"text":"password";e.target.textContent=show?"🙈":"👁";e.target.setAttribute("aria-pressed",show);e.target.setAttribute("aria-label",show?"Hide password":"Show password");p.focus()}
  else if(e.target.closest("[data-open-auth],#aGo,#aCancel")||e.target.id==="authModal")setTimeout(resetPw,0)});
/* ---------- admin password reset with secret code ---------- */
const RESET_SHA="0efec3a7d9605c8fe249943bdd2039d5ccbf173b3233c5844d8c0e5371becb86",RESET_DJB="l0yhae",RESET_SALT="mkav-reset:";
function sha256(str){
  const m=new TextEncoder().encode(str),l=m.length,n=((l+9+63)>>6)<<6,b=new Uint8Array(n);b.set(m);b[l]=128;
  const dv=new DataView(b.buffer);dv.setUint32(n-4,(l*8)>>>0);dv.setUint32(n-8,Math.floor(l*8/4294967296));
  const K=new Uint32Array(64),H=new Uint32Array(8),W=new Uint32Array(64),r=(x,k)=>(x>>>k)|(x<<(32-k));
  for(let c=2,k=0;k<64;c++){let p=1;for(let i=2;i*i<=c;i++)if(c%i==0){p=0;break}if(p)K[k++]=Math.floor((Math.cbrt(c)%1)*4294967296)}
  [2,3,5,7,11,13,17,19].forEach((p,i)=>H[i]=Math.floor((Math.sqrt(p)%1)*4294967296));
  for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)W[i]=dv.getUint32(o+i*4);
    for(let i=16;i<64;i++){const a=W[i-15],d=W[i-2];W[i]=W[i-16]+(r(a,7)^r(a,18)^(a>>>3))+W[i-7]+(r(d,17)^r(d,19)^(d>>>10))}
    let [a,b2,c2,d2,e,f,g,h]=H;
    for(let i=0;i<64;i++){const t1=(h+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+W[i])>>>0,t2=((r(a,2)^r(a,13)^r(a,22))+((a&b2)^(a&c2)^(b2&c2)))>>>0;h=g;g=f;f=e;e=(d2+t1)>>>0;d2=c2;c2=b2;b2=a;a=(t1+t2)>>>0}
    H[0]+=a;H[1]+=b2;H[2]+=c2;H[3]+=d2;H[4]+=e;H[5]+=f;H[6]+=g;H[7]+=h}
  return [...H].map(x=>x.toString(16).padStart(8,"0")).join("")}
const scHash=(email,code)=>sha256("mkav-user:"+String(email).trim().toLowerCase()+":"+String(code).trim());
const codeOk=(u,c)=>u.sc?u.sc===scHash(u.email,c):(u.role==="admin"&&sha256(RESET_SALT+String(c).trim())===RESET_SHA);
const rClose=()=>{$("#resetModal").classList.remove("on");["rEmail","rCode","rPass","rPass2"].forEach(i=>{$("#"+i).value="";$("#"+i).type="password"});document.querySelectorAll(".pwt").forEach(b=>b.textContent="👁")};
function submitReset(){
  const E=m=>$("#rErr").textContent=m,fl=ls.get("av_resetfail",{n:0,until:0});
  if(Date.now()<fl.until)return E("Too many wrong tries. Try again in "+Math.ceil((fl.until-Date.now())/60000)+" min.");
  const email=$("#rEmail").value.trim().toLowerCase(),code=$("#rCode").value,p1=$("#rPass").value,p2=$("#rPass2").value;
  if(!/^\S+@\S+\.\S+$/.test(email))return E("Enter your account email.");
  if(!code)return E("Enter your secret code.");
  const u=users.find(x=>x.email===email);
  if(!u||!codeOk(u,code)){fl.n=(fl.n||0)+1;if(fl.n>=5){fl.until=Date.now()+15*60000;fl.n=0;ls.set("av_resetfail",fl);return E("Too many wrong tries. Locked for 15 minutes.")}ls.set("av_resetfail",fl);return E("Email or secret code is incorrect. "+(5-fl.n)+" attempt(s) left.")}
  if(p1.length<6)return E("Use a password with at least 6 characters.");
  if(p1!==p2)return E("The two passwords do not match.");
  u.pw=hashPw(p1);ls.set("av_users",users);ls.set("av_resetfail",{n:0,until:0});
  rClose();openAuth("login");$("#aEmail").value=u.email;toast("Password changed — log in with the new password");
}
document.addEventListener("click",e=>{const id=e.target.id;
  if(id==="forgotLink"){$("#authModal").classList.remove("on");$("#rErr").textContent="";$("#resetModal").classList.add("on");setTimeout(()=>$("#rEmail").focus(),30)}
  else if(id==="rGo")submitReset();
  else if(id==="rCancel"||id==="resetModal")rClose();
  else if(e.target.classList&&e.target.classList.contains("pwt")){const i=$("#"+e.target.dataset.pwt),sh=i.type==="password";i.type=sh?"text":"password";e.target.textContent=sh?"🙈":"👁";e.target.setAttribute("aria-label",sh?"Hide":"Show")}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")rClose();if(e.key==="Enter"&&e.target.closest&&e.target.closest("#resetModal"))submitReset()});
applyTheme();route();
if(!users.length)setTimeout(()=>openAuth("signup"),500);
