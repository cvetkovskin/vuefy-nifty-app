<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon @click="logout">
        <v-icon color="blue">fa fa-sign-out-alt</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="toolbar-title-centered">出退勤データ登録</v-toolbar-title>
      <v-toolbar-side-icon @click="goToUsers">
        <v-icon color="blue" v-show="userAdmin">fa fa-list-alt</v-icon>
      </v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container class="today-date centered"> {{ today_date }}
      </v-container>
      <v-container class="dashboard centered">
        <v-layout class="centered" row wrap>
         <v-flex xs2>
           <v-btn color="blue" class="btn" :disabled="!canCheckin" @click="saveStartTime">出勤</v-btn>
         </v-flex>
         <v-flex xs6>
           {{ startTime }}
         </v-flex>
       </v-layout>
       <v-layout class="centered" row wrap>
        <v-flex xs2>
          <v-btn color="blue" class="btn" :disabled="!canCheckout" @click="saveEndTime">退勤</v-btn>
        </v-flex>
        <v-flex xs6>
          {{ endTime }}
        </v-flex>
      </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  mounted () {
    this.checkRole()

    let date = new Date()
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    this.today_date = today.getFullYear() + '年' +
        (today.getMonth() + 1) + '月' +
        today.getDate() + '日' +
        '(' + '日月火水木金土'[today.getDay()] + ')'
  },
  data () {
    return {
      today_date: '',
      startTime: '--:--',
      endTime: '--:--',
      canCheckin: true,
      canCheckout: false,
      userAdmin: false,
      currentUser: '',
      startClickTime: ''
    }
  },
  methods: {
    checkRole () {
    // ロール情報を取得
      this.ncmb.Role
        .equalTo('roleName', 'admin')
        .fetch()
        .then(role => {
          // adminロール内ユーザーの取得
          role.fetchUser()
            .then(adminUsers => {
              // ログインユーザーがadminロールに所属しているかどうか
              let loggedInUser = this.ncmb.User.getCurrentUser()
              this.ncmb.User.fetchById(loggedInUser.get('objectId'))
                .then(result => {
                  this.currentUser = result
                  for (let i = 0; i < adminUsers.length; i++) {
                    if (this.currentUser && this.currentUser.objectId === adminUsers[i].objectId) {
                      this.userAdmin = true
                      break
                    }
                  }
                })
            })
        })
    },
    goToUsers () {
      this.$router.push('/users')
    },
    logout () {
      this.ncmb.User.logout()
      alert('ログアウトしました')
      this.$router.push('/')
    },
    setTimeCardAcl () {
      let acl = new this.ncmb.Acl()
      acl.setUserReadAccess(this.currentUser, true) // 本人の読み込みを許可
        .setUserWriteAccess(this.currentUser, true) // 本人の書き込みを許可
        .setRoleReadAccess('admin', true) // adminロールの読み込みを許可

      return acl
    },
    saveStartTime () {
      this.startClickTime = new Date()

      // 出退勤データをメモリ上に作成
      let TimeCard = this.ncmb.DataStore('TimeCard')
      let timeCard = new TimeCard()
      let acl = this.setTimeCardAcl()
      timeCard.set('startTime', this.startClickTime)
        .set('acl', acl)

      // リレーションの参照先として出退勤データを設定
      let relation = new this.ncmb.Relation()
      relation.add(timeCard)

      // ログイン中のユーザーに出退勤データを関連付ける
      this.currentUser.set('timeCard', relation)
        .update()
        .then(result => {
          this.canCheckin = !this.canCheckin
          this.canCheckout = !this.canCheckout
          this.startTime = this.zeroPad(this.startClickTime.getHours()) + ':' + this.zeroPad(this.startClickTime.getMinutes())
          alert('登録しました')
        })
        .catch(error => {
          alert(JSON.stringify(error))
        })
    },
    saveEndTime () {
      let date = new Date()
      let TimeCard = this.ncmb.DataStore('TimeCard')

      TimeCard.relatedTo(this.currentUser, 'timeCard')
        .equalTo('startTime', this.startClickTime)
        .fetchAll()
        .then(results => {
          let result = results[0]
          result.set('endTime', date)
            .update()
            .then(() => {
              this.canCheckout = !this.canCheckout
              this.endTime = this.zeroPad(date.getHours()) + ':' + this.zeroPad(date.getMinutes())
              alert('登録しました')
            })
        })
        .catch(error => {
          alert('登録に失敗しました', JSON.stringify(error))
        })
    },
    zeroPad (num) {
      return ('0' + num).slice(-2)
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    font-weight: 400;
    user-select: none;
    font-size: 17px;
    line-height: 32px;
    letter-spacing: 0;
    color: white;
    border: 0 solid currentcolor;
    border-radius: 3px;
    margin-bottom: 30px;
    min-width: 50px;
  }

  .dashboard {
    margin-top: 20px;
  }

  .today-date {
    font-size: 1.6em;
    font-weight: bold;
    height: 50px;
    margin-top: 44px;
    padding-top: 0;
  }
</style>
