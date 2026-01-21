// sessionStorage 数据存储

// 会话存储管理器
const SessionStorageManager = {
    // 收藏相关
    saveFavorite(iconId, isFavor) {
        let favorites = this.getFavorites();
        if (isFavor) {
            favorites[iconId] = true;
        } else {
            delete favorites[iconId];
        }
        sessionStorage.setItem('iconFavorites', JSON.stringify(favorites));
    },
    
    getFavorites() {
        return JSON.parse(sessionStorage.getItem('iconFavorites') || '{}');
    },
    
    isFavorite(iconId) {
        const favorites = this.getFavorites();
        return !!favorites[iconId];
    },
    
    // 购物车相关
    saveToCart(iconId, isSelected) {
        let cart = this.getCart();
        if (isSelected) {
            cart[iconId] = true;
        } else {
            delete cart[iconId];
        }
        sessionStorage.setItem('iconCart', JSON.stringify(cart));
    },
    
    getCart() {
        return JSON.parse(sessionStorage.getItem('iconCart') || '{}');
    },
    
    isInCart(iconId) {
        const cart = this.getCart();
        return !!cart[iconId];
    },
    
    getCartCount() {
        const cart = this.getCart();
        return Object.keys(cart).length;
    },
    
    // 清除所有数据
    clearAll() {
        sessionStorage.removeItem('iconFavorites');
        sessionStorage.removeItem('iconCart');
    }
};

// 恢复收藏状态
function restoreFavoriteStates() {
    const favorites = SessionStorageManager.getFavorites();
    
    document.querySelectorAll('.block-icon-list li').forEach(li => {
        const iconId = li.querySelector('.icon-name span').textContent;
        
        if (favorites[iconId]) {
            li.classList.add('favor');
            const favorIcon = li.querySelector('.icon-shoucang1.cover-item');
            if (favorIcon) {
                favorIcon.classList.remove('icon-shoucang1');
                favorIcon.classList.add('icon-favorites-fill');
            }
        }
    });
}

// 恢复购物车状态
function restoreCartStates() {
    const cart = SessionStorageManager.getCart();
    
    document.querySelectorAll('.block-icon-list li').forEach(li => {
        const iconId = li.querySelector('.icon-name span').textContent;
        
        if (cart[iconId]) {
            li.classList.add('selected');
            const cartIcon = li.querySelector('.icon-gouwuche.cover-item');
            if (cartIcon) {
                cartIcon.classList.remove('icon-gouwuche');
                cartIcon.classList.add('icon-gouwuche1');
            }
        }
    });
}

// 页面加载完成后恢复状态
document.addEventListener('DOMContentLoaded', function() {
    restoreFavoriteStates();
    restoreCartStates();
    updateCartCount();
});

// 更新购物车计数器函数
function updateCartCount() {
    const count = SessionStorageManager.getCartCount();
    
    // 更新所有购物车计数器元素（顶部导航栏+悬浮球）
    const allCartCounts = document.querySelectorAll('#J_icon_sidebar_count');
    allCartCounts.forEach(sidebarCount => {
        if (sidebarCount) {
            if (count === 0) {
                sidebarCount.style.display = 'none';
            } else {
                sidebarCount.style.display = 'flex';
                sidebarCount.textContent = count;
            }
        }
    });
    
    // 更新购物车为空状态显示
    const cartContainer = document.getElementById('J_block_car_container');
    if (cartContainer) {
        const iconsContainer = cartContainer.querySelector('.icons-container');
        if (iconsContainer) {
            // 空购物车提示
            if (count === 0) {
                iconsContainer.innerHTML = '<div class="no-result"><img src="./web_assets/background/car.png" alt="购物车为空" style="width: 170px; height: 200px;"><div class="no-result-message">购物车为空</div></div>';
            } else if (iconsContainer.querySelector('.no-result')) {
                iconsContainer.innerHTML = '';
            }
        }
    }
}

