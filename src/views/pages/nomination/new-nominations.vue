<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import {API} from "@/api";
import { format} from 'date-fns'
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
    title: "New Nomination",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, },
  data() {
    return {
      format,
      isError: false,
      isSuccess: false,
      isBusy: false,
      isLoading: true,
      isLoadingError: false,
      successMsg: "",
      errorMsg: "",
      title: "New Nomination",
      items: [
        {
          text: "Nomination",
          href: "/"
        },
        {
          text: "New Nomination",
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
      totalRows: 1,
      currentPage: 1,
      //perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: false,
      fields: [
       /* { key: "id", sortable: false, label: "S/N" },*/
        { key: "fullname", sortable: false, label: "Fullname" },
        { key: "staff_id", sortable: false, label: "Staff Id" },
        { key: "job_trade", sortable: false, label: "Department" },
        { key: "location", sortable: false, label: "Location" },
        { key: "action" }
      ]
    };
  },
  mounted() {
    API.get(" /employees").then(response => {
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

    API.get(`/training-schedule/approved/get/${0}`).then(response => {
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

    this.totalRows = this.selectedEmployees.length;
  },
  methods:{

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


    ScheduleSelectedChanged(){
      this.clearError();
      this.selectedSchedule = this.schedules.find( ({ id }) => id === this.schedule.value );
      this.selectedSchedule_department = this.selectedSchedule.department.name;
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
      await API.post("/nomination/create", data)
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

  },
  computed:{
    rows() {
      return this.selectedEmployees.length;
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
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



                      <!--
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
                                            </div>-->

<!--                      <a v-if="selectedSchedule.ts_status == 1" class="btn btn-secondary waves-effect mt-4" >
                        &lt;!&ndash;              <i class="mdi mdi-plus"></i>&ndash;&gt; Submit
                      </a>
                      &lt;!&ndash;v-if="selectedSchedule.ts_status ==1"&ndash;&gt;
                      <a v-if="selectedSchedule.ts_status ==1"  class="btn btn-secondary waves-effect mt-4 ml-3">
                        <i class="mdi mdi-pencil"></i> Edit
                      </a>-->

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
        <div class="card">
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
            <div>
                <b-table
                    striped
                    :items="selectedEmployees"
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
                    <a  class="text-danger" v-b-tooltip.hover title="Delete" @click="removeEmployee(row.item)">
                      <i class="mdi mdi-trash-can font-size-18"></i>
                    </a>
                  </template>
                </b-table>
              </div>
            <b-button v-if="!isBusy" variant="primary" class="w-sm mt-2" @click="submitNomination">Submit Nomination</b-button>
            <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
            </div>
          </div>
        </div>
      </div>

  </Layout>
</template>