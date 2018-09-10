<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon @click="back">
        <v-icon color="blue">fas fa-angle-left</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="toolbar-title-centered">{{ user.userName }}</v-toolbar-title>
      <v-toolbar-side-icon @click="editoUser">
        <v-icon color="blue">fas fa-user</v-icon>
      </v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout row wrap>
         <v-flex @click="updateMonthlyContent(-1)" class="txt txt-month" xs3>
           先月
         </v-flex>
         <v-flex class="txt txt-date" xs6>
           {{ this.selectedDate.year }}  年 {{ this.selectedDate.month }} 月
         </v-flex>
         <v-flex @click="updateMonthlyContent(+1)" class="txt txt-month" xs3>
           翌月
         </v-flex>
       </v-layout>
      <v-data-table
        :items="monthlyData"
        hide-headers
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.day }} 日</td>
            <td>{{ props.item.startHour }} : {{ props.item.startMinute }} ~ {{ props.item.endHour }} : {{ props.item.endMinute }}</td>
          </tr>
        </template>
      </v-data-table>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      userData: {},
      currentUser: {},
      selectedDate: {
        month: '',
        year: ''
      },
      monthlyData: []
    }
  },

  mounted () {
    let date = new Date()
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    this.selectedDate.month = today.getMonth() + 1
    this.selectedDate.year = today.getFullYear()

    this.currentUser = this.ncmb.User.getCurrentUser()

    if (this.currentUser) {
      this.ncmb.User.fetchById(this.$route.params.id)
        .then(user => {
          this.user = user
          this.getMonthlyData(this.user.objectId, date)
        })
        .catch(err => {
          console.log(err)
          alert('ユーザーデータを取得できませんでした')
        })
    }
  },

  methods: {
    editoUser () {
      this.$router.push(`/user/edit/${this.user.objectId}`)
    },
    back () {
      this.$router.go(-1)
    },
    createMonthlyRecords () {
      this.monthlyData = []

      this.userData.forEach(data => {
        // 1日分のデータを分解・整形
        let startTime = new Date(data.get('startTime').iso)
        let day = startTime.getDate()
        let startHour = this.zeroPad(startTime.getHours())
        let startMinute = this.zeroPad(startTime.getMinutes())
        let endTime
        let endHour = '--'
        let endMinute = '--'
        let startMonth = startTime.getMonth() + 1
        let startYear = startTime.getFullYear()

        if (data.get('endTime')) {
          endTime = new Date(data.get('endTime').iso)
          endHour = this.zeroPad(endTime.getHours())
          endMinute = this.zeroPad(endTime.getMinutes())
        }

        this.monthlyData.push({
          day,
          startMonth,
          startYear,
          startTime,
          startHour,
          startMinute,
          endTime,
          endHour,
          endMinute
        })
      })

      this.monthlyData = this.monthlyData.filter(item =>
        item.startMonth === this.selectedDate.month && item.startYear === this.selectedDate.year
      )
    },
    getMonthlyData (objectId, date) {
      let currentMonth = new Date(date.getFullYear(), date.getMonth())
      let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1)

      let TimeCard = this.ncmb.DataStore('TimeCard')
      TimeCard
        .relatedTo(this.user, 'timeCard')
        .greaterThanOrEqualTo('startTime', currentMonth)
        .lessThan('startTime', nextMonth)
        .order('startTime')
        .fetchAll()
        .then(results => {
          this.userData = results
          this.createMonthlyRecords()
        })
    },
    updateMonthlyContent (offset) {
      if ((this.selectedDate.month + offset) % 13 === 0) {
        this.selectedDate.month = (13 + offset) % 13
        this.selectedDate.year += offset
      } else {
        this.selectedDate.month += offset
      }

      this.createMonthlyRecords()
    },
    zeroPad (num) {
      return ('0' + num).slice(-2)
    }
  }
}
</script>

<style lang="scss" scoped>
.txt {
  align-items: center;
  justify-content: center;
  display: flex;

  &-date {
    font-size: 1.6em;
    font-weight: bold;
    height: 50px;
    padding-top: 0;
  }

  &-month {
    color: #2195f3;
  }
}
</style>
