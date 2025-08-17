document.addEventListener("DOMContentLoaded", function() {

    function updateCart(productId, quantity) {
        fetch("/update_cart", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: productId, quantity: quantity})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) location.reload();
        });
    }

    // input number เปลี่ยนจำนวน
    document.querySelectorAll(".qty").forEach(input => {
        input.addEventListener("change", function() {
            const id = this.dataset.id;
            const quantity = this.value;
            updateCart(id, quantity);
        });
    });

    // ปุ่ม + เพิ่มจำนวน
document.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", function() {
        const id = this.dataset.id;
        const input = document.querySelector(`.qty[data-id='${id}']`);
        input.value = parseInt(input.value) + 1;
        updateSubtotal(id);
    });
});

// ปุ่ม - ลดจำนวน
document.querySelectorAll(".minus").forEach(btn => {
    btn.addEventListener("click", function() {
        const id = this.dataset.id;
        const input = document.querySelector(`.qty[data-id='${id}']`);
        let val = parseInt(input.value) - 1;
        if (val < 1) val = 1;
        input.value = val;
        updateSubtotal(id);
    });
});

// ปุ่มลบสินค้า
document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", function() {
        const id = this.dataset.id;
        const item = document.querySelector(`.cart-item[data-id='${id}']`);
        item.remove();
        updateTotal();
    });
});

// อัปเดต Subtotal ของสินค้าแต่ละชิ้น
function updateSubtotal(id) {
    const input = document.querySelector(`.qty[data-id='${id}']`);
    const price = parseFloat(document.querySelector(`.cart-item[data-id='${id}'] .item-price`).innerText);
    const subtotal = price * parseInt(input.value);

    document.querySelector(`.subtotal[data-id='${id}']`).innerText = subtotal.toFixed(2);

    updateTotal();
}

// อัปเดตราคารวมทั้งหมด
function updateTotal() {
    let total = 0;
    document.querySelectorAll(".subtotal").forEach(sub => {
        total += parseFloat(sub.innerText);
    });
    document.getElementById("total").innerText = total.toFixed(2);
}




});
document.addEventListener("DOMContentLoaded", function() {
    // 🔎 ฟังก์ชันกรองหมวดหมู่
    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");
    const searchInput = document.getElementById("search");
    const productList = document.getElementById("product-list");

    function filterAndSort() {
        const category = categoryFilter.value;
        const sortOrder = priceSort.value;
        const searchText = searchInput.value.toLowerCase();

        let products = Array.from(productList.getElementsByClassName("product-card"));

        // filter category
        products.forEach(p => {
            const matchCategory = (category === "All" || p.dataset.category === category);
            const matchSearch = p.querySelector("h3").innerText.toLowerCase().includes(searchText);

            if (matchCategory && matchSearch) {
                p.style.display = "block";
            } else {
                p.style.display = "none";
            }
        });

        // sort price
        if (sortOrder !== "none") {
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector("p").innerText);
                const priceB = parseFloat(b.querySelector("p").innerText);
                return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
            });

            products.forEach(p => productList.appendChild(p)); // reorder DOM
        }
    }

    categoryFilter.addEventListener("change", filterAndSort);
    priceSort.addEventListener("change", filterAndSort);
    searchInput.addEventListener("input", filterAndSort);
});
