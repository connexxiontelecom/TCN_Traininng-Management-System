<script>
/**
 * Transactions component
 */
import {format} from 'date-fns'
import Vue from "vue";
import {API} from "@/api";

var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});

export default {
  props: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    training: ""
  },
  data() {
    return {
      format,
      totalRows: 1,
      currentPage: 1,
      //perPage: 5,
      //pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "orderid",
      sortDesc: false,
      nominees: [],
      fields: [
        {key: "sno", sortable: false, label: "S/N"},
        {key: "nominated_employee.fullname", sortable: false, label: "Fullname"},
        {key: "nm_attendance", sortable: false, label: "Attendance"},
        {key: "nm_punctuality", sortable: false, label: "Punctuality"},
        {key: "nominated_employee.job_trade", sortable: false, label: "Job Trade"}
        /*{ key: "ts_cost", sortable: false, label: "Unit Cost" },
        { key: "year.y_year", sortable: false, label: "Year" },
        { key: "department.name", sortable: false, label: "Department" },
        { key: "ts_status", sortable: false, label: "Status" },
        { key: "ts_start", sortable: false, label: "Start" },
        { key: "ts_end", sortable: false, label: "End" },
        { key: "action" }*/
      ]
    };
  },
  computed: {
    items() {
      return this.nominees.map((d, index) => ({...d, sno: index + 1}))
    },
    rows() {
      return this.nominees.length;
    }
  },
  mounted() {
    console.log(this.training);
    API.get(`/nomination/nominations/nominees/${this.training}`).then(response => {
      this.loadComplete();
      this.nominees = response.data;
      this.nomineesFetched(this.nominees);
      //this.sum = this.computeSum(this.nominees);
      console.log(response.data);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
    })
    // Set the initial number of items
    this.totalRows = this.nominees.length;
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
    participantRated() {
      this.$emit('onRated', this.items)
    },

    nomineesFetched(nominees) {
      this.$emit('onNomineesFetched', nominees)
    },

  }
};
</script>

<template>
  <div>
    <div class="row mt-4">
    </div>
    <div class="table-responsive">
      <b-table
          :current-page="currentPage"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :items="items"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          responsive="sm"
          striped
          @filtered="onFiltered"
      >
        <template v-slot:cell(ts_status)="row">

          <div>
            <b-badge v-if="row.value== 1" variant="primary">Pending</b-badge>
            <b-badge v-if="row.value== 4" class="" variant="success">Approved</b-badge>
            <b-badge v-if="row.value== 2" class="" variant="warning">Submitted</b-badge>
          </div>

        </template>

        <template v-slot:cell(nominated_employee.fullname)="row">

          <div>
            <label class="d-block mb-0">{{ row.item.nominated_employee.fullname }}</label>
            <small>{{ row.item.nominated_employee.staff_id }}</small>
            <small class="text-muted"> | {{ row.item.nominated_employee.location }}</small>
          </div>

        </template>

        <template v-slot:cell(nm_attendance)="row">
          <div>
            <b-badge v-if="row.value== 1" variant="danger">V.Poor</b-badge>
            <b-badge v-if="row.value== 2" class="" variant="danger">Poor</b-badge>
            <b-badge v-if="row.value== 3" class="" variant="warning">Fair</b-badge>
            <b-badge v-if="row.value== 4" class="" variant="success">V.Good</b-badge>
            <b-badge v-if="row.value== 5" class="" variant="success">Excellent</b-badge>
          </div>
        </template>

        <template v-slot:cell(nm_punctuality)="row">
          <div>
            <b-badge v-if="row.value== 1" variant="danger">V.Poor</b-badge>
            <b-badge v-if="row.value== 2" class="" variant="danger">Poor</b-badge>
            <b-badge v-if="row.value== 3" class="" variant="warning">Fair</b-badge>
            <b-badge v-if="row.value== 4" class="" variant="success">V.Good</b-badge>
            <b-badge v-if="row.value== 5" class="" variant="success">Excellent</b-badge>
          </div>
        </template>

        <template v-slot:cell(action)="row">
          <i v-b-modal.view-training-schedule class="mdi mdi-eye font-size-18 text-primary ml-2"
             @click=selectedSchedule(row.item)></i>

        </template>
      </b-table>
    </div>


  </div>
</template>