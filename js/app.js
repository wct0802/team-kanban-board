/* 团队任务看板 - 应用主逻辑
 * 负责：渲染看板、新建任务、删除任务
 */
(function () {
  'use strict';

  var board = document.getElementById('board');
  var dialog = document.getElementById('task-dialog');
  var form = document.getElementById('task-form');
  var statsEl = document.getElementById('stats');
  var emptyTip = document.getElementById('empty-tip');
  var inputTitle = document.getElementById('input-title');
  var inputDesc = document.getElementById('input-desc');
  var inputPriority = document.getElementById('input-priority');
  var filterPriority = document.getElementById('filter-priority');

  var PRIORITY_TEXT = { high: '高', medium: '中', low: '低' };

  /* 任务标题/描述由用户输入，渲染前必须转义，避免 XSS 与标签破坏布局 */
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function formatTime(ts) {
    var d = new Date(ts);
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    return pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function cardHtml(task) {
    var desc = task.description
      ? '<p class="task-desc">' + escapeHtml(task.description) + '</p>'
      : '';
    return `
      <li class="task" draggable="true" data-id="${task.id}">
        <span class="badge badge-${task.priority}">${PRIORITY_TEXT[task.priority] || "中"}</span>
        <p class="task-title">${escapeHtml(task.title)}</p>
        ${desc}
        <footer class="task-foot">
          <time>${formatTime(task.createdAt)}</time>
          <button class="task-del" type="button" data-id="${task.id}" title="删除任务">×</button>
        </footer>
      </li>`;
  }

  function render() {
    TaskStore.STATUSES.forEach(function (status) {
      var list = board.querySelector('.task-list[data-status="' + status + '"]');
      var items = TaskStore.byStatus(status);
      if (filterPriority.value !== 'all') {
        items = items.filter(function (task) {
          return task.priority === filterPriority.value;
        });
      }
      list.innerHTML = items.length
        ? items.map(cardHtml).join('')
        : '<li class="task-empty">暂无任务，可从其他列拖入</li>';
      board.querySelector('[data-count="' + status + '"]').textContent = items.length;
    });
    updateStats();
  }

  function updateStats() {
    var total = TaskStore.total();
    var done = TaskStore.byStatus('done').length;
    statsEl.textContent = '共 ' + total + ' 个任务 · 已完成 ' + done + ' 个';
    emptyTip.hidden = total > 0;
  }

  function openDialog() {
    form.reset();
    inputTitle.focus();
    dialog.showModal();
  }

  document.getElementById('btn-add').addEventListener('click', openDialog);

  document.getElementById('btn-cancel').addEventListener('click', function () {
    dialog.close();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var title = inputTitle.value.trim();
    if (!title) {
      inputTitle.focus();
      return;
    }
    TaskStore.add(title, inputDesc.value, inputPriority.value);
    dialog.close();
    render();
  });

  filterPriority.addEventListener('change', render);

  board.addEventListener('click', function (event) {
    var btn = event.target.closest('.task-del');
    if (!btn) {
      return;
    }
    if (!window.confirm('确定要删除这个任务吗？删除后不可恢复。')) {
      return;
    }
    TaskStore.remove(btn.dataset.id);
    render();
  });

  TaskStore.load();
  render();

  // 拖拽移动：drag.js 只识别拖放动作，状态更新仍交给数据层
  KanbanDrag.init(board, function (id, status) {
    TaskStore.move(id, status);
    render();
  });
})();
