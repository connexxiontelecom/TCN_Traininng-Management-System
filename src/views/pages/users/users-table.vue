<script>
/**
 * Transactions component
 */
import Multiselect from "vue-multiselect";
import axios from "axios";
export default {
  props: {
    items:[]
  },
  components: {
    Multiselect,
  },
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: false,
      fields: [
        { key: "id", sortable: false, label: "S/N" },
        { key: "staff_id", sortable: false,label: "Staff ID" },
        { key: "fullname", sortable: false, label: "Full Name" },
        { key: "email", sortable: false, label: "Email" },
        { key: "status", sortable: false, label: "Status" },
        { key: "action" }
      ],
      value: null,
      value1: null,
      isError:false,
      isLoading:true,
      isLoadingError:false,
      isSuccess:false,
      isBusy:false,
      successMsg:"",
      errorMsg:"",
      checked: true,
      roles: [
        {text:"User", value:1},
        {text:"Admin", value:2},
      ],
      permissions:[],
      currentUserPermissions:[],
      user:""
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.items.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
    axios.get("http://127.0.0.1:8000/api/permissions/all").then(response => {
      this.permissions = response.data.slice(2, response.data.length-2);
      console.log(this.permissions);
    }).catch(e => {
          this.notifyLoadingError();
          console.log(e);
        })

    axios.get(`http://127.0.0.1:8000/api/permission/user/${this.user.id}`).then(response => {
      console.log(response.data);
    }).catch(e => {
          this.notifyLoadingError();
          console.log(e);
        })

  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    updateUserInfo(user){
      this.user = user;
      this.parsePermissions(user.permissions);
    },
    roleSelector({ text }){
      return `${ text }`;
    },

   parsePermissions(permissions){
      this.currentUserPermissions.length=0;
      let userPermissions = [];
      if(permissions!=null){
        for(let key of Object.keys(permissions)){
          userPermissions.push(permissions[key]== 1 ? true : false);
        }
        this.currentUserPermissions= userPermissions.slice(2, userPermissions.length-2);
      }
      else{
        for (let i = 0; i < this.permissions; i++) {
          this.currentUserPermissions.push(false);
        }
      }


    }

  }
};
</script>

<template>

  <div>
      <div class="row mt-4">
        <div class="col-sm-12 col-md-6">
          <div id="tickets-table_length" class="dataTables_length">
            <label class="d-inline-flex align-items-center">
              Show&nbsp;
              <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
            </label>
          </div>
        </div>
        <!-- Search -->
        <div class="col-sm-12 col-md-6">
          <div id="tickets-table_filter" class="dataTables_filter text-md-right">
            <label class="d-inline-flex align-items-center">
              Search:
              <b-form-input
                  v-model="filter"
                  type="search"
                  class="form-control form-control-sm ml-2"
              ></b-form-input>
            </label>
          </div>
        </div>
        <!-- End search -->
      </div>
      <div class="table-responsive">
        <b-table
            :items="items"
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

          <template v-slot:cell(status)="row">
            <div
                class="badge font-size-12"
                :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
              'badge-soft-success': `${row.value}` === '1',
              'badge-soft-warning': `${row.value}` === 'Unpaid'}"
            >{{row.value == 1 ? "Active" : row.value == 2 ? "Suspended" :"Inactive"}}</div>
          </template>
          <template v-slot:cell(action)="row">
            <i v-b-modal.modal-center @click=updateUserInfo(row.item) class="mdi mdi-pencil font-size-18"></i>
            <a href="javascript:void(0);" class="text-danger" v-b-tooltip.hover title="Delete">
              <i class="mdi mdi-trash-can font-size-18"></i>
            </a>
          </template>
        </b-table>
      </div>
      <div class="row">
        <div class="col">
          <div class="dataTables_paginate paging_simple_numbers float-right">
            <ul class="pagination pagination-rounded mb-0">
              <!-- pagination -->
              <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
            </ul>
          </div>
        </div>
      </div>

    <b-modal
        id="modal-center"
        centered
        title="Update user"
        title-class="font-18"
        hide-footer
    >



      <div >
        <form class="form-horizontal" role="form" >
          <b-form-group
              id="staffid"
              label-for="staffid"
              label="Staff Id"
          >

            <b-form-input readonly disabled :value="user.staff_id" id="staffid" placeholder="E.g xzq23c" ></b-form-input>

          </b-form-group>

          <b-form-group
              id="fullname"
              label="Fullname"
              label-for="text"
          >
            <b-form-input readonly disabled  :value="user.fullname"  id= "fullname" for="fullname" placeholder="E.g Johny Dudus"></b-form-input>

          </b-form-group>

          <b-form-group
              id="email"
              label="Email"
              label-for="email">
            <b-form-input readonly disabled  :value="user.email"  id="email" placeholder="E.g me@yahoo.com" ></b-form-input>
          </b-form-group>

          <b-form-group
              id="submit-btn"
              label=""
              label-for=""
          >
            <b-form-checkbox v-model="checked" switch class="mb-1">
              <label>Disable user</label>
            </b-form-checkbox>

            <b-form-group
                id="roles"
                label="User Role"
                label-for="roles">
              <multiselect v-model="value" :options="roles"  :custom-label="roleSelector" :allow-empty="false" ></multiselect>
            </b-form-group>

            <p>Permissions</p>
            <hr>

           <div class="row mb-3">
             <div v-for="(permission, index) in permissions" v-bind:key="index" >
               <div class="col-6">
                 <b-form-checkbox v-model="currentUserPermissions[index]"  switch class="mb-1 font-size-13" >
                   <label>{{permission.substring(2).toUpperCase()}}</label>
                 </b-form-checkbox>
               </div>
             </div>
           </div>


            <b-button  type="submit" variant="primary" class="w-lg">Save</b-button>
            <b-spinner v-if="isBusy" class="m-2" variant="primary" role="status"></b-spinner>
          </b-form-group>

        </form>
      </div>

    </b-modal>
  </div>


</template>