<script>
/**
 * Transactions component
 */
export default {
  props: {
    EmployeeData:[]
  },
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "orderid",
      sortDesc: false,
      fields: [
        { key: "id", sortable: false, label: "SN" },
        { key: "fullname", sortable: false, label: "Full Name" },
        { key: "email", sortable: false, label: "Email" },
        /*{ key: "phone", sortable: false, label: "Phone" },*/
        { key: "staff_id", sortable: false, label: "  Staff Id" },
        { key: "designation", sortable: false, label: "Designation" },
        { key: "job_trade", sortable: false, label: "Job-trade" },
        { key: "type", sortable: false, label: "Type" },
        { key: "location", sortable: false, label: "Location" },
        { key: "status", sortable: false, label: "Status" },
        { key: "action" }
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.EmployeeData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.EmployeeData.length;
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
    selectedEmployee(employee){
      console.log(employee)
      this.$emit('onSelectedEmployee', employee)
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
            :items="EmployeeData"
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
            <i v-b-modal.modal-center @click=selectedEmployee(row.item) class="mdi mdi-pencil font-size-18"></i>
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
  </div>
</template>