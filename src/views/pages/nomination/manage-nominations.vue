<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import NominationsTable from "./nomination-table";
import Multiselect from "vue-multiselect";
import axios from "axios";
import Vue from "vue";
import Swal from "sweetalert2";

var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0.00"); // displaying other groupings/separators is possible, look at the docs
});

/**
 * Form-element component
 */
export default {
  page: {
    title: "Manage Nominations",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,NominationsTable,Multiselect},
  data() {
    return {
      title: "Manage Nominations",
      items: [
        {
          text: "Nominations",
          href: "/"
        },
        {
          text: "Manage",
          active: true
        }
      ],
      isError:false,
      isSuccess:false,
      isBusy:false,
      isLoading:true,
      isLoadingError:false,
      successMsg:"",
      errorMsg:"",
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      years: [],
      year:"",
      departments:[],
      nominations:[],
      selectedNomination:"",
      selectedNomination_department:"",
      //New Nomination

      employee:null,
      employees: [],
      employees_sublist: [],
      schedules:[],
      schedule:null,
      selectedSchedule:null,
      schedules_sublist: [],
      selectedSchedule_department:"",
      //TABLE DETAILS
      selectedEmployees: [],

      //Employee
      employee_name:"",
      employee_staffid:"",
      employee_email:"",
      employee_jobtrade:"",
      employee_designation:"",
      //Training
      nominationTraining_title:"",
      nominationTraining_description:"",
      nominationTraining_start:"",
      nominationTraining_end:"",
      nominationTraining_cost:"",
      nominationTraining_department:"",
      nominationTraining_facilitator:"",
      nominationTraining_type:"",
      nominationTraining_year:"",
      nominationTraining_status:"",
      //Nominated By
      nominatedby:"",
      nominatedby_location:"",
      nominatedby_staffid:"",
      nominatedby_designation:""
    };
  },
  mounted() {

    axios.get(" http://127.0.0.1:8000/api/employees").then(response => {
      this.loadComplete();
      this.employees = response.data;
      this.employees.map( emp => {
        this.employees_sublist.push({
          value:emp.id,
          text:`${emp.fullname}  ${emp.staff_id}`
        });
      });

    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
      console.log(e);
    })

    axios.get(`http://127.0.0.1:8000/api/training-schedule/approved/get/${0}`).then(response => {
      this.loadComplete();
      this.schedules = response.data;
      this.schedules.map( sch => {
        this.schedules_sublist.push({
          value:sch.id,
          text:`${sch.ts_title}`
        });
      });
      console.log(response.data);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
    })


    axios.get(" http://127.0.0.1:8000/api/nomination/all-nominations").then(response => {
      this.loadComplete();
      this.nominations = response.data;
      console.log(this.nominations);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
      console.log(e);
    })

    axios.get(`http://127.0.0.1:8000/api/years`).then(response => {
      this.loadComplete();
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
      this.loadComplete();
      this.departments = response.data;
      console.log(response.data);
    }).catch(e => {
          this.notifyLoadingError();
          console.log(e);

        })


  },
  methods:{
    fetchNominationsById(){
      axios.get(`http://127.0.0.1:8000/api/nomination/nominations/${2}`).then(response => {
        this.loadComplete();
        this.schedules = response.data;
        this.schedules.map( sch => {
          this.schedules_sublist.push({
            value:sch.id,
            text:`${sch.ts_title}`
          });
        });
        console.log(response.data);
      }).catch(e => {
        this.notifyLoadingError();
        console.log(e);
      })
    },
    fetchNominationsByYear(){
      this.processing();
      axios.get(`http://127.0.0.1:8000/api/nomination/nominations/${this.year.value}`).then(response => {
       this.completed();
        this.schedules = response.data;
        this.schedules.map( sch => {
          this.schedules_sublist.push({
            value:sch.id,
            text:`${sch.ts_title}`
          });
        });
        console.log(response.data);
      }).catch(e => {
        this.notifyLoadingError();
        console.log(e);
      })
    },
    yearSelector({ text }){
      return `${ text }`;
    },
    periodChanged(){
      this.fetchNominationsByYear();
    },
    nominationSelected(rec){
      this.selectedNomination = rec;
      //employee
      this.employee_name = rec.nominated_employee.fullname;
      this.employee_email = rec.nominated_employee.email;
      this.employee_staffid = rec.nominated_employee.staff_id;
      this.employee_jobtrade = rec.nominated_employee.job_trade;
      this.employee_designation = rec.nominated_employee.designation;
      this.nominationTraining_department = this.departments.find( ({ id }) => id === rec.training.ts_department);
      this.nominationTraining_year = rec.year.y_year //this.years.find( ({ id }) => id === rec.training.ts_year);
      this.nominationTraining_title = rec.training.ts_title;
      this.nominationTraining_description = rec.training.ts_description;
      this.nominationTraining_start = rec.training.ts_start;
      this.nominationTraining_end = rec.training.ts_end;
      this.nominationTraining_cost= rec.training.ts_cost;
      this.nominationTraining_facilitator = rec.training.ts_facilitator;
      this.nominationTraining_type = rec.training.ts_type;
      this.nominationTraining_status = rec.training.ts_status;
      this.nominatedby = rec.nominated_by.fullname;
      this.nominatedby_location =  rec.nominated_by.location;
      this.nominatedby_staffid = rec.nominated_by.staff_id;
      this.nominatedby_designation = rec.nominated_by.designation;


    },
    approveNomination(){
      this.processing();
      axios.get(`http://127.0.0.1:8000/api/nomination/nominations/approve/${this.selectedNomination.id}`).then(response => {
        this.completed();
        this.$bvModal.hide('view-nomination');
        this.notifySuccess();
        this.showSuccess("Nomination Approved!");
        this.nominations = response.data;
        console.log(response.data);
      }).catch(e => {
        this.completed();
        this.$bvModal.hide('view-nomination');
        this.notifyError();
        //this.showError("Oops! an error occured while processing ");
        this.showError(e.response.data);
        //this.errorMsg = e.response.data;
        console.log(e);
      })
    },
    declineNomination(){
      this.processing();
      axios.get(`http://127.0.0.1:8000/api/nomination/nominations/decline/${this.selectedNomination.id}`).then(response => {
        this.completed();
        this.$bvModal.hide('view-nomination');
        this.nominations = response.data;
        this.notifySuccess();
        this.showSuccess("Nomination Declined!");
        console.log(response.data);
      }).catch(e => {
        this.completed();
        this.$bvModal.hide('view-nomination');
        this.notifyError();
        //this.showError("Oops! an error occured while processing ");
        this.showError(e.response.data);
        //this.errorMsg = e.response.data;
        console.log(e);
      })
    },
    employeeSelector({ text }){
      return `${ text }`;
    },

    scheduleSelector({ text }){
      return `${ text }`;
    },

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    addEmployee(){
      console.log(this.employee)
      this.clearError();
      const emp = this.employees.find( ({ id }) => id === this.employee.value );
      const data = this.selectedEmployees.find(({ id }) => id === this.employee.value);

      if(data == null){
        this.selectedEmployees.push(emp);
        this.employee = null;
      }
    },

    ScheduleSelectedChanged(){
      this.clearError();
      this.selectedSchedule = this.schedules.find( ({ id }) => id === this.schedule.value );
      this.selectedSchedule_department = this.selectedSchedule.department.name;
    },

    removeEmployee(employee){
      const index = this.selectedEmployees.find(({ id }) => id === employee.id);
      this.selectedEmployees.splice(index,1);
    },

    submitNomination(){
      if (this.selectedSchedule == null || this.selectedSchedule == ""){
        this.notifyError();
        this.showError("Please Select a Training");
        return;
      }
      if(this.selectedEmployees == null || this.selectedEmployees.length<=0)
      {
        this.notifyError();
        this.showError("Please Select at least one employee");
        return;
      }

      let ids = [];
      for (let i = 0; i < this.selectedEmployees.length ; i++) {
        ids.push(this.selectedEmployees[i].id);
      }
      let nomination_data = {
        ids:JSON.stringify(ids),
        schedule:this.selectedSchedule.id,
      };
      this.submitData(nomination_data)
    },

    async submitData(data)
    {
      this.processing();
      await axios.post("http://127.0.0.1:8000/api/nomination/create", data)
          .then(response => {
            this.completed();
            this.clearSelectedEmployees();
            this.notifySuccess();
            this.showSuccess( "Nomination Submitted Successfully");
            this.successmsg("<p class='font-size-18 text-muted'>Nominations Submitted</p>");
            console.log(response.data);
          })
          .catch(e => {
            this.completed();
            this.notifyError();
            this.showError(e.response.data);
            //this.errorMsg = e.response.data;
            console.log(e);

          })
    },

    clearSelectedEmployees(){
      this.selectedEmployees = [];
      this.selectedEmployees.length = 0;
    },
    successmsg(message) {
      Swal.fire("<h5 class='text-success'>Success!</h5>", `${message}`, "success");
    },


  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-10">
      </div>
      <div class="col-2">
        <b-button v-b-modal.new-nomination  class="w-lg"  variant="primary"> <i class="mdi mdi-plus mr-2"></i>New Nomination</b-button>
      </div>
    </div>
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
          <div v-if="isBusy" class="text-center justify-content-center mb-3">
            <b-spinner type="grow" class="mt-5" variant="primary" role="status" style="width: 3rem; height: 3rem;"></b-spinner>
            <p class="text-primary" >loading...</p>
          </div>
         <div class="p-3">
           <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
           <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
         </div>
          <div v-if="!isBusy" class="card-body">
            <NominationsTable :nominations="nominations" @onSelectedNomination="nominationSelected"/>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <b-modal
        id="view-nomination"
        size="lg"
        centered
        title="Training Nomination"
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
                <h5 class="font-size-14 my-1">{{nominationTraining_title}}</h5>
                <div><small class="text-muted"> {{nominationTraining_type}}</small></div>
                <small class="text-muted"> {{nominationTraining_start}} - {{nominationTraining_end}}</small>
              </div>
            </div>


           <div class="mb-3">
             <div class="media-body">
               <h5 class="font-size-14 my-1">{{employee_name}}</h5>
               <small class="text-muted">{{ employee_designation }} {{employee_staffid}}</small>
               <div>
                 <small class="text-muted">{{ employee_email }}</small>
               </div>
             </div>
           </div>

            <h4 class="mt-0 font-size-16">{{nominationTraining_title}}</h4>

            <p
                readonly
                v-html="this.nominationTraining_description">
            </p>

           <div class="row">

             <div class="col-4">
               <small class="text-muted">Department</small>
               <h5 class="mt-0 font-size-14">
                 {{nominationTraining_department.name}}
               </h5>
             </div>


             <div class="col-4">
               <small class="text-muted">Unit Cost </small>
               <h5 class="mt-0 font-size-14">
                 ₦ {{this.nominationTraining_cost | formatNumber}}
               </h5>
             </div>


             <div class="col-4">
               <small class="text-muted">Training Status</small>
               <div>
                 <b-badge v-if="nominationTraining_status == 1" variant="primary">Pending</b-badge>
                 <b-badge v-if="nominationTraining_status == 2"  variant="warning" class="">Pending</b-badge>
                 <b-badge v-if="nominationTraining_status == 3"  variant="danger" class="">Declined</b-badge>
                 <b-badge v-if="nominationTraining_status == 4"  variant="success" class="">Approved</b-badge>
                 <b-badge v-if="nominationTraining_status == 5"  variant="success" class="">Completed</b-badge>
               </div>
             </div>

           </div>



            <div class="row mt-3">

              <div class="col-4">
                <i class="mdi mdi-account-multiple"></i>
                <small class="text-muted">Facilitator</small>
                <h5 class="mt-0 font-size-14">
                  {{ nominationTraining_facilitator }}
                </h5>
              </div>

              <div class="col-4">
                <small class="text-muted">Training Year </small>
                <h5 class="mt-0 font-size-14">
                  {{ nominationTraining_year }}
                </h5>
              </div>

              <div class="col-4">
                <small class="text-muted">Nomination Status</small>
                <div>
                  <b-badge v-if="selectedNomination.nm_status == 1" variant="primary">Pending</b-badge>
                  <b-badge v-if="selectedNomination.nm_status == 2"  variant="success" class="">Approved</b-badge>
                  <b-badge v-if="selectedNomination.nm_status == 3"  variant="danger" class="">Declined</b-badge>
                  <b-badge v-if="selectedNomination.nm_status == 4"  variant="warning" class="">In Progress</b-badge>
                  <b-badge v-if="selectedNomination.nm_status == 5"  variant="dark" class="">Completed</b-badge>
                </div>
              </div>

            </div>

            <hr />

          <div class="row">
            <div class="col-3">
              <i class="mdi"></i>
              <small class="text-muted">Nominated By</small>
              <h5 class="mt-0 font-size-14">
                {{ nominatedby }}
              </h5>
            </div>

            <div class="col-3">
              <i class="mdi"></i>
              <small class="text-muted"> Location </small>
              <h5 class="mt-0 font-size-14">
                {{ nominatedby_location }}
              </h5>
            </div>
            <div class="col-3">
              <i class="mdi"></i>
              <small class="text-muted">Staff Id</small>
              <h5 class="mt-0 font-size-14">
                {{ nominatedby_staffid }}
              </h5>
            </div>

            <div class="col-3">
              <i class="mdi"></i>
              <small class="text-muted">Designation</small>
              <h5 class="mt-0 font-size-14">
                {{ nominatedby_designation }}
              </h5>
            </div>

          </div>

           <div v-if=" selectedNomination.nm_status === 1">
             <a v-if="!isBusy" class="btn btn-primary waves-effect mt-4" @click="approveNomination">
               <i class="mdi mdi-check-all" ></i> Approve
             </a>

             <a  v-if="!isBusy" class="btn btn-danger waves-effect mt-4 ml-4" @click="declineNomination">
               <i class="mdi mdi-close"></i> Decline
             </a>
           </div>

           <b-spinner v-if="isBusy" class="m-2" role="status" variant="primary"></b-spinner>

          </div>
        </div>
      </div>

    </b-modal>


    <b-modal
        id="new-nomination"
        size="lg"
        centered
        title="Training Nomination"
        title-class="font-size-14"
        hide-footer
    >
      <div class="row">
        <div class="col-12">
          <div class="">
            <div class="card-body">
              <h4 class="card-title ">New Nomination</h4>
              <div class="row">
                <div class="col-12">
                  <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
                  <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
                  <form class="form-horizontal" role="form">
                    <b-form-group
                        id="training"
                        label="Select Training"
                        label-for="text"
                    >
                      <multiselect v-model="schedule" :options="schedules_sublist"  @input="ScheduleSelectedChanged" :custom-label="scheduleSelector" :allow-empty="false" ></multiselect>
                    </b-form-group>
                  </form>

                  <div class="mb-3">
                    <div class="">
                      <div v-if="selectedSchedule!=null" >
                        <div class="media mb-4">
                          <!--                        <img
                                                      class="d-flex mr-3 rounded-circle avatar-sm"
                                                      src="@/assets/images/tcnlogo.png"
                                                      alt="Generic placeholder image"
                                                  />-->
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

                        <div class="row">
                          <div class="col-2">
                            <div>
                              <small class="text-muted">Department</small>
                              <h5 class="mt-0 font-size-14">
                                {{selectedSchedule_department}}
                              </h5>
                            </div>
                          </div>

                          <div class="col-2">
                            <div>
                              <small class="text-muted">Unit Cost </small>
                              <h5 class="mt-0 font-size-14">
                                ₦ {{this.selectedSchedule.ts_cost | formatNumber}}
                              </h5>
                            </div>
                          </div>

                          <div class="col-2">
                            <div>
                              <small class="text-muted">Status</small>
                              <div>
                                <b-badge v-if="selectedSchedule.ts_status == 1" variant="primary">Pending</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 4"  variant="success" class="">Approved</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 2"  variant="warning" class="">Submitted</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 3"  variant="danger" class="">Declined</b-badge>
                              </div>
                            </div>
                          </div>

                          <div class="col-5">
                            <div>
                              <i class="mdi mdi-account-multiple"></i>
                              <small class="text-muted">Facilitator</small>
                              <h5 class="mt-0 font-size-14">
                                {{selectedSchedule.ts_facilitator}}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end row -->
            </div>
          </div>
          <!-- end card -->
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="">
            <div class="card-body">
              <form class="form-horizontal" role="form">
                <b-form-group
                    id="select-employee"
                    label="Select Employees"
                    label-for="type"
                >
                  <multiselect v-model="employee" :options="employees_sublist" :custom-label="employeeSelector"  track-by="value"></multiselect>
                  <b-button  variant="primary" @click="addEmployee"  class="w-sm mt-2"><i class="mdi mdi-plus"></i>Add Employee</b-button>
                </b-form-group>

              </form>
              <h4 class="card-title">Employees</h4>
              <p class="card-title-desc">
                Selected Employees
              </p>
              <div class="w-100">
<!--                <b-table
                    style="max-width: 100%"
                    striped
                    :items="selectedEmployees"
                    :fields="fields"
                     responsive="lg"
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
                    <a  class="text-danger" v-b-tooltip.hover title="Delete" @click="removeEmployee(row.item)">
                      <i class="mdi mdi-trash-can font-size-18"></i>
                    </a>
                  </template>
                </b-table>-->

                <div class="table-responsive">
                  <table class="table table-striped mb-0">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>FullName</th>
                      <th>Staff-ID</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody v-for="(employee, index) in selectedEmployees" v-bind:key="index" >
                    <tr>
                      <th scope="row">{{ index }}</th>
                      <td>{{employee.fullname}}</td>
                      <td>{{employee.staff_id}}</td>
                      <td>{{employee.job_trade}}</td>
                      <td>{{employee.location}}</td>
                      <td><i class=" btn mdi mdi-trash-can font-size-18" @click="removeEmployee"></i></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <b-button v-if="!isBusy" variant="primary" class="w-sm mt-2" @click="submitNomination">Submit Nomination</b-button>
              <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
            </div>
          </div>
        </div>
      </div>

    </b-modal>
  </Layout>
</template>