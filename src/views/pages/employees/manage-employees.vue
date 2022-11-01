<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import EmployeesTable from "./employees-table";
import errorLoading from "@/components/error-loading";
import Multiselect from "vue-multiselect";
import {required,} from "vuelidate/lib/validators";
import {API} from "@/api";
import {mapActions} from 'vuex'

//const fullnameValidator = helpers.regex('alpha', /^[^\s]+( [^\s]+)+$/);

/**
 * Form-element component
 */
export default {
  page: {
    title: "Manage employees",
    meta: [{name: "description", content: appConfig.description}]
  },
  components: {Layout, PageHeader, EmployeesTable, errorLoading, Multiselect},
  data() {
    return {
      title: "Manage employees",
      items: [
        {
          text: "employees",
          href: "/"
        },
        {
          text: "Manage Employees",
          active: true
        }
      ],
      employees: [],
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
      location: "",
      selectedEmployee: ""
    };
  },
  validations: {
    //document: {required},
    /* fullname: {required, alpha},
     staffId: {required, minLength: minLength(4)},
     phone: {required, minLength: minLength(11)},
     email: {required, email},
     dob: {required},*/
    /* gradelevel: {required},
     designation: {required},*/
    department: {required},
    location: {required}
  },
  mounted() {
    //store.dispatch('employee/fetchEmployees')
    //this.employees = store.getters['employee/employeesList']
    //store.fetchEmployees();

    API.get("/employees").then(response => {
      this.loadComplete();
      this.employees = response.data;
      this.$router.push(
          this.$route.query.redirectFrom || {name: "Manage Employees"}
      );
    })
        .catch(e => {
          this.notifyLoadingError();
          console.log(e);

        })
  },
  methods: {
    ...mapActions(["fetchEmployees"]),
    onSelectedEmployee(employee) {
      this.selectedEmployee = employee;
      this.department = employee.job_trade;
      this.location = employee.location;
    },
    async saveChanges() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        this.processing();
        await API.post("/employee/update", {
          id: this.selectedEmployee.id,
          email: this.selectedEmployee.email,
          fullname: this.selectedEmployee.fullname,
          staff_id: this.selectedEmployee.staff_id,
          department: this.selectedEmployee.department,
          grade_level: this.selectedEmployee.gradelevel,
          designation: this.selectedEmployee.designation,
          phone: this.selectedEmployee.phone,
          location: this.location,
          type: this.department,
          job_trade: this.department,
        })
            .then(response => {
              this.completed();
              this.notifySuccess();
              this.showSuccess(response.data)
              console.log(response.data);
              /* this.$router.push(
                   this.$route.query.redirectFrom || {name: "M Employees"}
               );*/
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
    <PageHeader v-if="!isLoading" :items="items" :title="title"/>
    <div v-if="!isLoading && !isLoadingError" class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <EmployeesTable :employee-data="employees" @onSelectedEmployee="onSelectedEmployee"/>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <div v-if="isLoading && !isLoadingError" class="text-center justify-content-center mb-3">
      <b-spinner class="mt-5" role="status" style="width: 3rem; height: 3rem;" type="grow"
                 variant="primary"></b-spinner>
      <p class="text-primary">loading...</p>
    </div>
    <div v-if="isLoadingError" class="text-center justify-content-center mb-3 mt-5 m-5">
      <errorLoading/>
    </div>

    <b-modal
        id="modal-center"
        centered
        hide-footer
        size="lg"
        title="Update employee"
        title-class="font-size-12"
    >


      <div class="row">
        <div class="col-lg-1">
        </div>
        <div class="col-10">
          <PageHeader :items="items" :title="title"/>
        </div>
        <div class="col-lg-1">
        </div>
      </div>

      <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
      <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>

      <div class="row">
        <div class="col-lg-1">
        </div>
        <div class="col-10">
          <div class="">
            <div class="">
              <div class="card-title mb-3 text-muted"><em>Basic Information </em></div>
              <div class="row">
                <div class="col-12">
                  <form class="form-horizontal" role="form">
                    <b-form-group
                        id="fullname"
                        label="Fullname"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="text"
                    >
                      <b-form-input :value="selectedEmployee.fullname" disabled for="text" readonly></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="phonenumber"
                        label="Phone"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="number"
                    >
                      <b-form-input id="number" :value="selectedEmployee.phone" name="number"
                                    placeholder="e.g 0801234567890" type="number"></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="email"
                        label="Email"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="email"
                    >
                      <b-form-input id="email" :value="selectedEmployee.email" disabled placeholder="e.g abc@gmail.com"
                                    readonly></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="date"
                        label="Date of Birth"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="date"
                    >
                      <b-form-input id="date" :value="selectedEmployee.dob" placeholder="01/05/1987"
                                    type="date"></b-form-input>
                    </b-form-group>


                  </form>
                </div>
              </div>
              <!-- end row -->
            </div>
          </div>
          <!-- end card -->
        </div>
        <div class="col-lg-1">
        </div>
        <!-- end col -->
      </div>

      <div class="row">
        <div class="col-lg-1">
        </div>
        <div class="col-10">
          <div class="">
            <div class="">
              <div class="card-title mt-2 mb-3 "><em class="card-title mt-2 mb-3 text-muted">Official Information</em>
              </div>
              <div class="row">
                <div class="col-12">
                  <form class="form-horizontal" role="form">
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
                      <b-form-input :value="selectedEmployee.staff_id" disabled for="text" placeholder="e.g FG-TCN-002"
                                    readonly></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="Gradelevel"
                        label="Grade Lvl"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="designation"
                    >
                      <b-form-input id="number" :value="selectedEmployee.gradelevel" name="designation"
                                    placeholder="e.g Gl-14"></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="designation"
                        label="Designation"
                        label-cols-lg="2"
                        label-cols-sm="2"
                        label-for="designation"
                    >
                      <b-form-input id="number" :value="selectedEmployee.designation"
                                    name="designation" placeholder="e.g Head of Procurement"></b-form-input>
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
                      <b-button v-if="!isBusy" class="w-lg" type="button" variant="primary" @click="saveChanges()">Save
                        Changes
                      </b-button>
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
        <div class="col-lg-1">
        </div>
      </div>

    </b-modal>

  </Layout>
</template>