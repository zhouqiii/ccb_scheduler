import actions from './actions';
import mutations from './mutations';
import state from './state';

export default {
  strict: true,
  namespaced: true,
  state,
  mutations,
  actions,
};
