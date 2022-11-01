<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
import errorLoading from "@/components/error-loading";
import CategoriesTable from "./training-category-table";
import {required} from "vuelidate/lib/validators";
import {API} from "@/api";

/**
 * Form-element component
 */
export default {
  page: {
    title: "Training Categories",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, CategoriesTable, Multiselect, errorLoading},
  data() {
    return {
      title: "Setup & Manage Training Categories",
      categories:[],
      items: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Training Categories",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      options: [
        "Technical",
        "Non-Technical",
      ],
      isError:false,
      isSuccess:false,
      isBusy:false,
      isLoading:true,
      isLoadingError:false,
      successMsg:"",
      errorMsg:"",
      categoryTitle:"",
      description:""
    };
  },
  validations: {
    categoryTitle: {required},
    description: {required},
    value: {required}
  },
  methods:{
    async createTrainingCategory(){
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      else{
        this.processing();
        await API.post("/create-category", {
          name: this.categoryTitle,
          description: this.description,
          type:this.value
        })
            .then(response => {
              this.completed();
              this.notifySuccess();
              this.showSuccess( "Category Successfully Created" /*response.data*/);
              console.log(response.data);
              this.$router.push(
                  this.$route.query.redirectFrom || { name: "Categories" }
              );
            })
            .catch(e => {
              this.completed();
              this.notifyError();
              this.showError(e.response.data);
              //this.errorMsg = e.response.data;
              console.log(e);

            })
      }

    },
  },
  mounted() {
    API.get("/all-categories").then(response => {
      this.loadComplete();
      this.categories = response.data;
      console.log(response.data);
      this.$router.push(
          this.$route.query.redirectFrom || { name: "Categories" }
      );
    })
        .catch(e => {
          this.notifyLoadingError();
          console.log(e);

        })
  }
};
</script>

<template>
  <Layout>
    <PageHeader v-if="!isLoading" :title="title" :items="items" />

    <div v-if="!isLoading && !isLoadingError" >
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <b-alert  v-if="isSuccess" show dismissible variant="success">{{successMsg}}</b-alert>
              <b-alert v-if="isError" show dismissible variant="danger">{{errorMsg}}</b-alert>
              <h4 class="card-title mb-5">New Training Category</h4>
              <div class="row">
                <div class="col-12">
                  <form class="form-horizontal" role="form" @submit.prevent="createTrainingCategory">
                    <b-form-group
                        id="title"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label="Title"
                        label-for="text"
                    >
                      <b-form-input  :class="{ 'is-invalid':$v.categoryTitle.$error }" v-model="categoryTitle" @blur="$v.categoryTitle.$touch()"  for="text" placeholder="Title"></b-form-input>
                      <div v-if="$v.categoryTitle.$error" class="invalid-feedback">
                        <span v-if="!$v.categoryTitle.required">Category title is required.</span>
                      </div>
                    </b-form-group>

                    <b-form-group
                        id="description"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label="Description"
                        label-for="description"
                    >
                      <b-form-input :class="{ 'is-invalid':$v.description.$error }" v-model="description" @blur="$v.description.$touch()"  id="description" placeholder="Description"></b-form-input>
                      <div v-if="$v.description.$error" class="invalid-feedback">
                        <span v-if="!$v.description.required">Description is required.</span>
                      </div>
                    </b-form-group>


                    <b-form-group
                        id="select"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label="Type"
                        label-for="type"
                    >
                      <multiselect  :class="{ 'is-invalid':$v.value.$error }" v-model="value" @input="$v.value.$touch()"  :options="options" aria-placeholder="hello"></multiselect>
                      <div v-if="$v.value.$error" class="invalid-feedback">
                        <span v-if="!$v.value.required">Please Select an option.</span>
                      </div>
                    </b-form-group>



                    <b-form-group
                        id="submit-btn"
                        label-cols-sm="1"
                        label-cols-lg="1"
                        label=""
                        label-for=""
                    >
                      <b-button type="submit" variant="primary" class="w-lg">Submit</b-button>
                    </b-form-group>

                  </form>
                </div>
              </div>
              <!-- end row -->
            </div>
          </div>
          <!-- end card -->
        </div>

        <!-- end col -->
      </div>
      <!-- end row -->
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Training Categories</h4>
              <p class="card-title-desc">
                All Training Categories
              </p>
              <div class="col-lg-12">
                <CategoriesTable :categories-data="categories"/>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="isLoading && !isLoadingError" class="text-center justify-content-center mb-3">
      <b-spinner type="grow" class="mt-5" variant="primary" role="status" style="width: 3rem; height: 3rem;"></b-spinner>
      <p class="text-primary" >loading...</p>
    </div>
    <div v-if="isLoadingError" class="text-center justify-content-center mb-3 mt-5 m-5">
      <errorLoading/>
    </div>

  </Layout>
</template>