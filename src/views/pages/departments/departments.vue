<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import departmentsTable from "./departments-table";
import errorLoading from "@/components/error-loading";
import {required} from "vuelidate/lib/validators";
import {API} from "@/api";


/**
 * Form-element component
 */
export default {
  page: {
    title: "departments",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, departmentsTable, errorLoading },
  validations: {
    name: { required,},
    shortname: { required}
  },
  data() {
    return {
      title: "Setup & Manage Departments",
      items: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Departments",
          active: true
        }
      ],
      departments:[],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      isError:false,
      isSuccess:false,
      isBusy:false,
      isLoading:true,
      isLoadingError:false,
      successMsg:"",
      errorMsg:"",
      name:"",
      shortname:""

    };
  },
  methods:{
    async createDepartment(){
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      else{
        this.processing();
        await API.post("/create-department", {
          name: this.name,
          shortname: this.shortname
        }).then(response => {
              this.completed();
              this.notifySuccess();
              this.showSuccess( "Department Created Sucessfully"/*response.data*/)
              console.log(response.data);
              this.$router.push(
                  this.$route.query.redirectFrom || { name: "Departments" }
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
    API.get("/all-departments").then(response => {
      this.loadComplete();
      this.departments = response.data;
      console.log(response.data);
      this.$router.push(
          this.$route.query.redirectFrom || { name: "Departments" }
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
             <h4 class="card-title mb-5">Create new department</h4>
             <div class="row">
               <div class="col-12">
                 <form class="form-horizontal" role="form" @submit.prevent="createDepartment">
                   <b-form-group
                       id="department-name"
                       label-cols-sm="1"
                       label-cols-lg="1"
                       label="Name"
                       label-for="text"
                   >
                     <b-form-input  :class="{ 'is-invalid':$v.name.$error }" v-model="name" @blur="$v.name.$touch()" for="text" placeholder="E.g Engineering"></b-form-input>
                     <div v-if="$v.name.$error" class="invalid-feedback">
                       <span v-if="!$v.name.required">Department name is required.</span>
                     </div>
                   </b-form-group>

                   <b-form-group
                       id="short-name"
                       label-cols-sm="1"
                       label-cols-lg="1"
                       label="Short Name"
                       label-for="email"
                   >
                     <b-form-input  :class="{ 'is-invalid':$v.shortname.$error }" v-model="shortname" @blur="$v.shortname.$touch()"  id="shortname" placeholder="E.g ENG"></b-form-input>
                     <div v-if="$v.shortname.$error" class="invalid-feedback">
                       <span v-if="!$v.shortname.required">Department shortname is required.</span>
                     </div>
                   </b-form-group>

                   <b-form-group
                       id="submit-btn"
                       label-cols-sm="1"
                       label-cols-lg="1"
                       label=""
                       label-for=""
                   >
                     <b-button v-if="!isBusy"  type="submit" variant="primary" class="w-lg">Submit</b-button>
                     <b-spinner v-else class="m-2" variant="primary" role="status"></b-spinner>
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
             <h4 class="card-title">Departments</h4>
             <p class="card-title-desc">
               All Departments
             </p>
             <div class="col-lg-12">
               <departmentsTable :departments-data="departments"/>
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