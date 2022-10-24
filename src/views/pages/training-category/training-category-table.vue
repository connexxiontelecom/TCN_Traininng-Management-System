<script>
/**
 * Transactions component
 */
import Multiselect from "vue-multiselect";
export default {
  props: {
    categoriesData:[]
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
      sortBy: "orderid",
      sortDesc: false,
      fields: [
        { key: "id", sortable: false, label: "SN" },
        { key: "name", sortable: false, label: "Category" },
        { key: "description", sortable: false, label: "Description" },
        { key: "type", sortable: false, label: "Type" },
       /* { key: "paymentstatus", sortable: false, label: "Payment Status" },*/
        { key: "action" }
      ],
      options: [
        "Technical",
        "Non-Technical",
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
      category:""
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.categoriesData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.categoriesData.length;
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
    updateCategoryInfo(category){
      this.category = category;
      this.value = category.type;
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
            :items="categoriesData"
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
            <i v-b-modal.modal-center @click=updateCategoryInfo(row.item) class="mdi mdi-pencil font-size-18"></i>
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
        no-close-on-backdrop
        title="Edit Category"
        title-class="font-10"
        hide-footer
    >


      <div >
        <form class="form-horizontal" role="form" >
          <!--          <p> Hello {{user.email}} !</p>-->
          <b-form-group
              id="name"
              label-for="name"
              label="Title"
          >

            <b-form-input  :value="category.name" id="name" placeholder="E.g name" ></b-form-input>

          </b-form-group>

          <b-form-group
              id="description"
              label="Description"
              label-for="description"
          >
            <b-form-input  :value="category.description"  id= "description" for="description" placeholder="E.g description"></b-form-input>

          </b-form-group>


          <b-form-group
              id="submit-btn"
              label=""
              label-for=""
          >


            <b-form-group
                id="roles"
                label="Type"
                label-for="roles">
              <multiselect v-model="value" :options="options"></multiselect>
            </b-form-group>



            <b-button  type="submit" variant="primary" class="w-lg">Save</b-button>
            <b-spinner v-if="isBusy" class="m-2" variant="primary" role="status"></b-spinner>
          </b-form-group>

        </form>
      </div>

    </b-modal>
  </div>
</template>