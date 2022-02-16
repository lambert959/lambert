<template>
  <Layout :title="$t('menu.projects')">
    <splitpanes
      ref="splitpanes"
      class="default-theme">
      <pane min-size="20" class="ide-pane">
        <iframe class="responsive-iframe" :src="url" />
        <span class="emulator" @click="showEmulator=!showEmulator">
          {{ showEmulator?'Close Emulator':'Open Emulator' }}
        </span>
      </pane>
      <pane v-if="showEmulator">
        <span>xcb connection channel: {{ xcbChannel }} </span>
        <iframe id="myframe" class="responsive-iframe" :src="emulatorUrl" />
      </pane>
    </splitpanes>
  </Layout>
</template>

<script>
import './ide.scss'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
export default {
  components: { Splitpanes, Pane },
  data () {
    return {
      showEmulator: false,
    // emulatorUrl: 'http://172.16.2.64:6080'
    }
  },
  created () {
    console.log(`${this.url}, ${this.xcbChannel}`)
  },
  mounted () {
    console.log(this.$refs.splitpanes)
     window.onload = () => {
      let elem = document.getElementById('myframe');
      if (elem) {
        elem.focus();
      }
    },
    window.onclick = () => {
      let elem = document.getElementById('myframe');
      if (elem) {
        elem.focus();
      }
    }
  },
  methods: {
    openEmulator () {
      this.showEmulator = true
    }
  }
}
</script>
<style scoped>

</style>
