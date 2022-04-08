import store from '../../../../store';
import router from '../../../../router';

export default {
  data() {
    return {
      router,
      store,
      isDetails: false,
    };
  },
  created() {
    this.isDetails = store.state.dag.isDetails;
    // Permissions.getAuth() ? this.store.state.dag.isDetails : true
  },
};
