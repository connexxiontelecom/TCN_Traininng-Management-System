<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import store from '@/state/store'
import Stat from "./widget";
import EarningReport from "./earning";
//import Sources from "./sources";
import RecentActivity from "./recent-activity";
//import RevenueLocation from "./revenue-location";
//import Chat from "./chat";
import ApprovedTrainings from './approved-trainings';
import MyTrainings from './my-trainings';
import TrainingSchedule from './training-schedule';
import TrainingAnalytics from "./training-analytics";

/**
 * Dashboard component
 */
export default {

  beforeRouteEnter(to, from, next){
    //const loggedin = store.getters['auth/loggedIn'];
    //const loggeduser = store.getters['auth/loggedInUser'];
    //console.log(loggeduser);
    //console.log(loggedin);
    next();
  },
  components: {
    Layout,
    PageHeader,
    Stat,
    EarningReport,
    MyTrainings,
    //Sources,
    RecentActivity,
    //RevenueLocation,
    //Chat,
    ApprovedTrainings,
    TrainingSchedule,
    TrainingAnalytics
  },
  data() {
    return {
      //user:{},
      title: "Dashboard",
      items: [
        {
          text: "Home"
        },
        {
          text: "Dashboard",
          active: true
        }
      ]
    };
  },
  mounted(){
    //this.user = JSON.parse(store.getters['auth/loggedInUser']);
    //console.log(this.user);
  },
  computed:{
    user() {
      let user =  JSON.parse(store.getters['auth/loggedInUser']);
      return user.user;
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div v-if="user.usertype ===  1">
      <div class="row">
        <div class="col-xl-8">
          <Stat />
          <ApprovedTrainings />
          <TrainingSchedule />
        </div>
        <div class="col-xl-4">
          <EarningReport />
          <!--        <RevenueAnalytics/>-->
          <TrainingAnalytics />
          <RecentActivity />

        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-xl-12">
          <Stat />
          <MyTrainings />
        </div>
      </div>
    </div>
  </Layout>
</template>