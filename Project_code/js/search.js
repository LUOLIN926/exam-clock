// 搜索区域切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取搜索区域的tab按钮
    const searchTabs = document.querySelectorAll('.swiper-pagination-bullet.custom-tab-bullet');
    
    // 确保有两个tab按钮
    if (searchTabs.length >= 2) {
        const searchTab = searchTabs[0];  // 搜索按钮
        const aiTab = searchTabs[1];      // AI生成图标按钮
        
        // 为搜索按钮添加点击事件
        searchTab.addEventListener('click', function(e) {
            e.preventDefault();
            // 移除AI按钮的active状态，添加搜索按钮的active状态
            aiTab.classList.remove('swiper-pagination-bullet-active');
            searchTab.classList.add('swiper-pagination-bullet-active');
        });
        
        // 为AI生成图标按钮添加点击事件
        aiTab.addEventListener('click', function(e) {
            e.preventDefault();
            // 移除搜索按钮的active状态，添加AI按钮的active状态
            searchTab.classList.remove('swiper-pagination-bullet-active');
            aiTab.classList.add('swiper-pagination-bullet-active');
        });
    }
    
    // 添加搜索下拉框的点击功能
    const searchDrop = document.querySelector('.search-drop');
    const searchDropdown = document.querySelector('.search-dropdown');
    
    if (searchDrop && searchDropdown) {
        
        searchDrop.addEventListener('click', function(e) {
            
            e.stopPropagation();// !阻止事件冒泡，避免点击文档其他地方时立即关闭
            
            this.classList.toggle('dropdown-open');
        });
        
        // 点击下拉选项时关闭下拉框
        const dropdownItems = searchDropdown.querySelectorAll('div[data-type]');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除 dropdown-open 类以关闭下拉框
                searchDrop.classList.remove('dropdown-open');
                
                const selectedType = this.getAttribute('data-type');
                const selectedText = this.textContent.trim();
                
                // 更新显示文本
                const searchText = searchDrop.querySelector('.search-tab-text span');
                if (searchText) {
                    searchText.textContent = selectedText;
                }
            });
        });
        
        // 点击页面其他地方时关闭下拉框
        document.addEventListener('click', function(e) {
            if (searchDrop.classList.contains('dropdown-open')) {
                searchDrop.classList.remove('dropdown-open');
            }
        });
    }
});

// 推荐卡片标签按钮悬浮效果
document.addEventListener('DOMContentLoaded', function() {
    
    const tabButtons = document.querySelectorAll('.rec-cards .tab-btn');
    
    // 记录当前具有current类的按钮
    let currentActiveButton = tabButtons[0];
    
    // 为每个按钮添加鼠标事件监听器
    tabButtons.forEach(button => {
        
        button.addEventListener('mouseenter', function() {
            
            tabButtons.forEach(btn => {
                if (btn !== this) {
                    btn.classList.remove('current');
                }
            });
            
            
            this.classList.add('current');
            
            currentActiveButton = this;
        });
        
        button.addEventListener('mouseleave', function() {
            currentActiveButton = this;
        });
    });
});

// 推荐卡片标签按钮悬浮效果（显示对应Collections）
document.addEventListener('DOMContentLoaded', function() {
    
    const tabButtons = document.querySelectorAll('.rec-cards .tab-btn');
    const recommendContents = document.querySelectorAll('.recommendContent');
    
    // 初始化
    if (tabButtons.length > 0 && recommendContents.length > 0) {
        tabButtons[0].classList.add('current');
        recommendContents[0].classList.add('current');
    }
    
    // 为每个按钮添加鼠标事件监听器
    tabButtons.forEach((button, index) => {
        // 鼠标进入事件
        button.addEventListener('mouseenter', function() {
            
            tabButtons.forEach(btn => {
                btn.classList.remove('current');
            });
           
            this.classList.add('current');
            
            recommendContents.forEach(content => {
                content.classList.remove('current');
            });
            
            if (recommendContents[index]) {
                recommendContents[index].classList.add('current');
            }
        });
    });
});

// 鼠标悬停播放视频功能
document.addEventListener('DOMContentLoaded', function() {

    const videoItems = document.querySelectorAll('.ai-list-item video');
    
    // 为每个视频容器添加事件监听器
    videoItems.forEach(video => {
        const container = video.closest('.ai-list-item');
        
        container.addEventListener('mouseenter', function() {
            
            video.currentTime = 0;// 重置视频到开头
            
            video.play().catch(e => {
                console.log('视频播放被阻止:', e);// !自动播放可能被浏览器阻止，这里捕获错误
            });
        });
        
        // 鼠标离开时暂停视频
        container.addEventListener('mouseleave', function() {
            video.pause();
            video.currentTime = 0;// 重置视频到开头
        });
    });
});

// 实现标签点击切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取主标签项
    const tabNavItems = document.querySelectorAll('.primary-tabs .tab-nav-item');
    
    // 获取两个内容容器
    const content0 = document.getElementById('J_index_tab_content_0');
    const content1 = document.getElementById('J_index_tab_content_1');
    
    // 定义状态变量：0表示显示content_0，1表示显示content_1
    let currentState = 0;
    
    // 初始化显示状态
    function updateContentDisplay() {
        if (content0 && content1) {
            if (currentState === 0) {
                content0.style.display = 'flex';
                content1.style.display = 'none';
            } else if (currentState === 1) {
                content0.style.display = 'none';
                content1.style.display = 'flex';
            }
        }
    }
    
    // 初始化显示
    updateContentDisplay();
    
    // 绑定子标签项点击事件的函数
    function bindSubTabEvents(contentElement) {
        if (contentElement) {
            const tabItems = contentElement.querySelectorAll('.sub-tabs .tab-nav-item');
            tabItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    tabItems.forEach(tab => {
                        tab.classList.remove('current');
                    });
                    
                    this.classList.add('current');
                });
            });
        }
    }
    
    // 初始化子标签事件
    bindSubTabEvents(content0);
    bindSubTabEvents(content1);
    
    // 为每个主标签项添加点击事件监听器
    tabNavItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有标签项的current类
            tabNavItems.forEach(tab => {
                tab.classList.remove('current');
            });
            
            // 为当前点击的标签项添加current类
            this.classList.add('current');
            
            // 更新状态
            currentState = index;
            
            // 更新内容显示
            updateContentDisplay();
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {

    const tabItems = document.querySelectorAll('.sub-tabs .tab-nav-item');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            tabItems.forEach(tab => {
                tab.classList.remove('current');
            });
            
            this.classList.add('current');
        });
    });
});

// 实现标签点击切换功能和媒体内容联动
document.addEventListener('DOMContentLoaded', function() {
    // 获取主标签项
    const tabNavItems = document.querySelectorAll('.primary-tabs .tab-nav-item');
    
    // 获取两个内容容器
    const content0 = document.getElementById('J_index_tab_content_0');
    const content1 = document.getElementById('J_index_tab_content_1');
    
    // 切换媒体显示
    function switchMediaDisplay(tabIndex) {
        // 隐藏所有媒体元素
        const allMediaElements = document.querySelectorAll('.preview-video [data-tab]');
        allMediaElements.forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });
        
        // 显示当前tab对应的媒体元素
        const currentMedia = document.querySelector(`.preview-video [data-tab="${tabIndex}"]`);
        if (currentMedia) {
            currentMedia.classList.add('active');
            currentMedia.style.display = 'block';
        }
    }
    
    // 绑定子tab事件
    function bindSubTabEvents(contentElement, baseIndex) {
        if (contentElement) {
            const tabItems = contentElement.querySelectorAll('.sub-tabs .tab-nav-item');
            tabItems.forEach((item, index) => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // 移除同级tab项的current类
                    tabItems.forEach(tab => {
                        tab.classList.remove('current');
                    });
                    
                    // 为当前点击的tab项添加current类
                    this.classList.add('current');
                    
                    // 计算全局tab索引
                    const globalTabIndex = baseIndex + index;
                    
                    // 切换媒体显示
                    switchMediaDisplay(globalTabIndex);
                });
            });
        }
    }
    
    // 重置子标签到第一个选项
    function resetSubTabsToFirst(contentElement) {
        if (contentElement) {
            const tabItems = contentElement.querySelectorAll('.sub-tabs .tab-nav-item');
            // 设置第一个子标签为current，移除其他子标签的current类
            tabItems.forEach((tab, index) => {
                if (index === 0) {
                    tab.classList.add('current');
                } else {
                    tab.classList.remove('current');
                }
            });
        }
    }
    
    // 显示指定内容区域
    function showContent(contentToShow, contentToHide, activeTabIndex) {
        if (contentToShow && contentToHide) {
            // 使用CSS类来控制显示/隐藏
            contentToShow.classList.add('active');
            contentToHide.classList.remove('active');
            
            // 重置子标签到第一个选项
            resetSubTabsToFirst(contentToShow);
            
            // 显示对应的媒体内容
            switchMediaDisplay(activeTabIndex);
        }
    }
    
    // 为每个主标签项添加点击事件监听器
    tabNavItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有标签项的current类
            tabNavItems.forEach(tab => {
                tab.classList.remove('current');
            });
            
            // 为当前点击的标签项添加current类
            this.classList.add('current');
            
            // 根据点击的标签索引切换内容
            if (index === 0) {
                // 点击"使用指南"
                showContent(content0, content1, 0);
            } else if (index === 1) {
                // 点击"素材资产"
                showContent(content1, content0, 5);
            }
        });
    });
    
    // 初始化子标签事件
    bindSubTabEvents(content0, 0);
    bindSubTabEvents(content1, 5);
    
    // 初始化显示第一个内容区域
    if (content0 && content1) {
        content0.classList.add('active');
        content1.classList.remove('active');
        // 重置第一个内容区域的子标签
        resetSubTabsToFirst(content0);
        // 显示第一个媒体内容
        switchMediaDisplay(0);
    }
});