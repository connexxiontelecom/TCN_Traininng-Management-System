<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import ManageTrainingsTable from "./manage-Trainings-table";
import NomineesTable from "./nominees-table";
import Multiselect from "vue-multiselect";
import {required} from "vuelidate/lib/validators";
import CKEditor from "@ckeditor/ckeditor5-vue";
import StarRating from "vue-star-rating";
import {API} from "@/api";
import Vue from "vue";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {format} from "date-fns";
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
    title: "Manage Approved Trainings",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,ManageTrainingsTable,NomineesTable,Multiselect,StarRating, ckeditor: CKEditor.component},
  data() {
    return {
      title: "Manage Approved Trainings",
      items: [
        {
          text: " Approved Trainings",
          href: "/"
        },
        {
          text: "Manage",
          active: true
        }
      ],
      format,
      editor: ClassicEditor,
      editorData:"",
      evaluationNote:"",
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
      participants:[],
      FacilitatorRating:"",
      TrainingRating:""
    };
  },
  mounted() {
    this.currentYear = new Date().getFullYear();
    API.get(`/training-schedule/approved/get/${this.year.value}`).then(response => {
      this.loadComplete();
      this.schedules = response.data;
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
        total += parseFloat(item.ts_cost);
      })
      return total;
    },

    async submitEvaluation() {
      this.clearError();
      if(this.evaluationNote.trim() == "")
      {
        this.notifyError();
        this.showError("Kindly Provide Summary note of the training");
        this.toast("Kindly Provide Summary note of the training", "danger");
        return;
      }
      if(this.TrainingRating== "")
      {
        this.notifyError();
        this.showError("Kindly rate the training");
        this.toast("Kindly rate the training", "danger");
        return;
      }
      if(this.FacilitatorRating == "")
      {
        this.notifyError();
        this.showError("Kindly rate the facilitator");
        this.toast("Kindly rate the facilitator", "danger");
        return;
      }

        this.processing();
        await API.post("/nomination/participants/evaluate", {
          nominees:JSON.stringify(this.participants),
          schedule:this.selectedSchedule.id,
          SummaryNote:this.evaluationNote,
          FacilitatorRating:this.FacilitatorRating,
          TrainingRating:this.TrainingRating
        }).then(response => {
             /*
              this.schedules = response.data;
              this.sum = this.computeSum(this.schedules);
              this.showSuccess("Training Created Successfully");
              this.$bvModal.hide('new-approved-training-modal');*/
              this.completed();
              this.notifySuccess();
              this.showSuccess(response.data);
              this.toast("Evaluation Submitted Successfully", "success");
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
      this.FacilitatorRating = rec.ts_instructor_rating;
      this.TrainingRating = rec.ts_training_rating;
      this.evaluationNote = rec.ts_evaluation_note;
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

    async submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        this.processing();
        await API.post("/training-schedule/approved/create", {
          TypeofTraining : this.TypeofTraining,
          Title:this.Title,
          Description:this.editorData,
          Department:this.Department.value,
          Start:this.Start,
          End:this.End,
          Cost:this.Cost,
          Facilitator:this.Facilitator,
        }).then(response => {
          this.completed();
          this.notifySuccess();
          this.schedules = response.data;
          this.sum = this.computeSum(this.schedules);
          this.showSuccess("Training Created Successfully");
          this.$bvModal.hide('new-approved-training-modal');
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
      }
    },

    toast(message, variant, append = false) {
      this.counter++;
      this.$bvToast.toast(`${message}`, {
        title: `Notification`,
        toaster: "b-toaster-bottom-right",
        variant:variant,
        solid: true,
        appendToast: append
      });
    },

  },

};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  <div class="row">
      <div class="col-10">
      </div>
      <div class="col-2">
        <b-button v-b-modal.new-approved-training-modal  class="w-lg" @click="clearData" variant="primary"> <i class="mdi mdi-plus mr-2"></i>New Training</b-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <b-form-group
            id="select"
            label="Year"
            label-for="type"
        >
          <multiselect v-model="year" :options="years" :custom-label="yearSelector" :allow-empty="false" ></multiselect>

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

              </div>

            </div>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>

   <b-modal
        id="new-approved-training-modal"
        centered
        title="New Approved Training "
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
          <multiselect v-model="TypeofTraining" :class="{ 'is-invalid':$v.TypeofTraining.$error }" @blur="$v.TypeofTraining.$touch()"  :options="options" :allow-empty="false"  ></multiselect>
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
                        :allow-empty="false"
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
          <b-button v-if="!isBusy" class="w-lg" type="submit" variant="primary">Submit</b-button>
          <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
        </b-form-group>

      </form>
    </b-modal>


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

            <p  readonly
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
                <b-badge v-if="selectedSchedule.ts_status == 5" variant="primary">Completed</b-badge>
              </div>
            </div>

            <div class="mt-3">
              <i class="mdi mdi-account-multiple"></i>
              <small class="text-muted">Facilitator</small>
              <h5 class="mt-0 font-size-14">
                {{selectedSchedule.ts_facilitator}}
              </h5>
            </div>

            <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
            <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>

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


            <div class="mb-3 row">
              <div class="col-2">
                Rate Facilitator
              </div>
             <div class="col-3" v-if="selectedSchedule.ts_status == 5">
               <star-rating :read-only="true" active-color="#5664d2" :star-size="25" v-model="FacilitatorRating"  :show-rating="false" ></star-rating>
             </div>
              <div class="col-3" v-else>
                <star-rating  active-color="#5664d2" :star-size="25" v-model="FacilitatorRating"  :show-rating="false" ></star-rating>
              </div>
            </div>

            <div class="mb-3 row">
              <div class="col-2">
                Rate Training
              </div>
              <div class="col-3" v-if="selectedSchedule.ts_status == 5">
                <star-rating :read-only="true" active-color="#5664d2" :star-size="25"  v-model="TrainingRating" :show-rating="false" ></star-rating>
              </div>
              <div class="col-3" v-else>
                <star-rating active-color="#5664d2" :star-size="25"  v-model="TrainingRating" :show-rating="false" ></star-rating>
              </div>
            </div>

            <b-form-group
                id="evaluation-note"
                label="Notes"
                label-for="description"
                v-if="selectedSchedule.ts_status!=5"
            >
              <small class="text-muted">Kindly write an Evaluation-Summary Note </small>
              <ckeditor   v-model="evaluationNote" :editor="editor"></ckeditor>

            </b-form-group>


           <div v-if="selectedSchedule.ts_status == 5">
             <div class="mt-3">
               <small class="text-muted">Training Summary </small>
             </div>

             <p  readonly
                 v-html="this.selectedSchedule.ts_evaluation_note">
             </p>
           </div>

            <div class="mt-3">
              <small class="text-muted">Please Evaluate the participants by rating them appropriately</small>
<!--              <h5 class="mt-0 font-size-14">
                Please evaluate the training participants by ticking the box where applicable
              </h5>-->
            </div>

            <NomineesTable :training="selectedSchedule.id" @onRated="onRated"/>

            <b-form-group>
              <b-button v-if="!isBusy && selectedSchedule.ts_status == 4" class="w-lg"  type="button" @click="submitEvaluation" variant="primary">Submit</b-button>
              <b-spinner v-if="isBusy" class="m-2" role="status" variant="primary"></b-spinner>
            </b-form-group>


          </div>


        </div>
      </div>

    </b-modal>

  </Layout>
</template>