<script>
/**
 * Transactions component
 */
export default {
  data() {
    return {
      trainingData: [
        {
          title: "Advance Electrica..",
          date: "28 Mar, 2020",
          duration: "2 Days",
          organizer: "Frank Dean",
          total: "N300,000",
          paymentstatus: "Ended"
        },
        {
          title: "Capacity for...",
          date: "28 Mar, 2020",
          duration: "2 Months",
          organizer: "Eddy Torres",
          total: "N13,341",
          paymentstatus: "in-progress"
        },
        {
          title: "Construction,...",
          date: "29 Mar, 2020",
          duration: "2 Weeks",
          organizer: "Jamison Clark",
          total: "N24,123",
          paymentstatus: "Pending"
        },
        {
          title: "Capacity for...",
          date: "30 Mar, 2020",
          duration: "2 Years",
          organizer: "Jewel Buckley",
          total: "N198,412",
          paymentstatus: "in-progress"
        },
        {
          title: "Capacity...",
          date: "31 Mar, 2020",
          duration: "15 Days",
          organizer: "Jeffrey Waltz",
          total: "N105,000",
          paymentstatus: "Ended"
        },
        {
          title: "Capacity s...",
          date: "01 Apr, 2020",
          duration: "3 Weeks",
          organizer: "Jefferson Allen",
          total: "N160,000",
          paymentstatus: "in-progress"
        },
        {
          title: "Capacity lines...",
          date: "02 Apr, 2020",
          duration: "4 Months",
          organizer: "Paul Jones",
          total: "N183,500",
          paymentstatus: "in-progress"
        },
        {
          title: "Capacity for Lines...",
          date: "03 Apr, 2020",
          duration: "3 Days",
          organizer: "Donald Bailey",
          total: "N146,600",
          paymentstatus: "Pending"
        },

      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 25, 50],
      filter: null,
      filterOn: [],
      //sortBy: "title",
      sortDesc: false,
      fields: [
        {key: "title", sortable: false, label: "Title"},
        {key: "date", sortable: false},
        {key: "duration", sortable: false, label: "Duration"},
        {key: "organizer", sortable: false, label: "Organizer"},
        {key: "total", sortable: false, label: "Unit Cost"},
        {key: "paymentstatus", sortable: false, label: "Status"},
        {key: "action"}
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.trainingData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.trainingData.length;
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
  <div class="card">
    <div class="card-body">
<!--      <b-dropdown class="float-right" right toggle-class="arrow-none card-drop" variant="white">
        <template v-slot:button-content>
          <i class="mdi mdi-dots-vertical"></i>
        </template>
        &lt;!&ndash; item&ndash;&gt;
        <b-dropdown-item>Sales Report</b-dropdown-item>
        &lt;!&ndash; item&ndash;&gt;
        <b-dropdown-item>Export Report</b-dropdown-item>
        &lt;!&ndash; item&ndash;&gt;
        <b-dropdown-item>Profit</b-dropdown-item>
        &lt;!&ndash; item&ndash;&gt;
        <b-dropdown-item>Action</b-dropdown-item>
      </b-dropdown>-->

      <h4 class="card-title mb-4">Approved Trainings</h4>
      <div class="row mt-4">
        <div class="col-sm-12 col-md-6">
        </div>

        <!-- End search -->
      </div>
      <div class="table-responsive">
        <b-table
            :current-page="currentPage"
            :fields="fields"
            :filter="filter"
            :filter-included-fields="filterOn"
            :items="trainingData"
            :per-page="perPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            responsive="sm"
            @filtered="onFiltered"
        >
          <template v-slot:cell(paymentstatus)="row">
            <div
                :class="{'badge-soft-danger': `${row.value}` === 'Ended',
              'badge-soft-success': `${row.value}` === 'in-progress',
              'badge-soft-warning': `${row.value}` === 'Pending'}"
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
              <i class="mdi mdi-pencil font-size-18"></i>
            </a>
            <a v-b-tooltip.hover class="text-danger" href="javascript:void(0);" title="Delete">
              <i class="mdi mdi-trash-can font-size-18"></i>
            </a>
          </template>
        </b-table>
      </div>

    </div>
  </div>
</template>