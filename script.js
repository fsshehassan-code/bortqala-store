let products = [];
const fallbackProducts = [
  {id:"1",name:"آيفون 15",price:38250,compareAt:45000,discount:"-15%",icon:"📱",rating:"4.9"},
  {id:"2",name:"حذاء رياضي",price:1170,compareAt:1800,discount:"-35%",icon:"👟",rating:"4.8"},
  {id:"3",name:"ساعة ذكية",price:1999,compareAt:2500,discount:"-20%",icon:"⌚",rating:"4.6"},
  {id:"4",name:"مقلاة هوائية",price:2625,compareAt:3500,discount:"-25%",icon:"🍳",rating:"4.5"},
  {id:"5",name:"سماعات بلوتوث لاسلكية",price:1399,compareAt:2000,discount:"-30%",icon:"🎧",rating:"4.7"}
];
const API = '/api';
let authToken = localStorage.getItem('orangeToken') || '';
function apiHeaders(){ return {'Content-Type':'application/json', ...(authToken?{Authorization:`Bearer ${authToken}`}:{})}; }
async function loadProducts(){
  try { const r=await fetch(`${API}/products`); if(!r.ok) throw new Error(); products=await r.json(); }
  catch { products=fallbackProducts; }
  renderProducts(); renderCart();
}

let cart = JSON.parse(localStorage.getItem("orangeCart") || "[]");
const productBox = document.getElementById("products");
const searchInput = document.getElementById("searchInput");

function money(value){ return value.toLocaleString("ar-EG"); }
function saveCart(){ localStorage.setItem("orangeCart", JSON.stringify(cart)); }
function findProduct(id){ return products.find(p => p.id === id); }

function discountLabel(p){ if(!p.compareAt || Number(p.compareAt)<=Number(p.price)) return ''; return `-${Math.round((1-Number(p.price)/Number(p.compareAt))*100)}%`; }
function renderProducts(list = products){
  productBox.innerHTML = list.length ? list.map(p => `
    <article class="product">
      ${discountLabel(p) ? `<span class="discount">${discountLabel(p)}</span>` : ""}
      <div class="productImage" aria-label="${p.name}">${p.icon || "🛍️"}</div>
      <h3>${p.name}</h3>
      <div class="rating">${Number(p.rating || 5).toFixed(1)} ★★★★★</div>
      <div class="productFooter">
        <div><span class="price">${money(p.price)} ج.م</span><span class="old">${money(p.compareAt)} ج.م</span></div>
        <button class="add" aria-label="إضافة ${p.name} إلى السلة" onclick='addToCart(${JSON.stringify(p.id)})'>🛒</button>
      </div>
    </article>`).join("") : '<div class="emptySearch">لا توجد منتجات مطابقة لبحثك.</div>';
}

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty += 1;
  else cart.push({id, qty:1});
  saveCart(); renderCart(); openCart();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
}

function removeFromCart(id){
  cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
}

function renderCart(){
  const box = document.getElementById("cartItems");
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;

  if(!cart.length){
    box.innerHTML = '<div class="cartEmpty"><div>🛒</div><p>السلة فارغة.</p><small>أضف منتجاتك المفضلة للبدء.</small></div>';
  } else {
    box.innerHTML = cart.map(item => {
      const p = findProduct(item.id);
      return `<div class="cartItem">
        <div class="cartInfo"><span class="cartIcon">${p.icon || "🛍️"}</span><div><b>${p.name}</b><small>${money(p.price)} ج.م</small></div></div>
        <div class="qty"><button onclick='changeQty(${JSON.stringify(p.id)},-1)' aria-label="تقليل الكمية">−</button><b>${item.qty}</b><button onclick='changeQty(${JSON.stringify(p.id)},1)' aria-label="زيادة الكمية">+</button></div>
        <button class="remove" onclick='removeFromCart(${JSON.stringify(p.id)})' aria-label="حذف ${p.name}">×</button>
      </div>`;
    }).join("");
  }

  const total = cart.reduce((sum,item) => sum + (findProduct(item.id)?.price || 0) * item.qty, 0);
  document.getElementById("cartTotal").textContent = money(total);
}

function openCart(){ document.getElementById("cart").classList.add("open"); document.getElementById("overlay").classList.add("show"); document.body.classList.add("cartOpen"); }
function closeCart(){ document.getElementById("cart").classList.remove("open"); document.getElementById("overlay").classList.remove("show"); document.body.classList.remove("cartOpen"); }

async function account(){
  const mode=prompt('اكتب 1 لتسجيل الدخول أو 2 لإنشاء حساب'); if(!mode) return;
  const email=prompt('البريد الإلكتروني'); const password=prompt('كلمة المرور'); if(!email||!password)return;
  let body={email,password}; if(mode==='2') body.name=prompt('الاسم')||'عميل برتقالة';
  const r=await fetch(`${API}/auth/${mode==='2'?'register':'login'}`,{method:'POST',headers:apiHeaders(),body:JSON.stringify(body)});
  const data=await r.json(); if(!r.ok)return alert('تعذر تسجيل الحساب. تحقق من البيانات.'); authToken=data.token; localStorage.setItem('orangeToken',authToken); alert(`مرحبًا ${data.user.name}`);
}
async function checkout(){
  if(!cart.length) return alert('السلة فارغة.');
  if(!authToken){await account(); if(!authToken)return;}
  const items=cart.map(x=>({productId:x.id,quantity:x.qty}));
  const r=await fetch(`${API}/orders`,{method:'POST',headers:apiHeaders(),body:JSON.stringify({items})}); const order=await r.json();
  if(!r.ok)return alert('تعذر إنشاء الطلب: '+(order.error||'خطأ'));
  const pay=await fetch(`${API}/payments/checkout`,{method:'POST',headers:apiHeaders(),body:JSON.stringify({orderId:order.id})}); const pd=await pay.json();
  if(pay.ok&&pd.url){location.href=pd.url;return;}
  cart=[];saveCart();renderCart();alert(`تم إنشاء الطلب ${order.number}. الدفع الإلكتروني غير مفعّل حاليًا.`);
}
searchInput.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  renderProducts(q ? products.filter(p => p.name.toLowerCase().includes(q)) : products);
});

document.addEventListener("keydown", e => { if(e.key === "Escape") closeCart(); });
document.querySelector(".checkout").addEventListener("click", checkout);

loadProducts();
renderCart();
