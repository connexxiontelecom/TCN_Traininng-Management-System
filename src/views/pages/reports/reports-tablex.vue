<script>
/**
 * Transactions component
 */
export default {
  data() {
    return {
      transactionData: [
        {
          orderid: "#NZ1563",
          date: "28 Mar, 2020",
          billingname: "Frank Dean",
          total: "$164",
          paymentstatus: "Unpaid"
        },
        {
          orderid: "#NZ1564",
          date: "28 Mar, 2020",
          billingname: "Eddy Torres",
          total: "$141",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1565",
          date: "29 Mar, 2020",
          billingname: "Jamison Clark",
          total: "$123",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1566",
          date: "30 Mar, 2020",
          billingname: "Jewel Buckley",
          total: "$112",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1567",
          date: "31 Mar, 2020",
          billingname: "Jeffrey Waltz",
          total: "$105",
          paymentstatus: "Unpaid"
        },
        {
          orderid: "#NZ1568",
          date: "01 Apr, 2020",
          billingname: "Jefferson Allen",
          total: "$160",
          paymentstatus: "Chargeback"
        },
        {
          orderid: "#NZ1569",
          date: "02 Apr, 2020",
          billingname: "Paul Jones",
          total: "$183",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1570",
          date: "03 Apr, 2020",
          billingname: "Donald Bailey",
          total: "$146",
          paymentstatus: "Paid"
        },
        {
          orderid: "#NZ1571",
          date: "03 Apr, 2020",
          billingname: "Jimmy Barker",
          total: "$165",
          paymentstatus: "Unpaid"
        },
        {
          orderid: "#NZ1572",
          date: "04 Apr, 2020",
          billingname: "Walter Brown",
          total: "$172",
          paymentstatus: "Paid"
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      sortBy: "orderid",
      sortDesc: false,
      fields: [
        {key: "orderid", sortable: false, label: "Order ID"},
        {key: "date", sortable: false},
        {key: "billingname", sortable: false, label: "Billing Name"},
        {key: "total", sortable: false, label: "Total"},
        {key: "paymentstatus", sortable: false, label: "Payment Status"},
        {key: "action"}
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.transactionData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.transactionData.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
          :items="transactionData"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          responsive="sm"
          @filtered="onFiltered"
      >
        <template v-slot:cell(paymentstatus)="row">
          <div
              :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
              'badge-soft-success': `${row.value}` === 'Paid',
              'badge-soft-warning': `${row.value}` === 'Unpaid'}"
              class="badge font-size-12"
          >{{ row.value }}
          </div>
        </template>

        <template v-slot:cell(action)>
          <a
              v-b-tooltip.hover
              class="mr-3 text-primary"
              data-toggle="tooltip"
              href="javascript:void(0);"
              title="Edit"
          >
            <i class="mdi mdi-account-multiple-check font-size-18"></i>
          </a>
          <a v-b-tooltip.hover class="text-danger" href="javascript:void(0);" title="Delete">
            <i class="mdi mdi-marker-cancel font-size-18"></i>
          </a>
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