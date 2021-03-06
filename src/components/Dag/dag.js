/* eslint-disable no-restricted-syntax */
import Vue from 'vue';
import _ from 'lodash';
import { jsPlumb } from 'jsplumb';
import JSP from './plugIn/jsPlumbHandle';
import DownChart from './plugIn/downChart';
import store from '../../store';

const v = new Vue();
/**
 * Prototype method
 */
const Dag = function () {
  this.dag = {};
  this.instance = {};
};

/**
 * init
 * @dag dag vue instance
 */
Dag.prototype.init = function ({ dag, instance }) {
  this.dag = dag;
  this.instance = instance;
};

/**
 * set init config
 */
Dag.prototype.setConfig = function (o) {
  JSP.setConfig(o);
};

/**
 * create dag
 */
Dag.prototype.create = function () {
  const self = this;
  const plumbIns = jsPlumb.getInstance();
  plumbIns.reset();
  plumbIns.ready(() => {
    JSP.init({
      dag: this.dag,
      instance: this.instance,
      options: {
        onRemoveNodes($id) {
          self.dag.removeEventModelById($id);
        },
      },
    });
    // init event
    JSP.handleEvent();
    // init draggable
    JSP.draggable();
  });
};

/**
 * Action event on the right side of the toolbar
 */
Dag.prototype.toolbarEvent = function ({ item, code, is }) {
  const self = this;
  switch (code) {
    case 'pointer':
      JSP.handleEventPointer(is);
      break;
    case 'line':
      JSP.handleEventLine(is);
      break;
    case 'remove':
      JSP.handleEventRemove();
      break;
    case 'screen':
      JSP.handleEventScreen({ item, is });
      break;
    case 'download':
      v.$modal.dialog({
        width: 350,
        closable: false,
        showMask: true,
        maskClosable: true,
        title: 'Download',
        content: 'Please confirm whether the workflow has been saved before downloading',
        ok: {
          handle() {
            DownChart.download({
              dagThis: self.dag,
            });
          },
        },
        cancel: {},
      });
      break;
    default:
      break;
  }
};

/**
 * Echo data display
 */
Dag.prototype.backfill = function (arg) {
  if (arg) {
    let locationsValue = store.state.dag.locations;
    const locationsValue1 = _.cloneDeep(store.state.dag.locations);
    const locationsValue2 = _.cloneDeep(store.state.dag.locations);
    const arr = [];
    // eslint-disable-next-line guard-for-in
    for (const i in locationsValue1) {
      const objs = {};
      objs.id = i;
      arr.push(Object.assign(objs, locationsValue1[i])); // Attributes
    }
    const tmp = [];
    for (const i in locationsValue2) {
      if (locationsValue2[i].targetarr !== '' && locationsValue2[i].targetarr.split(',').length > 1) {
        tmp.push(locationsValue2[i]);
      }
    }

    const copy = function (array) {
      const newArray = [];
      for (const item of array) {
        newArray.push(item);
      }
      return newArray;
    };

    const newArr = copy(arr);
    const getNewArr = function () {
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].targetarr !== '' && newArr[i].targetarr.split(',').length > 1) {
          newArr[i].targetarr = newArr[i].targetarr.split(',').shift();
        }
      }
      return newArr;
    };
    getNewArr();
    /**
    * @description Transform flat data into a tree structure
    * @param {Array} arr Flat data
    * @param {String} pidStr targetarr key name
    * @param {String} idStr id key name
    * @param {String} childrenStr children key name
    */
    const fommat = function ({
      arrayList, pidStr = 'targetarr', idStr = 'id', childrenStr = 'children',
    }) {
      const listOjb = {}; // Used to store objects of the form {key: obj}
      const treeList = []; // An array to store the final tree structure data
      for (let i = 0; i < arrayList.length; i++) {
        listOjb[arrayList[i][idStr]] = arrayList[i];
      }
      // Format data based on pid
      for (let j = 0; j < arrayList.length; j++) {
        // Determine if the parent exists
        const haveParent = listOjb[arrayList[j][pidStr]];
        if (haveParent) {
          // If there is no parent children field, create a children field
          // eslint-disable-next-line no-unused-expressions
          !haveParent[childrenStr] && (haveParent[childrenStr] = []);
          // Insert child in parent
          haveParent[childrenStr].push(arrayList[j]);
        } else {
          // If there is no parent, insert directly into the outermost layer
          treeList.push(arrayList[j]);
        }
      }
      return treeList;
    };
    const datas = fommat({ arrayList: newArr, pidStr: 'targetarr' });
    // Count the number of leaf nodes
    const getLeafCountTree = function (json) {
      if (!json.children) {
        // eslint-disable-next-line no-param-reassign
        json.colspan = 1;
        return 1;
      }
      let leafCount = 0;
      for (let i = 0; i < json.children.length; i++) {
        leafCount += getLeafCountTree(json.children[i]);
      }
      // eslint-disable-next-line no-param-reassign
      json.colspan = leafCount;
      return leafCount;
    };
    // Number of tree node levels
    const countTree = getLeafCountTree(datas[0]);
    const getMaxFloor = function (treeData) {
      let max = 0;
      function each(data, floor) {
        data.forEach((e) => {
          e.floor = floor;
          e.x = floor * 170;
          if (floor > max) {
            max = floor;
          }
          if (e.children) {
            each(e.children, floor + 1);
          }
        });
      }
      each(treeData, 1);
      return max;
    };
    getMaxFloor(datas);
    // The last child of each node
    let lastchildren = [];
    const forxh = function (list) {
      for (let i = 0; i < list.length; i++) {
        const chlist = list[i];
        if (chlist.children) {
          forxh(chlist.children);
        } else {
          lastchildren.push(chlist);
        }
      }
    };
    forxh(datas);
    // Get all parent nodes above the leaf node
    const treeFindPath = function (tree, func, path, n) {
      if (!tree) return [];
      for (const data of tree) {
        path.push(data.name);
        if (func(data)) return path;
        if (data.children) {
          const findChildren = treeFindPath(data.children, func, path, n);
          if (findChildren.length) return findChildren;
        }
        path.pop();
      }
      return [];
    };
    const toLine = function (data) {
      return data.reduce((arrData, {
        id, name, targetarr, x, y, children = [],
      }) => arrData.concat([{
        id, name, targetarr, x, y,
      }], toLine(children)), []);
    };
    const listarr = toLine(datas);
    const listarrs = toLine(datas);
    const dataObject = {};
    for (let i = 0; i < listarrs.length; i++) {
      delete (listarrs[i].id);
    }

    for (let a = 0; a < listarr.length; a++) {
      dataObject[listarr[a].id] = listarrs[a];
    }
    // Comparison function
    const createComparisonFunction = function (propertyName) {
      return function (object1, object2) {
        const value1 = object1[propertyName];
        const value2 = object2[propertyName];
        if (value1 < value2) {
          return -1;
        }
        if (value1 > value2) {
          return 1;
        }
        return 0;
      };
    };

    lastchildren = lastchildren.sort(createComparisonFunction('x'));

    // Coordinate value of each leaf node
    for (let a = 0; a < lastchildren.length; a++) {
      dataObject[lastchildren[a].id].y = (a + 1) * 120;
    }
    for (let i = 0; i < lastchildren.length; i++) {
      const node = treeFindPath(datas,
        (data) => data.targetarr === lastchildren[i].targetarr, [], i + 1);
      for (let j = 0; j < node.length; j++) {
        for (let k = 0; k < listarrs.length; k++) {
          if (node[j] === listarrs[k].name) {
            listarrs[k].y = (i + 1) * 120;
          }
        }
      }
    }
    for (let i = 0; i < tmp.length; i++) {
      for (const objs in dataObject) {
        if (tmp[i].name === dataObject[objs].name) {
          dataObject[objs].targetarr = tmp[i].targetarr;
        }
      }
    }
    for (let a = 0; a < lastchildren.length; a++) {
      dataObject[lastchildren[a].id].y = (a + 1) * 120;
    }
    if (countTree > 1) {
      dataObject[Object.keys(locationsValue1)[0]].y = (countTree / 2) * 120 + 50;
    }

    locationsValue = dataObject;
    const self = this;
    const plumbIns = jsPlumb.getInstance();
    plumbIns.reset();
    plumbIns.ready(() => {
      JSP.init({
        dag: this.dag,
        instance: this.instance,
        options: {
          onRemoveNodes($id) {
            self.dag.removeEventModelById($id);
          },
        },
      });
      // Backfill
      JSP.jspBackfill({
        // connects
        connects: _.cloneDeep(store.state.dag.connects),
        // Node location information
        locations: _.cloneDeep(locationsValue),
        // Node data
        largeJson: _.cloneDeep(store.state.dag.tasks),
      });
    });
  } else {
    const self = this;
    const plumbIns = jsPlumb.getInstance();
    plumbIns.reset();
    plumbIns.ready(() => {
      JSP.init({
        dag: this.dag,
        instance: this.instance,
        options: {
          onRemoveNodes($id) {
            self.dag.removeEventModelById($id);
          },
        },
      });
      // Backfill
      JSP.jspBackfill({
        // connects
        connects: _.cloneDeep(store.state.dag.connects),
        // Node location information
        locations: _.cloneDeep(store.state.dag.locations),
        // Node data
        largeJson: _.cloneDeep(store.state.dag.tasks),
      });
    });
  }
};

/**
 * Get dag storage format data
 */
Dag.prototype.saveStore = function () {
  return JSP.saveStore();
};

export default new Dag();
