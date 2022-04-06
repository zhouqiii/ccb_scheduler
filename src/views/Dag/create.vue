<template>
  <div class="home-main index-model">
<!--    <m-dag v-if="!isLoading"></m-dag>-->
    <m-spin :is-spin="isLoading"></m-spin>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import mDag from '../components/Dag/dag.vue'
import mSpin from '../components/spin.vue'
import disabledState from '../components/Dag/mixin/disabledState'
import switchProject from '../components/Dag/mixin/switchProject'

export default {
  name: 'create-index',
  data () {
    return {
      // loading
      isLoading: true
    }
  },
  // mixins
  mixins: [disabledState, switchProject],
  props: {},
  methods: {
    ...mapMutations('dag', ['resetParams']),
    ...mapActions('dag', ['getTenantList','getWorkerGroupsAll','getProcessList','getProjectList', 'getResourcesList','getResourcesListJar','getResourcesListJar']),
    /**
     * init
     */
    init () {
      this.isLoading = true
      // Initialization parameters
      this.resetParams()
      // Promise Get node needs data
      Promise.all([
        // get process definition
        this.getProcessList(),
        // get project
        this.getProjectList(),
        // get jar
        this.getResourcesListJar(),
        this.getResourcesListJar('PYTHON'),
        // get resource
        this.getResourcesList(),
        // get worker group list
        this.getWorkerGroupsAll(),
        this.getTenantList()
      ]).then((data) => {
        this.isLoading = false
        // Whether to pop up the box?
        // Affirm.init(this.$root)
      }).catch(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    '$route': {
      deep: true,
      handler () {
        this.init()
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  components: { mSpin }
}
</script>
