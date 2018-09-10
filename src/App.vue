<template>
  <v-app>
     <router-view/>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      drawer: false
    }
  },

  methods: {
    route (path) {
      this.$router.push(path)
    }
  }
})
</script>

<style lang="scss">
body {
  background: #fafafa;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: constant(safe-area-inset-left);
  padding-left: env(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);
  padding-right: env(safe-area-inset-right);
}

.toolbar {
  &-title {
    &-centered {
      width: 100%;
      margin-left: 0!important;
      text-align: center;
    }
  }
}

.centered {
  justify-content: center;
  text-align: center;

  .v-toolbar__content{
    justify-content: center;
  }
}
</style>
