// Cart functionality
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ product_id: productId, quantity })
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('Product added to cart!', 'success');
            updateCartCount();
        } else {
            showNotification(data.error || 'Failed to add to cart', 'error');
        }
    } catch (error) {
        showNotification('Error adding to cart', 'error');
    }
}

async function updateCartItem(itemId, quantity) {
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity })
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('Cart updated', 'success');
            updateCartCount();
            location.reload(); // Refresh cart page
        } else {
            showNotification(data.error || 'Failed to update cart', 'error');
        }
    } catch (error) {
        showNotification('Error updating cart', 'error');
    }
}

async function removeFromCart(itemId) {
    if (!confirm('Remove this item from cart?')) return;
    
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('Item removed from cart', 'success');
            updateCartCount();
            location.reload(); // Refresh cart page
        } else {
            showNotification(data.error || 'Failed to remove item', 'error');
        }
    } catch (error) {
        showNotification('Error removing item', 'error');
    }
}

async function updateCartCount() {
    try {
        const response = await fetch('/api/cart', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
            const cartCounts = document.querySelectorAll('.cart-count');
            cartCounts.forEach(el => {
                el.textContent = count;
                el.style.display = count > 0 ? 'inline-block' : 'none';
            });
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close ms-3" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        updateCartCount();
    }
});