<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import ScheduleTable from "./submitted-schedule-table";
import Multiselect from "vue-multiselect";
import axios from "axios";
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
  components: {Layout, PageHeader, ScheduleTable, Multiselect},
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
      years: [],
      year: {value: 0, text: "All"},
      selectedSchedule: "",
      sum: "",
      currentYear: "",
      isnotsubmitted:false,
      selectedSchedules:[],
      selectedSchedule_department:""
    };
  },
  methods: {
    yearSelector({text}) {
      return `${text}`;
    },
    periodChanged() {
      this.fetchSchedulesByPeriod();
    },
    async fetchSchedulesByPeriod() {
      this.processing();
      await axios.get(`http://127.0.0.1:8000/api/training-schedule/get/${this.year.value}`).then(response => {
        this.completed()
        this.schedules = response.data;
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
    },

    onCheckedSchedule(schedules){
      this.selectedSchedules = schedules;
    },

    async submitSchedule(){
      let ids=[];
      for (let i = 0; i < this.selectedSchedules.length; i++) {
       ids.push(this.selectedSchedules[i].id);
      }
      await axios.post("http://127.0.0.1:8000/api/training-schedule/submit", {
       schedules:JSON.stringify(ids)
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
      await axios.post("http://127.0.0.1:8000/api/training-schedule/decline", {
        schedules:JSON.stringify(ids)
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
      await axios.post("http://127.0.0.1:8000/api/training-schedule/approve", {
        schedules:JSON.stringify(ids)
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
    axios.get(`http://127.0.0.1:8000/api/training-schedule/submitted/get/${this.year.value}`).then(response => {
      this.loadComplete();
      this.schedules = response.data;
      this.sum = this.computeSum(this.schedules);
      console.log(response.data);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
    })

    axios.get(`http://127.0.0.1:8000/api/years`).then(response => {
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
  },
};
</script>

<template>
  <Layout>
    <PageHeader :items="items" :title="title"/>
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
            <ScheduleTable :schedules="schedules" @onSelectedSchedule="onSelectedSchedule" @onCheckedSchedule="onCheckedSchedule"/>
            <div class="row">
              <div class=" col-4 mt-3">
                <p class="mb-2">Total cost</p>
                <h4>₦ {{ sum | formatNumber }}</h4>
              </div>
              <div class=" col-8 mt-3">
                <!--                <div class="badge  badge-soft-danger font-size-12">not-submitted</div>-->
                <p class="mt-3">


                  <b-button v-if="selectedSchedules.length && !isBusy > 0" class="w-lg"
                            variant="primary" @click="approveSchedule">
                    <i class="mdi mdi-check-all"></i> Approve
                  </b-button>


                  <b-button v-if="selectedSchedules.length && !isBusy > 0" class="w-lg ml-4"
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

            <div class="row">
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
            </div>

            <a class="btn btn-primary waves-effect mt-4">
              <i class="mdi mdi-check-all"></i> Approve
            </a>

            <a class="btn btn-danger waves-effect mt-4 ml-4">
              <i class="mdi mdi-close"></i> Decline
            </a>
          </div>
        </div>
      </div>

    </b-modal>
  </Layout>
</template>