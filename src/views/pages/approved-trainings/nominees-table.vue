<script>
/**
 * Transactions component
 */
import { format} from 'date-fns'
import Vue from "vue";
import axios from "axios";
import StarRating from "vue-star-rating";
var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});

export default {
  props:{
    // eslint-disable-next-line vue/require-prop-type-constructor
    training:""
  },
  components: { StarRating},
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
      { key: "sno", sortable: false, label: "S/N" },
      { key: "nominated_employee.fullname", sortable: false,  label: "Fullname" },
      { key: "nm_attendance", sortable: false, label: "Attendance" },
        { key: "nm_punctuality", sortable: false, label: "Punctuality" }
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
      return this.nominees.map((d, index) => ({ ...d, sno: index + 1}))
    },
    rows() {
      return this.nominees.length;
    }
  },
  mounted() {
    //alert(this.training);
    axios.get(`http://127.0.0.1:8000/api/nomination/nominations/nominees/${this.training}`).then(response => {
      this.loadComplete();
      this.nominees = response.data;
      this.participantRated();
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
    participantRated(){
      this.$emit('onRated', this.items)
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
            striped
            :items="items"
            :fields="fields"
            responsive="sm"
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
              <b-badge v-if="row.value== 2"  variant="warning" class="">Submitted</b-badge>
            </div>

          </template>

          <template v-slot:cell(nominated_employee.fullname)="row">

            <div>
              <label class="d-block mb-0">{{row.item.nominated_employee.fullname}}</label>
              <small>{{row.item.nominated_employee.staff_id}}</small>
              <small class="text-muted"> | {{row.item.nominated_employee.location}}</small>
            </div>

          </template>

          <template v-slot:cell(nm_attendance)="row">
            <div v-if="row.item.nm_status ==5">
                <star-rating  :read-only="true"  active-color="#5664d2" :star-size="25" v-model="row.item.nm_attendance" :show-rating="false" @rating-selected="participantRated"></star-rating>
            </div>
            <div v-else>
              <star-rating  active-color="#5664d2" :star-size="25" v-model="row.item.nm_attendance" :show-rating="false" @rating-selected="participantRated"></star-rating>
            </div>
          </template>

          <template v-slot:cell(nm_punctuality)="row">
            <div v-if="row.item.nm_status ==5">
              <star-rating :read-only="true"  active-color="#5664d2" :star-size="25"   v-model="row.item.nm_punctuality" :show-rating="false" @rating-selected="participantRated" ></star-rating>
            </div>
            <div v-else>
              <star-rating  active-color="#5664d2" :star-size="25"   v-model="row.item.nm_punctuality" :show-rating="false" @rating-selected="participantRated" ></star-rating>
            </div>
          </template>

          <template v-slot:cell(action)="row">
           <i v-b-modal.view-training-schedule @click=selectedSchedule(row.item)  class="mdi mdi-eye font-size-18 text-primary ml-2"></i>

          </template>
        </b-table>
      </div>



  </div>
</template>