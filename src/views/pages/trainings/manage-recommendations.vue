<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
import axios from "axios";
import RecommendationsTable from "./recommendations-table";
import {required} from "vuelidate/lib/validators";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
/**
 * Form-element component
 */
export default {
  page: {
    title: "Manage recommendations",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,RecommendationsTable,Multiselect,ckeditor: CKEditor.component },
  data() {
    return {
      title: "Manage recommendations",
      items: [
        {
          text: "Trainings",
          href: "/"
        },
        {
          text: "Recommendations",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      recommendations:[
      ],
      year:{value:0, text:"All"},
      years:[

      ],
      isError:false,
      isSuccess:false,
      isBusy:false,
      isLoading:true,
      isLoadingError:false,
      successMsg:"",
      errorMsg:"",
      selectedRec:"",
      employee:null,
      recommended_by:"",
      recommendedBy_designation:"",
      recommendedBy_staffId:"",
      type:"",
      Title:"",
      Description:"",
      TypeofTraining:"",
      Designation:"",
      Region:"",
      editor: ClassicEditor,
      editorData:"",
      employee_email:"",
      employee_designation:"",
      employee_staffid:"",
      Start:"",
      End:"",
      Cost:"",
      Department:"",
      Facilitator:"",
      departments:[]
    };
  },
  mounted(){
    axios.get(`http://127.0.0.1:8000/api/recommendations/get/${this.year.value}`).then(response => {
      this.loadComplete();
      this.recommendations = response.data;
      console.log(response.data);
    })
        .catch(e => {
          this.notifyLoadingError();
          console.log(e);
        })

    axios.get(`http://127.0.0.1:8000/api/years`).then(response => {
      //this.loadComplete();
      this.years.push({value:0, text:"All"});
      response.data.map( year => {
        this.years.push({value:year.id, text:year.y_year});
      });

      console.log(response.data);
    })
        .catch(e => {
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
  methods:{
    yearSelector({ text }){
      return `${ text }`;
    },
    periodChanged(){
      this.fetchRecommendationsByPeriod();
    },
    async fetchRecommendationsByPeriod()
    {
      this.processing();
     await axios.get(`http://127.0.0.1:8000/api/recommendations/get/${this.year.value}`).then(response => {
        this.completed()
        this.recommendations = response.data;
        console.log(response.data);
      }).catch(e => {
            this.completed()
            this.notifyLoadingError();
            console.log(e);
          })
    },
    onSelectedRec(rec) {
      this.selectedRec = rec;
      this.employee = this.selectedRec.recommended_employee.fullname;
      this.recommended_by = this.selectedRec.recommended_by.fullname;
      this.recommendedBy_designation = this.selectedRec.recommended_by.designation;
      this.recommendedBy_staffId = this.selectedRec.recommended_by.staff_id;
      this.employee_email = this.selectedRec.recommended_employee.email;
      this.employee_designation= this.selectedRec.recommended_employee.designation;
      this.employee_staffid = this.selectedRec.recommended_employee.staff_id;
    },
    deptSelector({ text }){
      return `${ text }`;
    },

    validateAdditionalInformation(){
      this.$v.Department.$touch();
      this.$v.End.$touch();
      this.$v.Start.$touch();
      this.$v.Cost.$touch();
      this.$v.Facilitator.$touch();
      if(this.$v.Department.$invalid ||
          this.$v.End.$invalid ||
          this.$v.Start.$invalid ||
          this.$v.Cost.invalid ||
          this.$v.Facilitator.invalid
      )
      {
        return
      }
      else{
        this.$bvModal.hide('Add-to-schedule');
        this.addToSchedule();
      }

    },

    async addToSchedule(){
      this.processing();
      await axios.post("http://127.0.0.1:8000/api/recommendations/schedule", {
        id:this.selectedRec.id,
        TypeofTraining : this.selectedRec.rec_type,
        Title:this.selectedRec.rec_name,
        Description:this.selectedRec.rec_description,
        Department:this.Department.value,
        Start:this.Start,
        End:this.End,
        Cost:this.Cost,
        Facilitator:this.Facilitator
        }).then(response => {
            this.$bvModal.hide('modal-lg');
            this.completed();
            this.notifySuccess();
            this.showSuccess(response.data)
            console.log(response.data);
        }).catch(e => {
            this.$bvModal.hide('modal-lg');
            this.completed();
            this.notifyError();
            //this.showError("Oops! an error occured while processing ");
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);

          })
    }


  },
  validations: {
    employee: {required},
    TypeofTraining: {required},
    Title: {required},
    Description: {required},
    Designation: {required},
    Region: {required},
    Department: {required},
    Start: {required},
    End: {required},
    Cost: {required},
    Facilitator: {required},
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <b-form-group
            id="select"
            label="Year"
            label-for="type"
        >
          <multiselect v-model="year" :options="years" :custom-label="yearSelector" @input="periodChanged()" ></multiselect>
        </b-form-group>
        <div class="card">

          <div  class="card-body">
            <div v-if="isBusy" class="text-center justify-content-center mb-3">
              <b-spinner type="grow" class="mt-5" variant="primary" role="status" style="width: 3rem; height: 3rem;"></b-spinner>
              <p class="text-primary" >loading...</p>
            </div>
            <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
            <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
            <RecommendationsTable v-if="!isBusy" :recommendations="recommendations" @onSelectedRec="onSelectedRec"  />
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <b-modal
        id="modal-center"
        centered
        title="Recommendation"
        title-class="font-size-14"
        hide-footer
    >
      <div >
        <form class="form-horizontal" role="form" @submit.prevent="submitForm">
          <div class="row">
            <div class="col-12">

                <b-form-group
                    id="title"
                    label="Title"
                    label-for="designation"
                    class="font-size-13 text-muted"
                >
                  <b-form-input readonly disabled v-model="this.selectedRec.rec_name" :class="{ 'is-invalid':$v.Title.$error }"
                                @blur="$v.Title.$touch()"   id="title" name="title" placeholder="e.g Construction techniques"
                                value=""></b-form-input>
                  <div v-if="$v.Title.$error" class="invalid-feedback">
                    <span v-if="!$v.Title.required">Title of training is required</span>
                  </div>
                </b-form-group>

<!--
                <b-form-group
                    id="description"
                    label="Description"
                    label-cols-lg="2"
                    label-cols-sm="2"
                    label-for="description"
                >
                  <b-form-input v-model="Description" :class="{ 'is-invalid':$v.Description.$error }" @blur="$v.Description.$touch()"  id="description" name="description" placeholder="" value=""></b-form-input>
                  <div v-if="$v.Description.$error" class="invalid-feedback">
                    <span v-if="!$v.Description.required">Please provide description</span>
                  </div>
                </b-form-group>
            --><b-form-group
                            id="description"
                            label="Description"
                            label-for="description"
                            class="font-size-13 text-muted"
                        >
              <ckeditor  v-model="this.selectedRec.rec_description" :editor="editor"></ckeditor>



            </b-form-group>
              <b-form-group
                  id="typeoftraining"
                  label="Training Type"
                  label-for="designation"
                  class="font-size-13 text-muted"
              >
                <b-form-input readonly disabled v-model="this.selectedRec.rec_type" :class="{ 'is-invalid':$v.Title.$error }"
                              @blur="$v.Title.$touch()"   id="title" name="title" placeholder="e.g Construction techniques"
                              value=""></b-form-input>
                <div v-if="$v.Title.$error" class="invalid-feedback">
                  <span v-if="!$v.Title.required">Title of training is required</span>
                </div>
              </b-form-group>
              <b-form-group
                  id="employee"
                  label="Employee"
                  label-for="designation"
                  class="font-size-13 text-muted"
              >
                <b-form-input readonly  disabled v-model="employee" :class="{ 'is-invalid':$v.Title.$error }"
                              @blur="$v.Title.$touch()"   id="title" name="title" placeholder="e.g Construction techniques"
                              value=""></b-form-input>
                <div v-if="$v.Title.$error" class="invalid-feedback">
                  <span v-if="!$v.Title.required">Title of training is required</span>
                </div>
              </b-form-group>

              <b-form-group
                  id="Recommended By"
                  label="Recommended By"
                  label-for="designation"
                  class="font-size-13 text-muted"
              >
                <b-form-input readonly v-model="recommended_by"  id="title" name="title" placeholder="e.g Construction techniques"
                              value=""></b-form-input>

              </b-form-group>
<!--              <b-form-group
                  id="Region"
                  label="Region"
                  label-for="region"
                  class="font-size-13 text-muted"
              >
                <b-form-input readonly disabled v-model="selectedRec.rec_region" id="title" name="title" placeholder="e.g Construction techniques"
                              value=""></b-form-input>

                <div class="invalid-feedback">

                </div>
              </b-form-group>-->


                <b-form-group
                    id="submit-btn"
                    label-for=""
                >
                  <b-button  class="w-lg" type="submit" variant="primary">Submit</b-button>
<!--                  <b-spinner class="m-2" role="status" variant="primary"></b-spinner>-->
                </b-form-group>

            </div>
          </div>

        </form>
      </div>

    </b-modal>

    <b-modal
        id="modal-lg"
        size="lg"
        centered
        title="Recommendation"
        title-class="font-size-14"
        hide-footer
    >
      <div class="mb-3">
        <div class="">
          <div class="btn-toolbar " role="toolbar">
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
                <h5 class="font-size-14 my-1">Training Recommendation</h5>

              </div>
            </div>




            <div class="media-body">
              <h5 class="font-size-14 my-1">{{employee}}</h5>
              <small class="text-muted">{{ employee_designation }} {{employee_staffid}}</small>
             <div>
               <small class="text-muted">{{ employee_email }}</small>
             </div>
            </div>


            <div class="media mb-4 mt-3">
              <div class="media-body">
                <label  class="font-italic font-size-14">Title</label>
                <h4 class="mt-0 font-size-16">{{this.selectedRec.rec_name}}</h4>
              </div>
            </div>


            <label  class="font-size-14 font-italic">Description</label>
            <p
                readonly
                v-html="this.selectedRec.rec_description">

            </p>

            <label  class="font-size-14 font-italic">Type of training</label>
            <p
                readonly
                class="font-weight-bolder font-size-16"
                v-html="this.selectedRec.rec_type">
            </p>


            <label  class="font-size-14 font-italic">Recommended By</label>
            <div class="media-body">
              <h5 class="font-size-14 my-1">{{ recommended_by }}</h5>
              <small class="text-muted">{{ recommendedBy_designation }} {{recommendedBy_staffId}}</small>
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

            <a href="javascript: void(0);" class="btn btn-secondary waves-effect mt-4">
              <i class="mdi mdi-printer"></i> Print
            </a>



            <a v-if="!isBusy"  v-b-modal.Add-to-schedule  class="btn btn-primary waves-effect mt-4 ml-4">
              <i class="mdi mdi-plus"></i> Add to Schedule
            </a>
            <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>


          </div>
        </div>
      </div>

    </b-modal>

    <b-modal
        id="Add-to-schedule"
        centered
        no-close-on-backdrop
        title="Additional Information"
        title-class="font-size-14"
        hide-footer
    >
      <form>
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


      </form>
      <a class="btn btn-primary"  @click="validateAdditionalInformation">
        Proceed
      </a>
    </b-modal>

  </Layout>
</template>