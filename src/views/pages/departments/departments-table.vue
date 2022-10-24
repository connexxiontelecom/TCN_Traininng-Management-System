<script>
/**
 * Departments component
 */
import { format} from 'date-fns'
export default {
  props: {
    departmentsData:[]
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
        { key: "name", sortable: false, label: "Department" },
        { key: "shortname", sortable: false, label: "Abbrev" },
        { key: "created_at", sortable: false, label: "Created" },
        //{ key: "paymentstatus", sortable: false, label: "Payment Status" },
        { key: "action" }
      ],
      department:""
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.departmentsData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.departmentsData.length;
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
    updateDeptInfo(dept){
      this.department = dept;
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
            :items="departmentsData"
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
            <div>{{ format(new Date(row.value), '	PPPP')  }}</div
                >


<!--           <span>{{ new Date(row.value).toDateString()}}</span>-->
          </template>

          <template  v-slot:cell(action)="row">
            <a
                href="javascript:void(0);"
                class="mr-3 text-primary"
                v-b-tooltip.hover
                data-toggle="tooltip"
                title="Edit"
            >
              <i v-b-modal.modal-center @click=updateDeptInfo(row.item) class="mdi mdi-pencil font-size-18"></i>
            </a>
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
        title="Edit Department"
        title-class="font-18"
        hide-footer
    >



      <div >
        <form class="form-horizontal" role="form" >
          <!--          <p> Hello {{user.email}} !</p>-->
          <b-form-group
              id="name"
              label-for="name"
              label="Department's Name"
          >

            <b-form-input readonly disabled :value="department.name" id="name" placeholder="E.g Engineering" ></b-form-input>

          </b-form-group>

          <b-form-group
              id="shortname"
              label="Abbrev"
              label-for="text"
          >
            <b-form-input readonly disabled  :value="department.shortname"  id= "shortname" for="shortname" placeholder="E.g Eng"></b-form-input>

          </b-form-group>

          <b-form-group
              id="submit-btn"
              label=""
              label-for=""
          >


            <b-button  type="submit" variant="primary" class="w-lg">Save</b-button>
            <b-spinner v-if="isBusy" class="m-2" variant="primary" role="status"></b-spinner>
          </b-form-group>

        </form>
      </div>

    </b-modal>
  </div>
</template>