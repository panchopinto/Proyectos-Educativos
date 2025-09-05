
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
