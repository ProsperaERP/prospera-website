/* Prospera pricing calculator: Prospera ERP vs Odoo Custom (+ Odoo.sh) vs Zoho One. Prices checked 20 Oct 2026. */
(function(){
  var D=document.getElementById('pv-data'); if(!D) return;
  var C=JSON.parse(D.textContent), T=C.t;
  var P={ m:{p1:3565,p2:893,p3:857,cap:1527,tm:99}, a:{p1:3040,p2:680,p3:680,cap:1256,tm:79} };
  var O={ fx:52.3, m:{lic:20.9,disc:4,wk:72,gb:0.25,st:18}, a:{lic:16.4,disc:3,wk:57.6,gb:0.2,st:14.4} };
  var Z={ m:{ae:1575,fl:3675}, a:{ae:1295,fl:3150} };
  var st={bill:'m',year:'y1',E:40,U:12,T:0};
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function fmt(n){return Math.round(n).toLocaleString('en-US')}
  function money(n){return T.cur.replace('{n}',fmt(n))}
  function pl(n,k){var f=T[k+(n===1?'1':'')]||T[k];return f}
  function prospera(E,U,Tm,b){var p=P[b];var u=Math.min(U,3)*p.p1+Math.max(0,Math.min(U,12)-3)*p.p2+Math.max(0,U-12)*p.p3;var capped=Math.min(u,E*p.cap);return {users:u,capped:capped,cap:capped<u,team:Tm*p.tm,total:capped+Tm*p.tm}}
  function odoo(U,b,y){var o=O[b];var wk=2+Math.max(0,Math.ceil((U-50)/25));var lic=U*(o.lic-(y==='y1'?o.disc:0));var host=wk*o.wk+Math.max(50,U)*o.gb+o.st;return {total:(lic+host)*O.fx,lic:lic*O.fx,host:host*O.fx,wk:wk}}
  function zoho(E,U,b){var z=Z[b];var ae=E*z.ae,fl=U*z.fl;return ae<=fl?{total:ae,plan:'ae'}:{total:fl,plan:'fl'}}

  /* billing switch (hero + calculator) */
  function setBill(b){st.bill=b;$$('[data-bill]').forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-bill')===b)});
    $$('[data-pm]').forEach(function(x){x.textContent=money(+x.getAttribute(b==='m'?'data-pm':'data-pa'))});
    $$('[data-bill-note]').forEach(function(x){x.textContent=x.getAttribute(b==='m'?'data-nm':'data-na')}); calc();}
  $$('[data-bill]').forEach(function(x){x.addEventListener('click',function(){setBill(x.getAttribute('data-bill'))})});
  $$('[data-year]').forEach(function(x){x.addEventListener('click',function(){st.year=x.getAttribute('data-year');$$('[data-year]').forEach(function(y){y.setAttribute('aria-pressed',y===x)});calc()})});

  /* inputs: number + range kept in sync, with sensible limits */
  var F={E:$('#pc-E'),U:$('#pc-U'),T:$('#pc-T')};
  function clamp(){var E=Math.max(1,Math.min(1000,parseInt(F.E.n.value,10)||1));var U=Math.max(1,Math.min(E,parseInt(F.U.n.value,10)||1));var Tm=Math.max(0,Math.min(E-U,parseInt(F.T.n.value,10)||0));st.E=E;st.U=U;st.T=Tm;
    F.U.r.max=Math.min(300,E);F.T.r.max=Math.max(0,Math.min(300,E-U));F.U.n.max=E;F.T.n.max=E-U;
    ['E','U','T'].forEach(function(k){var v=st[k];if(document.activeElement!==F[k].n)F[k].n.value=v;F[k].r.value=v})}
  ['E','U','T'].forEach(function(k){var w=F[k];if(!w)return;w.n=$('input[type=number]',w);w.r=$('input[type=range]',w);
    w.r.addEventListener('input',function(){w.n.value=w.r.value;clamp();calc()});
    w.n.addEventListener('input',function(){if(w.n.value==='')return;clamp();calc()});
    w.n.addEventListener('blur',function(){clamp();calc()});});
  $$('[data-preset]').forEach(function(x){x.addEventListener('click',function(){var v=x.getAttribute('data-preset').split(',');F.E.n.value=v[0];F.U.n.value=v[1];F.T.n.value=v[2]||0;clamp();calc()})});

  function setCard(k,mo,plan,tag,tagCls){var c=$('[data-card='+k+']');if(!c)return;$('.pc-amt',c).innerHTML=money(mo)+' <small>'+T.mo+'</small>';
    $('.pc-plan',c).textContent=plan;$('.pc-sub',c).textContent=money(mo*12)+' '+T.yr+' · '+money(mo/st.E)+' '+T.perEmp;
    var g=$('.pc-tag',c);if(g){g.textContent=tag||'';g.hidden=!tag;g.className='pc-tag'+(tagCls?' '+tagCls:'')}}
  function calc(){
    var b=st.bill,y=st.year,p=prospera(st.E,st.U,st.T,b),o=odoo(st.U,b,y),z=zoho(st.E,st.U,b);
    var pv=p.total, ov=o.total, zv=z.total;
    function cmp(v){var d=(v-pv)*12;return d>=0?[T.saves.replace('{n}',money(d)),'']:[T.costsLess.replace('{n}',money(-d)),'pc-more']}
    setCard('p',pv,pl(st.U,'pPlan').replace('{u}',st.U)+(st.T?T.pPlanT.replace('{t}',st.T):'')+(p.cap?T.pCap:''),'', '');
    var co=cmp(ov),cz=cmp(zv);
    setCard('o',ov,pl(st.U,y==='y1'?'oPlan1':'oPlan2').replace('{u}',st.U).replace('{w}',o.wk),co[0],co[1]);
    setCard('z',zv,(z.plan==='ae'?T.zAE.replace('{e}',st.E):pl(st.U,'zFL').replace('{u}',st.U)),cz[0],cz[1]);
    var mx=Math.max(pv,ov,zv);[['p',pv],['o',ov],['z',zv]].forEach(function(a){var r=$('[data-bar='+a[0]+']');if(!r)return;$('.pc-fill',r).style.width=(a[1]/mx*100).toFixed(1)+'%';$('b',r).textContent=money(a[1])});
    var sv=$('#pc-save');if(sv){var so=(ov-pv)*12,sz=(zv-pv)*12;
      if(so>0&&sz>0){$('b',sv).textContent=T.saveBoth.replace('{o}',money(so)).replace('{z}',money(sz));}
      else {$('b',sv).textContent=T.saveMixed.replace('{o}',(so>=0?T.less:T.more).replace('{n}',money(Math.abs(so)))).replace('{z}',(sz>=0?T.less:T.more).replace('{n}',money(Math.abs(sz))));}
      $('span',sv).textContent=(b==='m'?T.billM:T.billA)+' · '+(y==='y1'?T.yr1:T.yr2);}
    var bk=$('#pc-bk');if(bk){var pp=P[b],L=[];var u1=Math.min(st.U,3),u2=Math.max(0,Math.min(st.U,12)-3),u3=Math.max(0,st.U-12);
      L.push(T.bk1.replace('{n}',u1).replace('{p}',money(pp.p1)));if(u2)L.push(T.bk2.replace('{n}',u2).replace('{p}',money(pp.p2)));if(u3)L.push(T.bk3.replace('{n}',u3).replace('{p}',money(pp.p3)));
      if(p.cap)L.push(T.bkCap.replace('{e}',st.E).replace('{p}',money(pp.cap)).replace('{t}',money(p.capped)));
      if(st.T)L.push(T.bkT.replace('{n}',st.T).replace('{p}',money(pp.tm)));L.push(T.bkFree.replace('{n}',Math.max(0,st.E-st.U-st.T)));
      $('ul',bk).innerHTML=L.map(function(s){return '<li>'+s+'</li>'}).join('')}
    var tr=$('#pc-total');if(tr){var c=$$('td',tr);c[0].textContent=money(pv);c[1].textContent=money(ov);c[2].textContent=money(zv)}
  }

  /* feature table */
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
