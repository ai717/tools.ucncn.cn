/**
 * 不烧心免费工具 (NoHeartburn Tools) - 公共脚本基座
 * 纯原生 JS 实现，零外部依赖，极速轻巧
 */

(function () {
  'use strict';

  // 全局命名空间
  window.CleanTools = window.CleanTools || {};

  // 1. 简易吐司通知 (Toast)
  function showToast(message, duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🌿</span> <span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  }

  // 2. 剪贴板复制工具
  async function copyText(text, successMsg = '已复制到剪贴板') {
    if (!text) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showToast(successMsg);
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          showToast(successMsg);
          return true;
        }
      }
    } catch (err) {
      console.error('复制失败:', err);
      showToast('复制失败，请手动选取复制');
      return false;
    }
  }

  // 3. HTML 安全转义
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 4. 模态弹窗控制
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 5. 顶栏滚动阴影微动效
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 6. 大厅工具筛选与搜索初始化
  function initLobbySearch() {
    const searchInput = document.getElementById('tool-search');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const toolCards = document.querySelectorAll('.tool-card');
    const emptyState = document.getElementById('empty-state');

    if (!searchInput && categoryTabs.length === 0) return;

    let currentCategory = 'all';
    let currentQuery = '';

    function filterTools() {
      let visibleCount = 0;
      const query = currentQuery.trim().toLowerCase();

      toolCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
        const desc = (card.querySelector('.tool-card-desc')?.textContent || '').toLowerCase();

        const matchCategory = (currentCategory === 'all' || category === currentCategory);
        const matchQuery = !query || name.includes(query) || keywords.includes(query) || desc.includes(query);

        if (matchCategory && matchQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    // 搜索输入监听
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value;
        filterTools();
      });

      // 快捷键 '/' 聚焦搜索框
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
          const tagName = document.activeElement.tagName.toLowerCase();
          if (tagName !== 'input' && tagName !== 'textarea') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
          }
        }
        if (e.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.blur();
        }
      });
    }

    // 分类点击监听
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category') || 'all';
        filterTools();
      });
    });
  }

  // 7. 初始化通用弹窗事件（点击背景遮罩或关闭按钮关闭）
  function initModalListeners() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }

  // 页面加载完成后统一初始化
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initLobbySearch();
    initModalListeners();
  });

  // 导出到全局
  window.CleanTools = {
    showToast,
    copyText,
    escapeHTML,
    openModal,
    closeModal
  };
})();
