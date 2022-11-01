<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
import {required} from "vuelidate/lib/validators";
import {API} from "@/api";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
/**
 * Form-element component
 */
export default {
  page: {
    title: "New Schedule",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, Multiselect, ckeditor: CKEditor.component },
  data() {
    return {
      title: "New Schedule",
      items: [
        {
          text: "Trainings",
          href: "/"
        },
        {
          text: "New Schedule",
          active: true
        }
      ],
      editor: ClassicEditor,
      editorData:"",
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      options: [
        "Technical",
        "Non-technical",
      ],
      isError: false,
      isSuccess: false,
      isBusy: false,
      isLoading: true,
      isLoadingError: false,
      successMsg: "",
      errorMsg: "",
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
  validations: {
    TypeofTraining: {required},
    Title: {required},
    //Description: {required},
    Department: {required},
    Start: {required},
    End: {required},
    Cost: {required},
    editorData: {required},
    Facilitator: {required},
  },
  mounted() {
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
  methods:{
    deptSelector({ text }){
      return `${ text }`;
    },

    async submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("Invalid")
        return;
      } else {
        this.processing();
        await API.post("/training-schedule/create", {
          TypeofTraining : this.TypeofTraining,
          Title:this.Title,
          Description:this.editorData,
          Department:this.Department.value,
          Start:this.Start,
          End:this.End,
          Cost:this.Cost,
          Facilitator:this.Facilitator
        })
            .then(response => {
              this.completed();
              this.notifySuccess();
              this.showSuccess(response.data)
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
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
            <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
            <h4 class="card-title mb-5">Create New Schedule</h4>
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" role="form" @submit.prevent="submitForm">
                  <b-form-group
                      id="title"
                      label-cols-sm="2"
                      label-cols-lg="2"
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
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="description"
                  >
                    <ckeditor :class="{'is-invalid':$v.editorData.$error }"  v-model="editorData" :editor="editor"></ckeditor>
                    <!--                    <b-form-input v-model="Description" :class="{ 'is-invalid':$v.Description.$error }" @blur="$v.Description.$touch()"  id="description" name="description" placeholder="" value=""></b-form-input>
                                        <div v-if="$v.Description.$error" class="invalid-feedback">
                                          <span v-if="!$v.Description.required">Please provide description</span>
                                        </div>-->
                  </b-form-group>

                  <!--                  <b-form-group
                                        id="description"
                                        label-cols-sm="2"
                                        label-cols-lg="2"
                                        label="Description"
                                        label-for="description"
                                    >
                                      <b-form-input v-model="Description" :class="{ 'is-invalid':$v.Description.$error }" @blur="$v.Description.$touch()"  id="description" value="" placeholder=""  name="description"></b-form-input>

                                      <div v-if="$v.Description.$error" class="invalid-feedback">
                                        <span v-if="!$v.Description.required">Description of training is required</span>
                                      </div>
                                    </b-form-group>-->

                  <b-form-group
                      id="select"
                      label-cols-sm="2"
                      label-cols-lg="2"
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
                      label-cols-sm="2"
                      label-cols-lg="2"
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

<!--                  <b-form-group
                      id="Duration"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Duration"
                      label-for="Duration"
                  >
                    <b-form-input id="Duration" value="" placeholder="e.g 2 months"  name="duration"></b-form-input>
                  </b-form-group>-->

                  <b-form-group
                      id="start"
                      label-cols-sm="2"
                      label-cols-lg="2"
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
                      label-cols-sm="2"
                      label-cols-lg="2"
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
                      label-cols-sm="2"
                      label-cols-lg="2"
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
                      label-cols-sm="2"
                      label-cols-lg="2"
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
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label=""
                      label-for=""
                  >
                    <b-button v-if="!isBusy" class="w-lg" type="submit" variant="primary">Submit</b-button>
                    <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
                  </b-form-group>

                </form>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>


    <!-- end row -->
  </Layout>
</template>