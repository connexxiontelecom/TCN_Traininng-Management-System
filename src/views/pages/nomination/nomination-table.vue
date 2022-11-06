<script>
/**
 * Transactions component
 */
export default {
  props:{
    nominations:{
      type:Array
    }
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
        { key: "id", sortable: false, label: "S/N" },
        { key: "nominated_employee.fullname", sortable: false, label:"Nominated Employee"},
        { key: "nominated_employee.staff_id", sortable: false, label: "Staff Id" },
        { key: "nominated_employee.job_trade", sortable: false, label: "Department" },
        { key: "training.ts_title", sortable: false, label: "Training" },
        { key: "nominated_by.fullname", sortable: false, label: "Nominated By" },
        { key: "nominated_by.staff_id", sortable: false, label: "Staff Id" },
        { key: "year.y_year", sortable: false, label: "Year" },
        { key: "nm_status", sortable: false, label: "Status" },
        { key: "action" }
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.nominations.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.nominations.length;
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

    getSubstring(text){
      if(text.length >20)
      {
        return text.substring(0, 15) +" ...";
      }
      else{
        return text;
      }

    },

    selectedNomination(rec){
      console.log(rec)
      this.$emit('onSelectedNomination', rec)
    },

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
            :items="nominations"
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

          <template v-slot:cell(training.ts_title)="row">
            <div>
              {{ getSubstring(row.value)}}
            </div>
          </template>



          <template v-slot:cell(nm_status)="row">
            <div>
              <b-badge v-if="row.value== 1 && row.item.approvals.length == 0 " variant="primary">Pending</b-badge>
              <b-badge v-if="row.value== 2"  variant="success" class="">Approved</b-badge>
              <b-badge v-if="row.value== 3"  variant="danger" class="">Declined</b-badge>
              <b-badge v-if="row.value== 1 && row.item.approvals.length > 0"  variant="warning" class="">In Progress</b-badge>
              <b-badge v-if="row.value== 4"  variant="danger" class="">In Progress</b-badge>
              <b-badge v-if="row.value== 5"  variant="dark" class="">Completed</b-badge>
            </div>
          </template>

          <template v-slot:cell(action)="row">

            <a class="text-primary ml-3"
                v-b-tooltip.hover
                data-toggle="tooltip"
                title="Edit">
              <i v-b-modal.view-nomination @click=selectedNomination(row.item) class="mdi mdi-eye font-size-18" ></i>
            </a>
<!--            <a href="javascript:void(0);" class="text-danger" v-b-tooltip.hover title="Delete">
              <i class="mdi mdi-marker-cancel font-size-18"></i>
            </a>-->
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