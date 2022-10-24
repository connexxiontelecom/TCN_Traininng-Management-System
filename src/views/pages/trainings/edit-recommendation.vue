<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
/**
 * Form-element component
 */
export default {
  page: {
    title: "Edit recommendation",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, Multiselect },
  data() {
    return {
      title: "Edit recommendation",
      items: [
        {
          text: "Trainings",
          href: "/"
        },
        {
          text: "Edit recommendation",
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
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-5">Edit Recommendation</h4>
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" role="form">
                  <b-form-group
                      id="title"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Title"
                      label-for="designation"
                  >
                    <b-form-input id="title" value="" placeholder="e.g Construction techniques"  name="title"></b-form-input>
                  </b-form-group>
                  <b-form-group
                      id="description"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Description"
                      label-for="description"
                  >
                    <b-form-input id="description" value="" placeholder=""  name="description"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="select"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Type of training"
                      label-for="type"
                  >
                    <multiselect v-model="value" :options="options" ></multiselect>
                  </b-form-group>

                  <b-form-group
                      id="staffid"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Employee"
                      label-for="text"
                  >
                    <multiselect  :options="options" ></multiselect>
                  </b-form-group>

                  <b-form-group
                      id="designation"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Designation"
                      label-for="designation"
                  >
                    <b-form-input id="designation" value="" placeholder="e.g Supervisor"  name="designation"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="region"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Region"
                      label-for="text"
                  >
                    <multiselect  :options="options" ></multiselect>
                  </b-form-group>

                  <b-form-group
                      id="submit-btn"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label=""
                      label-for=""
                  >
                    <b-button  variant="primary" class="w-lg">Save Changes</b-button>
                  </b-form-group>

                </form>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>


    <!-- end row -->
  </Layout>
</template>