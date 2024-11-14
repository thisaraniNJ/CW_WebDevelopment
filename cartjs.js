window.onload = function() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var orderTableBody = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
    var orderTotal = document.getElementById('orderTotal');
    var emptyCartMessage = document.getElementById('emptyCartMessage');

    function updateCart() {
        orderTableBody.innerHTML = "";
        var total = 0;
        cart.forEach(item => {
            var subtotal = item.price * item.quantity;
            total += subtotal;
            var row = orderTableBody.insertRow();
            row.innerHTML = `
                <td>${item.name} (${item.size})</td>
                <td>Rs${item.price.toLocaleString()}</td>
                <td><input type="number" value="${item.quantity}" min="1" data-name="${item.name}" data-size="${item.size}"></td>
                <td>Rs${subtotal.toLocaleString()}</td>
                <td><button class="remove" data-name="${item.name}" data-size="${item.size}">Remove</button></td>
            `;
        });
        orderTotal.innerText = `${total.toLocaleString()}`;

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
            orderTableBody.style.display = "none";
            orderTotal.parentElement.style.display = "none";
        } else {
            emptyCartMessage.style.display = "none";
            orderTableBody.style.display = "";
            orderTotal.parentElement.style.display = "";
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    orderTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove')) {
            var name = event.target.getAttribute('data-name');
            var size = event.target.getAttribute('data-size');
            cart = cart.filter(item => item.name !== name || item.size !== size);
            updateCart();
        }
    });

    orderTableBody.addEventListener('change', function(event) {
        if (event.target.type === 'number') {
            var name = event.target.getAttribute('data-name');
            var size = event.target.getAttribute('data-size');
            var quantity = parseInt(event.target.value);
            if (quantity < 1) {
                alert("Quantity must be at least 1");
                return;
            }
            var item = cart.find(item => item.name === name && item.size === size);
            if (item) {
                item.quantity = quantity;
                updateCart();
            }
        }
    });

    updateCart();

    document.getElementById('placeOrderBtn').addEventListener('click', function() {
        var fname = document.getElementById('fname').value;
        var lname = document.getElementById('lname').value;
        var email = document.getElementById('email').value;
        var address = document.getElementById('address').value;
        var quizScore = parseInt(document.getElementById('quizScore').value) || 0;

        if (!fname || !lname || !email || !address) {
            alert('Please fill in all mandatory fields.');
            return;
        }

        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to your cart before placing an order.');
            return;
        }

        var total = parseFloat(orderTotal.innerText.replace(/,/g, ''));
        var discount = 0;
        if (quizScore === 5) {
            discount = total * 0.15;
        }
        var finalTotal = total - discount;

        var orderDetails = `Order placed successfully!<br><br>Name: ${fname} ${lname}<br>Email: ${email}<br>Address: ${address}<br><br>Items:<br>`;
        cart.forEach(item => {
            orderDetails += `${item.name} (${item.size}) - Rs${item.price} x ${item.quantity}<br>`;
        });
        orderDetails += `<br>Total: Rs${total.toLocaleString()}<br>`;
        orderDetails += `Discount: Rs${discount.toLocaleString()}<br>`;
        orderDetails += `Final Total: Rs${finalTotal.toLocaleString()}`;

        document.getElementById('orderDetails').innerHTML = orderDetails;

        var modal = document.getElementById('orderModal');
        modal.style.display = "block";

        var closeModal = document.getElementsByClassName("close")[0];
        closeModal.onclick = function() {
            modal.style.display = "none";
            cart = [];
            updateCart();
            window.location.href = "index.html";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                cart = [];
                updateCart();
                window.location.href = "index.html";
            }
        }
    });
};
