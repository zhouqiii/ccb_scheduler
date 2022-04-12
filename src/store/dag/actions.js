/* eslint-disable no-unused-vars */
import _ from 'lodash';
// import request from '../../utils/request';
import { tasksState } from '../../components/Dag/config';
import json from '../../mock/index.json';

const {
  taskListByProcessId,
  selectById,
  processList,
  queryProjectList,
  resourceList,
  jarList,
  allGroup,
  tenantList,
  selectByIdInstance,
  viewTree,
  viewGantt,
  notifyGroupList,
  logList,
  taskInstanceList,
} = json.data;

// delete 'definitionList' from tasks
const deleteDefinitionList = (tasks) => {
  const newTasks = [];
  tasks.forEach((item) => {
    const newItem = { ...item };
    if (newItem.dependence && newItem.dependence.dependTaskList) {
      newItem.dependence.dependTaskList.forEach((dependTaskItem) => {
        if (dependTaskItem.dependItemList) {
          dependTaskItem.dependItemList.forEach((dependItem) => {
            Reflect.deleteProperty(dependItem, 'definitionList');
          });
        }
      });
    }
    newTasks.push(newItem);
  });
  return newTasks;
};

export default {
  /**
   *  Task status acquisition
   */
  getTaskState({ state }, payload) {
    return new Promise((resolve, reject) => {
      // io.get(`projects/${state.projectName}/instance/task-list-by-process-id`, {
      //   processInstanceId: payload
      // }, res => {
      //   const arr = _.map(res.data.taskList, v => {
      //     return _.cloneDeep(_.assign(tasksState[v.state], {
      //       name: v.name,
      //       stateId: v.id,
      //       dependentResult: v.dependentResult
      //     }))
      //   })
      //   resolve({
      //     list: arr,
      //     processInstanceState: res.data.processInstanceState,
      //     taskList: res.data.taskList
      //   })
      // }).catch(e => {
      //   reject(e)
      // })
      const arr = _.map(taskListByProcessId.data.taskList, (v) => {
        _.cloneDeep(_.assign(tasksState[v.state], {
          name: v.name,
          stateId: v.id,
          dependentResult: v.dependentResult,
        }));
      });
      resolve({
        list: arr,
        processInstanceState: taskListByProcessId.data.processInstanceState,
        taskList: taskListByProcessId.data.taskList,
      });
    });
  },
  /**
   * Verify that the DGA map name exists
   */
  verifDAGName({ state }, payload) {
    return new Promise((resolve, reject) => {
      state.name = payload;
      resolve({ msg: '成功' });
    });
  },

  /**
   * Get process definition DAG diagram details
   */
  getProcessDetails({ state }, payload) {
    return new Promise((resolve, reject) => {
      state.name = selectById.data.name;
      // description
      state.description = selectById.data.description;
      // connects
      state.connects = JSON.parse(selectById.data.connects);
      // locations
      state.locations = JSON.parse(selectById.data.locations);
      // Process definition
      const processDefinitionJson = JSON.parse(selectById.data.processDefinitionJson);
      // tasks info
      state.tasks = processDefinitionJson.tasks;
      // tasks cache
      state.cacheTasks = {};
      processDefinitionJson.tasks.forEach((v) => {
        state.cacheTasks[v.id] = v;
      });
      // global params
      state.globalParams = processDefinitionJson.globalParams;
      // timeout
      state.timeout = processDefinitionJson.timeout;
      state.tenantId = processDefinitionJson.tenantId;
      resolve(selectById.data);
    });
  },

  /**
   * Get the process instance DAG diagram details
   */
  getInstancedetail({ state }, payload) {
    return new Promise((resolve, reject) => {
      // name
      state.name = selectByIdInstance.data.name;
      // desc
      state.description = selectByIdInstance.data.description;
      // connects
      state.connects = JSON.parse(selectByIdInstance.data.connects);
      // locations
      state.locations = JSON.parse(selectByIdInstance.data.locations);
      // process instance
      const processInstanceJson = JSON.parse(selectByIdInstance.data.processInstanceJson);
      // tasks info
      state.tasks = processInstanceJson.tasks;
      // tasks cache
      state.cacheTasks = {};
      processInstanceJson.tasks.forEach((v) => {
        state.cacheTasks[v.id] = v;
      });
      // global params
      state.globalParams = processInstanceJson.globalParams;
      // timeout
      state.timeout = processInstanceJson.timeout;
      state.tenantId = processInstanceJson.tenantId;
      // startup parameters
      state.startup = _.assign(state.startup, _.pick(selectByIdInstance.data, ['commandType', 'failureStrategy', 'processInstancePriority', 'workerGroup', 'warningType', 'warningGroupId', 'receivers', 'receiversCc']));
      state.startup.commandParam = JSON.parse(selectByIdInstance.data.commandParam);
      resolve(selectByIdInstance.data);
    });
  },
  /**
   * Get a list of process definitions (sub-workflow usage is not paged)
   */
  getProcessList({ state }, payload) {
    return new Promise((resolve, reject) => {
      if (state.processListS.length) {
        resolve();
        return;
      }
      state.processListS = processList.data;
      resolve(processList.data);
    });
  },
  /**
   * Get a list of project
   */
  getProjectList({ state }, payload) {
    return new Promise((resolve, reject) => {
      if (state.projectListS.length) {
        resolve();
        return;
      }
      state.projectListS = queryProjectList.data;
      resolve(queryProjectList.data);
    });
  },
  /**
   * Called before the process definition starts
   */
  getStartCheck({ state }, payload) {
    return new Promise((resolve, reject) => {
      resolve({ msg: '成功' });
    });
  },
  /**
   * get resources
   */
  getResourcesList({ state }) {
    return new Promise((resolve, reject) => {
      if (state.resourcesListS.length) {
        resolve();
        return;
      }
      state.resourcesListS = resourceList.data;
      resolve(resourceList.data);
      // io.get('resources/list', {
      //   type: 'FILE'
      // }, res => {
      //   state.resourcesListS = res.data
      //   resolve(res.data)
      // }).catch(res => {
      //   reject(res)
      // })
    });
  },
  /**
   * get jar
   */
  getResourcesListJar({ state }, payload) {
    return new Promise((resolve, reject) => {
      if (state.resourcesListJar.length) {
        resolve();
        return;
      }
      if (payload) {
        state.resourcesListPy = jarList.data;
      } else {
        state.resourcesListJar = jarList.data;
      }
      resolve(jarList.data);
    });
  },
  /**
   * get worker groups all
   */
  getWorkerGroupsAll({ state }, payload) {
    return new Promise((resolve, reject) => {
      let list = allGroup.data;
      if (list.length > 0) {
        list = list.map((item) => ({
          id: item,
          name: item,
        }));
      } else {
        list.unshift({
          id: 'default',
          name: 'default',
        });
      }
      state.workerGroupsListAll = list;
      resolve(list);
    });
  },
  /**
   * Tenant list - no paging
   */
  getTenantList({ state }, payload) {
    return new Promise((resolve, reject) => {
      const list = tenantList.data;
      const result = list.some((item) => {
        if (item.id === -1) {
          return true;
        }
        return false;
      });
      if (!result) {
        list.unshift({
          id: -1,
          tenantName: 'default',
        });
      }
      state.tenantAllList = list;
      resolve(list);
    });
  },
  /**
   * tree chart
   */
  getViewTree({ state }, payload) {
    return new Promise((resolve, reject) => {
      resolve(viewTree.data);
    });
  },

  /**
   * gantt chart
   */
  getViewGantt({ state }, payload) {
    return new Promise((resolve, reject) => {
      resolve(viewGantt.data);
    });
  },
  /**
   * Get alarm list
   */
  getNotifyGroupList({ state }, payload) {
    return new Promise((resolve, reject) => {
      state.notifyGroupListS = _.map(notifyGroupList.data, (v) => ({
        id: v.id,
        code: v.groupName,
        disabled: false,
      }));
      resolve(_.cloneDeep(state.notifyGroupListS));
    });
  },

  /**
   * Process definition startup interface
   */
  processStart({ state }, payload) {
    return new Promise((resolve, reject) => {
      resolve({ msg: '成功' });
    });
  },
  /**
   * View log
   */
  getLog({ state }, payload) {
    return new Promise((resolve, reject) => {
      resolve(logList);
    });
  },
  /**
   * Query task instance list
   */
  getTaskInstanceList({ state }, payload) {
    return new Promise((resolve, reject) => {
      resolve(taskInstanceList.data);
    });
  },

//   /**
//    * Update process definition status
//    */
//   editProcessState ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/process/release`, {
//         processId: payload.processId,
//         releaseState: payload.releaseState
//       }, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//   /**
//    * Update process instance status
//    */
//   editExecutorsState ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/executors/execute`, {
//         processInstanceId: payload.processInstanceId,
//         executeType: payload.executeType
//       }, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//
//   /**
//    * Get process definition DAG diagram details
//    */
//   copyProcess ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/process/copy`, {
//         processId: payload.processId
//       }, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//   /**
//    * Create process definition
//    */
//   saveDAGchart ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       const data = {
//         globalParams: state.globalParams,
//         tasks: deleteDefinitionList(state.tasks),
//         tenantId: state.tenantId,
//         timeout: state.timeout
//       }
//       io.post(`projects/${state.projectName}/process/save`, {
//         processDefinitionJson: JSON.stringify(data),
//         name: _.trim(state.name),
//         description: _.trim(state.description),
//         locations: JSON.stringify(state.locations),
//         connects: JSON.stringify(state.connects)
//       }, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Process definition update
//    */
//   updateDefinition ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       const data = {
//         globalParams: state.globalParams,
//         tasks: deleteDefinitionList(state.tasks),
//         tenantId: state.tenantId,
//         timeout: state.timeout
//       }
//       io.post(`projects/${state.projectName}/process/update`, {
//         processDefinitionJson: JSON.stringify(data),
//         locations: JSON.stringify(state.locations),
//         connects: JSON.stringify(state.connects),
//         name: _.trim(state.name),
//         description: _.trim(state.description),
//         id: payload
//       }, res => {
//         resolve(res)
//         state.isEditDag = false
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Process instance update
//    */
//   updateInstance ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       const data = {
//         globalParams: state.globalParams,
//         tasks: state.tasks,
//         tenantId: state.tenantId,
//         timeout: state.timeout
//       }
//       io.post(`projects/${state.projectName}/instance/update`, {
//         processInstanceJson: JSON.stringify(data),
//         locations: JSON.stringify(state.locations),
//         connects: JSON.stringify(state.connects),
//         processInstanceId: payload,
//         syncDefine: state.syncDefine
//       }, res => {
//         resolve(res)
//         state.isEditDag = false
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//   /**
//    * Get a list of process definitions by project id
//    */
//   getProcessByProjectId ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/process/queryProcessDefinitionAllByProjectId`,
//  payload, res => {
//         resolve(res.data)
//       }).catch(res => {
//         reject(res)
//       })
//     })
//   },
//   /**
//    * get datasource
//    */
//   getDatasourceList ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get('datasources/list', {
//         type: payload
//       }, res => {
//         resolve(res)
//       }).catch(res => {
//         reject(res)
//       })
//     })
//   },
//
//
//   /**
//    * Get process instance
//    */
//   getProcessInstance ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/instance/list-paging`, payload, res => {
//         state.instanceListS = res.data.totalList
//         resolve(res.data)
//       }).catch(res => {
//         reject(res)
//       })
//     })
//   },
//
//   /**
//    * Get the process instance id according to the process definition id
//    * @param taskId
//    */
//   getSubProcessId ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/instance/select-sub-process`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//   /**
//    * Create timing
//    */
//   createSchedule ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/schedule/create`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Preview timing
//    */
//   previewSchedule ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/schedule/preview`, payload, res => {
//         resolve(res.data)
//         // alert(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Timing list paging
//    */
//   getScheduleList ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/schedule/list-paging`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Timing online
//    */
//   scheduleOffline ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/schedule/offline`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Timed offline
//    */
//   scheduleOnline ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/schedule/online`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Edit timing
//    */
//   updateSchedule ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.post(`projects/${state.projectName}/schedule/update`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Delete process instance
//    */
//   deleteInstance ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/instance/delete`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Batch delete process instance
//    */
//   batchDeleteInstance ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/instance/batch-delete`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Delete definition
//    */
//   deleteDefinition ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/process/delete`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Batch delete definition
//    */
//   batchDeleteDefinition ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/process/batch-delete`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * export definition
//    */
//   exportDefinition ({ state }, payload) {
//     const downloadBlob = (data, fileNameS = 'json') => {
//       if (!data) {
//         return
//       }
//       const blob = new Blob([data])
//       const fileName = `${fileNameS}.json`
//       if ('download' in document.createElement('a')) { // 不是IE浏览器
//         const url = window.URL.createObjectURL(blob)
//         const link = document.createElement('a')
//         link.style.display = 'none'
//         link.href = url
//         link.setAttribute('download', fileName)
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link) // 下载完成移除元素
//         window.URL.revokeObjectURL(url) // 释放掉blob对象
//       } else { // IE 10+
//         window.navigator.msSaveBlob(blob, fileName)
//       }
//     }
//
//     io.get(`projects/${state.projectName}/process/export`,
// {processDefinitionIds: payload.processDefinitionIds}, res => {
//       downloadBlob(res, payload.fileName)
//     }, e => {
//
//     }, {
//       responseType: 'blob'
//     })
//   },
//
//   /**
//    * Process instance get variable
//    */
//   getViewvariables ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/instance/view-variables`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Get udfs function based on data source
//    */
//   getUdfList ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get('resources/udf-func/list', payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//   /**
//    * Query task record list
//    */
//   getTaskRecordList ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get('projects/task-record/list-paging', payload, res => {
//         resolve(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Query history task record list
//    */
//   getHistoryTaskRecordList ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get('projects/task-record/history-list-paging', payload, res => {
//         resolve(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//
//   /**
//    * Query task node list
//    */
//   getProcessTasksList ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/process/gen-task-list`, payload, res => {
//         resolve(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * Get the mailbox list interface
//    */
//   getReceiver ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/executors/get-receiver-cc`, payload, res => {
//         resolve(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   getTaskListDefIdAll ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/process/get-task-list`, payload, res => {
//         resolve(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   /**
//    * remove timing
//    */
//   deleteTiming ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get(`projects/${state.projectName}/schedule/delete`, payload, res => {
//         resolve(res)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   },
//   getResourceId ({ state }, payload) {
//     return new Promise((resolve, reject) => {
//       io.get('resources/queryResource', payload, res => {
//         resolve(res.data)
//       }).catch(e => {
//         reject(e)
//       })
//     })
//   }
};
