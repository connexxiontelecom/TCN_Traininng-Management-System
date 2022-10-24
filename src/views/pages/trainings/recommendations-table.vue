<script>
/**
 * Transactions component
 */
import { format} from 'date-fns'
export default {
  props: {
    recommendations:[]
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
        { key: "id", sortable: false, label: "S/N" },
        { key: "rec_name", sortable: false,label: "Training" },
        { key: "rec_type", sortable: false, label: "Type" },
        { key: "recommended_employee.fullname", sortable: false, label: "Employee" },
        { key: "recommended_by.fullname", sortable: false, label: "Recommended By" },
       // { key: "rec_region", sortable: false, label: "Region" },
        { key: "year.y_year", sortable: false, label: "Year" },
        { key: "created_at", sortable: false, label: "Date" },
        { key: "rec_status", sortable: false, label: "Status" },
        { key: "action" }
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.recommendations.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.recommendations.length;
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
    selectedRec(rec){
      console.log(rec)
      this.$emit('onSelectedRec', rec)
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
            :items="recommendations"
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

          <template v-slot:cell(created_at)="row">
            <div>{{ format(new Date(row.value), 'd MMM YYY')  }}</div>
          </template>
          <template v-slot:cell(rec_status)="row">
            <div
                class="badge font-size-12"
                :class="{'badge-soft-danger': `${row.value}` === '1',
              'badge-soft-success': `${row.value}` === '2',
              'badge-soft-warning': `${row.value}` === 'Unpaid'}"
            >{{ row.value == 1 ? "unscheduled" : "scheduled"}}</div>
          </template>

          <template v-slot:cell(action)="row">
            <i v-b-modal.modal-center @click=selectedRec(row.item) class="mdi mdi-pencil font-size-18"></i>
            <i v-b-modal.modal-lg @click=selectedRec(row.item)  class="mdi mdi-eye font-size-18"></i>
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
              <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
            </ul>
          </div>
        </div>
      </div>
<!--    <div class=" col-6 mt-3">
      <div class="badge  badge-soft-danger font-size-12">not-submitted</div>
      <p class="mt-3">
        <b-button size="sm" variant="primary">Submit recommendations</b-button>
        <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
      </p>
    </div>-->
  </div>
</template>