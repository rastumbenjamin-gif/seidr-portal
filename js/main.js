(function(){
  function safe(fn){ try{ fn&&fn(); } catch(e){ console.warn('[SEIDR:init]', e); showToast('Some features are loading…'); } }

  function showToast(message){
    let host = document.getElementById('toast-host');
    if(!host){
      host = document.createElement('div');
      host.id = 'toast-host';
      host.style.cssText = 'position:fixed;right:14px;bottom:14px;display:grid;gap:8px;z-index:9999';
      document.body.appendChild(host);
    }
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(14,24,32,.96);border:1px solid #20303b;color:#e9eef2;padding:10px 12px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.35);font:13px/1.4 system-ui, -apple-system, Segoe UI, Inter, Roboto, Arial';
    card.textContent = message;
    host.appendChild(card);
    setTimeout(()=>{ card.style.transition='opacity .3s'; card.style.opacity='0'; setTimeout(()=>card.remove(),350); }, 2200);
  }

  function enhanceNavLinks(){
    document.querySelectorAll('a[href="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{ e.preventDefault(); showToast('Coming soon'); });
    });
  }

  function guardButtons(){
    document.querySelectorAll('button').forEach(btn=>{
      const hasHandler = btn.getAttribute('onclick') || btn._hasHandler;
      if(!hasHandler){
        btn.addEventListener('click', ()=> showToast('This action is not available yet'));
        btn._hasHandler = true;
      }
    });
  }

  function animateOnView(){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const n = entry.target;
          n.style.transition = 'transform .35s cubic-bezier(.2,.6,.2,1), opacity .35s';
          n.style.transform = 'translateY(0)';
          n.style.opacity = '1';
          io.unobserve(n);
        }
      });
    }, {threshold: .1});

    document.querySelectorAll('.card, svg.chart, .k, .q').forEach(n=>{
      n.style.transform = 'translateY(6px)';
      n.style.opacity = '0';
      io.observe(n);
    });
  }

  function wireTables(){
    if(typeof makeTableInteractive === 'function'){
      document.querySelectorAll('table').forEach((tbl, idx)=>{
        if(!tbl.id) tbl.id = 'tbl-auto-' + idx;
        safe(()=> makeTableInteractive('#' + tbl.id));
      });
    }
  }

  function globalErrorGuards(){
    window.addEventListener('error', (e)=>{
      console.error('Unhandled error', e.error||e.message);
      showToast('An error occurred. We logged it.');
    });
    window.addEventListener('unhandledrejection', (e)=>{
      console.error('Unhandled promise', e.reason);
      showToast('Something went wrong. Please retry.');
    });
  }

  function wireHeroChips(){
    document.addEventListener('click', function(e){
      const chip = e.target.closest('.hero-chip[data-page]');
      if(!chip) return;
      const page = chip.getAttribute('data-page');
      if(page && typeof window.spaLoad === 'function'){
        e.preventDefault();
        const layout = document.getElementById('heroSection');
        if(layout) layout.classList.add('active');
        window.spaLoad(page);
      }
    });
  }

  function typeHtml(el, html){
    // Types out text while preserving tags: splits by tags and types only text chunks
    const parts = html.split(/(<[^>]+>)/g).filter(Boolean);
    el.innerHTML = '';
    let i = 0, j = 0; // i for parts, j for char within text part
    const speed = 18;
    function tick(){
      if(i >= parts.length) return;
      const part = parts[i];
      if(part.startsWith('<')){
        el.insertAdjacentHTML('beforeend', part);
        i++; j = 0; tick();
      } else {
        const nextChar = part.charAt(j++);
        el.insertAdjacentText('beforeend', nextChar);
        if(j >= part.length){ i++; j = 0; }
        setTimeout(tick, speed);
      }
    }
    setTimeout(tick, 200);
  }

  function runTypewriter(){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-typewriter]').forEach(el=>{
      if(el._typed) return; el._typed = true;
      const mode = el.getAttribute('data-typewriter');
      if(reduce){ return; }
      if(mode === 'html'){
        const html = el.innerHTML;
        el.style.opacity = '0'; requestAnimationFrame(()=>{ el.style.transition = 'opacity .8s ease'; el.style.opacity = '1'; });
        return;
      }
      const hasTags = el.innerHTML.trim() !== el.textContent.trim();
      if(hasTags){
        el.style.opacity = '0';
        requestAnimationFrame(()=>{ el.style.transition = 'opacity .6s ease'; el.style.opacity = '1'; });
        return;
      }
      const full = el.textContent; el.textContent='';
      const speed = 18; let i = 0; const tick = ()=>{ if(i<=full.length){ el.textContent = full.slice(0,i); i++; setTimeout(tick, speed); } };
      setTimeout(tick, 200);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    safe(()=> typeof insertNavigation === 'function' && insertNavigation());
    safe(()=> typeof initializeInteractivity === 'function' && initializeInteractivity());
    wireTables();
    enhanceNavLinks();
    guardButtons();
    animateOnView();
    globalErrorGuards();
    wireHeroChips();
    runTypewriter();
  });
})();
