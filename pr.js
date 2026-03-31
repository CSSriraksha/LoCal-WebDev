let menu = [
    { id: 1, name: "Paneer Butter Masala", price: 80, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Masala Dosa", price: 80, img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "Chole Bhature", price: 90, img: "https://media.istockphoto.com/id/979914742/photo/chole-bhature-or-chick-pea-curry-and-fried-puri-served-in-terracotta-crockery-over-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=8pmBVIcNb-GIFnsBT0sYqfy-YtzNq7pOqc6lQZgFOPo=" },
    { id: 4, name: "Chai", price: 15, img: "https://plus.unsplash.com/premium_photo-1677528573563-44ac31cd3b7e?w=500&auto=format&fit=crop&q=60" },
    { id: 5, name: "Biryani", price: 100, img: "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?q=80&w=500&auto=format&fit=crop" },
    { id: 6, name: "Samosa (2pcs)", price: 30, img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60" },
    { id: 7, name: "Butter Naan", price: 20, img: "https://images.unsplash.com/photo-1697155406014-04dc649b0953?w=500&auto=format&fit=crop&q=60" },
    { id: 8, name: "Gulab Jamun (2pcs)", price: 20, img: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?w=500&auto=format&fit=crop&q=60" },
    { id: 9, name: "Vada Pav", price: 25, img: "https://images.unsplash.com/photo-1750767396956-da1796f33ad1?w=500&auto=format&fit=crop&q=60" },
    { id: 10, name: "Mango Lassi", price: 40, img: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=500&auto=format&fit=crop" },
    { id: 11, name: "Dal Makhani", price: 100, img: "https://plus.unsplash.com/premium_photo-1700752343809-6dc1517295df?w=500&auto=format&fit=crop&q=60" },
    { id: 12, name: "Pav Bhaji", price: 110, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=500&auto=format&fit=crop" }
];

let cart = [];
let orders = [];
let discountThreshold = 200;
let discountRate = 0.15;

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'menu') renderMenu();
    if(id === 'admin') renderAdmin();
    if(id === 'checkout-form') initCanvas();
}

function showAdminLogin() { showSection('admin-login-sec'); }

function checkAdminLogin() {
    const pass = document.getElementById('admin-pass-input').value;
    if (pass === "admin") { showSection('admin'); } else { alert("Incorrect Password!"); }
    document.getElementById('admin-pass-input').value = '';
}

function showCheckoutForm() {
    if(cart.length === 0) return alert("Your plate is empty!");
    showSection('checkout-form');
}

function processOrder() {
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const notes = document.getElementById('chef-notes').value;
    const canvasData = canvas.toDataURL();

    if(!name || !email) return alert("Please provide your name and email.");

    const orderObj = {
        id: Date.now(),
        customer: name,
        email: email,
        items: [...cart],
        total: document.getElementById('final-total').innerText,
        notes: notes,
        drawing: canvasData,
        status: 'pending'
    };

    orders.push(orderObj);
    alert(`Order Confirmed!\nName: ${name}\nTotal: ₹${orderObj.total}`);
    
    cart = [];
    document.getElementById('cust-name').value = '';
    document.getElementById('cust-email').value = '';
    document.getElementById('chef-notes').value = '';
    clearCanvas();
    updateBill();
    showSection('home');
}

function renderMenu() {
    const list = document.getElementById('food-list');
    list.innerHTML = menu.map(item => `
        <div class="food-card">
            <img src="${item.img}" alt="${item.name}">
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <button onclick="addToCart(${item.id})">Add to Plate</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = menu.find(i => i.id === id);
    cart.push({...item, cartId: Date.now()});
    updateBill();
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateBill();
}

function updateBill() {
    const cartList = document.getElementById('cart-items');
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = subtotal >= discountThreshold ? subtotal * discountRate : 0;
    cartList.innerHTML = cart.map(item => `<li><span>${item.name} - ₹${item.price}</span><button onclick="removeFromCart(${item.cartId})" style="width:auto; padding:5px 10px; background:#c0392b; margin:0;">Remove</button></li>`).join('');
    document.getElementById('subtotal').innerText = subtotal;
    document.getElementById('discount-amount').innerText = Math.round(discount);
    document.getElementById('final-total').innerText = Math.round(subtotal - discount);
}

function renderAdmin() {
    const tbody = document.getElementById('admin-inventory');
    tbody.innerHTML = menu.map(item => `<tr><td>${item.name}</td><td>₹${item.price}</td><td><button style="background:#c0392b; width:auto; padding:5px 15px;" onclick="removeItem(${item.id})">Delete Item</button></td></tr>`).join('');
    renderOrderQueue();
}

function renderOrderQueue() {
    const queue = document.getElementById('order-queue');
    if (orders.length === 0) {
        queue.innerHTML = '<p style="color: #7f8c8d;">No active orders.</p>';
        return;
    }

    queue.innerHTML = orders.map(order => `
        <div class="card" style="border-left: 5px solid ${order.status === 'confirmed' ? '#f1c40f' : '#2ecc71'}; margin-bottom: 15px; background: #fafafa;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4>Order #${order.id} - ${order.customer} (${order.status.toUpperCase()})</h4>
                    <p>Items: ${order.items.map(i => i.name).join(', ')}</p>
                    <p><strong>Total: ₹${order.total}</strong></p>
                    ${order.notes ? `<p><em>Notes: ${order.notes}</em></p>` : ''}
                </div>
                <div style="text-align: right;">
                    ${order.status === 'pending' ? `<button onclick="updateOrderStatus(${order.id}, 'confirmed')" style="background: #f39c12;">Confirm Order</button>` : ''}
                    ${order.status === 'confirmed' ? `<button onclick="updateOrderStatus(${order.id}, 'delivered')" style="background: #27ae60;">Mark Delivered</button>` : ''}
                    <button onclick="viewDrawing('${order.drawing}')" style="background: #3498db; margin-top: 5px;">View Sketch</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateOrderStatus(id, newStatus) {
    const order = orders.find(o => o.id === id);
    if (order) {
        if (newStatus === 'delivered') {
            orders = orders.filter(o => o.id !== id);
            alert("Order delivered and cleared!");
        } else {
            order.status = newStatus;
        }
        renderOrderQueue();
    }
}

function viewDrawing(dataUrl) {
    const win = window.open();
    win.document.write(`<img src="${dataUrl}" style="border: 1px solid #000;">`);
}

function addItem() {
    const name = document.getElementById('new-item-name').value;
    const price = parseFloat(document.getElementById('new-item-price').value);
    const img = document.getElementById('new-item-img').value || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
    if(name && price) {
        menu.push({ id: Date.now(), name, price, img });
        document.getElementById('new-item-name').value = '';
        document.getElementById('new-item-price').value = '';
        document.getElementById('new-item-img').value = '';
        renderAdmin();
    }
}

function removeItem(id) { menu = menu.filter(i => i.id !== id); renderAdmin(); }

function updateDiscount() {
    discountThreshold = parseFloat(document.getElementById('threshold-input').value);
    discountRate = parseFloat(document.getElementById('discount-percent-input').value) / 100;
    alert("LoCal Rules Updated!");
}

let canvas, ctx, drawing = false;

function initCanvas() {
    canvas = document.getElementById('chef-canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseout', stopDraw);
}

function startDraw(e) { drawing = true; draw(e); }
function stopDraw() { drawing = false; ctx.beginPath(); }
function draw(e) {
    if(!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('brush-color').value;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke(); ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }