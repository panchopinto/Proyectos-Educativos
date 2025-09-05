
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }
function addToCart(item){
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  alert('Agregado al carrito: '+item.name);
}
function removeFromCart(i){
  const cart = getCart();
  cart.splice(i,1);
  saveCart(cart);
  renderCart();
}
function clearCart(){ saveCart([]); renderCart(); }

function renderCart(){
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if(!container) return;
  if(cart.length===0){
    container.innerHTML = '<p class="small">El carrito está vacío.</p>';
    summary.innerHTML = '';
    return;
  }
  container.innerHTML = cart.map((item,i)=>`
    <div class="card" style="margin:8px 0;display:flex;justify-content:space-between;align-items:center">
      <div>
        <strong>${item.name}</strong><br>
        <span class="small">${item.desc||''}</span>
      </div>
      <button class="btn" onclick="removeFromCart(${i})">Quitar</button>
    </div>
  `).join('');
  summary.innerHTML = `<p>Total items: ${cart.length}</p>`;
}

document.addEventListener('DOMContentLoaded', renderCart);
