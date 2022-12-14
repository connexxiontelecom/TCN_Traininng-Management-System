<script>
/**
 * Transactions component
 */
import { format} from 'date-fns'
import Vue from "vue";
var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});

export default {
  props:{
    schedules: [],
  },
  data() {
    return {
      format,
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "orderid",
      sortDesc: false,
      fields: [
      { key: "sno", sortable: false, label: "S/N" },
      { key: "ts_title", sortable: false,  label: "Title" },
      { key: "ts_type", sortable: false, label: "Type" },
      { key: "ts_cost", sortable: false, label: "Unit Cost" },
      { key: "year.y_year", sortable: false, label: "Year" },
      { key: "department.name", sortable: false, label: "Department" },
      { key: "ts_status", sortable: false, label: "Status" },
      { key: "ts_start", sortable: false, label: "Start" },
      { key: "ts_end", sortable: false, label: "End" },
      { key: "action" }
    ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    items() {
      return this.schedules.map((d, index) => ({ ...d, sno: index + 1 }))
    },
    rows() {
      return this.schedules.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.schedules.length;
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
    selectedSchedule(rec){
      console.log(rec)
      this.$emit('onSelectedSchedule', rec)
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
          <template v-slot:cell(ts_status)="row">
            <div>
              <b-badge v-if="row.value== 1" variant="primary">Pending</b-badge>
              <b-badge v-if="row.value== 4"  variant="success" class="">Approved</b-badge>
              <b-badge v-if="row.value== 5"  variant="primary" class="">Completed</b-badge>
              <b-badge v-if="row.value== 2"  variant="warning" class="">Submitted</b-badge>
            </div>
          </template>

          <template v-slot:cell(ts_start)="row">
            <div>{{ format(new Date(row.value), 'd MMM YYY')  }}</div>
          </template>

          <template v-slot:cell(ts_end)="row">
            <div>{{ format(new Date(row.value), 'd MMM YYY')  }}</div>
          </template>

          <template v-slot:cell(ts_cost)="row">
            <div>??? {{row.value | formatNumber}}</div>
          </template>

          <template v-slot:cell(action)="row">
          <i v-b-modal.view-training-schedule @click=selectedSchedule(row.item)  class="mdi mdi-eye font-size-18 text-primary ml-2"></i>
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