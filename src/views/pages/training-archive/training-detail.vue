<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";


/**
 * Email-read component
 */
export default {
  page: {
    title: "Read Email",
    meta: [{ name: "description" }]
  },
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component
  },
  data() {
    return {
      title: "Read Email",
      items: [
        {
          text: "Email",
          href: "/"
        },
        {
          text: "Read Email",
          active: true
        }
      ],
      showModal: false,
      editor: ClassicEditor,
      editorData: "<p>Content of the editor.</p>"
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <!-- Left sidebar -->

        <!-- Right Sidebar -->
        <div class="mb-3">
          <div class="card">

            <div class="card-body">

              <h4 class="mt-0 font-size-20">This Week's Top Stories</h4>
              <div class="media-body mb-5">
                <h5 class="font-size-14 my-1"><small class="text-muted md">Uploaded by </small> Humberto D. Champion</h5>
                <i class="mdi mdi-calendar font-size-14"></i><small class="text-muted md">25th Oct, 2022</small>
              </div>

              <p>Dear Lorem Ipsum,</p>
              <p>Praesent dui ex, dapibus eget mauris ut, finibus vestibulum enim. Quisque arcu leo, facilisis in fringilla id, luctus in tortor. Nunc vestibulum est quis orci varius viverra. Curabitur dictum volutpat massa vulputate molestie. In at felis ac velit maximus convallis.</p>
              <p>Sed elementum turpis eu lorem interdum, sed porttitor eros commodo. Nam eu venenatis tortor, id lacinia diam. Sed aliquam in dui et porta. Sed bibendum orci non tincidunt ultrices. Vivamus fringilla, mi lacinia dapibus condimentum, ipsum urna lacinia lacus, vel tincidunt mi nibh sit amet lorem.</p>
              <p>Sincerly,</p>
              <hr />

              <div class="row">
                <div class="col-xl-2 col-6">
                  <div class="card">
                    <img
                      class="card-img-top img-fluid"
                      src="@/assets/images/small/img-3.jpg"
                      alt="Card image cap"
                    />
                    <div class="py-2 text-center">
                      <a href class="font-weight-medium">Download</a>
                    </div>
                  </div>
                </div>
                <div class="col-xl-2 col-6">
                  <div class="card">
                    <img
                      class="card-img-top img-fluid"
                      src="@/assets/images/small/img-4.jpg"
                      alt="Card image cap"
                    />
                    <div class="py-2 text-center">
                      <a href class="font-weight-medium">Download</a>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
        <!-- card -->
      </div>
      <!-- end Col-9 -->
    </div>
    <b-modal v-model="showModal" title="New Message" centered>
      <form>
        <div class="form-group">
          <input type="email" class="form-control" placeholder="To" />
        </div>

        <div class="form-group">
          <input type="text" class="form-control" placeholder="Subject" />
        </div>
        <div class="form-group">
          <ckeditor v-model="editorData" :editor="editor"></ckeditor>
        </div>
      </form>
      <template v-slot:modal-footer>
        <b-button variant="secondary" @click="showModal = false">Close</b-button>
        <b-button variant="primary">
          Send
          <i class="fab fa-telegram-plane ml-1"></i>
        </b-button>
      </template>
    </b-modal>
  </Layout>
</template>
