<template>
  <v-container class="project-form-bg fill-height d-flex align-center justify-center">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="11" lg="10" xl="9">
        <v-card elevation="8" class="pa-0 rounded-xl main-form-card">
          <!-- Header Bar -->
          <v-sheet class="header-bar d-flex align-center px-6 py-4" elevation="0">
            <v-img
              src="https://ucarecdn.com/e767c054-980a-4511-aabe-8d7cbe48d732/CeedCivilEngineering.jpg"
              width="90"
              class="mr-4"
              style="border-radius: 8px"
            />
            <div class="flex-grow-1 text-center">
              <h2 class="form-title mb-0">Site Specific Pole Barn Order Form & Agreement</h2>
            </div>
            <v-btn color="primary" variant="flat" class="ml-auto" @click="goToDashboard"
              >See Dashboard</v-btn
            >
          </v-sheet>

          <!-- Status and Order Information Section -->
          <v-sheet class="page-section" elevation="1">
            <div class="section-header mb-4">Ceed Civil Engineering Project</div>
            <v-select
              v-model="form.status"
              :items="statuses"
              label="Status"
              class="mb-4"
              dense
              variant="outlined"
              hide-details
              full-width
            />
            <div class="section-header mb-2">Order Information</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.cname" label="Client Name" dense variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.projectname"
                  label="Project Name"
                  dense
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.siteaddress"
                  label="Site Address"
                  dense
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.city" label="City" dense variant="outlined" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="form.state"
                  :items="states"
                  label="Type or select a state"
                  dense
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="form.country" label="Country" dense variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="form.zip" label="Zip" dense variant="outlined" />
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="page-section" elevation="1">
            <div class="section-header">Scope of Work</div>
            <div class="scope-table-wrapper">
              <table class="scope-table-v2">
                <thead>
                  <tr>
                    <th class="scope-header">#</th>
                    <th class="scope-header">Open Pole Barn</th>
                    <th class="scope-header">Enclosed Pole</th>
                    <th class="scope-header">Partially Enclosed Pole Barn</th>
                    <th class="scope-header">Truss Only</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="scope-label">Size</th>
                    <td>
                      <v-text-field
                        v-model="form.openpolebarnsize"
                        id="openpolebarnsize"
                        name="openpolebarnsize"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.enclosedpolesize"
                        id="enclosedpolesize"
                        name="enclosedpolesize"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.partialyenclosedsize"
                        id="partialyenclosedsize"
                        name="partialyenclosedsize"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.trussonlysize"
                        id="trussonlysize"
                        name="trussonlysize"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="scope-label">Post Spacing</th>
                    <td>
                      <v-text-field
                        v-model="form.postspacingopenpolebarn"
                        id="postspacingopenpolebarn"
                        name="postspacingopenpolebarn"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.postspacingenclosedpole"
                        id="postspacingenclosedpole"
                        name="postspacingenclosedpole"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.postspacingpartialyenclosed"
                        id="postspacingpartialyenclosed"
                        name="postspacingpartialyenclosed"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.postspacingtrussonly"
                        id="postspacingtrussonly"
                        name="postspacingtrussonly"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="scope-label">Post Size</th>
                    <td>
                      <v-text-field
                        v-model="form.postsizeopenpolebarn"
                        id="postsizeopenpolebarn"
                        name="postsizeopenpolebarn"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.postsizeenclosedpole"
                        id="postsizeenclosedpole"
                        name="postsizeenclosedpole"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.postsizepartialyenclosed"
                        id="postsizepartialyenclosed"
                        name="postsizepartialyenclosed"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.postsizetrussonly"
                        id="postsizetrussonly"
                        name="postsizetrussonly"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="scope-label">Main Bldg. Pitch</th>
                    <td>
                      <v-text-field
                        v-model="form.maibbldgpitchopenpolebarn"
                        id="maibbldgpitchopenpolebarn"
                        name="maibbldgpitchopenpolebarn"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.maibbldgpitchenclosedpole"
                        id="maibbldgpitchenclosedpole"
                        name="maibbldgpitchenclosedpole"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.maibbldgpitchpartialyenclosed"
                        id="maibbldgpitchpartialyenclosed"
                        name="maibbldgpitchpartialyenclosed"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.maibbldgpitchtrussonly"
                        id="maibbldgpitchtrussonly"
                        name="maibbldgpitchtrussonly"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="scope-label">Metal Roof Panel Gauge</th>
                    <td>
                      <v-text-field
                        v-model="form.metalroofpanelgaugeopenpolebarn"
                        id="metalroofpanelgaugeopenpolebarn"
                        name="metalroofpanelgaugeopenpolebarn"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.metalroofpanelgaugeenclosedpole"
                        id="metalroofpanelgaugeenclosedpole"
                        name="metalroofpanelgaugeenclosedpole"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.metalroofpanelgaugepartialyenclosed"
                        id="metalroofpanelgaugepartialyenclosed"
                        name="metalroofpanelgaugepartialyenclosed"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.metalroofpanelgaugetrussonly"
                        id="metalroofpanelgaugetrussonly"
                        name="metalroofpanelgaugetrussonly"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th class="scope-label">Concrete Slab (Y/N)</th>
                    <td>
                      <v-text-field
                        v-model="form.connectslabopenpolebarn"
                        id="connectslabopenpolebarn"
                        name="connectslabopenpolebarn"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.connectslabenclosedpole"
                        id="connectslabenclosedpole"
                        name="connectslabenclosedpole"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.connectslabpartialyenclosed"
                        id="connectslabpartialyenclosed"
                        name="connectslabpartialyenclosed"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="form.connectslabtrussonly"
                        id="connectslabtrussonly"
                        name="connectslabtrussonly"
                        dense
                        variant="outlined"
                        hide-details
                        class="scope-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Overhang radios below the table -->
            <div class="fake-table-row mb-4">
              <div class="scope-label overhang-label">Overhang</div>
              <div class="overhang-controls">
                <v-radio-group v-model="form.overhangtype" inline hide-details>
                  <v-radio label="Standard" value="standard" />
                  <div style="display: inline-flex; align-items: center">
                    <v-radio label="Custom" value="custom" />
                    <v-text-field
                      v-if="form.overhangtype === 'custom'"
                      v-model="form.overhangvalue"
                      label="Value"
                      dense
                      variant="outlined"
                      hide-details
                      style="width: 100px; margin-left: 8px"
                    />
                  </div>
                </v-radio-group>
              </div>
            </div>

            <!-- Risk, Exposure, Plywood, Wind, Stud Spacing -->
            <v-row class="mb-2">
              <v-col cols="12" md="3">
                <v-radio-group v-model="form.riskcategory" row label="Risk Category" class="mb-2">
                  <v-radio
                    v-for="n in [1, 2, 3, 4]"
                    :key="n"
                    :label="n.toString()"
                    :value="n.toString()"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="3">
                <v-radio-group
                  v-model="form.exposurecategory"
                  row
                  label="Exposure Category"
                  class="mb-2"
                >
                  <v-radio
                    v-for="cat in ['A', 'B', 'C', 'D']"
                    :key="cat"
                    :label="cat"
                    :value="cat"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="3">
                <v-radio-group
                  v-model="form.plywoodonsiding"
                  row
                  label="Plywood On Siding"
                  class="mb-2"
                >
                  <v-radio label="Yes" value="Yes" />
                  <v-radio label="No" value="No" />
                </v-radio-group>
                <v-radio-group
                  v-model="form.plywoodonroof"
                  row
                  label="Plywood On Roof"
                  class="mb-2"
                >
                  <v-radio label="Yes" value="Yes" />
                  <v-radio label="No" value="No" />
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="form.windspeed"
                  label="Wind Speed"
                  dense
                  variant="outlined"
                />
                <v-checkbox v-model="form.wetmapandseal" label="Wet Stamp And Seal" />
                <v-radio-group
                  v-model="form.studspacing"
                  row
                  label="2 x 6 Stud Spacing"
                  class="mb-2"
                >
                  <v-radio label="16" value="16" />
                  <v-radio label="24" value="24" />
                  <v-radio label="Custom" value="custom" />
                </v-radio-group>
                <v-text-field
                  v-if="form.studspacing === 'custom'"
                  v-model="form.studspacingcustomvalue"
                  label="Custom Stud Spacing Value"
                  dense
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- Add-ons -->
            <div class="form-section-title mt-8 mb-2">ADD-ONS</div>
            <v-row class="mb-2">
              <v-col cols="12" md="4">
                <v-checkbox v-model="form.selectaddonsfordoors" label="Doors" />
                <v-row v-if="form.selectaddonsfordoors">
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.addonsfordoorsquantityenclosedpole"
                      label="Quantity"
                      dense
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.addonsfordoorssizeenclosedpole"
                      label="Size"
                      dense
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-checkbox v-model="form.selectaddonsforwindows" label="Windows" />
                <v-row v-if="form.selectaddonsforwindows">
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.addonsforwindowsquantityenclosedpole"
                      label="Quantity"
                      dense
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.addonsforwindowssizeenclosedpole"
                      label="Size"
                      dense
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-checkbox v-model="form.selectaddonsforleanto" label="Lean-To" />
                <v-row v-if="form.selectaddonsforleanto">
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.addonsleantoopenpolebarnsize"
                      label="Size"
                      dense
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.addonsleantoopenpolebarnpitch"
                      label="Pitch"
                      dense
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Ordered by, Signature, Date, Notes -->
            <v-row class="mb-2">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.orderedby"
                  label="Ordered by"
                  dense
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="form.signature" label="Signature" dense variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.orderdate"
                  label="Order Date"
                  type="date"
                  dense
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.additionalinformationnotes"
                  label="Additional Information/Notes"
                  rows="2"
                  dense
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- Upload Sketch -->
            <div class="upload-title mt-8 mb-2">Page 2 - Upload Sketch</div>
            <v-file-input
              v-model="form.files"
              label="Upload Files"
              multiple
              show-size
              prepend-icon="mdi-upload"
              variant="outlined"
              class="mb-2"
            />

            <div class="text-center mt-8">
              <v-btn
                color="red darken-2"
                type="submit"
                size="large"
                class="px-10 py-4 text-white font-weight-bold"
                >Submit</v-btn
              >
            </div>

            <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">{{
              errorMessage
            }}</v-alert>
            <v-alert v-if="successMessage" type="success" variant="tonal" class="mt-4">{{
              successMessage
            }}</v-alert>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const states = ['AL', 'FL']
const statuses = [
  'New Request',
  'Accepted',
  'In Progress',
  'For Review by BW',
  'Approved by BW',
  'Rework',
  'S&S',
  'Delivered',
  'Archived',
]

const form = reactive({
  status: '',
  cname: '',
  projectname: '',
  siteaddress: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  openpolebarnsize: '',
  postspacingopenpolebarn: '',
  postsizeopenpolebarn: '',
  maibbldgpitchopenpolebarn: '',
  metalroofpanelgaugeopenpolebarn: '',
  connectslabopenpolebarn: '',
  enclosedpolesize: '',
  postspacingenclosedpole: '',
  postsizeenclosedpole: '',
  maibbldgpitchenclosedpole: '',
  metalroofpanelgaugeenclosedpole: '',
  connectslabenclosedpole: '',
  partialyenclosedsize: '',
  postspacingpartialyenclosed: '',
  postsizepartialyenclosed: '',
  maibbldgpitchpartialyenclosed: '',
  metalroofpanelgaugepartialyenclosed: '',
  connectslabpartialyenclosed: '',
  trussonlysize: '',
  postspacingtrussonly: '',
  postsizetrussonly: '',
  maibbldgpitchtrussonly: '',
  metalroofpanelgaugetrussonly: '',
  connectslabtrussonly: '',
  overhangtype: '',
  overhangvalue: '',
  riskcategory: '',
  exposurecategory: '',
  plywoodonsiding: '',
  plywoodonroof: '',
  windspeed: '',
  wetmapandseal: false,
  studspacing: '',
  studspacingcustomvalue: '',
  projectpricing: '',
  selectaddonsfordoors: false,
  addonsfordoorsquantityenclosedpole: '',
  addonsfordoorssizeenclosedpole: '',
  selectaddonsforwindows: false,
  addonsforwindowsquantityenclosedpole: '',
  addonsforwindowssizeenclosedpole: '',
  selectaddonsforleanto: false,
  addonsleantoopenpolebarnsize: '',
  addonsleantoopenpolebarnpitch: '',
  orderedby: '',
  signature: '',
  orderdate: '',
  additionalinformationnotes: '',
  files: [],
})

const errorMessage = ref('')
const successMessage = ref('')

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<style scoped>
.project-form-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8eafc 0%, #fbe9e7 100%);
}
.main-form-card {
  background: #fff6f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
}
.header-bar {
  background: #fff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border-bottom: 1.5px solid #f2caca;
  min-height: 150px;
}
.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.5px;
}
.main-form-section {
  background: #fff6f6;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}
.form-section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #b62025;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}
.section-note {
  font-size: 0.95rem;
  color: #222;
  font-weight: 400;
  margin-left: 8px;
}
.status-select {
  min-width: 200px;
  max-width: 300px;
}
.scope-table-wrapper {
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid #f2caca;
  padding: 0;
  overflow-x: auto;
  margin-bottom: 2px;
}
.scope-table-v2 {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.scope-table-v2 th.scope-header {
  background: #ffeaea;
  color: #b62025;
  font-weight: 700;
  text-align: center;
  font-size: 1.05rem;
  padding: 10px 8px;
  border-bottom: 2px solid #f2caca;
}
.scope-table-v2 th.scope-label {
  background: #fff6f6;
  color: #b62025;
  font-weight: 600;
  text-align: left;
  font-size: 1rem;
  padding: 8px 10px;
  border-right: 1.5px solid #f2caca;
  min-width: 140px;
}
.scope-table-v2 td {
  background: #fff;
  padding: 6px 8px;
  min-width: 140px;
  border-bottom: 1px solid #f2caca;
  margin-bottom: 2px;
}
.scope-table-v2 tr:last-child td {
  border-bottom: 0;
}
.scope-input {
  margin-bottom: 0;
}
.upload-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #b62025;
  margin-bottom: 18px;
  text-align: center;
}
.page-section {
  background: #fff0f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 16px;
  margin-bottom: 16px;
  margin-top: 16px;
}
.section-header {
  font-size: 1.25rem;
  font-weight: 700;
  color: #b62025;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}
.overhang-row {
  flex-wrap: nowrap !important;
  width: 100%;
}
.overhang-row-cell {
  min-width: 600px;
  padding-left: 16px;
  padding-right: 16px;
}
.overhang-radio-group .v-selection-control {
  margin-right: 32px !important;
}
.fake-table-row {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f2caca;
  border-top: 1px solid #f2caca;
  border-left: 1.5px solid #f2caca;
  border-right: 1.5px solid #f2caca;
  border-radius: 10px;
  min-height: 56px;
}
.scope-label.overhang-label {
  width: 162px;
  font-weight: 600;
  color: #b62025;
  background: #fff6f6;
  padding: 15px 10px;
  border-right: 1.5px solid #f2caca;
  min-width: 140px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.overhang-controls {
  flex: 1;
  padding-left: 16px;
  display: flex;
  align-items: center;
}
</style>
