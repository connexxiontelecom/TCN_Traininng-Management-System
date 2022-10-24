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
    title: "Edit employees",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, Multiselect },
  data() {
    return {
      title: "Edit employees",
      items: [
        {
          text: "Manage employees",
          href: "/"
        },
        {
          text: "Edit employees",
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

    <div class="row">
      <div class="col-lg-2">
      </div>
      <div class="col-8">
        <PageHeader :title="title" :items="items" />
      </div>
      <div class="col-lg-2">
      </div>
    </div>

    <div class="row">
      <div class="col-lg-2">
      </div>
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-5">Basic Information </h4>
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" role="form">
                  <b-form-group
                    id="fullname"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Fullname"
                    label-for="text"
                  >
                    <b-form-input for="text" value="Artisanal kale"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="phonenumber"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Phone"
                      label-for="number"
                  >
                    <b-form-input id="number" value="" placeholder="e.g 0801234567890" type="number" name="number"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="email"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Email"
                      label-for="email"
                  >
                    <b-form-input id="email" value="" placeholder="e.g abc@gmail.com"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="date"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Date of Birth"
                      label-for="date"
                  >
                    <b-form-input id="date" value="" placeholder="01/05/1987" type="date"></b-form-input>
                  </b-form-group>


                </form>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <div class="col-lg-2">
      </div>
      <!-- end col -->
    </div>

    <div class="row">
      <div class="col-lg-2">
      </div>
      <div class="col-8">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-5">Official Information</h4>
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" role="form">
                  <b-form-group
                      id="select"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Department"
                      label-for="type"
                  >
                    <multiselect v-model="value" :options="options" aria-placeholder="hello"></multiselect>
                  </b-form-group>

                  <b-form-group
                      id="staffid"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Staff Id"
                      label-for="text"
                  >
                    <b-form-input for="text" value="" placeholder="e.g FG-TCN-002"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="Gradelevel"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Grade Level"
                      label-for="designation"
                  >
                    <b-form-input id="number" value="" placeholder="e.g Gl-14"  name="designation"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="designation"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Designation"
                      label-for="designation"
                  >
                    <b-form-input id="number" value="" placeholder="e.g Head of Procurement"  name="designation"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="Appointmentdate"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Date of Appointment"
                      label-for="date"
                  >
                    <b-form-input id="date" value="" placeholder="01/05/1987" type="date"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="submit-btn"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label=""
                      label-for=""
                  >
                    <b-button  variant="primary" class="w-lg">Submit</b-button>
                  </b-form-group>

                </form>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <div class="col-lg-2">
      </div>
    </div>


    <!-- end row -->
  </Layout>
</template>