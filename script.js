// ===== FAVORITES =====
const FAV_KEY = "staybnb_favorites";
const LOGIN_KEY = "staybnb_logged_in";

function getFavs(){
  return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
}
function saveFavs(favs){
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}
function toggleFav(item){
  let favs = getFavs();
  const exists = favs.find(x => x.id === item.id);
  if (exists) favs = favs.filter(x => x.id !== item.id);
  else favs.push(item);
  saveFavs(favs);
}

// Setup hearts on listing pages
function setupFavButtons(){
  document.querySelectorAll(".card[data-id]").forEach(card=>{
    const btn = card.querySelector(".fav");
    if(!btn) return;

    const item = {
      id: card.dataset.id,
      city: card.dataset.city,
      title: card.dataset.title,
      price: card.dataset.price,
      rating: card.dataset.rating,
      img: card.dataset.img
    };

    const saved = getFavs().some(x => x.id === item.id);
    btn.textContent = saved ? "♥" : "♡";
    btn.classList.toggle("active", saved);

    btn.addEventListener("click", ()=>{
      toggleFav(item);
      const now = getFavs().some(x => x.id === item.id);
      btn.textContent = now ? "♥" : "♡";
      btn.classList.toggle("active", now);
    });
  });
}

// Favorites page render
function showFavorites(){
  const box = document.getElementById("favoritesBox");
  if(!box) return;

  const favs = getFavs();
  if(favs.length === 0){
    box.innerHTML = `<p>No favorites yet. Go to <a href="cities.html" style="color:#e11d48;font-weight:bold;">Cities</a> and tap ♡.</p>`;
    return;
  }

  box.innerHTML = favs.map(item=>`
    <div class="card">
      <img src="${item.img}">
      <div class="body">
        <div class="city">${item.city}</div>
        <h3>${item.title}</h3>
        <div class="row">
          <span>$${item.price}/night</span>
          <span>⭐ ${item.rating}</span>
        </div>
        <button class="fav active" data-remove="${item.id}" type="button">♥ Remove</button>
      </div>
    </div>
  `).join("");

  box.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.remove;
      saveFavs(getFavs().filter(x=>x.id!==id));
      showFavorites();
    });
  });
}

// ===== LOGIN =====
function setupLogin(){
  const loginBtn = document.getElementById("loginBtn");
  if(!loginBtn) return;

  loginBtn.addEventListener("click", ()=>{
    const email = document.getElementById("email").value.trim();
    const pass  = document.getElementById("password").value.trim();
    const msg   = document.getElementById("msg");

    if(email === "" || pass === ""){
      msg.textContent = "Please fill email and password.";
      return;
    }

    // Save login (simple demo)
    localStorage.setItem(LOGIN_KEY, "yes");
    msg.textContent = "Login success! Redirecting...";

    setTimeout(()=>{ window.location.href = "cities.html"; }, 600);
  });
}

// Protect cities and city pages (must be logged in)
function protectPages(){
  const needLoginPages = [
    "cities.html","casablanca.html","rabat.html","marrakech.html","tangier.html"
  ];

  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const logged = localStorage.getItem(LOGIN_KEY) === "yes";

  if(needLoginPages.includes(current) && !logged){
    window.location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  protectPages();
  setupLogin();
  setupFavButtons();
  showFavorites();
});
