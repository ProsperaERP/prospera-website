/* Prospera pricing calculator v7: Prospera ERP vs Odoo Custom vs Zoho One. Competitor prices: Egypt, checked 20 Oct 2026. */
(function(){
  var D=document.getElementById('pv-data'); if(!D) return;
  var C=JSON.parse(D.textContent), T=C.t;
  /* Prospera v7: users 1-2 at p1, every user after at p2; never more than cap x employees; team members on top */
  var P={ m:{p1:3457,n:2,p2:857,cap:1527,tm:99}, a:{p1:2760,n:2,p2:680,cap:1256,tm:79} };
  /* Odoo Custom plan, Egypt (USD). Odoo.sh: 1 worker + 1 per 25 back-end users; 50 GB for every 12.5 users; staging copies */
  var O={ m:{lic:20.9,disc:4,wk:72,gb:0.25,st:18}, a:{lic:16.4,disc:3,wk:57.6,gb:0.2,st:14.4} };
  /* Zoho One Standard, Egypt (EGP) */
  var Z={ m:{ae:1575,fl:3675}, a:{ae:1295,fl:3150}, sup:{classic:0,premium:0.20,enterprise:0.25} };
  var st={bill:'m',year:'y1',E:40,U:12,T:0,fx:52.3,host:'sh',wk:null,gb:null,stg:1,zplan:'best',zsup:'classic'};
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function fmt(n){return Math.round(n).toLocaleString('en-US')}
  function usd(n){return T.usd.replace('{n}',(Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}))}
  function money(n){return T.cur.replace('{n}',fmt(n))}
  function pl(n,k){return T[k+(n===1?'1':'')]||T[k]}
  function autoWk(U){return 1+Math.floor((U-1)/25)}
  function autoGb(U){return 50*Math.ceil(U/12.5)}
  function prospera(E,U,Tm,b){var p=P[b];var u=Math.min(U,p.n)*p.p1+Math.max(0,U-p.n)*p.p2;var capped=Math.min(u,E*p.cap);return {users:u,capped:capped,cap:capped<u,team:Tm*p.tm,total:capped+Tm*p.tm}}
  function odoo(U,b,y){var o=O[b];var wk=st.wk==null?autoWk(U):st.wk,gb=st.gb==null?autoGb(U):st.gb,sg=st.stg;
    var list=U*o.lic,disc=y==='y1'?U*o.disc:0,hw=0,hg=0,hs=0;
    if(st.host==='sh'){hw=wk*o.wk;hg=gb*o.gb;hs=sg*o.st}
    var tot=list-disc+hw+hg+hs;return {total:tot*st.fx,usd:tot,list:list,disc:disc,hw:hw,hg:hg,hs:hs,wk:wk,gb:gb,sg:sg}}
  function zoho(E,U,b){var z=Z[b];var ae=E*z.ae,fl=U*z.fl,plan=st.zplan==='best'?(ae<=fl?'ae':'fl'):st.zplan;var base=plan==='ae'?ae:fl;var sup=base*Z.sup[st.zsup];return {total:base+sup,base:base,sup:sup,plan:plan}}

  function setBill(b){st.bill=b;$$('[data-bill]').forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-bill')===b)});
    $$('[data-pm]').forEach(function(x){x.textContent=money(+x.getAttribute(b==='m'?'data-pm':'data-pa'))});calc();}
  $$('[data-bill]').forEach(function(x){x.addEventListener('click',function(){setBill(x.getAttribute('data-bill'))})});
  $$('[data-year]').forEach(function(x){x.addEventListener('click',function(){st.year=x.getAttribute('data-year');$$('[data-year]').forEach(function(y){y.setAttribute('aria-pressed',y===x)});calc()})});

  var F={E:$('#pc-E'),U:$('#pc-U'),T:$('#pc-T')};
  function clamp(){var E=Math.max(1,Math.min(1000,parseInt(F.E.n.value,10)||1));var U=Math.max(1,Math.min(E,parseInt(F.U.n.value,10)||1));var Tm=Math.max(0,Math.min(E-U,parseInt(F.T.n.value,10)||0));st.E=E;st.U=U;st.T=Tm;
    F.U.r.max=Math.min(300,E);F.T.r.max=Math.max(0,Math.min(300,E-U));F.U.n.max=E;F.T.n.max=E-U;
    ['E','U','T'].forEach(function(k){var v=st[k];if(document.activeElement!==F[k].n)F[k].n.value=v;F[k].r.value=v})}
  ['E','U','T'].forEach(function(k){var w=F[k];if(!w)return;w.n=$('input[type=number]',w);w.r=$('input[type=range]',w);
    w.r.addEventListener('input',function(){w.n.value=w.r.value;clamp();calc()});
    w.n.addEventListener('input',function(){if(w.n.value==='')return;clamp();calc()});
    w.n.addEventListener('blur',function(){clamp();calc()});});
  $$('[data-preset]').forEach(function(x){x.addEventListener('click',function(){var v=x.getAttribute('data-preset').split(',');F.E.n.value=v[0];F.U.n.value=v[1];F.T.n.value=v[2]||0;clamp();calc()})});

  /* quote settings */
  var S={host:$('#pc-host'),wk:$('#pc-wk'),gb:$('#pc-gb'),stg:$('#pc-stg'),fx:$('#pc-fx'),zplan:$('#pc-zplan'),zsup:$('#pc-zsup')};
  function num(el,min,def){var v=parseFloat(el.value);return isNaN(v)?def:Math.max(min,v)}
  if(S.host){S.host.addEventListener('change',function(){st.host=S.host.value;calc()});
    S.wk.addEventListener('input',function(){st.wk=S.wk.value===''?null:Math.round(num(S.wk,1,1));calc()});
    S.gb.addEventListener('input',function(){st.gb=S.gb.value===''?null:Math.round(num(S.gb,1,50));calc()});
    S.stg.addEventListener('input',function(){st.stg=Math.round(num(S.stg,0,1));calc()});
    S.fx.addEventListener('input',function(){st.fx=num(S.fx,1,52.3);calc()});
    S.zplan.addEventListener('change',function(){st.zplan=S.zplan.value;calc()});
    S.zsup.addEventListener('change',function(){st.zsup=S.zsup.value;calc()});
    var rs=$('#pc-reset');if(rs)rs.addEventListener('click',function(){st.wk=null;st.gb=null;st.stg=1;st.host='sh';st.fx=52.3;st.zplan='best';st.zsup='classic';S.host.value='sh';S.stg.value=1;S.fx.value=52.3;S.zplan.value='best';S.zsup.value='classic';S.wk.value='';S.gb.value='';calc()});}

  function setCard(k,mo,plan,tag,tagCls){var c=$('[data-card='+k+']');if(!c)return;$('.pc-amt',c).innerHTML=money(mo)+' <small>'+T.mo+'</small>';
    $('.pc-plan',c).textContent=plan;$('.pc-sub',c).textContent=money(mo*12)+' '+T.yr+' · '+money(mo/st.E)+' '+T.perEmp;
    var g=$('.pc-tag',c);if(g){g.textContent=tag||'';g.hidden=!tag;g.className='pc-tag'+(tagCls?' '+tagCls:'')}}
  function li(a,b,cls){return '<li'+(cls?' class="'+cls+'"':'')+'><span>'+a+'</span><b>'+b+'</b></li>'}
  function calc(){
    var b=st.bill,y=st.year,p=prospera(st.E,st.U,st.T,b),o=odoo(st.U,b,y),z=zoho(st.E,st.U,b);
    var pv=p.total, ov=o.total, zv=z.total;
    if(S.wk){S.wk.placeholder=autoWk(st.U);S.gb.placeholder=autoGb(st.U);var dis=st.host!=='sh';[S.wk,S.gb,S.stg].forEach(function(e){e.disabled=dis})}
    function cmp(v){var d=(v-pv)*12;return d>=0?[T.saves.replace('{n}',money(d)),'']:[T.costsLess.replace('{n}',money(-d)),'pc-more']}
    setCard('p',pv,pl(st.U,'pPlan').replace('{u}',st.U)+(st.T?T.pPlanT.replace('{t}',st.T):'')+(p.cap?T.pCap:''),'','');
    var co=cmp(ov),cz=cmp(zv);
    var oh=st.host==='sh'?T.oHostSh.replace('{w}',o.wk).replace('{g}',o.gb):T.oHostOn;
    setCard('o',ov,pl(st.U,y==='y1'?'oPlan1':'oPlan2').replace('{u}',st.U)+', '+oh,co[0],co[1]);
    setCard('z',zv,(z.plan==='ae'?T.zAE.replace('{e}',st.E):pl(st.U,'zFL').replace('{u}',st.U))+(z.sup?T.zSup:''),cz[0],cz[1]);
    var mx=Math.max(pv,ov,zv);[['p',pv],['o',ov],['z',zv]].forEach(function(a){var r=$('[data-bar='+a[0]+']');if(!r)return;$('.pc-fill',r).style.width=(a[1]/mx*100).toFixed(1)+'%';$('b',r).textContent=money(a[1])});
    var sv=$('#pc-save');if(sv){var so=(ov-pv)*12,sz=(zv-pv)*12;
      if(so>0&&sz>0){$('b',sv).textContent=T.saveBoth.replace('{o}',money(so)).replace('{z}',money(sz));}
      else {$('b',sv).textContent=T.saveMixed.replace('{o}',(so>=0?T.less:T.more).replace('{n}',money(Math.abs(so)))).replace('{z}',(sz>=0?T.less:T.more).replace('{n}',money(Math.abs(sz))));}
      $('span',sv).textContent=(b==='m'?T.billM:T.billA)+' · '+(y==='y1'?T.yr1:T.yr2);}
    /* three quotes, line by line */
    var q=$('#pc-q-p');if(q){var pp=P[b],L='';var u1=Math.min(st.U,pp.n),u2=Math.max(0,st.U-pp.n);
      L+=li(T.bk1.replace('{n}',u1).replace('{p}',money(pp.p1)),money(u1*pp.p1));if(u2)L+=li(T.bk2.replace('{n}',u2).replace('{p}',money(pp.p2)),money(u2*pp.p2));
      if(p.cap)L+=li(T.bkCap.replace('{e}',st.E).replace('{p}',money(pp.cap)),'−'+money(p.users-p.capped));
      if(st.T)L+=li(T.bkT.replace('{n}',st.T).replace('{p}',money(pp.tm)),money(p.team));
      L+=li(T.bkFree.replace('{n}',Math.max(0,st.E-st.U-st.T)),T.free);L+=li(T.total,money(pv),'pc-qt');q.innerHTML=L}
    q=$('#pc-q-o');if(q){var oo=O[b],L2='';L2+=li(T.oqUsers.replace('{n}',st.U).replace('{p}',usd(oo.lic)),usd(o.list));
      if(o.disc)L2+=li(T.oqDisc.replace('{p}',usd(oo.disc)),'−'+usd(o.disc));
      if(st.host==='sh'){L2+=li(T.oqWk.replace('{n}',o.wk).replace('{p}',usd(oo.wk)),usd(o.hw));L2+=li(T.oqGb.replace('{n}',o.gb).replace('{p}',usd(oo.gb)),usd(o.hg));if(o.sg)L2+=li(T.oqSt.replace('{n}',o.sg).replace('{p}',usd(oo.st)),usd(o.hs));}
      else L2+=li(T.oqOnline,usd(0));
      L2+=li(T.oqTotal,usd(o.usd));L2+=li(T.oqEgp.replace('{fx}',st.fx),money(ov),'pc-qt');q.innerHTML=L2}
    q=$('#pc-q-z');if(q){var zz=Z[b],L3='';L3+=li(T.zqAE.replace('{n}',st.E).replace('{p}',money(zz.ae)),money(st.E*zz.ae),z.plan==='ae'?'pc-on':'pc-off');
      L3+=li(T.zqFL.replace('{n}',st.U).replace('{p}',money(zz.fl)),money(st.U*zz.fl),z.plan==='fl'?'pc-on':'pc-off');
      if(z.sup)L3+=li(T.zqSup.replace('{p}',Math.round(Z.sup[st.zsup]*100)),money(z.sup));L3+=li(T.total,money(zv),'pc-qt');q.innerHTML=L3}
    var tr=$('#pc-total');if(tr){var c=$$('td',tr);c[0].textContent=money(pv);c[1].textContent=money(ov);c[2].textContent=money(zv)}
  }

  var tbl=$('#pc-tbl');
  function cell(v){var k=v[0],lab=v[1],sm=v[2];var ic=k==='y'?'<span class="cv y" role="img" aria-label="'+T.inc+'"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.3l2.8 2.8 6.2-6.4"/></svg></span>':k==='n'?'<span class="cv n" role="img" aria-label="'+T.notInc+'"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 8h7"/></svg></span>':'<span class="cv '+k+'">'+lab+'</span>';return ic+(sm?'<small>'+sm+'</small>':'')}
  if(tbl){var h='<thead><tr><th scope="col">'+T.feat+'</th><th scope="col" class="pc-us">'+T.pName+'</th><th scope="col">'+T.oName+'</th><th scope="col">'+T.zName+'</th></tr></thead><tbody>';
    h+='<tr class="pc-total" id="pc-total"><th scope="row">'+T.totalRow+'</th><td></td><td></td><td></td></tr>';
    C.m.forEach(function(r){if(r.g){h+='<tr class="pc-g"><th colspan="4" scope="colgroup">'+r.g+'</th></tr>';return}
      var same=(r.p.join()===r.z.join()&&r.p.join()===r.o.join());h+='<tr'+(same?' class="pc-same"':'')+'><th scope="row">'+r.f+'</th><td class="pc-us">'+cell(r.p)+'</td><td>'+cell(r.o)+'</td><td>'+cell(r.z)+'</td></tr>'});
    tbl.innerHTML=h+'</tbody>';}
  var fb=$('#pc-show'),fw=$('#pc-feat-body');
  if(fb&&fw){fb.addEventListener('click',function(){var open=fw.hidden;fw.hidden=!open;fb.setAttribute('aria-expanded',open);fb.textContent=open?T.hideFeat:T.showFeat;if(open)fw.scrollIntoView({behavior:'smooth',block:'start'})})}
  $$('[data-fv]').forEach(function(x){x.addEventListener('click',function(){var d=x.getAttribute('data-fv')==='d';tbl.classList.toggle('pc-diff',d);$$('[data-fv]').forEach(function(y){y.setAttribute('aria-pressed',y===x)})})});
  if(location.hash==='#features'&&fw){fw.hidden=false;if(fb){fb.setAttribute('aria-expanded','true');fb.textContent=T.hideFeat}}
  clamp();setBill('m');
})();
