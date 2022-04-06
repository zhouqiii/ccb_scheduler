import { mapState } from 'vuex';
// import { beforeProjectRoute } from '@/module/project/router'

export default {
  computed: {
    ...mapState('dag', ['projectId', 'projectName']),
  },
  watch: {
    projectId() {},
  },
  // beforeRouteUpdate (to, from, next) {
  //   beforeProjectRoute(to, from, next)
  // }
};
