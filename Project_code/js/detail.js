// 点击搜索图标展开搜索框功能
document.addEventListener('DOMContentLoaded', function() {
    
    const searchButton = document.getElementById('J_radius_search_wrap');
    const searchInput = document.getElementById('J_radius_search_input');
    
    if (searchButton && searchInput) {

        searchInput.placeholder = '';

        // 鼠标移入移出检测
        searchButton.addEventListener('mouseenter', function() {
            this.classList.add('radius-btn-search-in');
            searchInput.placeholder = '请输入文字';
        });
        
        searchButton.addEventListener('mouseleave', function() {
            this.classList.remove('radius-btn-search-in');
            searchInput.placeholder = '';
        });
    }
});

// 点击选中icon加上灰色框效果__给其父级li元素添加selected类
document.addEventListener('DOMContentLoaded', function() {
    
    document.addEventListener('click', function(e) {
        // 检查点击的元素是否是具有cover-item类的购物车图标
        if ((e.target.classList.contains('icon-gouwuche') || e.target.classList.contains('icon-gouwuche1')) && 
            e.target.classList.contains('cover-item')) {
            e.stopPropagation();

            const parentLi = e.target.closest('li');
            if (parentLi) {
                parentLi.classList.toggle('selected');
                
                const cartIcon = e.target;
                const iconId = parentLi.querySelector('.icon-name span').textContent;
                
                
                if (parentLi.classList.contains('selected')) {
                    cartIcon.classList.remove('icon-gouwuche');
                    cartIcon.classList.add('icon-gouwuche1');
                } else {
                    cartIcon.classList.remove('icon-gouwuche1');
                    cartIcon.classList.add('icon-gouwuche');
                }
                
                // 保存购物车状态
                SessionStorageManager.saveToCart(iconId, parentLi.classList.contains('selected'));

                updateCartCount();
            }
        }
    });
});

// 点击选中icon添加favor类
document.addEventListener('DOMContentLoaded', function() {
    
    document.addEventListener('click', function(e) {
        // 检查点击的元素是否是具有cover-item类的收藏图标
        if ((e.target.classList.contains('icon-shoucang1') || e.target.classList.contains('icon-favorites-fill')) && 
            e.target.classList.contains('cover-item')) {
            e.stopPropagation();
            
            const parentLi = e.target.closest('li');
            if (parentLi) {
                parentLi.classList.toggle('favor');
                
                const favorIcon = e.target;
                const iconId = parentLi.querySelector('.icon-name span').textContent;
                
                // 检查是否已收藏
                if (parentLi.classList.contains('favor')) {
                    favorIcon.classList.remove('icon-shoucang1');
                    favorIcon.classList.add('icon-favorites-fill');
                } else {
                    favorIcon.classList.remove('icon-favorites-fill');
                    favorIcon.classList.add('icon-shoucang1');
                }
                
                // 保存收藏状态
                SessionStorageManager.saveFavorite(iconId, parentLi.classList.contains('favor'));
            }
        }
    });
});

