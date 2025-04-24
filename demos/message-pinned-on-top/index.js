
TCIC.SDK.instance.subscribeState(TCIC.TMainState.Joined_Class, (status) => {
    if(status){
        const injectedMap = new Map();

        // 创建公告 DOM 元素
        function createDemoBanner() {
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-demo-pinned-banner';
            wrapper.style.cssText = `
      display: flex;
      align-items: center;
      background: linear-gradient(90deg, #d2ffb3 0%, #d2ffcb 100%);
      border-radius: 8px;
      padding: 8px 12px;
      margin: 8px;
      font-size: 14px;
      color: #333;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      cursor: pointer;
    `;

            const tag = document.createElement('span');
            tag.textContent = '公告';
            tag.style.cssText = `
      background-color: #b3f264;
      color: #222;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
      margin-right: 8px;
      font-size: 12px;
    `;

            const message = document.createElement('span');
            message.textContent = '各位同学请注意，第三周的练习作业需要在本周日之前提交～';

            const arrow = document.createElement('span');
            arrow.textContent = '▼';
            arrow.style.cssText = `
      margin-left: auto;
      font-size: 12px;
      color: #666;
    `;

            wrapper.appendChild(tag);
            wrapper.appendChild(message);
            wrapper.appendChild(arrow);

            wrapper.onclick = () => {
                alert('你点击了置顶公告！');
            };

            return wrapper;
        }

        function injectToAllSlots() {
            const slots = document.querySelectorAll('#im-area-pinned-on-top[data-slot="im-pinned"]');
            slots.forEach(slot => {
                if (!injectedMap.has(slot)) {
                    const banner = createDemoBanner();
                    slot.appendChild(banner);
                    injectedMap.set(slot, banner);
                }
            });

            injectedMap.forEach((banner, slot) => {
                if (!document.body.contains(slot)) {
                    injectedMap.delete(slot);
                }
            });
        }

        injectToAllSlots();

        const observer = new MutationObserver(() => {
            injectToAllSlots();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 可选：暴露销毁函数供调试或组件卸载时清理
        window.__destroyDemoPinnedObserver__ = () => {
            observer.disconnect();
            injectedMap.forEach((banner, slot) => {
                banner.remove();
            });
            injectedMap.clear();
        };
    }
});
