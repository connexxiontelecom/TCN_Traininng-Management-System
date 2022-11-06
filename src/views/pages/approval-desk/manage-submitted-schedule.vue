<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import RecentActivity from "./recent-activity";
import appConfig from "@/app.config";
import ScheduleTable from "./submitted-schedule-table";
import store from '@/state/store'
import Multiselect from "vue-multiselect";
import {API} from "@/api";
import Vue from "vue";
import { format} from 'date-fns'

/**
 * Form-element component
 */
var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0.00"); // displaying other groupings/separators is possible, look at the docs
});
export default {
  page: {
    title: "Manage Schedule",
    meta: [{name: "description", content: appConfig.description}]
  },
  components: {Layout, PageHeader, ScheduleTable, Multiselect, RecentActivity},
  data() {
    return {
      format,
      title: "Manage Schedule",
      items: [
        {
          text: "Manage Schedule",
          href: "/"
        },
        {
          text: "Schedule",
          active: true
        }
      ],
      isError: false,
      isSuccess: false,
      isBusy: false,
      isLoading: true,
      isLoadingError: false,
      successMsg: "",
      errorMsg: "",
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      options: [
        "Alaska",
        "Hawaii",
        "California",
        "Nevada",
        "Oregon",
        "Washington",
        "Arizona",
        "Colorado",
        "Idaho",
        "Montana",
        "Nebraska",
        "New Mexico",
        "North Dakota",
        "Utah",
        "Wyoming",
        "Alabama",
        "Arkansas",
        "Illinois",
        "Iowa"
      ],
      schedules: [],
      schedulesMasterList:[],
      years: [],
      year: {value: 0, text: "All"},
      selectedSchedule: "",
      sum: "",
      currentYear: "",
      isnotsubmitted:false,
      selectedSchedules:[],
      selectedSchedule_department:"",
      approversList:[],
      filteroptions: [
        {value:0, text:"All"},
        {value:1, text:"Pending"},
      ],
      SelectedScheduleApprovals :[],
      filterValue:null,
      activityData: [
        {
          icon: "ri-edit-2-fill",
          date: "28 Apr, 2020 ",
          time: "12:07 am",
          title: "Responded to need “Volunteer Activities”"
        },
        {
          icon: "ri-user-2-fill",
          date: "21 Apr, 2020 ",
          time: "08:01 pm",
          title: "Added an interest “Volunteer Activities”"
        },
        {
          icon: "ri-bar-chart-fill",
          date: "17 Apr, 2020 ",
          time: "05:10 pm",
          title: "Responded to need “In-Kind Opportunity”"
        },
        {
          icon: "ri-calendar-2-fill",
          date: "07 Apr, 2020",
          time: "12:47 pm",
          title: "Created need “Volunteer Activities”"
        },
        {
          icon: "ri-edit-2-fill",
          date: "05 Apr, 2020 ",
          time: "03:09 pm",
          title: "Attending the event “Some New Event”"
        },
        {
          icon: "ri-user-2-fill",
          date: "02 Apr, 2020 ",
          time: "12:07 am",
          title: "Responded to need “In-Kind Opportunity”"
        }
      ]
    };
  },
  methods: {
    yearSelector({text}) {
      return `${text}`;
    },
    filterSelector({ text }){
      return `${ text }`;
    },
    filterPendingSchedules(){
      let temparray = [];
      this.schedulesMasterList.forEach((element) => {
        console.log( "Hello"+element.ts_status);
        if(element.ts_status === 2){
          console.log(true);
          temparray.push(element);
        }
      });
      this.schedules = temparray
    },
    filterChanged(){
      console.log(this.filterValue.value);
      if(this.filterValue.value === 1){
        this.filterPendingSchedules();
      }
      else{
        this.schedules = this.schedulesMasterList;
      }
    },
    periodChanged() {
      this.fetchSchedulesByPeriod();
    },
    async fetchSchedulesByPeriod() {
      this.processing();
      await API.get(`/training-schedule/get/${this.year.value}`).then(response => {
        this.completed()
        this.schedules = response.data;
        this.schedulesMasterList = response.data,
        this.sum = this.computeSum(this.schedules);
        this.isnotsubmitted = this.isNotSubmitted(this.schedules);
        console.log(response.data);
      }).catch(e => {
        this.completed()
        this.notifyLoadingError();
        console.log(e);
      })
    },

    onSelectedSchedule(rec) {
      this.selectedSchedule = rec;
      this.selectedSchedule_department = rec.department.name;


      this.approversList.forEach((element) => {
      let approver =  this.selectedSchedule.approvals.findIndex(appr => {
          return appr.approver_id === element.id;
        });

      if(approver!== -1){
        this.SelectedScheduleApprovals.push(this.selectedSchedule.approvals[approver].status);
      }
      else{
        this.SelectedScheduleApprovals.push(0);
      }
      });

      console.log(this.SelectedScheduleApprovals);
      console.log("approvals");
    },



    onCheckedSchedule(schedules){
      this.selectedSchedules = schedules;
    },
    async submitSchedule(){
      let ids=[];
      for (let i = 0; i < this.selectedSchedules.length; i++) {
       ids.push(this.selectedSchedules[i].id);
      }
      await API.post("training-schedule/submit", {
       schedules:JSON.stringify(ids),
        user:this.authUser.id
      }).then(response => {
            this.schedules = response.data;
            this.selectedSchedules.length = 0;
            this.completed();
            this.notifySuccess();
            this.showSuccess("Schedules Submitted Successfully");
            console.log(response.data);
          })
          .catch(e => {
            this.completed();
            this.notifyError();
            //this.showError("Oops! an error occured while processing ");
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);
          })
    },
    async declineSchedule(){
      let ids=[];
      for (let i = 0; i < this.selectedSchedules.length; i++) {
        ids.push(this.selectedSchedules[i].id);
      }
      await API.post(`/training-schedule/decline`, {
        schedules:JSON.stringify(ids),
        user:this.authUser.id
      }).then(response => {
        this.schedules = response.data;
        this.selectedSchedules.length = 0;
        this.completed();
        this.notifySuccess();
        this.showSuccess("Schedules  Declined");
        console.log(response.data);
      })
          .catch(e => {
            this.completed();
            this.notifyError();
            //this.showError("Oops! an error occured while processing ");
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);
          })
    },
    async approveSchedule(){
      let ids=[];
      for (let i = 0; i < this.selectedSchedules.length; i++) {
        ids.push(this.selectedSchedules[i].id);
      }
      await API.post("/training-schedule/approve", {
        schedules:JSON.stringify(ids),
        user:this.authUser.id
      }).then(response => {
        this.schedules = response.data;
        this.selectedSchedules.length = 0;
        this.completed();
        this.notifySuccess();
        this.showSuccess("Schedules Approved Successfully");
        console.log(response.data);
      })
          .catch(e => {
            this.completed();
            this.notifyError();
            //this.showError("Oops! an error occured while processing ");
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);
          })
    },
    computeSum(data) {
      let total = 0;
      data.map(item => {
        total += parseFloat(item.ts_cost);
      })
      return total;
    },
    isNotSubmitted(data) {
      let notSubmitted = false;
      data.map(item => {
        if (item.ts_status == "1" || item.ts_status == 1) {
          notSubmitted = true;
        }
      })
      if(this.currentYear != this.year.text){
        notSubmitted = false;
      }
      return notSubmitted;
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear();
    API.get(`/training-schedule/submitted/get/${this.year.value}`).then(response => {
      this.loadComplete();
      this.schedules = response.data;
      this.schedulesMasterList = response.data,
      this.sum = this.computeSum(this.schedules);
      console.log(response.data);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
    })

    API.get(`/years`).then(response => {
      //this.loadComplete();
      this.years.push({value: 0, text: "All"});
      response.data.map(year => {
        this.years.push({value: year.id, text: year.y_year});
      });
      console.log(response.data);
    }).catch(e => {
      //this.notifyLoadingError();
      console.log(e);
    })

    API.get("/approvers/all").then(response => {
      console.log(response.data);
      this.loadComplete();
      this.approversList = response.data;
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
      console.log(e);
    })

  },
  computed:{
    authUser() {
      let user =  JSON.parse(store.getters['auth/loggedInUser']);
      return user.user;
    },

    //is the user an approver
    isApprover(){
      let approver = this.approversList.find(appr => {
        return appr.staff_id == this.authUser.staff_id;
      });
      return approver != null;
    },

    //check wether this current user is the 1st 2nd or more approver
    approvalLevel(){
      let index = this.approversList.findIndex(appr => {
        return appr.staff_id == this.authUser.staff_id;
      });
      return index;
    }

  }
};
</script>

<template>
  <Layout>
    <PageHeader :items="items" :title="title"/>

<!--    <h1>{{authUser.id}}{{authUser.fullname}}</h1>-->
    <div class="row">
      <div class="col-12">
        <b-form-group
            id="select"
            label="Year"
            label-for="type"
        >
          <multiselect v-model="year" :custom-label="yearSelector" :options="years"
                       @input="periodChanged()"></multiselect>
        </b-form-group>
        <div class="card">
          <div class="card-body">
            <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
            <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
            <div class="row">
              <div class="col-6">
              </div>
              <div class="col-6 pr-2">
                <div>
                  <multiselect v-model="filterValue" :options="filteroptions"  @input="filterChanged"  :custom-label="filterSelector" :allow-empty="false"></multiselect>
                </div>
              </div>
            </div>
            <ScheduleTable :schedules="schedules" :approval-level="approvalLevel" :is-approver="isApprover" @onSelectedSchedule="onSelectedSchedule" @onCheckedSchedule="onCheckedSchedule"/>
            <div class="row">
              <div class=" col-4 mt-3">
                <p class="mb-2">Total cost</p>
                <h4>₦ {{ sum | formatNumber }}</h4>
              </div>

              <div class=" col-8 mt-3"   >
                <!--                <div class="badge  badge-soft-danger font-size-12">not-submitted</div>-->
                <p class="mt-3">


                  <b-button v-if="(selectedSchedules.length > 0 && !isBusy) && isApprover " class="w-lg"
                            variant="primary" @click="approveSchedule">
                    <i class="mdi mdi-check-all"></i> Approve
                  </b-button>


                  <b-button v-if="(selectedSchedules.length > 0 && !isBusy) && isApprover " class="w-lg ml-4"
                            variant="danger" @click="declineSchedule">
                    <i class="mdi mdi-close"></i> Decline
                  </b-button>

                  <b-spinner v-if="isBusy" class="m-2" role="status" variant="primary"></b-spinner>
                </p>
              </div>

            </div>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <b-modal
        id="view-schedule"
        size="lg"
        centered
        title="Training Schedule"
        title-class="font-size-14"
        hide-footer
    >

      <div class="mb-3">
        <div class="">
          <div class="btn-toolbar p-3" role="toolbar">
            <Toolbar />
          </div>

          <div class="card-body">
            <div class="media mb-4">
              <img
                  class="d-flex mr-3 rounded-circle avatar-sm"
                  src="@/assets/images/tcnlogo.png"
                  alt="Generic placeholder image"
              />
              <div class="media-body">
                <h5 class="font-size-14 my-1">{{selectedSchedule.ts_title}}</h5>
                <div><small class="text-muted"> {{selectedSchedule.ts_type}}</small></div>
                <small class="text-muted"> {{selectedSchedule.ts_start}} - {{selectedSchedule.ts_end}}</small>
              </div>
            </div>

            <h4 class="mt-0 font-size-16">{{selectedSchedule.ts_title}}</h4>

            <p
                readonly
                v-html="this.selectedSchedule.ts_description">
            </p>

            <div>
              <small class="text-muted">Department</small>
              <h5 class="mt-0 font-size-14">
                {{selectedSchedule_department}}
              </h5>
            </div>

            <div>
              <small class="text-muted">Unit Cost </small>
              <h5 class="mt-0 font-size-14">
               ₦ {{this.selectedSchedule.ts_cost | formatNumber}}
              </h5>
            </div>


            <div>
              <small class="text-muted">Status</small>
              <div>
                <b-badge v-if="selectedSchedule.ts_status == 1" variant="primary">Pending</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 4"  variant="success" class="">Approved</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 2"  variant="warning" class="">Pending</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 3"  variant="danger" class="">Declined</b-badge>
              </div>
            </div>

            <div class="mt-3">
              <i class="mdi mdi-account-multiple"></i>
              <small class="text-muted">Facilitator</small>
              <h5 class="mt-0 font-size-14">
                {{selectedSchedule.ts_facilitator}}
              </h5>
            </div>




            <hr />
<!--            <div class="row">
              <div class="col-xl-2 col-6">
                <div class="card">
                  <img
                      class="card-img-top img-fluid"
                      src="@/assets/images/small/img-3.jpg"
                      alt="Card image cap"
                  />
                  <div class="py-2 text-center">
                    <a href class="font-weight-medium">Download</a>
                  </div>
                </div>
              </div>
              <div class="col-xl-2 col-6">
                <div class="card">
                  <img
                      class="card-img-top img-fluid"
                      src="@/assets/images/small/img-4.jpg"
                      alt="Card image cap"
                  />
                  <div class="py-2 text-center">
                    <a href class="font-weight-medium">Download</a>
                  </div>
                </div>
              </div>
            </div>-->

           <div class="mb-5" v-if="selectedSchedule.ts_status === 2 && isApprover && (approvalLevel === selectedSchedule.approvals.length) ">
             <a class="btn btn-primary waves-effect mt-4">
               <i class="mdi mdi-check-all"></i> Approve
             </a>

             <a class="btn btn-danger waves-effect mt-4 ml-4">
               <i class="mdi mdi-close"></i> Decline
             </a>
           </div>

            <p class="mt-0 mb-0 pt-0 pb-0">Approval Timeline</p>
            <hr />


            <div data-simplebar style="max-height: 330px;">
              <ul class="list-unstyled activity-wid">
                <li class="activity-list" v-for="(approval, index) in approversList" v-bind:key="index">
                  <div class="activity-icon avatar-xs">
              <span class="avatar-title bg-soft-primary text-primary rounded-circle">
               <i  class="mdi mdi-check-decagram font-size-20" style="color:#0a890a;"></i>
              </span>
                  </div>
                  <div>
                    <div>
                      <h5 class="font-size-13">
                        {{approval.fullname}} {{approval.designation}}
                        <small class="text-muted">Approved</small>
                      </h5>
                    </div>

                    <div>
                      <p class="text-muted mb-0"></p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>



          <div v-for="(approval, index) in approversList" v-bind:key="index" >
             <div class="row mb-2">
               <div class="col-5">
                 <p class="mb-0 font-weight-bold font-size-14">{{approval.fullname}} {{approval.designation}}</p>
                 <p v-if="SelectedScheduleApprovals[index] === 4" class="mb-0 font-weight-bold font-size-10">Approved <i  class="mdi mdi-check-decagram font-size-20" style="color:#0a890a;"></i> </p>
                 <p v-if=" SelectedScheduleApprovals[index]  === 3" class="mb-0 font-weight-bold font-size-10">Declined <i  class="mdi mdi-close-circle font-size-20" style="color:#ea3b35;"></i> </p>
                 <p v-if="SelectedScheduleApprovals[index]=== 0 " class="mb-0 font-weight-bold font-size-10"> In-Progress <i  class="mdi mdi-clock font-size-20" style="color:#ffa949;"></i> </p>

               </div>

             </div>
            </div>
          </div>

        </div>
      </div>

    </b-modal>
  </Layout>
</template>