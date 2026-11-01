/* 团队任务看板 - 拖拽模块
 * 使用 HTML5 Drag and Drop API 实现任务卡片在「待办 / 进行中 / 已完成」之间移动
 */
(function (global) {
  'use strict';

  var draggingId = null;
  var DRAG_CLASS = 'is-dragging';
  var OVER_CLASS = 'column-over';

  function clearHints(root) {
    var columns = root.querySelectorAll('.column.' + OVER_CLASS);
    Array.prototype.forEach.call(columns, function (col) {
      col.classList.remove(OVER_CLASS);
    });
    var cards = root.querySelectorAll('.task.' + DRAG_CLASS);
    Array.prototype.forEach.call(cards, function (card) {
      card.classList.remove(DRAG_CLASS);
    });
  }

  function init(root, onMove) {
    if (!root) {
      return;
    }

    root.addEventListener('dragstart', function (event) {
      var card = event.target.closest ? event.target.closest('.task') : null;
      if (!card) {
        return;
      }
      draggingId = card.dataset.id;
      card.classList.add(DRAG_CLASS);
      // Firefox 必须写入数据，否则不会触发 drag 事件
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggingId);
    });

    root.addEventListener('dragend', function () {
      draggingId = null;
      clearHints(root);
    });

    var columns = root.querySelectorAll('.column');
    Array.prototype.forEach.call(columns, function (column) {
      column.addEventListener('dragover', function (event) {
        // 不阻止默认行为，浏览器会判定为「不可放置」
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        column.classList.add(OVER_CLASS);
      });

      column.addEventListener('dragleave', function (event) {
        // 在子元素之间移动时也会触发 dragleave；
        // relatedTarget 为 null（拖到窗口外）时同样需要清理高亮
        if (!event.relatedTarget || !column.contains(event.relatedTarget)) {
          column.classList.remove(OVER_CLASS);
        }
      });

      column.addEventListener('drop', function (event) {
        event.preventDefault();
        var id = draggingId || event.dataTransfer.getData('text/plain');
        var status = column.dataset.status;
        draggingId = null;
        clearHints(root);
        if (id && status) {
          onMove(id, status);
        }
      });
    });
  }

  global.KanbanDrag = { init: init };
})(window);
