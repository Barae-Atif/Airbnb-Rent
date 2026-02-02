const LOGIN = "staybnb_login";
const RESERVE = "staybnb_reserve";
const FAVS = "staybnb_favs";

/* Favorites */
const getFavs = () => JSON.parse(localStorage.getItem(FAVS)) || [];
const saveFavs = (f) => localStorage.setItem(FAVS, JSON.stringify(f));

function toggleFav(item){
  let favs = getFavs();
  const exist = favs.find(x=>x.id===item.id);
  favs = exist ? favs.filter(x=>x.id!==item.id) : [...favs,item];
  saveFavs(favs);
}

function initFavButtons(){
  document.querySelectorAll(".fav-btn").forEach(btn=>{
    const id = btn.dataset.id;
    btn.classList.toggle("active", getFavs().some(f=>f.id===id));
    btn.innerText = btn.classList.contains("active") ? "♥ Favorite" : "♡ Favorite";

    btn.onclick = ()=>{
      toggleFav({
        id,
        city:btn.dataset.city,
        title:btn.dataset.title,
        price:btn.dataset.price,
        img:btn.dataset.img
      });
      initFavButtons();
    };
  });
}

function renderFavorites(){
  const box = document.getElementById("favoritesGrid");
  if(!box) return;
  const favs = getFavs();
  if(!favs.length){
    box.innerHTML = "<p>No favorites yet.</p>";
    return;
  }
  box.innerHTML = favs.map(f=>`
    <div class="card">
      <img src="${f.img}">
      <div class="body">
        <div class="tag">${f.city}</div>
        <h3>${f.title}</h3>
        <div class="row">${f.price} MAD/night</div>
        <button class="reserve-btn" onclick="goReserve('${f.title}','${f.price}','${f.city}')">Reserve</button>
      </div>
    </div>
  `).join("");
}

/* Reserve flow */
function goReserve(title,price,city){
  localStorage.setItem(RESERVE,JSON.stringify({title,price,city}));
  window.location.href = localStorage.getItem(LOGIN) ? "reservations.html" : "login.html";
}

function loginNow(){
  localStorage.setItem(LOGIN,"yes");
  window.location.href="reservations.html";
}

function showReservation(){
  const box=document.getElementById("reservationInfo");
  if(!box) return;
  const r=JSON.parse(localStorage.getItem(RESERVE)||"{}");
  box.innerHTML=`<b>${r.title}</b><br>${r.city}<br>${r.price} MAD/night`;
}

function confirmReservation(){
  window.location.href="success.html";
}

document.addEventListener("DOMContentLoaded",()=>{
  initFavButtons();
  renderFavorites();
  showReservation();
});
