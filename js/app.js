
async function loadCatalog(){
  try{
    const res = await fetch('data/products.json');
    const data = await res.json();
    const grid = document.querySelector('#catalog');
    if(!grid) return;
    data.products.forEach(p=>{
      const card = document.createElement('a');
      card.className = 'card product';
      card.href = p.href;
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}"/>
        <div class="badge">${p.badge}</div>
        <h3 style="margin:8px 0">${p.title}</h3>
        <p class="small">${p.summary}</p>
        <div class="kpi"><div>Estado: ${p.status}</div><div>Precio: ${p.price}</div></div>
        <button class="btn" style="margin-top:10px">${p.cta}</button>
      `;
      grid.appendChild(card);
      // add 'Agregar al carrito' button
      const add = document.createElement('button');
      add.className='btn'; add.textContent='Agregar al carrito';
      add.setAttribute('data-addcart','1');
      add.setAttribute('data-id', p.id);
      add.setAttribute('data-title', p.title);
      add.setAttribute('data-badge', p.badge||'');
      // naive numeric extraction from price string (CLP)
      const price = (p.price||'').replace(/[^0-9]/g,'');
      add.setAttribute('data-price', price ? Number(price) : 0);
      add.setAttribute('data-paykey', p.id==='siamp'?'siamp_basic':(p.id==='vr'?'vr_licencia':(p.id==='hidroponia'?'hidro_kit':'')));
      card.appendChild(add);
      // wire on click
      add.addEventListener('click', ()=>{
        addToCart({
          id: add.getAttribute('data-id'),
          title: add.getAttribute('data-title'),
          badge: add.getAttribute('data-badge'),
          price: Number(add.getAttribute('data-price')||0),
          payKey: add.getAttribute('data-paykey')||'',
          qty: 1
        });
      });
    });
  }catch(e){ console.error(e); }
}
document.addEventListener('DOMContentLoaded', loadCatalog);

// Simple analytics (no external services)
(function(){
  const key='pp-views';
  const n=Number(localStorage.getItem(key)||0)+1;
  localStorage.setItem(key,n);
})();


async function wirePayments(){
  try{
    const res = await fetch('../data/payments.json').catch(()=>fetch('data/payments.json'));
    if(!res.ok) return;
    const cfg = await res.json();
    document.querySelectorAll('[data-pay]').forEach(btn=>{
      const key = btn.getAttribute('data-pay');
      const pref = btn.getAttribute('data-pay-pref') || 'flow';
      const url = (cfg[pref] && cfg[pref][key]) ? cfg[pref][key] : null;
      if(url){ btn.addEventListener('click', ()=> window.open(url, '_blank')); }
    });
  }catch(e){ console.warn('payments wiring error', e); }
}
document.addEventListener('DOMContentLoaded', wirePayments);


// ======== CART (localStorage) ========
const CART_KEY = 'pp-cart';

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(e){ return []; } }
function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); renderCartCount(); }
function addToCart(item){
  const cart = getCart();
  const idx = cart.findIndex(x=>x.id===item.id);
  if(idx>=0){ cart[idx].qty += item.qty||1; } else { cart.push({...item, qty:item.qty||1}); }
  saveCart(cart);
  alert('Añadido al carrito');
}
function removeFromCart(id){
  const cart = getCart().filter(x=>x.id!==id);
  saveCart(cart);
  renderCartList();
}
function clearCart(){ saveCart([]); renderCartList(); }

function renderCartCount(){
  const el = document.querySelector('#cartCount');
  if(!el) return;
  const n = getCart().reduce((a,b)=>a+(b.qty||1),0);
  el.textContent = n>0 ? String(n) : '0';
}

function renderCartList(){
  const list = document.querySelector('#cartList');
  const totalEl = document.querySelector('#cartTotal');
  if(!list || !totalEl) return;
  const items = getCart();
  list.innerHTML = '';
  let total = 0;
  items.forEach(it=>{
    const li = document.createElement('div');
    li.className='card';
    const price = Number(it.price||0);
    const line = price * (it.qty||1);
    total += line;
    li.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <div><strong>${it.title}</strong><div class="small">${it.badge||''}</div></div>
      <div>Cantidad: ${it.qty||1}</div>
      <div>Precio: ${price.toLocaleString('es-CL',{style:'currency',currency:'CLP'})}</div>
      <div>Total: ${line.toLocaleString('es-CL',{style:'currency',currency:'CLP'})}</div>
      <button class="btn" onclick="removeFromCart('${it.id}')">Quitar</button>
    </div>`;
    list.appendChild(li);
  });
  totalEl.textContent = total.toLocaleString('es-CL',{style:'currency',currency:'CLP'});

  // Wire checkout provider buttons
  const proceedFlow = document.querySelector('#proceedFlow');
  const proceedMP = document.querySelector('#proceedMP');
  [proceedFlow, proceedMP].forEach(btn=>{
    if(!btn) return;
    btn.onclick = async ()=>{
      const pref = btn.id==='proceedFlow' ? 'flow' : 'mercadopago';
      try{
        const res = await fetch('data/payments.json');
        const cfg = await res.json();
        // Strategy: open the first matching payment link; for combos, fallback to quote.
        const first = items[0];
        if(!first){ alert('Tu carrito está vacío'); return; }
        const url = cfg[pref][first.payKey||first.id] || null;
        if(url && !url.includes('REEMPLAZAR_')){
          window.open(url,'_blank');
        }else{
          window.location.href = `quote.html?p=${encodeURIComponent(first.title)}&cart=1`;
        }
      }catch(e){
        console.error(e);
        window.location.href = `quote.html?p=${encodeURIComponent(first.title)}&cart=1`;
      }
    };
  });
}

document.addEventListener('DOMContentLoaded', renderCartCount);
