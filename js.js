document.addEventListener('DOMContentLoaded', function () {
    var MainImg = document.getElementById("MainImg");
    var smallImg = document.getElementsByClassName("small-img");

    for (let i = 0; i < smallImg.length; i++) {
        smallImg[i].onclick = function() {
            MainImg.src = smallImg[i].src;
        }
    }

    var modal = document.getElementById("cartModal");
    var cartIcon = document.querySelector(".fa-shopping-cart");
    var addToCartButtons = document.querySelectorAll(".button");
    var span = document.getElementsByClassName("close")[0];
    var cartTableBody = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    var cartTotal = document.getElementById("cartTotal");

    cartIcon.onclick = function() {
        console.log("Cart icon clicked");
        modal.style.display = "block";
        loadStoredQuantities();
    }

    span.onclick = function() {
        modal.style.display = "none";
        clearStoredQuantities(); // Clear stored quantities when modal is closed
    }

    window.onclick = function(event) { //anywhere outside the modal is clicked
        if (event.target == modal) {
            modal.style.display = "none";
            clearStoredQuantities(); // Clear stored quantities when modal is closed
        }
    }

    var cart = JSON.parse(localStorage.getItem('cart')) || []; //Load the cart from localStorage or initialize it as an empty array if not found.
    console.log("Initial cart:", cart);

    addToCartButtons.forEach(button => {
        button.onclick = function(event) {
            console.log("Add to Cart button clicked");
            var product = event.target.closest('.single-pro-details');
            var name = product.querySelector('h2').innerText.trim(); //ignores unwanted spaces on either side of the text
            var priceText = product.querySelectorAll('h2')[1].innerText.trim().replace('Rs', '').replace(/,/g, ''); // replaces Rs with nothing and the comma is also replaced with nothing 
            var price = parseFloat(priceText);
            var quantity = parseInt(product.querySelector('input[type="number"]').value);
            var selectedSize = product.querySelector('select').value;

            console.log("Product details:", { name, price, quantity, selectedSize });

            // Validate if size is selected
            if (selectedSize === "Select Size") {
                alert("Please select your size.");
                return;
            }

            if (isNaN(price) || isNaN(quantity) || quantity < 1) {
                alert("Invalid price or quantity");
                return;
            }

            addToCart(name, price, quantity, selectedSize);
            modal.style.display = "block";
        }
    });

    function addToCart(name, price, quantity, size) {
        console.log("Adding to cart:", { name, price, quantity, size });
        var existingItem = cart.find(item => item.name === name && item.size === size); //.find is to search in the array and item.name is the name in the array and name is the one we are searching for
        if (existingItem) {
            // Update existing quantity instead of adding
            existingItem.quantity = quantity;
        } else {
            cart.push({ name: name, price: price, quantity: quantity, size: size });
        }
        updateCart();
    }

    function updateCart() {
        console.log("Updating cart:", cart);
        cartTableBody.innerHTML = "";
        var total = 0;
        cart.forEach(item => {
            var price = item.price ? item.price : 0; //the price is set to 0 if it is null or empty or invlaid
            var quantity = item.quantity ? item.quantity : 0;
            var subtotal = price * quantity;
            total += subtotal;
            var row = cartTableBody.insertRow();
            row.innerHTML = `
                <td>${item.name} (${item.size})</td>
                <td>Rs${price.toLocaleString()}</td>
                <td><input type="number" value="${quantity}" min="1" data-name="${item.name}" data-size="${item.size}"></td>
                <td>Rs${subtotal.toLocaleString()}</td>
                <td><button class="remove" data-name="${item.name}" data-size="${item.size}">Remove</button></td>
            `;
        });
        cartTotal.innerText = `${total.toLocaleString()}`;
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart updated:", cart);
    }

    cartTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove')) {
            var name = event.target.getAttribute('data-name');
            var size = event.target.getAttribute('data-size');
            cart = cart.filter(item => item.name !== name || item.size !== size); //method creates a new array filled with elements that pass a test provided by a function.
            updateCart();
        }
    });

    cartTableBody.addEventListener('change', function(event) {
        if (event.target.type === 'number') {
            var name = event.target.getAttribute('data-name');
            var size = event.target.getAttribute('data-size');
            var quantity = parseInt(event.target.value);
            if (isNaN(quantity) || quantity < 1) {
                alert("Quantity must be at least 1");
                return;
            }
            var item = cart.find(item => item.name === name && item.size === size);
            if (item) {
                item.quantity = quantity;
            }
            updateCart();
        }
    });

    function loadStoredQuantities() {
        var storedQuantities = JSON.parse(localStorage.getItem('quantities')) || {};
        document.querySelectorAll('.single-pro-details').forEach(product => {
            var name = product.querySelector('h2').innerText.trim();
            if (storedQuantities[name]) {
                product.querySelector('input[type="number"]').value = storedQuantities[name];
            }
        });
    }

    function clearStoredQuantities() {
        localStorage.removeItem('quantities');
    }

    // Clear cart on window load if redirected from cart.html modal
    var referrer = document.referrer;
    if (referrer.includes("cart.html")) {
        localStorage.removeItem('cart');
    }

    // Proceed to Cart button functionality
    document.getElementById('proceedToCart').addEventListener('click', function() {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    });

    // Continue Shopping button functionality
    document.getElementById('continueShopping').addEventListener('click', function() {
        modal.style.display = "none";
        clearStoredQuantities(); // Clear stored quantities when continuing shopping
    });
});
