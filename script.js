
const products = [
    {id:1, name:"Premium Headphones", price:450000, icon:"🎧", category:"audio"},
    {id:2, name:"Smart Watch", price:350000, icon:"⌚", category:"accessory"},
    {id:3, name:"iPhone Style", price:2500000, icon:"📱", category:"phone"},
    {id:4, name:"Wireless Earbuds", price:280000, icon:"🎵", category:"audio"},
    {id:5, name:"Gaming Mouse", price:190000, icon:"🖱️", category:"accessory"},
    {id:6, name:"Smart Phone", price:1800000, icon:"📲", category:"phone"},
    {id:7, name:"Speaker", price:320000, icon:"🔊", category:"audio"},
    {id:8, name:"Keyboard", price:250000, icon:"⌨️", category:"accessory"}
];

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];
let activeCategory = "all";

const grid = document.getElementById("productGrid");

function formatPrice(price) {
    return price.toLocaleString("uz-UZ");
}

function renderProducts() {
    const search = document.getElementById("search")
        .value.toLowerCase();

    const filtered = products.filter(p =>
        (activeCategory === "all" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(search)
    );

    grid.innerHTML = filtered.map(p => `
        <div class="product">
            <div class="product-img">${p.icon}</div>
            <h3>${p.name}</h3>
            <div class="price">${formatPrice(p.price)} so'm</div>
            <button onclick="addToCart(${p.id})">
                Savatchaga qo'shish +
            </button>
        </div>
    `).join("") || "<p>Mahsulot topilmadi.</p>";
}

function saveCart() {
    localStorage.setItem("novaCart", JSON.stringify(cart));
}

function addToCart(id) {
    const item = cart.find(p => p.id === id);

    if (item) item.quantity++;
    else cart.push({id, quantity:1});

    saveCart();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItems");
    const count = cart.reduce((sum, p) => sum + p.quantity, 0);

    document.getElementById("cartCount").textContent = count;

    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return `
        <div class="cart-item">
            <div>
                <strong>${product.name}</strong>
                <p>${formatPrice(product.price)} so'm</p>
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                ${item.quantity}
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeItem(${item.id})">🗑️</button>
        </div>`;
    }).join("") || "<p>Savatcha hozircha bo'sh.</p>";

    const total = cart.reduce((sum, item) => {
        const p = products.find(p => p.id === item.id);
        return sum + p.price * item.quantity;
    }, 0);

    document.getElementById("total").textContent =
        formatPrice(total);
}

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);
    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveCart();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
    renderCart();
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("open");
    document.getElementById("cartOverlay").classList.toggle("open");
}

function checkout() {
    if (!cart.length) {
        alert("Savatchangiz bo'sh!");
        return;
    }

    alert("Buyurtma qabul qilish uchun backend yoki Telegram bot ulash kerak!");
}

document.getElementById("search")
    .addEventListener("input", renderProducts);

document.querySelectorAll(".categories button")
    .forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".categories .active")
                .classList.remove("active");

            button.classList.add("active");
            activeCategory = button.dataset.category;
            renderProducts();
        });
    });

renderProducts();
renderCart();
