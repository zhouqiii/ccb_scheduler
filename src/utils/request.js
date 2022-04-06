import axios from 'axios';
import Vue from 'vue';
// import {
//   getParamsFromUrl,
//   isMobile,
// } from '@/utils/commonFn';

export const req = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : '/AppPrj',
  timeout: 15000,
  //   params: {
  //     txnId: `${isMobile()}CODE00001`,
  //     imei: getParamsFromUrl('imei') || '123',
  //     dns: process.env.NODE_ENV === 'development' ? '322' : '322', // 生产环境要改
  //   },
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  // },
  withCredentials: true,
});
export const request = ({
  url = '', data = {}, params = {}, method = 'post',
} = {}) => req({
  url,
  data,
  params,
  method,
});

req.interceptors.request.use((config) => {
  const configThe = config;
  configThe.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  return configThe;
}, (err) => {
  console.log(err);
});
req.interceptors.response.use((res) => {
  if (res.status === 200) {
    return res.data;
  }
  Vue.prototype.$message.error({ message: '数据请求失败,请重试！' });

  return res;
}, (error) => {
  if (error.response) {
    return Promise.reject(error.response.data.message);
  }
  Vue.prototype.$message.error({ message: '连接服务器出错,请重试！' });

  return Promise.reject(new Error('连接服务器出错, 请重试！'));
});
