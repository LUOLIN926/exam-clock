// 购物车功能
document.addEventListener('DOMContentLoaded', function() {
    
    const cartIcon = document.querySelector('.iconfont.icon-gouwuche');
    const cartContainer = document.getElementById('J_block_car_container');
    const overlay = document.getElementById('overlay');
    
    // ！检查必要元素是否存在
    if (!cartIcon || !cartContainer || !overlay) {
        console.warn('购物车相关元素未找到');
        return;
    }
    
    const closeBtn = document.querySelector('.top-back.iconfont.icon-right');
    
    // 清空购物车按钮
    const clearCartBtn = document.createElement('span');
    clearCartBtn.className = 'btn-clean-all';
    clearCartBtn.innerHTML = '<span class="iconfont icon-gouwuche"></span>清空购物车';
    clearCartBtn.style.cursor = 'pointer';
    
    const carTop = cartContainer.querySelector('.car-top');
    if (carTop) {
        carTop.appendChild(clearCartBtn);
    }
    
// 打开购物车函数
function openCart() {
    cartContainer.classList.add('show');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁止背景滚动

    updateCartCount();
}
    
// 关闭购物车函数
function closeCart() {
    cartContainer.classList.remove('show');
    overlay.classList.remove('active');
    
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 300);
}
    
// 清空购物车函数
function clearCart() {
    sessionStorage.removeItem('iconCart');
    
    updateCartCount();
    
    // 清除选中状态
    document.querySelectorAll('.block-icon-list li.selected').forEach(li => {
        li.classList.remove('selected');
        const cartIcon = li.querySelector('.icon-gouwuche1.cover-item');
        if (cartIcon) {
            cartIcon.classList.remove('icon-gouwuche1');
            cartIcon.classList.add('icon-gouwuche');
        }
    });
    
    console.log('购物车已清空');
}
    
    // 打开or关闭购物车侧拉框
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCart();
    });
    
    // 点击清空购物车按钮
    clearCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        clearCart();
    });
    
    // 点击现有的关闭按钮关闭
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }
    
    // 点击遮罩层关闭
    overlay.addEventListener('click', closeCart);
    
    // 按ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartContainer.classList.contains('show')) {
            closeCart();
        }
    });
    
    // 函数暴露到全局作用域
    window.openCart = openCart;
    window.closeCart = closeCart;
    window.clearCart = clearCart;
});