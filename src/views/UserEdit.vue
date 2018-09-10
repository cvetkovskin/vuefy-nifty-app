<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon  @click="back">
        <v-icon color="blue">fas fa-angle-left</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="toolbar-title-centered" v-if="isNew">社員情報登録</v-toolbar-title>
      <v-toolbar-title class="toolbar-title-centered" v-if="!isNew">社員情報編集</v-toolbar-title>
      <v-toolbar-side-icon @click="confirmDelete">
        <v-icon color="blue" v-show="!isNew">fas fa-trash-alt</v-icon>
      </v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-toolbar card dense>
                <v-toolbar-title class="card-title">社員番号</v-toolbar-title>
              </v-toolbar>
              <v-text-field
                label="12345"
                class="remove-details"
                v-model="user.employeeNo"
                solo
              ></v-text-field>
            </v-card>
          </v-flex>

          <v-flex xs12>
            <v-card>
              <v-toolbar card dense>
                <v-toolbar-title class="card-title">ユーザー名</v-toolbar-title>
              </v-toolbar>
              <v-text-field
                label="Username"
                class="remove-details"
                v-model="user.userName"
                solo
              ></v-text-field>
            </v-card>
          </v-flex>

          <v-flex xs12>
            <v-card>
              <v-toolbar card dense>
                <v-toolbar-title class="card-title">パスワード</v-toolbar-title>
              </v-toolbar>
              <v-text-field
                label="Password"
                class="remove-details"
                v-model="user.password"
                :type="'password'"
                solo
              ></v-text-field>
            </v-card>
          </v-flex>

          <v-flex xs12 class="centered">
            <v-btn color="blue" class="white--text" @click="updateUser" v-if="!isNew">更新</v-btn>
             <v-btn color="blue" class="white--text" @click="createUser" v-if="isNew">登録</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-dialog
      v-model="deleteDialog"
      width="500"
    >

      <v-card>
        <v-toolbar card dense>
          <v-toolbar-title class="card-title">社員番号</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          削除してよろしいですか？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" flat @click="deleteUser">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        employeeNo: '',
        userName: '',
        password: ''
      },
      currentUser: {},
      deleteDialog: false
    }
  },

  computed: {
    isNew () {
      return this.$route.params.id === 'new'
    }
  },

  mounted () {
    this.currentUser = this.ncmb.User.getCurrentUser()

    if (this.currentUser && !this.isNew) {
      this.ncmb.User.fetchById(this.$route.params.id)
        .then(user => {
          this.user = user
        })
        .catch(err => {
          console.log(err)
          alert('ユーザーデータを取得できませんでした')
        })
    }
  },

  methods: {
    createUser () {
      if (!this.user.password || !this.user.userName) {
        alert('ユーザ名とパスワードを指定してください')
        return
      }

      let user = new this.ncmb.User()
      let acl = this.setUserAcl()

      // ユーザー登録実行
      user.set('userName', this.user.userName)
        .set('password', this.user.password)
        .set('employeeNo', this.user.employeeNo)
        .set('acl', acl)
        .signUpByAccount()
        .then(registUser => {
          // aclに本人を追加して、ユーザー情報更新
          let newAcl = this.setUserAcl(registUser)
          user.set('acl', newAcl)
            .update()
            .then(() => {
              alert('登録しました')
              this.back()
            })
        })
        .catch(error => {
          alert(JSON.stringify(error))
        })
    },

    updateUser () {
      if (!this.user.userName) {
        alert('ユーザ名を指定してください')
        return
      }

      this.user.update()
        .then(() => {
          alert('更新しました')
          this.back()
        })
        .catch(error => {
          alert(JSON.stringify(error))
        })
    },

    setUserAcl (currentUser) {
      let acl = new this.ncmb.Acl()
      acl.setRoleReadAccess('admin', true) // adminロールの読み込みを許可
        .setRoleWriteAccess('admin', true) // adminロールの書き込みを許可

      if (currentUser) {
        acl.setUserReadAccess(currentUser, true) // 本人の読み込みを許可
          .setUserWriteAccess(currentUser, true) // 本人の書き込みを許可
      }

      return acl
    },

    confirmDelete () {
      this.deleteDialog = true
    },

    deleteUser () {
      this.user.delete()
        .then(() => {
          alert('削除しました')
          this.$router.go(-2)
        })
        .catch(error => {
          alert(JSON.stringify(error))
        })
    },

    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .remove-details {
  .v-input__control {
    .v-input__slot {
      margin: 0;
    }

    .v-text-field__details {
      display: none;
    }
  }
}

.card-title {
  font-size: 16px;
}
</style>
