<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
import axios from "axios";
import { required,} from "vuelidate/lib/validators";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
/**
 * Form-element component
 */
export default {
  page: {
    title: "New recommendations",
    meta: [{name: "description", content: appConfig.description}]
  },
  components: {Layout, PageHeader, Multiselect,  ckeditor: CKEditor.component },
  data() {
    return {
      title: "New recommendations",
      items: [
        {
          text: "Trainings",
          href: "/"
        },
        {
          text: "New recommendations",
          active: true
        }
      ],
      editor: ClassicEditor,
      editorData:"",
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      document:"",
      employees: [],
      employees_sublist: [],
      names:[],
      options:[
          "Technical",
          "Non-Technical"
      ],
      regions:[
          "Minna",
          "Suleja",
          "New Bussa",
          "HQ"
      ],
      isError: false,
      isSuccess: false,
      isBusy: false,
      isLoading: true,
      isLoadingError: false,
      successMsg: "",
      errorMsg: "",
      selectedEmployees:"",
      type:"",
      Title:"",
      Description:"",
      TypeofTraining:"",
      Designation:"",
      Region:"",

    };
  },
  validations: {
    selectedEmployees: {required},
    TypeofTraining: {required},
    Title: {required},
    editorData: {required},
    //Description: {required},
   //Designation: {required},
    // Region: {required},
  },
  mounted() {
    axios.get(" http://127.0.0.1:8000/api/employees").then(response => {
      this.loadComplete();
      //var names = [];
      this.employees = response.data;
      this.employees.map( emp => {
        this.names.push({
          value:emp.id,
          text:`${emp.fullname}  ${emp.staff_id}`
        });
        //names.push(`${value.fullname}  ${value.staff_id}`);
      });

    }).catch(e => {
          this.notifyLoadingError();
          console.log(e);
          console.log(e);
        })
  },
  methods:{
    employeeSelector({ text }){
      return `${ text }`;
    },
    async submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        //alert(JSON.stringify(this.selectedEmployees));
        let formData = new FormData();
        formData.append('document', this.document);
        formData.append('employees', JSON.stringify(this.selectedEmployees) );
        formData.append('TypeofTraining', this.TypeofTraining);
        formData.append('Title', this.Title);
        formData.append('Description', this.editorData);
        this.processing();
        await axios.post("http://127.0.0.1:8000/api/recommendations/create",
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
        )

          /*employee: this.employee.value,
          TypeofTraining:this.TypeofTraining,
          Title:this.Title,
          Description:this.Description,
          Designation:this.Designation,
          Region:this.Region,*/

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
    async submitFile() {
      var fileExt = this.filename.split('.').pop();
      this.clearErrors();
      if (this.document == "" || this.document === null || this.filename.trim().length <= 0) {
        this.documenterror = true;
        this.errorMsg = "Please Select a file"

      } else if (fileExt.toLowerCase() != "csv") {
        this.documenterror = true;
        this.errorMsg = "File Format must be a .csv"

      } else {
        let formData = new FormData();
        formData.append('document', this.document);
        this.processing();
        await axios.post('http://127.0.0.1:8000/api/employees/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
        ).then(response => {
          this.completed();
          this.isDocumentSuccess = true;
          this.documentSuccessMsg = response.data;
          console.log(response.data);
          this.$router.push(
              this.$route.query.redirectFrom || {name: "New Employees"}
          );
        })
            .catch(e => {
              this.completed();
              this.documenterror = true;
              this.errorMsg = "Error Occurred while processing file! Please try again";
              //this.notifyError();
              //this.showError(e.response.data);
              //this.errorMsg = e.response.data;
              console.log(e);

            })
      }
    },
    handleFileUpload() {
      this.document = event.target.files[0];
      this.filename = this.document.name;
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :items="items" :title="title"/>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
            <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
            <h5 class="card-title mb-5">Create new recommendation</h5>
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" role="form" @submit.prevent="submitForm">
                  <b-form-group
                      id="title"
                      label="Title"
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="designation"
                  >
                    <b-form-input v-model="Title" :class="{ 'is-invalid':$v.Title.$error }"
                                  @blur="$v.Title.$touch()"   id="title" name="title" placeholder="e.g Construction techniques"
                                  value=""></b-form-input>
                    <div v-if="$v.Title.$error" class="invalid-feedback">
                      <span v-if="!$v.Title.required">Title of training is required</span>
                    </div>

                  </b-form-group>

                  <b-form-group
                      id="select"
                      label="Type of training"
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="type"
                  >
                    <multiselect v-model="TypeofTraining" :class="{ 'is-invalid':$v.TypeofTraining.$error }" @blur="$v.TypeofTraining.$touch()"  :options="options"></multiselect>
                    <div v-if="$v.TypeofTraining.$error" class="invalid-feedback">
                      <span v-if="!$v.TypeofTraining.required">Please indicate type of training</span>
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

                  <b-form-group
                      id="staffid"
                      label="Employee"
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="text"
                  >
                    <multiselect
                        v-model="selectedEmployees"
                        :class="{ 'is-invalid':$v.selectedEmployees.$error }"
                        @blur="$v.selectedEmployees.$touch()"
                        :options="names"
                        :custom-label="employeeSelector"
                        onchange=""
                        track-by="value"
                        :multiple="true"
                    ></multiselect>
                    <div v-if="$v.selectedEmployees.$error" class="invalid-feedback">
                      <span v-if="!$v.selectedEmployees.required">Please select at least 1 employee</span>
                    </div>
                  </b-form-group>


                  <b-form-group
                      id=""
                      label="Upload file"
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="text"
                  >
                    <div class="custom-file">
                      <input id="file" class="custom-file-input" type="file"
                             v-on:change="handleFileUpload()"/>
                      <!--                    <input id="file" :class="{'is-invalid':$v.document.$error }" class="custom-file-input"
                                                 type="file" @blur="$v.document.$touch()"
                                                 v-on:change="handleFileUpload()"/>-->
                      <label class="custom-file-label" for="file">{{ filename }}</label>
                      <!--                    <div v-if="$v.document.$error" class="invalid-feedback">
                                            <span v-if="!$v.document.required">Please select a file .</span>
                                          </div>-->
                    </div>

                  </b-form-group>



<!--                  <b-form-group
                      id="designation"
                      label="Designation"
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="designation"
                  >
                    <b-form-input v-model="Designation" :class="{ 'is-invalid':$v.Designation.$error }" @blur="$v.Designation.$touch()" id="designation" name="designation" placeholder="e.g Supervisor"
                                  value=""></b-form-input>
                    <div v-if="$v.Designation.$error" class="invalid-feedback">
                      <span v-if="!$v.Designation.required">Please indicate designation</span>
                    </div>
                  </b-form-group>

                  <b-form-group
                      id="region"
                      label="Region"
                      label-cols-lg="2"
                      label-cols-sm="2"
                      label-for="text"
                  >
                    <multiselect  :class="{ 'is-invalid':$v.Region.$error }" @blur="$v.Region.$touch()" v-model="Region" :options="regions"></multiselect>
                    <div v-if="$v.Region.$error" class="invalid-feedback">
                      <span v-if="!$v.Region.required">Please select a region</span>
                    </div>
                  </b-form-group>-->

                  <b-form-group
                      id="submit-btn"
                      label=""
                      label-cols-lg="2"
                      label-cols-sm="2"
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