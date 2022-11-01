<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";
import {API} from "@/api";
import Vue from "vue";
import completedTrainings from "./completed-training-table";
var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});


/**
 * Form-element component
 */
export default {
  page: {
    title: "Trainings & Resources",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, Multiselect, completedTrainings },
  data() {
    return {
      isError: false,
      isSuccess: false,
      isBusy: false,
      isLoading: true,
      isLoadingError: false,
      successMsg: "",
      errorMsg: "",
      files:[],
      title: "Trainings & Resources",
      items: [
        {
          text: "Archive",
          href: "/"
        },
        {
          text: "View",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      value: null,
      employees_sublist: [],
      schedules:[],
      schedule:null,
      selectedSchedule:"",
      schedules_sublist: [],
      selectedSchedule_department:"",
      Title:"",
      Description:"",
      TypeofTraining:"",
      Start:"",
      End:"",
      Cost:"",
      Department:"",
      Facilitator:"",
      departments:[],
      resources:[],
      filenames:[]
    };
  },
  mounted() {
    API.get(`/training-schedule/completed/get/0`).then(response => {
      this.loadComplete();
      this.schedules = response.data;
      this.schedules.map( sch => {
        this.schedules_sublist.push({
          value:sch.id,
          text:`${sch.ts_title}`
        });
      });
      console.log(response.data);
    }).catch(e => {
      this.notifyLoadingError();
      console.log(e);
    })
  },

  methods:{
    toast(message, variant, append = false) {
      this.counter++;
      this.$bvToast.toast(`${message}`, {
        title: `Notification`,
        toaster: "b-toaster-bottom-right",
        variant:variant,
        solid: true,
        appendToast: append
      });
    },
    scheduleSelector({ text }){
      return `${ text }`;
    },
    handleFilesUpload( event ){
      let uploadedFiles = event.target.files;
      for( let i = 0; i < uploadedFiles.length; i++ ){
        this.files.push( uploadedFiles[i] );
      }
    },
    ScheduleSelectedChanged(){
      this.clearError();
      this.selectedSchedule = this.schedules.find( ({ id }) => id === this.schedule.value );
      this.selectedSchedule_department = this.selectedSchedule.department.name;
    },
    submitFiles(){
      this.clearError();
      this.clearSuccess();
      if(this.selectedSchedule == null || this.selectedSchedule == "")
      {
        this.notifyError();
        this.showError("Please Select a Training");
        return;
      }

      if(this.files == null || this.files.length <=0)
      {
        this.notifyError();
        this.showError("Please Select at least one Training Resource to upload");
        return;
      }

      let formData = new FormData();
      for( let i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[' + i + ']', file);
      }
      formData.append("training", this.selectedSchedule.id);
      this.processing();
      API.post( '/trainings/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      ) .then(response => {
        this.completed();
        this.notifySuccess();
        this.showSuccess(response.data);
        this.toast("Files Uploaded successfully", "success");
        this.files.length=0;
        this.selectedSchedule ="";
        console.log(response.data);
      }).catch(e => {
            this.completed();
            this.notifyError();
            //this.showError("Oops! an error occured while processing ");
            this.showError(e.response.data);
            this.toast("An error has occured", "danger");
            //this.errorMsg = e.response.data;
            console.log(e);

          })
    },
    onSelectedSchedule(rec) {
      this.selectedSchedule = rec;
      this.resources = rec.files;
      //this.parseFiles();
      this.selectedSchedule_department = rec.department.name;
      this.Title = rec.ts_title;
      this.editorData = rec.ts_description;
      this.Department = {value:rec.department.id, text:rec.department.name};
      this.TypeofTraining = rec.ts_type;
      this.Cost = rec.ts_cost;
      this.Start = rec.ts_start;
      this.End = rec.ts_end;
      this.Facilitator = rec.ts_facilitator;
    },
    async downloadDocument(resource) {
      API.get(`/trainings/download/${resource.id}`, {responseType: 'arraybuffer'}).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", resource.filenames);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }).catch(e => {
        console.log(e);
      })
    },
    clearData(){
      this.selectedSchedule ="";
      this.schedule=null;
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row mb-3">
      <div class="col-10">
      </div>
      <div class="col-2">
        <b-button v-b-modal.new-training-resource-modal  class="w-lg" @click="clearData"  variant="primary"> <i class="mdi mdi-plus mr-2"></i> Upload Resources</b-button>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
          <b-alert v-if="isError"  dismissible show variant="danger">{{ errorMsg }}</b-alert>
          <completedTrainings :schedules="schedules" @onSelectedSchedule="onSelectedSchedule" />
          <div class="row">
            <div class=" col-6 mt-3">
              <p class="mb-2">Total cost</p>
<!--              <h4>₦ {{sum | formatNumber}}</h4>-->
            </div>
            <div class=" col-6 mt-3">
            </div>

          </div>
        </div>
      </div>
      <!-- end card -->
    </div>



    <b-modal
        id="new-training-resource-modal"
        size="lg"
        centered
        title="Upload Training Resources"
        title-class="font-size-14"
        hide-footer
    >

      <div class="row">
        <div class="col-12">
          <div class="">
            <div class="card-body">

              <div class="row">
                <div class="col-12">
                  <b-alert v-if="isSuccess" dismissible show variant="success">{{ successMsg }}</b-alert>
                  <b-alert v-if="isError" show variant="danger">{{ errorMsg }}</b-alert>
                  <form class="form-horizontal" role="form">
                    <b-form-group
                        id="training"
                        label="Select Training"
                        label-for="text"
                    >
                      <multiselect v-model="schedule" :options="schedules_sublist"  @input="ScheduleSelectedChanged" :custom-label="scheduleSelector" :allow-empty="false" ></multiselect>
                    </b-form-group>
                  </form>

                  <div class="mb-3">
                    <div class="">
                      <div v-if="selectedSchedule!=''" >
                        <div class="media mb-4">
                          <!--                        <img
                                                      class="d-flex mr-3 rounded-circle avatar-sm"
                                                      src="@/assets/images/tcnlogo.png"
                                                      alt="Generic placeholder image"
                                                  />-->
                          <div class="media-body">
                            <h5 class="font-size-14 my-1">{{selectedSchedule.ts_title}}</h5>
                            <div><small class="text-muted"> {{selectedSchedule.ts_type}}</small></div>
                            <small class="text-muted"> {{selectedSchedule.ts_start}} - {{selectedSchedule.ts_end}}</small>
                          </div>
                        </div>

                        <h4 class="mt-0 font-size-16">{{selectedSchedule.ts_title}}</h4>

                        <p
                            readonly
                            v-html="this.selectedSchedule.ts_description">
                        </p>

                        <div class="row">
                          <div class="col-2">
                            <div>
                              <small class="text-muted">Department</small>
                              <h5 class="mt-0 font-size-14">
                                {{selectedSchedule_department}}
                              </h5>
                            </div>
                          </div>

                          <div class="col-2">
                            <div>
                              <small class="text-muted">Unit Cost </small>
                              <h5 class="mt-0 font-size-14">
                                ₦ {{this.selectedSchedule.ts_cost | formatNumber}}
                              </h5>
                            </div>
                          </div>

                          <div class="col-2">
                            <div>
                              <small class="text-muted">Status</small>
                              <div>
                                <b-badge v-if="selectedSchedule.ts_status == 1"  variant="primary">Pending</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 4"  variant="success" class="">Approved</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 2"  variant="warning" class="">Submitted</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 3"  variant="danger"  class="">Declined</b-badge>
                                <b-badge v-if="selectedSchedule.ts_status == 5"  variant="primary" class="">Completed</b-badge>
                              </div>
                            </div>
                          </div>

                          <div class="col-5">
                            <div>
                              <i class="mdi mdi-account-multiple"></i>
                              <small class="text-muted">Facilitator</small>
                              <h5 class="mt-0 font-size-14">
                                {{selectedSchedule.ts_facilitator}}
                              </h5>
                            </div>
                          </div>





                        </div>




                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end row -->
            </div>
          </div>
          <!-- end card -->
        </div>
      </div>


      <div class="row">
        <div class="col-lg-12">
          <form class="form-horizontal" role="form" @submit.prevent="submitFiles">
            <div class="">
              <div class="card-body">
                <!--              <b-alert v-if="isDocumentSuccess" dismissible show variant="success">{{ documentSuccessMsg }}</b-alert>
                              <b-alert v-if="documenterror" show variant="danger">{{ errorMsg }}</b-alert>-->
                <h4 class="card-title">Upload Files</h4>
                <p class="card-title-desc">
                  Select files upload
                </p>
                <div class="custom-file">
                  <input type="file" id="file" class="custom-file-input" multiple
                         v-on:change="handleFilesUpload($event)"/>

                  <label class="custom-file-label" for="file"></label>

                </div>

                <div v-for="file in files" v-bind:key="file.index">
                  <div class="pt-2">
                    <b-badge variant="primary" class="p-2" >{{file.name}}  {{(file.size/(1024 * 1024)).toFixed(2)}}MB</b-badge>
                  </div>
                </div>

                <b-form-group
                    id="submit-csv"
                    class="mt-4"
                    label=""
                    label-for=""
                >
                  <b-button v-if="!isBusy" class="w-lg" type="submit" variant="primary">Submit
                  </b-button>
                  <b-spinner v-else class="m-2" role="status" variant="primary"></b-spinner>
                </b-form-group>

              </div>
            </div>
          </form>
        </div>
      </div>

    </b-modal>


    <b-modal
        id="view-completed-training"
        size="lg"
        centered
        title="Training Information"
        title-class="font-size-14"
        hide-footer
    >
    <div>{{selectedSchedule.ts_title}}</div>
    <div class="mb-3">
        <div class="">
          <div class="btn-toolbar p-3" role="toolbar">
            <Toolbar />
          </div>

          <div class="card-body">
            <div class="media mb-4">
              <img
                  class="d-flex mr-3 rounded-circle avatar-sm"
                  src="@/assets/images/tcnlogo.png"
                  alt="Generic placeholder image"
              />
              <div class="media-body">
                <h5 class="font-size-14 my-1">{{selectedSchedule.ts_title}}</h5>
                <div><small class="text-muted"> {{selectedSchedule.ts_type}}</small></div>
                <small class="text-muted"> {{selectedSchedule.ts_start}} - {{selectedSchedule.ts_end}}</small>
              </div>
            </div>

            <h4 class="mt-0 font-size-16">{{selectedSchedule.ts_title}}</h4>

            <p
                readonly
                v-html="this.selectedSchedule.ts_description">
            </p>

            <div>
              <small class="text-muted">Department</small>
              <h5 class="mt-0 font-size-14">
                {{selectedSchedule_department}}
              </h5>
            </div>

            <div>
              <small class="text-muted">Unit Cost </small>
              <h5 class="mt-0 font-size-14">
                ₦ {{this.selectedSchedule.ts_cost | formatNumber}}
              </h5>
            </div>


            <div>
              <small class="text-muted">Status</small>
              <div>
                <b-badge v-if="selectedSchedule.ts_status == 1" variant="primary">Pending</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 4"  variant="success" class="">Approved</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 2"  variant="warning" class="">Submitted</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 3"  variant="danger" class="">Declined</b-badge>
                <b-badge v-if="selectedSchedule.ts_status == 5" variant="primary">Completed</b-badge>
              </div>
            </div>

            <div class="mt-3">
              <i class="mdi mdi-account-multiple"></i>
              <small class="text-muted">Facilitator</small>
              <h5 class="mt-0 font-size-14">
                {{selectedSchedule.ts_facilitator}}
              </h5>
            </div>


            <label class="mt-3">Training Resources </label>
            <hr class="mt-0" />
<!--            src="@/assets/images/small/img-3.jpg"-->
            <div class="row" >
              <div class="col-xl-2 col-3" v-for="(resource, index) in resources" v-bind:key="index">
                <div class="card" v-bind="resource">
                  <img v-if="resource.filenames.split('.').pop() == 'jpg' || resource.filenames.split('.').pop() == 'jpeg'"
                      class="card-img-top img-fluid"
                       src="@/assets/images/jpg.png"
                      alt="Card image cap"
                  />
                  <img v-else-if="resource.filenames.split('.').pop() == 'pdf'"
                       class="card-img-top img-fluid"
                       src="@/assets/images/pdf.png"
                       alt="Card image cap"
                  />
                  <img v-else-if="resource.filenames.split('.').pop() == 'mp4'"
                       class="card-img-top img-fluid"
                       src="@/assets/images/video.png"
                       alt="Card image cap"
                  />
                  <img v-else
                       class="card-img-top img-fluid"
                       src="@/assets/images/file.png"
                       alt="Card image cap"
                  />
                  <div class="py-2 text-center">
                    <a class="font-weight-medium btn" @click="downloadDocument(resource)">Download</a>
                  </div>
                </div>
              </div>


            </div>


          </div>
        </div>
      </div>

    </b-modal>

  </Layout>
</template>