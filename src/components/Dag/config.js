const toolOper = (dagThis) => {
  const disabled = !!dagThis.$store.state.dag.isDetails;
  return [
    {
      code: 'pointer',
      icon: 'el-icon-top-left',
      disable: disabled,
      desc: '拖动结点和选中项',
    },
    {
      code: 'line',
      icon: 'el-icon-sort',
      disable: disabled,
      desc: '选择线条连接',
    },
    {
      code: 'remove',
      icon: 'el-icon-delete',
      disable: disabled,
      desc: '删除选中的线或结点',
    },
    {
      code: 'download',
      icon: 'el-icon-download',
      disable: !dagThis.type,
      desc: '下载',
    },
    {
      code: 'screen',
      icon: 'el-icon-rank',
      disable: false,
      desc: '全屏',
    },
  ];
};
//
// /**
//  * Post status
//  * @id Front end definition id
//  * @desc tooltip
//  * @code Backend definition identifier
//  */
// const publishStatus = [
//   {
//     id: 0,
//     desc: '${i18n.$t('Unpublished')}',
//     code: 'NOT_RELEASE'
//   },
//   {
//     id: 1,
//     desc: '${i18n.$t('online')}',
//     code: 'ONLINE'
//   },
//   {
//     id: 2,
//     desc: '${i18n.$t('offline')}',
//     code: 'OFFLINE'
//   }
// ]
//
// /**
//  * Operation type
//  * @desc tooltip
//  * @code identifier
//  */
// const runningType = [
//   {
//     desc: '${i18n.$t('Start Process')}',
//     code: 'START_PROCESS'
//   },
//   {
//     desc: '${i18n.$t('Execute from the current node')}',
//     code: 'START_CURRENT_TASK_PROCESS'
//   },
//   {
//     desc: '${i18n.$t('Recover tolerance fault process')}',
//     code: 'RECOVER_TOLERANCE_FAULT_PROCESS'
//   },
//   {
//     desc: '${i18n.$t('Resume the suspension process')}',
//     code: 'RECOVER_SUSPENDED_PROCESS'
//   },
//   {
//     desc: '${i18n.$t('Execute from the failed nodes')}',
//     code: 'START_FAILURE_TASK_PROCESS'
//   },
//   {
//     desc: '${i18n.$t('Complement Data')}',
//     code: 'COMPLEMENT_DATA'
//   },
//   {
//     desc: '${i18n.$t('Scheduling execution')}',
//     code: 'SCHEDULER'
//   },
//   {
//     desc: '${i18n.$t('Rerun')}',
//     code: 'REPEAT_RUNNING'
//   },
//   {
//     desc: '${i18n.$t('Pause')}',
//     code: 'PAUSE'
//   },
//   {
//     desc: '${i18n.$t('Stop')}',
//     code: 'STOP'
//   },
//   {
//     desc: '${i18n.$t('Recovery waiting thread')}',
//     code: 'RECOVER_WAITTING_THREAD'
//   }
// ]

/**
 * Task status
 * @key key
 * @id id
 * @desc tooltip
 * @color color
 * @icoUnicode iconfont
 * @isSpin is loading (Need to execute the code block to write if judgment)
 */
const tasksState = {
  SUBMITTED_SUCCESS: {
    id: 0,
    desc: '提交成功',
    color: '#A9A9A9',
    icoUnicode: 'ans-icon-dot-circle',
    isSpin: false,
  },
  RUNNING_EXECUTION: {
    id: 1,
    desc: '执行中',
    color: '#0097e0',
    icoUnicode: 'ans-icon-gear',
    isSpin: true,
  },
  READY_PAUSE: {
    id: 2,
    desc: '准备暂停',
    color: '#07b1a3',
    icoUnicode: 'ans-icon-pause-solid',
    isSpin: false,
  },
  PAUSE: {
    id: 3,
    desc: '暂停',
    color: '#057c72',
    icoUnicode: 'ans-icon-pause',
    isSpin: false,
  },
  READY_STOP: {
    id: 4,
    desc: '准备停止',
    color: '#FE0402',
    icoUnicode: 'ans-icon-coin',
    isSpin: false,
  },
  STOP: {
    id: 5,
    desc: '停止',
    color: '#e90101',
    icoUnicode: 'ans-icon-stop',
    isSpin: false,
  },
  FAILURE: {
    id: 6,
    desc: '失败',
    color: '#000000',
    icoUnicode: 'ans-icon-fail-empty',
    isSpin: false,
  },
  SUCCESS: {
    id: 7,
    desc: '成功',
    color: '#33cc00',
    icoUnicode: 'ans-icon-success-empty',
    isSpin: false,
  },
  NEED_FAULT_TOLERANCE: {
    id: 8,
    desc: '需要容错',
    color: '#FF8C00',
    icoUnicode: 'ans-icon-pen',
    isSpin: false,
  },
  KILL: {
    id: 9,
    desc: 'kill',
    color: '#a70202',
    icoUnicode: 'ans-icon-minus-circle-empty',
    isSpin: false,
  },
  WAITTING_THREAD: {
    id: 10,
    desc: '等待线程',
    color: '#912eed',
    icoUnicode: 'ans-icon-sand-clock',
    isSpin: false,
  },
  WAITTING_DEPEND: {
    id: 11,
    desc: '等待分支',
    color: '#5101be',
    icoUnicode: 'ans-icon-dependence',
    isSpin: false,
  },
};

/**
 * Node type
 * @key key
 * @desc tooltip
 * @color color (tree and gantt)
 */
const tasksType = {
  SHELL: {
    desc: 'SHELL',
    color: '#646464',
  },
  SUB_PROCESS: {
    desc: 'SUB_PROCESS',
    color: '#0097e0',
  },
  PROCEDURE: {
    desc: 'PROCEDURE',
    color: '#525CCD',
  },
  SQL: {
    desc: 'SQL',
    color: '#7A98A1',
  },
  SPARK: {
    desc: 'SPARK',
    color: '#E46F13',
  },
  FLINK: {
    desc: 'FLINK',
    color: '#E46F13',
  },
  MR: {
    desc: 'MapReduce',
    color: '#A0A5CC',
  },
  PYTHON: {
    desc: 'PYTHON',
    color: '#FED52D',
  },
  DEPENDENT: {
    desc: 'DEPENDENT',
    color: '#2FBFD8',
  },
  HTTP: {
    desc: 'HTTP',
    color: '#E46F13',
  },
  DATAX: {
    desc: 'DataX',
    color: '#1fc747',
  },
  SQOOP: {
    desc: 'SQOOP',
    color: '#E46F13',
  },
  CONDITIONS: {
    desc: 'CONDITIONS',
    color: '#E46F13',
  },
};

export {
  toolOper,
  // publishStatus,
  // runningType,
  tasksState,
  tasksType,
};
