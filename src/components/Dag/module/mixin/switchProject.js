import { mapState } from 'vuex'
// import { beforeProjectRoute } from '@/module/project/router'

export default {
  computed: {
    ...mapState('dag', ['projectId', 'projectName'])
  },
  watch: {
    projectId () {
      typeof this._updateProject === 'function' && this._updateProject()
    }
  },
  // beforeRouteUpdate (to, from, next) {
  //   beforeProjectRoute(to, from, next)
  // }
}
