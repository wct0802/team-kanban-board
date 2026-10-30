/* 团队任务看板 - 数据层
 * 使用浏览器 localStorage 持久化，不依赖任何后端服务
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'team-kanban-board.tasks.v1';
  var STATUSES = ['todo', 'doing', 'done'];
  var PRIORITIES = ['high', 'medium', 'low'];

  var tasks = [];

  function uid() {
    return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function isValid(task) {
    return !!task
      && typeof task.id === 'string'
      && typeof task.title === 'string'
      && STATUSES.indexOf(task.status) > -1;
  }

  function load() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      tasks = Array.isArray(list) ? list.filter(isValid) : [];
    } catch (err) {
      console.warn('[TaskStore] 本地数据解析失败，已重置', err);
      tasks = [];
    }
    return tasks;
  }

  function persist() {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn('[TaskStore] 本地数据写入失败（可能是隐私模式）', err);
    }
  }

  function all() {
    return tasks.slice();
  }

  function byStatus(status) {
    return tasks.filter(function (task) {
      return task.status === status;
    });
  }

  function add(title, description) {
    var task = {
      id: uid(),
      title: String(title).trim(),
      description: String(description || '').trim(),
      status: 'todo',
      createdAt: Date.now()
    };
    tasks.push(task);
    persist();
    return task;
  }

  function remove(id) {
    var before = tasks.length;
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    if (tasks.length !== before) {
      persist();
    }
  }

  function move(id, status) {
    if (STATUSES.indexOf(status) === -1) {
      return;
    }
    var target = null;
    tasks.forEach(function (task) {
      if (task.id === id) {
        target = task;
      }
    });
    if (!target || target.status === status) {
      return;
    }
    target.status = status;
    target.updatedAt = Date.now();
    persist();
  }

  function total() {
    return tasks.length;
  }

  function clear() {
    tasks = [];
    persist();
  }

  global.TaskStore = {
    STATUSES: STATUSES,
    PRIORITIES: PRIORITIES,
    load: load,
    all: all,
    byStatus: byStatus,
    add: add,
    remove: remove,
    move: move,
    total: total,
    clear: clear
  };
})(window);
