 <script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import UsersTable from "./approvers-table";
import errorLoading from "@/components/error-loading";
import Multiselect from "vue-multiselect";
import {email, required, helpers, minLength,} from "vuelidate/lib/validators";
import {API} from "@/api";
import Swal from "sweetalert2";

const alpha = helpers.regex('alpha', /^[^\s]+( [^\s]+)+$/);

/**
 * Form-element component
 */
export default {
  page: {
    title: "users",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: {
    Layout,
    PageHeader,
    UsersTable,
    errorLoading,
    Multiselect
  },
  data() {
    return {
      title: "Setup & Manage Approval Hierarchy",
      items: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Users",
          active: true
        }
      ],
      userData:[
        {
          "id": 1,
          "fullname": "Abdulaziz Sule Ahmed",
          "email": "AbdulazizgFGRf@tcn.com",
          "staff_id": "607026",
          "status": 1,
          "usertype": 1,
          "uuid": "627d8e1bd210a",
          "remember_token": null,
          "created_at": "2022-05-12T22:45:47.000000Z",
          "updated_at": "2022-05-12T22:45:47.000000Z"
        },
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      isError:false,
      isLoading:true,
      isLoadingError:false,
      isSuccess:false,
      isBusy:false,
      successMsg:"",
      errorMsg:"",
      fullname:"",
      email:"",
      staffId:"",
      fields: [
        /* { key: "id", sortable: false, label: "S/N" },*/
        { key: "fullname", sortable: false, label: "Fullname" },
        { key: "staff_id", sortable: false, label: "Staff Id" },
        { key: "job_trade", sortable: false, label: "Department" },
        { key: "location", sortable: false, label: "Location" },
        { key: "action" }
      ],
      user:null,
      users: [],
      users_sublist: [],
      filter: null,
      filterOn: [],
      selectedUsers: [],
      approversList:[]
    };
  },
  validations: {
    fullname: { required, alpha},
    email: { required, email },
    staffId:{required, minLength: minLength(4)}
  },
  methods:{
    userSelector({ text }){
      return `${ text }`;
    },
    async createUser(){
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      else{
          this.processing();
          await API.post("user/create", {
            email: this.email,
            fullname: this.fullname,
            staff_id:this.staffId
          })
              .then(response => {
                this.completed();
                this.notifySuccess();
                this.showSuccess(response.data)
                console.log(response.data);
               this.$router.push(
                    this.$route.query.redirectFrom || { name: "Approval-setup" }
                );
              })
              .catch(e => {
                this.completed();
                this.notifyError();
                this.showError(e.response.data);
                //this.errorMsg = e.response.data;
                console.log(e);

              })
      }

    },
    addUser(){
      console.log(this.user)
      this.clearError();
      const usr = this.users.find( ({ id }) => id === this.user.value );
      const data = this.selectedUsers.find(({ id }) => id === this.user.value);
      if(data == null){
        this.selectedUsers.push(usr);
        this.user = null;
      }
    },
    removeUser(user){
      const index = this.selectedUsers.find(({ id }) => id === user.id);
      this.selectedUsers.splice(index,1);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    submitApprovers(){
      let ids = [];
      for (let i = 0; i < this.selectedUsers.length ; i++) {
        ids.push(this.selectedUsers[i].id);
      }
      let data = {
        approvers:JSON.stringify(ids),
      };
      this.submitData(data);
    },

    async submitData(data) {
      this.processing();
      await API.post("/approvers/create", data)
          .then(response => {
            this.completed();
            this.clearSelectedEmployees();
            this.notifySuccess();
            this.showSuccess( "Approvers Updated Successfully");
            this.successmsg("<p class='font-size-18 text-muted'>Approvers Updated Successfully</p>");
            console.log(response.data);
          }).catch(e => {
            this.completed();
            this.notifyError();
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);

          })
    },

    clearSelectedEmployees(){
      this.selectedUsers = [];
      this.selectedUsers.length = 0;
    },

    successmsg(message) {
      Swal.fire("<h5 class='text-success'>Success!</h5>", `${message}`, "success");
    },

  },
  mounted() {
    API.get("/users").then(response => {
      this.loadComplete();
      this.userData = response.data;
      //console.log(response.data);
      this.$router.push(
          this.$route.query.redirectFrom || {name: "Approval-setup"}
      );
    }).catch(e => {
          this.notifyLoadingError();
          console.log(e);
        })


    API.get("/employees").then(response => {
      this.loadComplete();
      this.users = response.data;
      this.users.map( usr => {
        this.users_sublist.push({
          value:usr.id,
          text:`${usr.fullname}  ${usr.staff_id}`
        });
      });

    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
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


    //this.totalRows = this.selectedEmployees.length;

  },
};
</script>

<template>
  <Layout>
    <PageHeader v-if="!isLoading" :title="title" :items="items" />
    <div v-if="!isLoading && !isLoadingError">

  <!--      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <b-alert  v-if="isSuccess" show dismissible variant="success">{{successMsg}}</b-alert>
              <b-alert v-if="isError" show dismissible variant="danger">{{errorMsg}}</b-alert>
              <h4 class="card-title mb-5"> Add a user to the Approval Hierarchy</h4>

              <div class="row">
                <div class="col-12">
                  <form class="form-horizontal" role="form" @submit.prevent="createUser">
                    <b-form-group
                        id="fullname"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label="Fullname"
                        label-for="text"
                    >
                      <b-form-input v-model="fullname" @blur= "$v.fullname.$touch()" :class="{ 'is-invalid':$v.fullname.$error }" id= "fullname" for="fullname" placeholder="E.g Johny Dudus"></b-form-input>
                      <div v-if="$v.fullname.$error" class="invalid-feedback">
                        <span v-if="!$v.fullname.required">Fullname is required.</span>
                        <span v-if="!$v.fullname.alpha">Please enter valid name.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="email"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label="Email"
                        label-for="email"
                    >
                      <b-form-input  v-model="email" @blur="$v.email.$touch()" id="email" placeholder="E.g me@yahoo.com" :class="{ 'is-invalid':$v.email.$error }"></b-form-input>
                      <div v-if="$v.email.$error" class="invalid-feedback">
                        <span v-if="!$v.email.required">Email is required.</span>
                        <span v-if="!$v.email.email">Please enter valid email.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="staffid"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label="Staff-Id"
                        label-for="staffid"
                    >
                      <b-form-input  v-model="staffId" @blur="$v.staffId.$touch()" id="email" placeholder="E.g xzq23c" :class="{ 'is-invalid':$v.staffId.$error }"></b-form-input>
                      <div v-if="$v.staffId.$error" class="invalid-feedback">
                        <span v-if="!$v.staffId.required">Staff Id is required.</span>
                        <span v-if="!$v.staffId.minLength">Staff Id must be at least 4 characters.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="submit-btn"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label=""
                        label-for=""
                    >
                      <b-button v-if="!isBusy" type="submit" variant="primary" class="w-lg">Submit</b-button>
                      <b-spinner v-else class="m-2" variant="primary" role="status"></b-spinner>
                    </b-form-group>

                  </form>
                </div>
              </div>
              &lt;!&ndash; end row &ndash;&gt;
            </div>
          </div>
          &lt;!&ndash; end card &ndash;&gt;
        </div>

        &lt;!&ndash; end col &ndash;&gt;
      </div>-->

      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <form class="form-horizontal" role="form">
                <b-form-group
                    id="select-employee"
                    label="Select Employees"
                    label-for="type"
                >
                  <multiselect v-model="user" :options="users_sublist" :custom-label="userSelector"  track-by="value"></multiselect>
                  <b-button  variant="primary" @click="addUser"  class="w-sm mt-2"><i class="mdi mdi-plus"></i>Add Employee</b-button>
                </b-form-group>

              </form>
              <h4 class="card-title">Approval List</h4>
              <p class="card-title-desc">
                Selected Users
              </p>
              <div>
                <b-table
                    striped
                    :items="selectedUsers"
                    :fields="fields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                >
                  <template v-slot:cell(paymentstatus)="row">
                    <div
                        class="badge font-size-12"
                        :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
              'badge-soft-success': `${row.value}` === 'Paid',
              'badge-soft-warning': `${row.value}` === 'Unpaid'}"
                    >{{ row.value}}</div>
                  </template>

                  <template v-slot:cell(action)="row">
                    <a  class="text-danger" v-b-tooltip.hover title="Delete" @click="removeUser(row.item)">
                      <i class="mdi mdi-trash-can font-size-18"></i>
                    </a>
                  </template>
                </b-table>
              </div>
              <b-button v-if="!isBusy" variant="primary" class="w-sm mt-2" @click=submitApprovers >Submit</b-button>
              <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
            </div>
          </div>
        </div>
      </div>




      <!-- end row -->
      <div class="row">
        <div class="col-lg-12">
          <div class="row">
            <div class="col-12">
              <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
              <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Users</h4>
              <p class="card-title-desc">
                All registered users
              </p>
              <div class="col-lg-12">
                <UsersTable :items="approversList"/>
              </div>
            </div>
          </div>
        </div>
        <!--      <div class="col-lg-6">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Range Inputs</h4>
                    <p class="card-title-desc">
                      Set horizontally scrollable range inputs using
                      <code>.form-control-range</code>.
                    </p>

                    <div>
                      <h5 class="font-size-14">Example</h5>
                      <input id="formControlRange" type="range" class="form-control-range" />
                    </div>
                    <div class="mt-4">
                      <h5 class="font-size-14">Custom Range</h5>
                      <b-form-input id="custom-range" type="range"></b-form-input>

                      <b-form-input id="customRange2" class="mt-4" type="range" min="0" max="5"></b-form-input>
                    </div>
                  </div>
                </div>
              </div>-->
      </div>
    </div>
    <div v-if="isLoading && !isLoadingError" class="text-center justify-content-center mb-3">
      <b-spinner type="grow" class="mt-5" variant="primary" role="status" style="width: 3rem; height: 3rem;"></b-spinner>
      <p class="text-primary" >loading...</p>
    </div>
    <div v-if="isLoadingError" class="text-center justify-content-center mb-3 mt-5 m-5">
      <errorLoading/>
    </div>


<!--    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Checkboxes</h4>

            <div class="row">
              <div class="col-md-6">
                <div>
                  <h5 class="font-size-14 mb-4">Default Checkboxes</h5>
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" value id="defaultCheck1" />
                    <label class="form-check-label" for="defaultCheck1">Default checkbox</label>
                  </div>
                  <div class="form-check form-check-right">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value
                      id="defaultCheck2"
                      checked
                    />
                    <label class="form-check-label" for="defaultCheck2">Default checkbox</label>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mt-4 mt-lg-0">
                  <h5 class="font-size-14 mb-4">Custom Checkboxes</h5>
                  <div class="custom-control custom-checkbox mb-3">
                    <input type="checkbox" class="custom-control-input" id="customCheck1" checked />
                    <label class="custom-control-label" for="customCheck1">Custom checkbox</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-right">
                    <input type="checkbox" class="custom-control-input" id="customCheck2" />
                    <label class="custom-control-label" for="customCheck2">Custom checkbox</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Radios</h4>

            <div class="row">
              <div class="col-md-6">
                <div>
                  <h5 class="font-size-14 mb-4">Default Radios</h5>
                  <div class="form-check mb-3">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios1"
                      value="option1"
                      checked
                    />
                    <label class="form-check-label" for="exampleRadios1">Default radio</label>
                  </div>
                  <div class="form-check form-check-right">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios2"
                      value="option2"
                    />
                    <label class="form-check-label" for="exampleRadios2">Default radio</label>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mt-4 mt-lg-0">
                  <h5 class="font-size-14 mb-4">Custom Radios</h5>
                  <div class="custom-control custom-radio mb-3">
                    <input
                      type="radio"
                      id="customRadio1"
                      name="customRadio"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="customRadio1">Toggle this custom radio</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-right">
                    <input
                      type="radio"
                      id="customRadio2"
                      name="customRadio"
                      class="custom-control-input"
                      checked
                    />
                    <label
                      class="custom-control-label"
                      for="customRadio2"
                    >Or toggle this other custom radio</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Switches</h4>
            <p class="card-title-desc">
              A switch has the markup of a custom checkbox but uses the
              <code>.custom-switch</code> class to render a toggle switch. Switches also support the
              <code>disabled</code> attribute.
            </p>
            <b-form-checkbox v-model="checked" switch class="mb-1">
              <label>Toggle this switch element</label>
            </b-form-checkbox>
            <b-form-checkbox switch disabled>
              <label>Disabled switch element</label>
            </b-form-checkbox>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">File browser</h4>
            <p class="card-title-desc">
              The file input is the most gnarly of the bunch and requires additional JavaScript if you’d like to hook them up with functional
              <em>Choose file…</em> and selected file name text.
            </p>
            <div class="custom-file">
              <input id="customFile" type="file" class="custom-file-input" />
              <label class="custom-file-label" for="customFile">Choose file</label>
            </div>
          </div>
        </div>
      </div>
    </div>-->
    <!-- end row -->
  </Layout>
</template>