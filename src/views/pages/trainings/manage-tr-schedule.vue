<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import ScheduleTable from "./tr-schedule-table";
import Multiselect from "vue-multiselect";
import axios from "axios";
import Vue from "vue";
import { format} from 'date-fns'
import {required} from "vuelidate/lib/validators";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
  components: {Layout, PageHeader, ScheduleTable, Multiselect, ckeditor: CKEditor.component},
  data() {
    return {
      format,
      editor: ClassicEditor,
      editorData:"",
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
        "Technical",
        "Non-technical",
      ],
      schedules: [],
      years: [],
      year: {value: 0, text: "All"},
      selectedSchedule: "",
      sum: "",
      currentYear: "",
      isnotsubmitted:false,
      selectedSchedules:[],
      selectedSchedule_department:"",
      //EDIT SCHEDULE
      employee:"",
      type:"",
      Title:"",
      Description:"",
      TypeofTraining:"",
      Start:"",
      End:"",
      Cost:"",
      Department:"",
      Facilitator:"",
      departments:[]
    };
  },
  methods: {
    yearSelector({text}) {
      return `${text}`;
    },
    deptSelector({ text }){
      return `${ text }`;
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
      this.Title = rec.ts_title;
      this.editorData = rec.ts_description;
      this.Department = {value:rec.department.id, text:rec.department.name};
      this.TypeofTraining = rec.ts_type;
      this.Cost = rec.ts_cost;
      this.Start = rec.ts_start;
      this.End = rec.ts_end;
      this.Facilitator = rec.ts_facilitator;
    },

    onCheckedSchedule(schedules){
      this.selectedSchedules = schedules;
    },

    submitSelectedSchedules(){
      let ids=[];
      for (let i = 0; i < this.selectedSchedules.length; i++) {
        ids.push(this.selectedSchedules[i].id);
      }
      this.submitSchedule(ids);
    },

    async submitViewedSchedule(){
      let ids=[];
      ids.push(this.selectedSchedule.id);
      await this.submitSchedule(ids);
      this.$bvModal.hide('view-schedule');
    },

    async submitSchedule(ids){
      await axios.post("http://127.0.0.1:8000/api/training-schedule/submit", {
       schedules:JSON.stringify(ids)
      }).then(response => {
            this.schedules = response.data;
            this.selectedSchedules.length = 0;
            this.completed();
            this.notifySuccess();
            this.showSuccess("Schedules Submitted Successfully");
            console.log(response.data);
          }).catch(e => {
            this.completed();
            this.notifyError();
            //this.showError("Oops! an error occured while processing ");
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);
          })
    },

   /* toast() {
      this.$bvToast.toast(`Toast body content`, {
        title: `Toaster`,
        toaster: 'b-toaster-top-center',
        solid: true,
        variant: 'success',
        appendToast: true
      });
    },*/

    async showEdit(){
      this.$bvModal.hide('view-schedule');
    },

    async updateSchedule(){
      this.processing();
      await axios.post("http://127.0.0.1:8000/api/training-schedule/update", {
        id:this.selectedSchedule.id,
        TypeofTraining : this.TypeofTraining,
        Title:this.Title,
        Description:this.editorData,
        Department:this.Department.value,
        Start:this.Start,
        End:this.End,
        Cost:this.Cost,
        Facilitator:this.Facilitator
      }).then(response => {
            this.completed();
            this.notifySuccess();
            this.showSuccess(response.data);
            //this.toast();
            this.$bvModal.hide('edit-schedule');
            console.log(response.data);
          }).catch(e => {
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
    axios.get(`http://127.0.0.1:8000/api/training-schedule/get/${this.year.value}`).then(response => {
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

    axios.get(" http://127.0.0.1:8000/api/all-departments").then(response => {
      response.data.map( dept=>{
        this.departments.push({
          value:dept.id,
          text:dept.name
        })
      })
      //this.departments = response.data;
      //console.log(response.data);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
    })
  },
  validations: {
    TypeofTraining: {required},
    Title: {required},
    Description: {required},
    Department: {required},
    Start: {required},
    End: {required},
    Cost: {required},
    editorData: {required},
    Facilitator: {required},
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
              <div class=" col-6 mt-3">
                <p class="mb-2">Total cost</p>
                <h4>₦ {{ sum | formatNumber }}</h4>
              </div>
              <div class=" col-6 mt-3">
                <!--                <div class="badge  badge-soft-danger font-size-12">not-submitted</div>-->
                <p class="mt-3">
                  <b-button v-if="selectedSchedules.length > 0" class="w-lg" variant="primary" @click=" submitSelectedSchedules">Submit for Approval
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
        id="edit-schedule"
        centered
        title="Edit Training Schedule"
        title-class="font-size-14"
        hide-footer
    >
      <form class="form-horizontal" role="form" @submit.prevent="submitForm">
        <b-form-group
            id="title"
            label="Title"
            label-for="designation"
        >
          <b-form-input v-model="Title" :class="{ 'is-invalid':$v.Title.$error }" @blur="$v.Title.$touch()" id="title" value="" placeholder="e.g Construction Techniques"  name="title"></b-form-input>
          <div v-if="$v.Title.$error" class="invalid-feedback">
            <span v-if="!$v.Title.required">Title of training is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="description"
            label="Description"

            label-for="description"
        >
          <ckeditor :class="{'is-invalid':$v.editorData.$error }"  v-model="editorData" :editor="editor"></ckeditor>

        </b-form-group>

        <b-form-group
            id="typeoftraining"
            label="Type of training"
            label-for="type"
        >
          <multiselect v-model="TypeofTraining" :class="{ 'is-invalid':$v.TypeofTraining.$error }" @blur="$v.TypeofTraining.$touch()"  :options="options" ></multiselect>
          <div v-if="$v.TypeofTraining.$error" class="invalid-feedback">
            <span v-if="!$v.TypeofTraining.required">Type of training is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="department"
            label="Department"
            label-for="text"
        >
          <multiselect  v-model="Department" :class="{ 'is-invalid':$v.Department.$error }"
                        @blur="$v.Department.$touch()"
                        :options="departments"
                        :custom-label="deptSelector"
          >

          </multiselect>
          <div v-if="$v.Department.$error" class="invalid-feedback">
            <span v-if="!$v.Department.required">Department is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="start"
            label="Start Date"
            label-for="date"
        >
          <b-form-input v-model="Start" :class="{ 'is-invalid':$v.Start.$error }" @blur="$v.Start.$touch()" id="date" value="" placeholder="01/05/1987" type="date"></b-form-input>
          <div v-if="$v.Start.$error" class="invalid-feedback">
            <span v-if="!$v.Start.required">Start date is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="end"
            label="End Date"
            label-for="date"
        >
          <b-form-input v-model="End" :class="{ 'is-invalid':$v.End.$error }" @blur="$v.End.$touch()" id="date" value="" placeholder="01/05/1987" type="date"></b-form-input>
          <div v-if="$v.End.$error" class="invalid-feedback">
            <span v-if="!$v.End.required">End date is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="cost"
            label="Unit Cost"
            label-for="cost"
        >
          <b-form-input v-model="Cost" :class="{ 'is-invalid':$v.Cost.$error }" @blur="$v.Cost.$touch()"  id="cost" type="number" placeholder="e.g 500,000"  name="cost"></b-form-input>
          <div v-if="$v.Cost.$error" class="invalid-feedback">
            <span v-if="!$v.Cost.required">Unit Cost is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="facilitator"
            label="Facilitator"
            label-for="Facilitator"
        >
          <b-form-input v-model="Facilitator" :class="{ 'is-invalid':$v.Facilitator.$error }" @blur="$v.Facilitator.$touch()" id="title" value="" placeholder="e.g A&B Facilitators"  name="title"></b-form-input>
          <div v-if="$v.Facilitator.$error" class="invalid-feedback">
            <span v-if="!$v.Facilitator.required">Facilitator of training is required</span>
          </div>
        </b-form-group>

        <b-form-group
            id="submit-btn"
            label=""
            label-for=""
        >
          <b-button v-if="!isBusy" class="w-lg" @click="updateSchedule" variant="primary">Update</b-button>
          <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
        </b-form-group>

      </form>
    </b-modal>

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
                <b-badge v-if="selectedSchedule.ts_status == 2"  variant="warning" class="">Submitted</b-badge>
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

            <a v-if="selectedSchedule.ts_status == 1" class="btn btn-secondary waves-effect mt-4" @click="submitViewedSchedule">
<!--              <i class="mdi mdi-plus"></i>--> Submit
            </a>
            <!--v-if="selectedSchedule.ts_status ==1"-->
            <a v-if="selectedSchedule.ts_status ==1" v-b-modal.edit-schedule @click="showEdit"  class="btn btn-secondary waves-effect mt-4 ml-3">
              <i class="mdi mdi-pencil"></i> Edit
            </a>

          </div>
        </div>
      </div>

    </b-modal>



  </Layout>
</template>