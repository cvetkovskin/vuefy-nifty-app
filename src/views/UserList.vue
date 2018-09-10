<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon @click="back">
        <v-icon color="blue">fas fa-angle-left</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="toolbar-title-centered">社員一覧</v-toolbar-title>
      <v-toolbar-side-icon @click="createNewUser">
        <v-icon color="blue">fas fa-plus</v-icon>
      </v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-data-table
        :items="users"
        hide-headers
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr @click="goToUser(props.item.objectId)">
            <td>{{ props.item.employeeNo }}</td>
            <td>{{ props.item.userName }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: [],
      currentUser: {}
    }
  },

  mounted () {
    this.currentUser = this.ncmb.User.getCurrentUser()

    if (this.currentUser) {
      this.ncmb.User
        .order('employeeNo')
        .fetchAll()
        .then(users => {
          this.users = users
        })
        .catch(err => {
          console.log(err)
          alert('ユーザーデータを取得できませんでした')
        })
    }
  },

  methods: {
    createNewUser () {
      this.$router.push(`/user/edit/new`)
    },

    goToUser (id) {
      this.$router.push(`/user/${id}`)
    },

    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
