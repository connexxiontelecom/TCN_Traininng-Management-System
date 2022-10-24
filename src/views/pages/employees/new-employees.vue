<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
import {email, helpers, minLength, required,} from "vuelidate/lib/validators";
import axios from "axios";

const alpha = helpers.regex('alpha', /^[^\s]+( [^\s]+)+$/);
/**
 * Form-element component
 */
export default {
  page: {
    title: "New employees",
    meta: [{name: "description", content: appConfig.description}]
  },

  components: {Layout, PageHeader, Multiselect},
  data() {
    return {
      title: "New employees",
      items: [
        {
          text: "employees",
          href: "/"
        },
        {
          text: "New employees",
          active: true
        }
      ],
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
      isError: false,
      documenterror: false,
      isSuccess: false,
      isDocumentSuccess:false,
      isBusy: false,
      successMsg: "",
      documentSuccessMsg: "",
      errorMsg: "",
      document: "",
      filename: "Choose File",
      fullname: "",
      phone: "",
      email: "",
      dob: "",
      staffId: "",
      department: "",
      gradelevel: "",
      designation: "",
      location: ""
    };
  },
  validations: {
    //document: {required},
    fullname: {required, alpha},
    staffId: {required, minLength: minLength(4)},
    phone: {required, minLength: minLength(11)},
    email: {required, email},
    dob: {required},
    department: {required},
    gradelevel: {required},
    designation: {required},
    location: {required}
  },
  methods: {
    clearErrors() {
      this.documenterror = false;
      this.isError = false;
      this.errorMsg = "";
      this.successMsg = false;
      this.isSuccess = false;
    },
    handleFileUpload() {
      this.document = event.target.files[0];
      this.filename = this.document.name;
      this.clearErrors();
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
    async submitEmployeeForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
      return;
      } else {
        this.processing();
        await axios.post("http://127.0.0.1:8000/api/employee/create", {
          email: this.email,
          fullname: this.fullname,
          staff_id: this.staffId,
          department: this.department,
          grade_level: this.gradelevel,
          designation: this.designation,
          phone:this.phone,
          location: this.location,
          type:this.department,
          job_trade: this.department,
        })
            .then(response => {
              this.completed();
              this.notifySuccess();
              this.showSuccess(response.data)
              console.log(response.data);
              this.$router.push(
                  this.$route.query.redirectFrom || {name: "New Employees"}
              );
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
    <PageHeader :items="items" :title="title"/>

    <div>
      <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
      <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
      <form class="form-horizontal" role="form" @submit.prevent="submitEmployeeForm">
        <div class="row">
          <div class="col-8">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title mb-5">Basic Information </h4>
                <div class="row">
                  <div class="col-12">

                    <b-form-group
                        id="fullname"
                        label="Fullname"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="text"
                    >
                      <b-form-input v-model="fullname" :class="{ 'is-invalid':$v.fullname.$error }" for="text"
                                    placeholder="e.g Edet Effiong "
                                    @blur="$v.fullname.$touch()"></b-form-input>
                      <div v-if="$v.fullname.$error" class="invalid-feedback">
                        <span v-if="!$v.fullname.required">Fullname is required.</span>
                        <span v-if="!$v.fullname.alpha">Please enter valid name.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="phonenumber"
                        label="Phone"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="number"
                    >
                      <b-form-input id="phone" v-model="phone" :class="{ 'is-invalid':$v.phone.$error }"
                                    name="phone" placeholder="e.g 0801234567890" type="number" value=""
                                    @blur="$v.phone.$touch()">

                      </b-form-input>
                      <div v-if="$v.phone.$error" class="invalid-feedback">
                        <span v-if="!$v.phone.required">Phone-number is required.</span>
                        <span v-if="!$v.phone.minLength">Phone be must be at least 11 characters.</span>
                      </div>

                    </b-form-group>

                    <b-form-group
                        id="email"
                        label="Email"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="email"
                    >
                      <b-form-input id="email" v-model="email" :class="{ 'is-invalid':$v.email.$error }"
                                    placeholder="e.g abc@gmail.com" value="" @blur="$v.email.$touch()"></b-form-input>
                      <div v-if="$v.email.$error" class="invalid-feedback">
                        <span v-if="!$v.email.required">Email is required.</span>
                        <span v-if="!$v.email.email">Please enter a valid email.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="date"
                        label="Date of Birth"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="date"
                    >
                      <b-form-input id="date" v-model="dob" :class="{ 'is-invalid':$v.dob.$error }"
                                    placeholder="01/05/1987" type="date" @blur="$v.dob.$touch()"></b-form-input>
                      <div v-if="$v.dob.$error" class="invalid-feedback">
                        <span v-if="!$v.dob.required">Date of Birth is required.</span>
                      </div>
                    </b-form-group>

                  </div>
                </div>
                <!-- end row -->
              </div>
            </div>
            <!-- end card -->
          </div>
          <div class="col-lg-4">
            <form class="form-horizontal" role="form" @submit.prevent="submitFile">
              <div class="card">
                <div class="card-body">
                  <b-alert v-if="isDocumentSuccess" dismissible show variant="success">{{ documentSuccessMsg }}</b-alert>
                  <b-alert v-if="documenterror" show variant="danger">{{ errorMsg }}</b-alert>
                  <h4 class="card-title">Upload CSV File</h4>
                  <p class="card-title-desc">
                    Upload a CSV file that contains employees information
                  </p>
                  <div class="custom-file">
                    <input id="file" class="custom-file-input"  type="file"
                           v-on:change="handleFileUpload()"/>
                    <!--                    <input id="file" :class="{'is-invalid':$v.document.$error }" class="custom-file-input"
                                               type="file" @blur="$v.document.$touch()"
                                               v-on:change="handleFileUpload()"/>-->
                    <label class="custom-file-label" for="file">{{ filename }}</label>
                    <!--                    <div v-if="$v.document.$error" class="invalid-feedback">
                                          <span v-if="!$v.document.required">Please select a file .</span>
                                        </div>-->
                  </div>

                  <b-form-group
                      id="submit-csv"
                      class="mt-4"
                      label=""
                      label-for=""
                  >
                    <b-button v-if="!isBusy" class="w-lg" type="submit" variant="primary"
                              @change="handleFileUpload( $event )">Submit
                    </b-button>
                    <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
                  </b-form-group>

                </div>
              </div>
            </form>
          </div>
          <!-- end col -->
        </div>

        <div class="row">
          <div class="col-8">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title mb-5">Official Information</h4>
                <div class="row">
                  <div class="col-12">
                    <b-form-group
                        id="select"
                        label="Department"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="type"
                    >
                      <multiselect v-model="department" :class="{ 'is-invalid':$v.department.$error }"
                                   :options="options" @blur="$v.department.$touch()"
                                   @input="$v.department.$touch()"></multiselect>
                      <div v-if="$v.department.$error" class="invalid-feedback">
                        <span v-if="!$v.department.required">Please select a department.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="staffid"
                        label="Staff Id"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="text"
                    >
                      <b-form-input v-model="staffId" :class="{ 'is-invalid':$v.staffId.$error }"
                                    for="text" placeholder="e.g FG-TCN-002"
                                    @blur="$v.staffId.$touch()"></b-form-input>
                      <div v-if="$v.staffId.$error" class="invalid-feedback">
                        <span v-if="!$v.staffId.required">Staff Id is required.</span>
                        <span v-if="!$v.staffId.minLength">Staff Id must be at least 4 Characters </span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="Gradelevel"
                        label="Grade Level"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="designation"
                    >
                      <b-form-input id="gradelevel" v-model="gradelevel"
                                    :class="{ 'is-invalid':$v.gradelevel.$error }" name="designation"
                                    placeholder="e.g Gl-14"
                                    @blur="$v.gradelevel.$touch()"></b-form-input>
                      <div v-if="$v.gradelevel.$error" class="invalid-feedback">
                        <span v-if="!$v.gradelevel.required">Grade Level is required.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="designation"
                        label="Designation"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="designation"
                    >
                      <b-form-input id="designation" v-model="designation"
                                    :class="{ 'is-invalid':$v.designation.$error }" name="designation"
                                    placeholder="e.g Head of Procurement"
                                    value=""
                                    @blur="$v.designation.$touch()"></b-form-input>
                      <div v-if="$v.designation.$error" class="invalid-feedback">
                        <span v-if="!$v.designation.required"> Designation is required </span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="location"
                        label="Location"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="type"
                    >
                      <multiselect v-model="location" :class="{ 'is-invalid':$v.location.$error }"
                                   :options="options" @blur="$v.location.$touch()"
                                   @input="$v.location.$touch()"></multiselect>
                      <div v-if="$v.location.$error" class="invalid-feedback">
                        <span v-if="!$v.location.required">Please select a location.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="submit-btn"
                        label=""
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for=""
                    >
                      <b-button class="w-lg" type="submit" variant="primary">Submit</b-button>
                    </b-form-group>

                  </div>
                </div>
                <!-- end row -->
              </div>
            </div>
            <!-- end card -->
          </div>
        </div>
      </form>

    </div>


    <!-- end row -->
  </Layout>
</template>