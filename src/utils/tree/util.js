/* eslint-disable semi */
import { formatDate } from '../filter/filter';
import { tasksState } from '../../components/Dag/config';

/**
 * Node prompt dom
 */
const rtInstancesTooltip = (data) => {
  let str = '<div style="text-align: left;word-break:break-all">';
  str += `id : ${data.id}</br>`;
  str += `host : ${data.host}</br>`;
  str += `name : ${data.name}</br>`;
  str += `state : ${data.state ? tasksState[data.state].desc : '-'}（${data.state}）</br>`;
  if (data.type) {
    str += `type : ${data.type}</br>`;
  }
  str += `startTime : ${data.startTime ? formatDate(data.startTime) : '-'}</br>`;
  str += `endTime : ${data.endTime ? formatDate(data.endTime) : '-'}</br>`;
  str += `duration : ${data.duration}</br>`;
  str += '</div>';
  return str;
};

/**
 * Calculate the maximum node length
 * Easy to calculate the width dynamically
 */
const rtCountMethod = (list) => {
  const arr = []
  // eslint-disable-next-line no-shadow
  function count(list, t) {
    let toggle = false
    list.forEach((v) => {
      if (v.children && v.children.length > 0) {
        if (!toggle) {
          toggle = true
          // eslint-disable-next-line no-param-reassign
          t += '*'
          arr.push(t)
        }
        count(v.children, t)
      }
    })
  }
  count(list, '*')
  let num = 6
  arr.forEach((v) => {
    if (v.length > num) {
      num = v.length
    }
  })
  return num
}
export {
  rtInstancesTooltip,
  rtCountMethod,
};
