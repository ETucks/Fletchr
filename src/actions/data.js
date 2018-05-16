import 'whatwg-fetch';
// import { decrementProgress, incrementProgress } from './progress';

// Action Creators
export const addTaskSuccess = json => ({ type: 'ADD_TASK', json });

// Add New Task
function LocalDB() {
  const DBName = 'TaskDB';
  const that = {};
  let idb = null;
  const init = () => {
    const promise = new Promise((resolve) => {
      const open = window.indexedDB.open(DBName, 1);
      open.onupgradeneeded = () => {
        idb = open.result;
        idb.createObjectStore(DBName, { keyPath: 'date' });
      };
      open.onsuccess = () => {
        idb = open.result;
        resolve(true);
      };
    });
    return promise;
  };
  const createTask = (text) => {
    const promise = new Promise((resolve) => {
      const tx = idb.transaction(DBName, 'readwrite');
      const store = tx.objectStore(DBName);
      store.add({ date: new Date(), text })
        .onsuccess = (event) => {
          resolve(event.target.result);
        };
    });
    return promise;
  };
  const deleteTask = (ByDate) => {
    const promise = new Promise((resolve) => {
      const tx = idb.transaction(DBName, 'readwrite');
      const store = tx.objectStore(DBName);
      store.delete(ByDate);
      tx.oncomplete = (e) => {
        resolve(e.target.result);
      };
    });
    return promise;
  };
  const getTasks = () => {
    const promise = new Promise((resolve) => {
      const tx = idb.transaction(DBName, 'readonly');
      const store = tx.objectStore(DBName);
      const TaskList = [];
      store.openCursor().onsuccess = (event) => {
        const cur = event.target.result;
        if (cur) {
          TaskList.push(cur.value);
          cur.continue();
        } else {
          resolve(TaskList);
        }
      };
    });
    return promise;
  };
  const close = () => {
    idb.close();
  };
  that.init = init;
  that.close = close;
  that.getAll = getTasks;
  that.createTask = createTask;
  that.deleteTask = deleteTask;
  return that;
}

export default LocalDB();
