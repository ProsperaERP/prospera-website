/* Land at the top of every page (or on the linked section). The claude.ai frame carries the previous page's scroll position into the next page. */
(function(){
  try{if("scrollRestoration" in history)history.scrollRestoration="manual";}catch(e){}
  var userMoved=false;
  ["wheel","touchstart","keydown","mousedown"].forEach(function(t){window.addEventListener(t,function(){userMoved=true;},{passive:true,once:true});});
  function target(){var h=location.hash.slice(1);if(!h)return null;try{return document.getElementById(decodeURIComponent(h));}catch(e){return null;}}
  function land(){
    if(userMoved)return;
    var el=target();
    if(el){var hd=document.querySelector(".header"),off=hd?hd.getBoundingClientRect().height+12:0;window.scrollTo({top:Math.max(0,el.getBoundingClientRect().top+window.scrollY-off),left:0,behavior:"instant"});}
    else if(window.scrollY!==0){window.scrollTo({top:0,left:0,behavior:"instant"});}
  }
  land();
  document.addEventListener("DOMContentLoaded",land);
  window.addEventListener("load",function(){land();setTimeout(land,60);setTimeout(land,250);setTimeout(land,600);});
  window.addEventListener("pageshow",function(e){if(e.persisted)return;land();});
})();
(function(){
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Scroll reveal: tag headline blocks, tiles and visuals, show those already on screen immediately
  if(!reduce&&"IntersectionObserver" in window){
    var sel=".section .inner > *, .section .lhead > *, .three > *, .two > *, .products > *, .features > *, .comp > *, .inds > *, .roles > *, .fo-stage > *, .fo-points > *, .ai-stage > *, .ai-pts > *, .sec-grid > *, .plans > *, .steps > *, .pband .inner > *";
    var els=[].slice.call(document.querySelectorAll(sel));
    var vh=window.innerHeight;
    document.documentElement.classList.add("js-rv");
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px",threshold:.08});
    els.forEach(function(el,i){
      if(el.closest(".hero,.page-hero,.header,.footer"))return;
      el.classList.add("rv");
      var sib=el.parentElement?[].indexOf.call(el.parentElement.children,el):0;
      el.style.transitionDelay=Math.min(sib,5)*70+"ms";
      if(el.getBoundingClientRect().top<vh){el.classList.add("in");}else{io.observe(el);}
    });
    // Safety net: never leave content hidden
    setTimeout(function(){els.forEach(function(el){el.classList.add("in");});},6000);
  }
  // Photo bands zoom settle
  [].forEach.call(document.querySelectorAll(".pband"),function(b){
    if(!("IntersectionObserver" in window)){b.classList.add("in");return;}
    var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){b.classList.add("in");o.disconnect();}});});o.observe(b);
  });
  // Industry band slideshow
  [].forEach.call(document.querySelectorAll(".ind-band"),function(band){
    var imgs=[].slice.call(band.querySelectorAll(".slides img")),bars=[].slice.call(band.querySelectorAll(".bars i")),lab=band.querySelector(".cap b"),i=0,t;
    if(!imgs.length)return;
    function show(n){i=(n+imgs.length)%imgs.length;imgs.forEach(function(im,k){im.classList.toggle("on",k===i);});bars.forEach(function(b,k){b.classList.remove("on");if(k===i){void b.offsetWidth;b.classList.add("on");}});if(lab)lab.textContent=imgs[i].dataset.label||"";}
    function next(){show(i+1);}
    bars.forEach(function(b,k){b.addEventListener("click",function(){show(k);clearInterval(t);if(!reduce)t=setInterval(next,4500);});});
    show(0);if(!reduce)t=setInterval(next,4500);
  });
})();
(function(){
  var mm=document.querySelector(".mm"),t=mm&&mm.querySelector(".mm-t");
  if(mm&&t){
    var here=location.pathname.split("/").pop()||"index.html";
    if([].some.call(mm.querySelectorAll(".mm-p a"),function(a){return a.getAttribute("href")===here;}))t.classList.add("cur");
    var close=function(){mm.classList.remove("open");t.setAttribute("aria-expanded","false");};
    var open=function(){mm.classList.add("open");t.setAttribute("aria-expanded","true");};
    var hov=window.matchMedia("(hover:hover) and (min-width:861px)").matches;
    t.addEventListener("click",function(e){e.stopPropagation();if(hov){open();}else{mm.classList.contains("open")?close():open();}});
    if(hov){var tm;mm.addEventListener("mouseenter",function(){clearTimeout(tm);open();});mm.addEventListener("mouseleave",function(){tm=setTimeout(close,180);});}
    document.addEventListener("click",function(e){if(!mm.contains(e.target))close();});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){close();t.focus();}});
  }
  var mb=document.querySelector(".mnav-t"),nav=document.querySelector(".nav");
  if(mb&&nav){mb.addEventListener("click",function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",String(o));document.body.style.overflow=o?"hidden":"";});}
})();
(function(){var h=document.querySelector(".header");if(!h)return;var f=function(){h.classList.toggle("scrolled",window.scrollY>8)};f();window.addEventListener("scroll",f,{passive:true});})();
(function(){
  var els=document.querySelectorAll("[data-tip]");if(!els.length)return;
  var pop=document.createElement("div");pop.className="tip-pop";pop.setAttribute("role","tooltip");pop.id="tip-pop";document.body.appendChild(pop);
  var cur=null,rtl=document.documentElement.dir==="rtl";
  var shownAt=0,shownY=0;function show(b){shownAt=Date.now();shownY=window.scrollY;cur=b;pop.textContent=b.getAttribute("data-text");pop.classList.add("on");b.setAttribute("aria-expanded","true");b.setAttribute("aria-describedby","tip-pop");
    var r=b.getBoundingClientRect(),w=Math.min(300,window.innerWidth-24);pop.style.maxWidth=w+"px";var pw=pop.offsetWidth,ph=pop.offsetHeight;
    var left=r.left+r.width/2-20;if(rtl)left=r.left+r.width/2-pw+20;left=Math.max(12,Math.min(left,window.innerWidth-pw-12));
    var top=r.top-ph-12,below=false;if(top<70){top=r.bottom+12;below=true;}
    pop.classList.toggle("below",below);pop.style.left=(left+window.scrollX)+"px";pop.style.top=(top+window.scrollY)+"px";pop.style.setProperty("--ax",Math.max(10,Math.min(pw-22,(rtl?(left+pw-(r.left+r.width/2))-6:(r.left+r.width/2-left)-6)))+"px");}
  function hide(){if(!cur)return;pop.classList.remove("on");cur.setAttribute("aria-expanded","false");cur.removeAttribute("aria-describedby");cur=null;}
  [].forEach.call(els,function(el){
    var b=document.createElement("button");b.type="button";b.className="tip-b";b.textContent="i";b.setAttribute("aria-label",(rtl?"مزيد من التوضيح: ":"More about: ")+el.textContent.trim().slice(0,60));b.setAttribute("aria-expanded","false");b.setAttribute("data-text",el.getAttribute("data-tip"));
    el.appendChild(b);
    b.addEventListener("click",function(e){e.stopPropagation();(cur===b&&Date.now()-shownAt>400)?hide():show(b);});
    b.addEventListener("mouseenter",function(){if(window.matchMedia("(hover:hover)").matches)show(b);});
    b.addEventListener("mouseleave",function(){if(window.matchMedia("(hover:hover)").matches)hide();});
    b.addEventListener("focus",function(){show(b);});b.addEventListener("blur",hide);
  });
  document.addEventListener("click",hide);document.addEventListener("keydown",function(e){if(e.key==="Escape")hide();});window.addEventListener("scroll",function(){if(Math.abs(window.scrollY-shownY)>40)hide();},{passive:true});
})();

/* Face-aware photo layout: keep every face in frame and clear of cards and headline text. */
(function(){
  var FACES={"biz-automotive.jpg":{"a":1.5,"f":[[0.3485,0.1526,0.1071,0.2176],[0.1991,0.1233,0.1052,0.2224]]},"biz-boardroom.jpg":{"a":1.5,"f":[[0.7032,0.3313,0.1176,0.247],[0.498,0.1077,0.1433,0.2524],[0.2841,0.3452,0.1149,0.239]]},"biz-clinic.jpg":{"a":1.5,"f":[[0.1685,0.2649,0.105,0.2083],[0.626,0.1532,0.101,0.2406]]},"biz-ecommerce.jpg":{"a":1.7778,"f":[[0.7493,0.2127,0.1463,0.2981],[0.5004,0.1079,0.1081,0.2503],[0.2112,0.2164,0.1088,0.2252]]},"biz-factory.jpg":{"a":1.5,"f":[[0.5297,0.1071,0.1278,0.2541]]},"biz-fitness.jpg":{"a":1.5,"f":[[0.3537,0.3177,0.1054,0.2054],[0.6759,0.1402,0.1079,0.3148],[0.2065,0.3847,0.0282,0.0645],[0.6039,0.4377,0.0157,0.0318],[0.0374,0.4598,0.0302,0.075],[0.5193,0.3788,0.0269,0.0697]]},"biz-hero.jpg":{"a":1.7798,"f":[[0.4632,-0.0016,0.1665,0.4125],[0.2653,0.5033,0.0513,0.1254],[0.1077,0.4812,0.0649,0.176],[0.0123,0.4601,0.0395,0.106]]},"biz-hospitality.jpg":{"a":1.7778,"f":[[0.218,0.135,0.0666,0.1634],[0.4899,0.0921,0.0632,0.181],[0.5767,0.1743,0.0536,0.1519]]},"biz-learning.jpg":{"a":1.5009,"f":[[0.1934,0.3016,0.0714,0.1542],[0.6592,0.0748,0.0766,0.1658],[0.3409,0.3328,0.0581,0.122],[0.0685,0.3577,0.0766,0.1977]]},"biz-logistics.jpg":{"a":1.5009,"f":[[0.3119,0.109,0.1274,0.2821],[0.575,0.3736,0.0317,0.0723],[0.4943,0.3948,0.0219,0.0413],[0.8083,0.3935,0.052,0.1169]]},"biz-realestate.jpg":{"a":1.5009,"f":[[0.4731,0.3675,0.1062,0.1996],[0.2625,0.3121,0.1306,0.2178]]},"biz-retail.jpg":{"a":1.5009,"f":[[0.3213,0.0976,0.164,0.3461],[0.5445,0.1274,0.1568,0.3293]]},"biz-sales.jpg":{"a":1.5,"f":[[0.5733,0.1106,0.1007,0.2113],[0.7385,0.202,0.0958,0.1891],[0.2204,0.1323,0.0908,0.2229]]},"biz-security.jpg":{"a":1.5,"f":[[0.5487,0.1438,0.129,0.2571]]},"biz-support.jpg":{"a":1.5,"f":[[0.4591,0.0866,0.1947,0.3761],[0.0489,0.2822,0.0627,0.1146]]},"biz-team.jpg":{"a":1.7798,"f":[[0.4292,0.2174,0.0998,0.2685],[0.2586,0.2791,0.0851,0.2339],[0.6335,0.279,0.0844,0.2311],[0.1533,0.2726,0.0987,0.2723],[0.8003,0.2613,0.099,0.2761]]},"biz-transport.jpg":{"a":1.5009,"f":[[0.2828,0.0979,0.175,0.3695],[0.8493,0.476,0.0267,0.051],[0.716,0.4953,0.0234,0.0452],[0.6093,0.49,0.0248,0.0451]]},"biz-warehouse.jpg":{"a":1.5,"f":[[0.5612,0.1105,0.1111,0.2243],[0.2679,0.45,0.0365,0.0723]]},"finance.jpg":{"a":1.7798,"f":[[0.3999,0.1889,0.1152,0.2699],[0.6427,0.1631,0.1322,0.3237]]},"hero-people.jpg":{"a":1.7798,"f":[[0.5551,0.1721,0.0975,0.2263],[0.7817,0.0851,0.0879,0.2488],[0.7197,0.5109,0.0983,0.2294],[0.4335,0.4896,0.0209,0.0462],[0.2411,0.4719,0.0226,0.0521],[0.3129,0.462,0.0215,0.0489]]},"office.jpg":{"a":1.3333,"f":[[0.4042,0.0594,0.1618,0.2766]]},"travel.jpg":{"a":1.3382,"f":[[0.7684,0.2411,0.1031,0.1981],[0.2762,0.1506,0.1082,0.212]]}};
  function nameOf(img){var s=img.getAttribute("src")||"";return s.split("/").pop().split("?")[0];}
  function inter(a,b){var w=Math.min(a.r,b.r)-Math.max(a.l,b.l),h=Math.min(a.b,b.b)-Math.max(a.t,b.t);return w>0&&h>0?w*h:0;}
  function faceBoxes(img,fd,px,py,box){
    // box: displayed img box {l,t,w,h}; px,py object-position fractions; returns face rects in same coord space
    var a=fd.a,bw=box.w,bh=box.h,dw,dh;
    if(bw/bh>a){dw=bw;dh=bw/a;}else{dh=bh;dw=bh*a;}
    var ox=box.l+(bw-dw)*px,oy=box.t+(bh-dh)*py;
    return fd.f.map(function(f){var m=f[2]*0.06;var r={l:ox+(f[0]-m)*dw,t:oy+(f[1]-m)*dh,r:ox+(f[0]+f[2]+m)*dw,b:oy+(f[1]+f[3]+m)*dh};r.wt=f[2]>=0.035?1:0.5;r.area=(r.r-r.l)*(r.b-r.t);return r;});
  }
  function textRects(els,base){
    var out=[];els.forEach(function(el){
      if(!el||!el.getClientRects)return;var rg=document.createRange();
      var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;
      while((n=walker.nextNode())){if(!n.textContent.trim())continue;rg.selectNodeContents(n);[].forEach.call(rg.getClientRects(),function(q){if(q.width&&q.height)out.push({l:q.left-base.left-6,t:q.top-base.top-6,r:q.right-base.left+6,b:q.bottom-base.top+6});});}
      var btn=el.matches&&el.matches(".btn,a.btn")?[el]:[].slice.call(el.querySelectorAll?el.querySelectorAll(".btn"):[]);
      btn.forEach(function(bt){var q=bt.getBoundingClientRect();out.push({l:q.left-base.left,t:q.top-base.top,r:q.right-base.left,b:q.bottom-base.top});});
    });return out;
  }
  function cost(fr,box,protect){
    var c=0;fr.forEach(function(f){
      var fw=f.r-f.l,fh=f.b-f.t;
      var hv=Math.max(0,Math.min(f.r,box.l+box.w)-Math.max(f.l,box.l))/fw, vv=Math.max(0,Math.min(f.b,box.t+box.h)-Math.max(f.t,box.t))/fh;
      if(hv<=0.02){c+=f.wt*0.3;}            /* whole person framed out sideways: acceptable */
      else{c+=(1-hv)*10+(1-vv)*20;}         /* a head cut through, or cut off top/bottom: never, whoever it is */
      protect.forEach(function(p){c+=inter(f,p)/f.area*f.wt*10;});
    });return c;
  }
  function bestPosition(img,fd,box,protect){
    var best=null,cs=getComputedStyle(img),op=(cs.objectPosition||"50% 50%").split(" ");
    var dx=parseFloat(op[0])/100,dy=parseFloat(op[1])/100;if(isNaN(dx))dx=.5;if(isNaN(dy))dy=.5;
    if(img.dataset.fpx){dx=+img.dataset.fpx;dy=+img.dataset.fpy;}
    for(var i=0;i<=20;i++)for(var j=0;j<=20;j++){
      var px=i/20,py=j/20,c=cost(faceBoxes(img,fd,px,py,box),box,protect)+(Math.abs(px-dx)+Math.abs(py-dy))*0.02;
      if(!best||c<best.c)best={c:c,px:px,py:py};
    }
    return best;
  }
  function layoutCards(cont,img,fd){
    var cards=[].slice.call(cont.querySelectorAll(".sec-card"));
    cont.classList.remove("pb-cards-below");cards.forEach(function(c){c.style.left=c.style.top=c.style.right=c.style.bottom="";});
    var base=cont.getBoundingClientRect(),ir=img.getBoundingClientRect();
    var box={l:ir.left-base.left,t:ir.top-base.top,w:ir.width,h:ir.height};
    var pos=bestPosition(img,fd,box,[]);
    img.style.objectPosition=(pos.px*100)+"% "+(pos.py*100)+"%";
    var fr=faceBoxes(img,fd,pos.px,pos.py,box),placed=[],ok=true;
    var inset=Math.max(10,box.w*0.03);
    cards.forEach(function(c){
      var w=c.offsetWidth,h=c.offsetHeight,ol=c.offsetLeft,ot=c.offsetTop,best=null;
      var x0=box.l+inset,x1=box.l+box.w-w-inset,y0=box.t+inset,y1=box.t+box.h-h-inset;
      if(x1<x0)x1=x0;if(y1<y0)y1=y0;
      for(var i=0;i<=12;i++)for(var j=0;j<=12;j++){
        var x=x0+(x1-x0)*i/12,y=y0+(y1-y0)*j/12,r={l:x,t:y,r:x+w,b:y+h},k=0;
        fr.forEach(function(f){k+=inter(f,r)/f.area*f.wt*100;});
        placed.forEach(function(p){k+=inter(p,{l:r.l-8,t:r.t-8,r:r.r+8,b:r.b+8})/(w*h)*100;});
        var edge=Math.min(i,12-i)+Math.min(j,12-j);
        k+=(Math.abs(x-ol)+Math.abs(y-ot))/(box.w+box.h)*0.5+edge*0.01;
        if(!best||k<best.k)best={k:k,x:x,y:y,r:r};
      }
      if(best.k>=1){ok=false;}
      placed.push(best.r);c.style.left=best.x+"px";c.style.top=best.y+"px";c.style.right="auto";c.style.bottom="auto";
    });
    if(!ok){cards.forEach(function(c){c.style.left=c.style.top=c.style.right=c.style.bottom="";});cont.classList.add("pb-cards-below");}
  }
  function bandFit(band,img,fd){
    var base=band.getBoundingClientRect(),ir=img.getBoundingClientRect();
    var box={l:ir.left-base.left,t:ir.top-base.top,w:ir.width,h:ir.height};
    var protect=textRects([].slice.call(band.querySelectorAll(".inner > *, .cap, .over > *")),base);
    var pos=bestPosition(img,fd,box,protect),fr=faceBoxes(img,fd,pos.px,pos.py,box),touch=0,cut=0;
    fr.forEach(function(f){protect.forEach(function(p){touch+=inter(f,p);});var hv=Math.max(0,Math.min(f.r,box.l+box.w)-Math.max(f.l,box.l))/(f.r-f.l),vv=Math.max(0,Math.min(f.b,box.t+box.h)-Math.max(f.t,box.t))/(f.b-f.t);if(hv>0.02&&(hv<0.97||vv<0.97))cut++;});
    return {pos:pos,ok:touch===0&&cut===0};
  }
  function layoutBand(band,img,fd){
    band.classList.remove("pb-stack","pb-txt-end");band.style.removeProperty("--ph");img.style.objectPosition="";
    var phone=window.innerWidth<760;
    if(!phone){
      var a=bandFit(band,img,fd);
      if(a.ok){img.style.objectPosition=(a.pos.px*100)+"% "+(a.pos.py*100)+"%";return;}
      band.classList.add("pb-txt-end");img.style.objectPosition="";
      var b=bandFit(band,img,fd);
      if(b.ok){img.style.objectPosition=(b.pos.px*100)+"% "+(b.pos.py*100)+"%";return;}
      band.classList.remove("pb-txt-end");
    }
    /* phones, or no clear side on desktop: photo on top, text below */
    band.classList.add("pb-stack");
    var w=band.getBoundingClientRect().width,natH=w/fd.a,ph;
    if(!phone){ /* cinematic strip: as short as possible while every face stays whole */
      var t=1,bm=0;fd.f.forEach(function(f){t=Math.min(t,f[1]);bm=Math.max(bm,f[1]+f[3]);});
      ph=Math.round(Math.min(natH,Math.max(w/2.4,(bm-t)*natH*1.2)));
    } else ph=Math.round(Math.min(natH,w*0.8));
    band.style.setProperty("--ph",ph+"px");
    var ir=img.getBoundingClientRect(),base=band.getBoundingClientRect();
    var pos=bestPosition(img,fd,{l:ir.left-base.left,t:ir.top-base.top,w:ir.width,h:ir.height},[]);img.style.objectPosition=(pos.px*100)+"% "+(pos.py*100)+"%";
  }
  function run(){
    [].forEach.call(document.querySelectorAll("img"),function(img){
      var fd=FACES[nameOf(img)];if(!fd||!fd.f.length)return;
      var cont=img.closest(".hero-stage,.m-photo,.sec-photo");
      if(cont&&cont.querySelector(".sec-card")){layoutCards(cont,img,fd);return;}
      var band=img.closest(".pband,.ind-band .slides,.photo");
      if(band){layoutBand(band,img,fd);return;}
      if(getComputedStyle(img).objectFit==="cover"){
        var ir=img.getBoundingClientRect();img.style.objectPosition="";
        var pos=bestPosition(img,fd,{l:0,t:0,w:ir.width,h:ir.height},[]);img.style.objectPosition=(pos.px*100)+"% "+(pos.py*100)+"%";
      }
    });
  }
  window.__faceLayout=run;
  var t;function soon(){clearTimeout(t);t=setTimeout(run,80);}
  if(document.readyState!=="loading")run();else document.addEventListener("DOMContentLoaded",run);
  window.addEventListener("load",run);window.addEventListener("resize",soon);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run);
})();
