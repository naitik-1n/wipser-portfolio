(() => {
  const canvas = document.getElementById('defenseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const healthEl = document.getElementById('coreHealth');
  const scoreEl = document.getElementById('threatScore');
  const message = document.getElementById('gameMessage');
  const start = document.getElementById('gameStart');
  let w, h, dpr, angle = -Math.PI / 2, health = 100, score = 0, running = false, last = 0, spawn = 0;
  let threats = [], shots = [], bursts = [];
  const keys = new Set();
  const resize = () => { const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
  new ResizeObserver(resize).observe(canvas); resize();
  const center = () => ({x:w/2,y:h/2});
  function begin(){ health=100; score=0; angle=-Math.PI/2; threats=[]; shots=[]; bursts=[]; spawn=0; running=true; last=performance.now(); start.textContent='Restart'; message.textContent='The cycle is under attack. Hold Space to fire.'; updateHud(); requestAnimationFrame(loop); }
  function updateHud(){healthEl.textContent=health+'%';scoreEl.textContent=String(score).padStart(2,'0');}
  function spawnThreat(){const c=center(), a=Math.random()*Math.PI*2, r=Math.max(w,h)*.58; threats.push({x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,angle:Math.atan2(c.y-(c.y+Math.sin(a)*r),c.x-(c.x+Math.cos(a)*r)),hp:1,phase:Math.random()*6, speed:24+Math.min(score,25)*1.2});}
  function fire(){const c=center(); shots.push({x:c.x+Math.cos(angle)*50,y:c.y+Math.sin(angle)*50,a:angle,life:.8}); bursts.push({x:c.x+Math.cos(angle)*48,y:c.y+Math.sin(angle)*48,t:.16});}
  function loop(now){if(!running)return;const dt=Math.min((now-last)/1000,.04);last=now; angle+=(keys.has('ArrowRight')?1:0)*dt*2.5-(keys.has('ArrowLeft')?1:0)*dt*2.5; if(keys.has(' ')&&now-(loop.lastShot||0)>170){fire();loop.lastShot=now;} spawn-=dt;if(spawn<=0){spawnThreat();spawn=Math.max(.48,1.35-score*.018)+Math.random()*.55;}
    const c=center(), radius=Math.min(w,h)*.28; ctx.clearRect(0,0,w,h);
    // radial atmosphere
    const glow=ctx.createRadialGradient(c.x,c.y,12,c.x,c.y,radius*2.3);glow.addColorStop(0,'rgba(242,84,27,.16)');glow.addColorStop(1,'rgba(242,84,27,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    // wheel and 24 spokes
    ctx.save();ctx.translate(c.x,c.y);ctx.rotate(angle);ctx.strokeStyle='rgba(242,84,27,.62)';ctx.lineWidth=2;[radius*.22,radius*.48,radius*.82,radius].forEach(r=>{ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();});
    for(let i=0;i<24;i++){let a=i*Math.PI/12;ctx.strokeStyle=i===0?'#ffcc00':'rgba(242,84,27,.42)';ctx.lineWidth=i===0?4:1.4;ctx.beginPath();ctx.moveTo(Math.cos(a)*radius*.18,Math.sin(a)*radius*.18);ctx.lineTo(Math.cos(a)*radius*.92,Math.sin(a)*radius*.92);ctx.stroke();}
    ctx.fillStyle='#f2541b';ctx.beginPath();ctx.arc(0,0,radius*.13,0,Math.PI*2);ctx.fill();ctx.restore();
    // threats form at edge, then converge
    threats.forEach(t=>{const dx=c.x-t.x,dy=c.y-t.y,d=Math.hypot(dx,dy);t.x+=dx/d*t.speed*dt;t.y+=dy/d*t.speed*dt;t.phase+=dt;ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.phase);ctx.shadowBlur=16;ctx.shadowColor='#a41408';ctx.strokeStyle='#c62d18';ctx.fillStyle='rgba(125,22,16,.5)';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<8;i++){let a=i*Math.PI/4,r=i%2?9:16;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();if(d<radius*.22){t.dead=true;health=Math.max(0,health-20);bursts.push({x:c.x,y:c.y,t:.7,red:true});updateHud();}});
    shots.forEach(s=>{s.x+=Math.cos(s.a)*680*dt;s.y+=Math.sin(s.a)*680*dt;s.life-=dt;ctx.fillStyle='#ffcc00';ctx.shadowBlur=12;ctx.shadowColor='#ff7b00';ctx.beginPath();ctx.arc(s.x,s.y,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;for(const t of threats){if(!t.dead&&Math.hypot(s.x-t.x,s.y-t.y)<19){t.dead=true;s.life=0;score++;bursts.push({x:t.x,y:t.y,t:.45});updateHud();break;}}});
    threats=threats.filter(t=>!t.dead);shots=shots.filter(s=>s.life>0&&s.x>-20&&s.x<w+20&&s.y>-20&&s.y<h+20);
    bursts.forEach(b=>{b.t-=dt;const p=1-b.t/(b.red?.7:.45);ctx.strokeStyle=b.red?`rgba(242,40,15,${1-p})`:`rgba(255,170,30,${1-p})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,p*(b.red?90:45),0,Math.PI*2);ctx.stroke();});bursts=bursts.filter(b=>b.t>0);
    if(health<=0){running=false;message.textContent='The core has fallen. Restart and defend the cycle.';start.textContent='Play again';return;} requestAnimationFrame(loop);
  }
  document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key)){e.preventDefault();keys.add(e.key);}});document.addEventListener('keyup',e=>keys.delete(e.key));start.addEventListener('click',begin);
  let pointerX=null;canvas.addEventListener('pointerdown',e=>{pointerX=e.clientX;canvas.setPointerCapture(e.pointerId);fire();});canvas.addEventListener('pointermove',e=>{if(pointerX!==null){angle+=(e.clientX-pointerX)*.012;pointerX=e.clientX;}});canvas.addEventListener('pointerup',()=>pointerX=null);canvas.addEventListener('pointercancel',()=>pointerX=null);
  // Draw the wheel before starting.
  const c=center(), radius=Math.min(w,h)*.28;ctx.translate(c.x,c.y);ctx.strokeStyle='rgba(242,84,27,.55)';[.22,.48,.82,1].forEach(k=>{ctx.beginPath();ctx.arc(0,0,radius*k,0,Math.PI*2);ctx.stroke();});for(let i=0;i<24;i++){let a=i*Math.PI/12;ctx.strokeStyle=i===0?'#ffcc00':'rgba(242,84,27,.4)';ctx.beginPath();ctx.moveTo(Math.cos(a)*radius*.18,Math.sin(a)*radius*.18);ctx.lineTo(Math.cos(a)*radius*.92,Math.sin(a)*radius*.92);ctx.stroke();}ctx.setTransform(dpr,0,0,dpr,0,0);
})();
