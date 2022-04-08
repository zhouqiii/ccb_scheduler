import localStore from '../../components/Dag/module/util/localStorage';

// Get the project currently clicked
const projectId = localStore.getItem('projectId');
const projectName = localStore.getItem('projectName');

export default {
  // name
  name: '',
  // description
  description: '',
  // Node global parameter
  globalParams: [],
  // Node information
  tasks: [],
  // Node cache information, cache the previous input
  cacheTasks: {},
  // Timeout alarm
  timeout: 0,
  // tenant id
  tenantId: -1,
  // Node location information
  locations: {},
  // Node-to-node connection
  connects: [],
  // Running sign
  runFlag: '',
  // Whether to edit
  isEditDag: false,
  // Current project id
  projectId,
  // Current project name
  projectName: projectName || '',
  // Whether to update the process definition
  syncDefine: true,
  // tasks processList
  processListS: [],
  // projectList
  projectListS: [],
  // tasks resourcesList
  resourcesListS: [],
  // tasks resourcesListJar
  resourcesListJar: [],
  // tasks resourcesListPy
  resourcesListPy: [],
  // tasks datasource Type
  // dsTypeListS: [
  //   {
  //     id: 0,
  //     code: 'MYSQL',
  //     disabled: false
  //   },
  //   {
  //     id: 1,
  //     code: 'POSTGRESQL',
  //     disabled: false
  //   },
  //   {
  //     id: 2,
  //     code: 'HIVE',
  //     disabled: false
  //   },
  //   {
  //     id: 3,
  //     code: 'SPARK',
  //     disabled: false
  //   },
  //   {
  //     id: 4,
  //     code: 'CLICKHOUSE',
  //     disabled: false
  //   },
  //   {
  //     id: 5,
  //     code: 'ORACLE',
  //     disabled: false
  //   },
  //   {
  //     id: 6,
  //     code: 'SQLSERVER',
  //     disabled: false
  //   },
  //   {
  //     id: 7,
  //     code: 'DB2',
  //     disabled: false
  //   }
  // ],
  // Alarm interface
  notifyGroupListS: [],
  // Process instance list{ view a single record }
  // instanceListS: [],
  // Operating state
  isDetails: false,
  startup: {

  },
};
