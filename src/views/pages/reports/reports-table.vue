<script>
/**
 * Transactions component
 */
import {format,differenceInCalendarDays} from 'date-fns'
import Vue from "vue";

var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});

export default {
  props: {
    schedules: [],
  },
  data() {
    return {
      format,
      differenceInCalendarDays,
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "orderid",
      sortDesc: false,
      fields: [
        {key: "sno", sortable: false, label: "S/N"},
        {key: "ts_title", sortable: false, label: "Title"},
        {key: "ts_type", sortable: false, label: "Type"},
        {key: "ts_cost", sortable: false, label: "Unit Cost"},
        {key: "year.y_year", sortable: false, label: "Year"},
        {key: "ts_facilitator", sortable: false, label: "Organizer"},
        {key: "department.name", sortable: false, label: "Department"},
        {key: "ts_status", sortable: false, label: "Status"},
        {key: "ts_duration", sortable: false, label: "Duration"},
        {key: "ts_venue", sortable: false, label: "Venue"},
        {key: "ts_nominees", sortable: false, label: "Nominees"},
        {key: "ts_trained", sortable: false, label: "Trained"},
        {key: "ts_start", sortable: false, label: "Start"},
        {key: "ts_end", sortable: false, label: "End"},
        {key: "action"},

      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    items() {
      return this.schedules.map((d, index) => ({...d, sno: index + 1}))
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
    selectedSchedule(rec) {
      console.log(rec)
      this.$emit('onSelectedSchedule', rec)
    },

    countTrained(nominees){
      return nominees.filter (({nm_status}) => nm_status === 5).length
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
            <b-form-select v-model="perPage" :options="pageOptions" size="sm"></b-form-select>&nbsp;entries
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
                class="form-control form-control-sm ml-2"
                type="search"
            ></b-form-input>
          </label>
        </div>
      </div>
      <!-- End search -->
    </div>
    <div class="table-responsive">
      <b-table
          :current-page="currentPage"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :items="items"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          responsive
          sticky-header = "true"
          @filtered="onFiltered"
      >

        <template v-slot:cell(ts_title)="row">
          <span class="text-nowrap">{{ row.value }}</span>
        </template>

        <template v-slot:cell(ts_facilitator)="row">
          <span class="text-nowrap">{{ row.value }}</span>
        </template>


        <template v-slot:cell(ts_status)="row">

          <div>
            <b-badge v-if="row.value== 1" variant="primary">Pending</b-badge>
            <b-badge v-if="row.value== 4" class="" variant="success">Approved</b-badge>
            <b-badge v-if="row.value== 5" class="" variant="primary">Completed</b-badge>
            <b-badge v-if="row.value== 2" class="" variant="warning">Submitted</b-badge>
          </div>

        </template>

        <template v-slot:cell(ts_start)="row">
          <div  class="text-nowrap" >{{ format(new Date(row.value), 'd MMM YYY') }}</div>
        </template>

        <template v-slot:cell(ts_end)="row">
          <div  class="text-nowrap" >{{ format(new Date(row.value), 'd MMM YYY') }}</div>
        </template>

        <template v-slot:cell(ts_duration)="row">
          <div  class="text-nowrap" >{{
            Math.abs( differenceInCalendarDays(
                new Date(row.item.ts_start),
                new Date(row.item.ts_end)))
             }} Days</div>
        </template>

        <template v-slot:cell(ts_cost)="row">
          <div class="text-nowrap" >₦ {{ row.value | formatNumber }}</div>
        </template>

        <template v-slot:cell(ts_venue)>
          <div class="text-nowrap" > HQ | Abuja </div>
        </template>

        <template v-slot:cell(ts_trained)="row">
          <div class="text-nowrap" >{{ countTrained(row.item.nominees)}}</div>
        </template>

        <template v-slot:cell(action)="row">
          <!--v-if="row.item.ts_status == 1"-->
          <!--            <i v-if="row.item.ts_status == 1" v-b-modal.edit-schedule @click=selectedSchedule(row.item) class="mdi mdi-pencil font-size-18 text-primary"></i>-->
          <i v-b-modal.view-training-schedule class="mdi mdi-eye font-size-18 text-primary ml-2"
             @click=selectedSchedule(row.item)></i>
          <!--            <a href="javascript:void(0);" class="text-danger" v-b-tooltip.hover title="Delete">
                        <i class="mdi mdi-trash-can font-size-18"></i>
                      </a>-->
        </template>
      </b-table>
    </div>
    <div class="row">
      <div class="col">
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <ul class="pagination pagination-rounded mb-0">
            <!-- pagination -->
            <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="rows"></b-pagination>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>