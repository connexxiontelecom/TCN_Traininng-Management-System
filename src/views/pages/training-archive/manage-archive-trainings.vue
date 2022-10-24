<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import ApprovedTrainings from "./archive-training-table";
import Multiselect from "vue-multiselect";

/**
 * Form-element component
 */
export default {
  page: {
    title: "Manage Archive Trainings",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,ApprovedTrainings,Multiselect},
  data() {
    return {
      title: "Manage Archive Trainings",
      items: [
        {
          text: "Archive Trainings",
          href: "/"
        },
        {
          text: "Manage",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      options: [
        "Alaska",
        "Hawaii",
        "California",
        "Nevada",
        "Oregon",
        "Washington",
        "Arizona",
        "Colorado",
        "Idaho",
        "Montana",
        "Nebraska",
        "New Mexico",
        "North Dakota",
        "Utah",
        "Wyoming",
        "Alabama",
        "Arkansas",
        "Illinois",
        "Iowa"
      ]
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <b-form-group
            id="select"
            label="Year"
            label-for="type"
        >
          <multiselect v-model="value" :options="options" ></multiselect>
        </b-form-group>
        <div class="card">
          <div class="card-body">
            <ApprovedTrainings/>
            <div class="row">
              <div class=" col-6 mt-3">
                <p class="mb-2">Total</p>
                <h4>45</h4>
              </div>

            </div>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
  </Layout>
</template>