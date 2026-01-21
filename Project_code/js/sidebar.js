// 下拉200px显示悬浮球
// 监听滚动事件，控制悬浮球显示
function handleScroll() {
    const sidebar = document.getElementById('J_block_sidebar');
    if (window.scrollY >= 200) {
        sidebar.style.display = 'block';
    } else {
        sidebar.style.display = 'none';
    }
}

// 添加滚动事件监听器
window.addEventListener('scroll', handleScroll);

// 页面加载完成后初始化状态（用于解决页面刷新后的位置判断问题）
document.addEventListener('DOMContentLoaded', function() {
    handleScroll(); // 初始化时检查一次位置
});

// 返回网页顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}