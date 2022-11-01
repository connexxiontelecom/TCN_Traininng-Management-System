<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import ManageTrainingsTable from "./reports-table";
import NomineesTable from "./participants-table";
import Multiselect from "vue-multiselect";
import {required} from "vuelidate/lib/validators";
import VueExcelXlsx from "vue-excel-xlsx";
import {API} from "@/api";
import Vue from "vue";
import {format,differenceInCalendarDays} from 'date-fns';
import VueHtml2pdf from 'vue-html2pdf';
Vue.use(VueExcelXlsx);
//import CKEditor from "@ckeditor/ckeditor5-vue";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/**
 * Form-element component
 */
var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0.00"); // displaying other groupings/separators is possible, look at the docs
});

/**
 * Form-element component
 */
export default {
  page: {
    title: "Reports",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,ManageTrainingsTable,NomineesTable,VueHtml2pdf,Multiselect},
  data() {
    return {
      format,
      differenceInCalendarDays,
      columns : [
        {
          label: "Fullname",
          field: "nominated_employee.fullname",
        },
        {
          label: "Email",
          field: "nominated_employee.email",
        },
        {
          label: "Staff Id",
          field: "nominated_employee.staff_id",
        },
        {
          label: "Designation",
          field: "nominated_employee.designation",
        },
        {
          label: "Job Trade",
          field: "nominated_employee.job_trade",
        },
        {
          label: "Location",
          field: "nominated_employee.location",
        },
      ],
      trainingDataColumns: [
       /* {field: "sno", label: "S/N"},*/
        {field: "ts_title", label: "Title"},
        {field: "ts_type", label: "Type"},
        {field: "ts_cost", label: "Unit Cost"},
        {field: "year.y_year", label: "Year"},
        {field: "ts_facilitator", label: "Organizer"},
        {field: "department.name", label: "Department"},
        {field: "ts_status", label: "Status"},
        {field: "ts_duration", label: "Duration"},
        {field: "ts_venue", label: "Venue"},
        {field: "ts_nominees", label: "Nominees"},
        {field: "ts_trained", label: "Trained"},
        {field: "ts_start", label: "Start"},
        {field: "ts_end", label: "End"},
      ],
      nomineesfields: [
        { key: "sno", sortable: false, label: "S/N" },
        { key: "nominated_employee.fullname", sortable: false,  label: "Fullname" },
        { key: "nm_attendance", sortable: false, label: "Attendance" },
        { key: "nm_punctuality", sortable: false, label: "Punctuality" },
        { key: "nominated_employee.job_trade", sortable: false, label: "Job Trade" },
      ],
      nominationData : [],
      trainingData : [],
      title: "Reports",
      items: [
        {
          text: " Reports",
          href: "/"
        },
        {
          text: "View",
          active: true
        }
      ],
      editor: ClassicEditor,
      editorData:"",
      isError: false,
      isSuccess: false,
      isBusy: false,
      isLoading: true,
      isLoadingError: false,
      successMsg: "",
      errorMsg: "",
      years: [],
      year: {value: 0, text: "All"},
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      sum:"",
      options: [
          "Technical",
          "Non-Technical"
      ],
      schedules:[],
      selectedSchedule_department:"",
      selectedSchedule: "",

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
      departments:[],
      participants:[]
    };
  },
  mounted() {
    this.currentYear = new Date().getFullYear();
    API.get(`/training-schedule/completed/get/${this.year.value}`).then(response => {
      this.loadComplete();
      this.schedules = response.data;
     // console.log(response.data);

      this.schedules.forEach((element, index) => {
        this.schedules[index].ts_trained = this.countTrained(this.schedules[index].nominees)
        this.schedules[index].ts_duration  = Math.abs( differenceInCalendarDays(
            new Date(this.schedules[index].ts_start),
            new Date(this.schedules[index].ts_end))) + "Day"
      });

      this.sum = this.computeSum(this.schedules);

      console.log(this.schedules);

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

    API.get("/all-departments").then(response => {
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
    Department: {required},
    Start: {required},
    End: {required},
    Cost: {required},
    editorData: {required},
    Facilitator: {required},
  },
  methods:{
    yearSelector({text}) {
      return `${text}`;
    },
    deptSelector({ text }){
      return `${ text }`;
    },
    onRated(data){
      this.participants = data;
    },
    computeSum(data) {
      let total = 0;
      data.map(item => {
        total += parseFloat(item.ts_cost * item.ts_trained);
      })
      return total;
    },
    async submitEvaluation() {
        this.processing();
        await API.post("/nomination/participants/evaluate", {
          nominees:JSON.stringify(this.participants),
          schedule:this.selectedSchedule.id,
        }).then(response => {
             /*
              this.schedules = response.data;
              this.sum = this.computeSum(this.schedules);
              this.showSuccess("Training Created Successfully");
              this.$bvModal.hide('new-approved-training-modal');*/
              this.completed();
              this.notifySuccess();
              this.showSuccess(response.data);
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
    clearData(){
      this.selectedSchedule ="";
      this.selectedSchedule_department ="";
      this.Title ="";
      this.editorData = "";
      this.Department = "";
      this.TypeofTraining = "";
      this.Cost = "";
      this.Start = "";
      this.End = "";
      this.Facilitator = "";
    },
    periodChanged() {
      this.fetchSchedulesByPeriod();
    },
    async fetchSchedulesByPeriod() {
      this.processing();
      await API.get(`/training-schedule/completed/get/${this.year.value}`).then(response => {
        this.completed()
        this.schedules = response.data;
        this.sum = this.computeSum(this.schedules);
        console.log(response.data);
      }).catch(e => {
        this.completed()
        this.notifyLoadingError();
        console.log(e);
      })
    },
    onNomineesFetched(data){
      this.nominationData = data;
    },
    countTrained(nominees){
      return nominees.filter (({nm_status}) => nm_status === 5).length
    },
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    }
  },
  computed:{
    nomineesList() {
      return this.nominationData.map((d, index) => ({...d, sno: index + 1}))
    },
  }

};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
<!--    <div class="row">
      <div class="col-10">
      </div>
      <div class="col-2">
        <b-button v-b-modal.new-approved-training-modal  class="w-lg" @click="clearData" variant="primary"> <i class="mdi mdi-plus mr-2"></i>New Training</b-button>
      </div>
    </div>-->
    <div class="row">
      <div class="col-12">
        <b-form-group
            id="select"
            label="Year"
            label-for="type"
        >
          <multiselect v-model="year" :options="years" :custom-label="yearSelector" @input="periodChanged" :allow-empty="false" ></multiselect>

        </b-form-group>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
            <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
            <ManageTrainingsTable :schedules="schedules" @onSelectedSchedule="onSelectedSchedule" />
            <div class="row">
              <div class=" col-6 mt-3">
                <p class="mb-2">Total cost</p>
                <h4>₦ {{sum | formatNumber}}</h4>
              </div>
              <div class=" col-6 mt-3">
                <vue-excel-xlsx
                    :data="schedules"
                    :columns="trainingDataColumns"
                    :file-name="'Trainings_Information'"
                    :file-type="'xlsx'"
                    :sheet-name="'Trainings'"
                    class="btn">
                  <b-button  class="w-lg"  type="button"  variant="primary"><i class="mdi mdi-microsoft-excel mr-2"></i>Export Record</b-button>
                </vue-excel-xlsx>
              </div>

            </div>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <b-modal
        id="view-training-schedule"
        size="lg"
        centered
        title="Training Schedule"
        title-class="font-size-14"
        hide-footer
    >

      <div class="mb-3">
        <div class="">
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


            <div class="row">

              <div class="col-3">
                <small class="text-muted">Status</small>
                <div>
                  <b-badge v-if="selectedSchedule.ts_status == 1" variant="primary">Pending</b-badge>
                  <b-badge v-if="selectedSchedule.ts_status == 4"  variant="success" class="">Approved</b-badge>
                  <b-badge v-if="selectedSchedule.ts_status == 2"  variant="warning" class="">Submitted</b-badge>
                  <b-badge v-if="selectedSchedule.ts_status == 3"  variant="danger" class="">Declined</b-badge>
                  <b-badge v-if="selectedSchedule.ts_status == 5" variant="primary">Completed</b-badge>
                </div>
              </div>

              <div class="col-3">
                <small class="text-muted">Training Rating</small>
                <div>
                  <b-badge v-if="selectedSchedule.ts_training_rating == 1" variant="danger">V. Poor</b-badge>
                  <b-badge v-if="selectedSchedule.ts_training_rating == 2"  variant="danger" class="">Poor</b-badge>
                  <b-badge v-if="selectedSchedule.ts_training_rating == 3"  variant="warning" class="">Fair</b-badge>
                  <b-badge v-if="selectedSchedule.ts_training_rating == 4"  variant="success" class="">V. Good</b-badge>
                  <b-badge v-if="selectedSchedule.ts_training_rating == 5" variant="success">Excellent</b-badge>
                </div>
              </div>

              <div class="col-3">
                <small class="text-muted">Facilitator Rating</small>
                <div>
                  <b-badge v-if="selectedSchedule.ts_instructor_rating == 1" variant="danger">V. Poor</b-badge>
                  <b-badge v-if="selectedSchedule.ts_instructor_rating == 2"  variant="danger" class="">Poor</b-badge>
                  <b-badge v-if="selectedSchedule.ts_instructor_rating == 3"  variant="warning" class="">Fair</b-badge>
                  <b-badge v-if="selectedSchedule.ts_instructor_rating == 4"  variant="success" class="">V. Good</b-badge>
                  <b-badge v-if="selectedSchedule.ts_instructor_rating == 5" variant="success">Excellent</b-badge>
                </div>
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

            <div class="mt-3">
              <small class="text-muted">Participants</small>
            </div>

            <NomineesTable :training="selectedSchedule.id" @onRated="onRated" @onNomineesFetched="onNomineesFetched"/>

            <div class="row">
              <b-form-group>

                <vue-excel-xlsx
                    :data="nominationData"
                    :columns="columns"
                    :file-name="'Training_Participants'"
                    :file-type="'xlsx'"
                    :sheet-name="'Participants'"
                    class="btn"
                >
                  <b-button  class="w-lg"  type="button"  variant="primary"><i class="mdi mdi-microsoft-excel mr-2"></i>Export Participants</b-button>
                </vue-excel-xlsx>

              </b-form-group>
              <b-form-group class="mt-2">
                <b-button  class="w-lg"  type="button" @click="generateReport" variant="primary"><i class="mdi mdi-file-pdf-box mr-2"></i>Export Training</b-button>
              </b-form-group>
            </div>

          </div>
        </div>
      </div>

    </b-modal>

    <template>
      <div>
        <vue-html2pdf
            :show-layout="false"
            :float-layout="true"
            :enable-download="true"
            :preview-modal="true"
            :paginate-elements-by-height="1400"
            filename="Training Information"
            :pdf-quality="2"
            :manual-pagination="false"
            pdf-format="a4"
            pdf-orientation="portrait"
            pdf-content-width="800px"
            ref="html2Pdf">
          <section slot="pdf-content">
            <div class="ml-5 mr-5">
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
                <p readonly v-html="this.selectedSchedule.ts_description">
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
                    <b-badge v-if="selectedSchedule.ts_status == 5" variant="primary">Completed</b-badge>
                  </div>
                </div>


                <div>
                  <small class="text-muted">Training Rating</small>
                  <div>
                    <b-badge v-if="selectedSchedule.ts_training_rating == 1" variant="danger">V. Poor</b-badge>
                    <b-badge v-if="selectedSchedule.ts_training_rating == 2"  variant="danger" class="">Poor</b-badge>
                    <b-badge v-if="selectedSchedule.ts_training_rating == 3"  variant="warning" class="">Fair</b-badge>
                    <b-badge v-if="selectedSchedule.ts_training_rating == 4"  variant="success" class="">V. Good</b-badge>
                    <b-badge v-if="selectedSchedule.ts_training_rating == 5" variant="success">Excellent</b-badge>
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

                <div class="mt-3">
                  <small class="text-muted">Participants</small>
                </div>

                <div>
                  <div class="row mt-4">
                  </div>
                  <div class="table-responsive">
                    <b-table
                        striped
                        :items="nomineesList"
                        :fields="nomineesfields"
                        responsive="sm"
                        :current-page="currentPage"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                        :filter="filter"
                        :filter-included-fields="filterOn"
                        @filtered="onFiltered"
                    >
                      <template v-slot:cell(ts_status)="row">

                        <div>
                          <b-badge v-if="row.value== 1" variant="primary">Pending</b-badge>
                          <b-badge v-if="row.value== 4"  variant="success" class="">Approved</b-badge>
                          <b-badge v-if="row.value== 2"  variant="warning" class="">Submitted</b-badge>
                        </div>

                      </template>

                      <template v-slot:cell(nominated_employee.fullname)="row">

                        <div>
                          <label class="d-block mb-0">{{row.item.nominated_employee.fullname}}</label>
                          <small>{{row.item.nominated_employee.staff_id}}</small>
                          <small class="text-muted"> | {{row.item.nominated_employee.location}}</small>
                        </div>

                      </template>

                      <template v-slot:cell(nm_attendance)="row">
                        <div>
                          <b-badge v-if="row.value== 1" variant="danger">V.Poor</b-badge>
                          <b-badge v-if="row.value== 2"  variant="danger" class="">Poor</b-badge>
                          <b-badge v-if="row.value== 3"  variant="warning" class="">Fair</b-badge>
                          <b-badge v-if="row.value== 4"  variant="success" class="">V.Good</b-badge>
                          <b-badge v-if="row.value== 5"  variant="success" class="">Excellent</b-badge>
                        </div>
                      </template>

                      <template v-slot:cell(nm_punctuality)="row">
                        <div>
                          <b-badge v-if="row.value== 1" variant="danger">V.Poor</b-badge>
                          <b-badge v-if="row.value== 2"  variant="danger" class="">Poor</b-badge>
                          <b-badge v-if="row.value== 3"  variant="warning" class="">Fair</b-badge>
                          <b-badge v-if="row.value== 4"  variant="success" class="">V.Good</b-badge>
                          <b-badge v-if="row.value== 5"  variant="success" class="">Excellent</b-badge>
                        </div>
                      </template>

                      <template v-slot:cell(action)="row">
                        <i v-b-modal.view-training-schedule @click=selectedSchedule(row.item)  class="mdi mdi-eye font-size-18 text-primary ml-2"></i>

                      </template>
                    </b-table>
                  </div>



                </div>

              </div>
            </div>
          </section>
        </vue-html2pdf>
      </div>
    </template>


  </Layout>
</template>