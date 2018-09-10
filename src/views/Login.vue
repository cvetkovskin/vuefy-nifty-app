<template>
  <div>
    <v-toolbar app class="centered">
      <v-toolbar-title>出退勤アプリ</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout row wrap class="centered">
          <v-flex xs6 sm6 md3 class="centered">
            <v-text-field
              v-model="username"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              :type="'password'"
              v-model="password"
              label="Password"
            ></v-text-field>
            <v-btn color="info" @click="login">Login</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.ncmb.User.login(this.username, this.password)
        .then(user => {
          this.$router.push('register')
        })
        .catch(err => {
          alert(err)
        })
    }
  }
}
</script>
