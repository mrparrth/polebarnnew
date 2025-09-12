<template>
  <v-container class="project-form-bg d-flex">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12">
        <v-card elevation="8" class="pa-0 rounded-xl main-form-card">
          <!-- Header Bar -->
          <v-sheet class="header-bar d-flex align-center py-4 position-relative" elevation="0">
            <v-img
              src="https://ucarecdn.com/e767c054-980a-4511-aabe-8d7cbe48d732/CeedCivilEngineering.jpg"
              height="100"
              width="100"
              class="rounded-lg position-absolute"
              style="left: 30px; top: 50%; transform: translateY(-50%)"
            />
            <div class="position-absolute w-100 d-flex justify-center">
              <h2 class="form-title mb-0 text-center">
                Site Specific Pole Barn <br />Order Form & Agreement
              </h2>
            </div>
            <div
              class="position-absolute d-flex flex-column"
              style="right: 20px; top: 33px; gap: 10px"
            >
              <v-btn v-if="isAdmin" color="secondary" variant="flat" @click="updatePaperStock"
                >Update Paper Stock</v-btn
              >
              <v-btn color="primary" variant="flat" @click="goToDashboard">View Dashboard</v-btn>
            </div>
          </v-sheet>

          <!-- Status and Order Information Section -->
          <v-sheet
            class="page-section"
            elevation="1"
            v-if="form.projectSubType !== 'paperCopyRequest'"
          >
            <div class="section-header mb-4">Ceed Civil Engineering Project</div>
            <v-row>
              <v-col cols="12" md="6" v-if="isEdit">
                <v-text-field
                  v-model="form.projectId"
                  label="Project ID"
                  variant="outlined"
                  dense
                  required
                  name="projectId"
                  disabled
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.status"
                  :items="STATUSES"
                  label="Status"
                  class="mb-4"
                  dense
                  variant="outlined"
                  hide-details
                  full-width
                  name="status"
                  :disabled="shouldDisableField('status')"
                  :error-messages="fieldErrors.status"
                  :error="!!fieldErrors.status"
                />
              </v-col>
            </v-row>
            <div class="section-header mb-2">Order Information</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.clientName"
                  :class="{ required: isRequired('clientName') }"
                  label="Client Name"
                  dense
                  variant="outlined"
                  required
                  name="clientName"
                  :disabled="shouldDisableField('clientName')"
                  :error-messages="fieldErrors.clientName"
                  :error="!!fieldErrors.clientName"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.projectName"
                  :class="{ required: isRequired('projectName') }"
                  label="Project Name"
                  dense
                  variant="outlined"
                  required
                  name="projectName"
                  counter="25"
                  :disabled="shouldDisableField('projectName')"
                  :error-messages="fieldErrors.projectName"
                  :error="!!fieldErrors.projectName"
                  @input="validateProjectNameLength"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.siteAddress"
                  :class="{ required: isRequired('siteAddress') }"
                  label="Site Address"
                  dense
                  variant="outlined"
                  required
                  name="siteAddress"
                  :disabled="shouldDisableField('siteAddress')"
                  :error-messages="fieldErrors.siteAddress"
                  :error="!!fieldErrors.siteAddress"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="form.city"
                  :class="{ required: isRequired('city') }"
                  label="City"
                  dense
                  variant="outlined"
                  required
                  name="city"
                  :disabled="shouldDisableField('city')"
                  :error-messages="fieldErrors.city"
                  :error="!!fieldErrors.city"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="form.state"
                  :items="STATES"
                  :class="{ required: isRequired('state') }"
                  label="State"
                  dense
                  variant="outlined"
                  name="state"
                  :disabled="shouldDisableField('state')"
                  :error-messages="fieldErrors.state"
                  :error="!!fieldErrors.state"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="form.zip"
                  :class="{ required: isRequired('zip') }"
                  label="Zip"
                  dense
                  variant="outlined"
                  name="zip"
                  :disabled="shouldDisableField('zip')"
                  :error-messages="fieldErrors.zip"
                  :error="!!fieldErrors.zip"
                />
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet
            class="page-section"
            elevation="1"
            v-if="form.projectSubType !== 'paperCopyRequest'"
          >
            <div class="section-header">Project Type (Select One To Proceed)</div>
            <v-row>
              <v-radio-group
                v-model="form.projectType"
                inline
                name="projectType"
                :disabled="shouldDisableField('projectType')"
                :error-messages="fieldErrors.projectType"
                :error="!!fieldErrors.projectType"
                hide-details
              >
                <v-col cols="6" xs="12">
                  <v-radio
                    label="Typical OPB ONLY / Name & Address Change ONLY"
                    value="typicalOpbOnly"
                    hide-details
                  />
                </v-col>
                <v-col cols="6" xs="12">
                  <v-radio label="Custom Pole Barn" value="customPoleBarn" hide-details />
                </v-col>
                <v-col cols="6" xs="12" v-if="!isEdit || form.projectType === 'paperCopy'">
                  <v-radio label="Paper Copy" value="paperCopy" hide-details />
                </v-col>
              </v-radio-group>
            </v-row>
          </v-sheet>

          <div v-if="form.projectType === 'paperCopy'">
            <v-sheet class="page-section" elevation="1">
              <div class="section-header mb-4">Paper Copy Options</div>
              <v-table>
                <colgroup>
                  <col style="width: 33%" />
                  <col style="width: 33%" />
                  <col style="width: 33%" />
                </colgroup>
                <thead>
                  <tr>
                    <th class="text-left">Type</th>
                    <th class="text-left">
                      {{ form.projectSubType === 'paperCopyRequest' ? 'Request Qty' : 'Sold Qty' }}
                    </th>
                    <th class="text-left">Qty In Stock Right Now</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Open pole barn</td>
                    <td>
                      <v-select
                        v-model="form.opbPaperSold"
                        name="paperCopyOpenPoleBarnQty"
                        :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="max-width-100"
                        clearable
                        :error="!!fieldErrors.opbPaperSold"
                        :disabled="isEdit"
                        v-if="!isEdit"
                      />
                      <div v-if="isEdit" disabled>
                        {{ form.opbPaperSold || form.openPoleBarn }}
                      </div>
                    </td>
                    <td>
                      {{ projectStore.paperCopyStock.openPoleBarn.qty }}
                      <span v-if="form.opbPaperSold && !isEdit">
                        (Left in Stock
                        {{ projectStore.paperCopyStock.openPoleBarn.qty - form.opbPaperSold }})
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Lean to</td>
                    <td>
                      <v-select
                        v-model="form.leanToPaperSold"
                        name="paperCopyLeanToQty"
                        :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="max-width-100"
                        clearable
                        :disabled="isEdit"
                        v-if="!isEdit"
                      />
                      <div v-if="isEdit" disabled>
                        {{ form.leanToPaperSold || form.leanTo }}
                      </div>
                    </td>
                    <td>
                      {{ projectStore.paperCopyStock.leanTo.qty }}
                      <span v-if="form.leanToPaperSold && !isEdit">
                        (Left in Stock
                        {{ projectStore.paperCopyStock.leanTo.qty - form.leanToPaperSold }})
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Single slope</td>
                    <td>
                      <v-select
                        v-model="form.singleSlopePaperSold"
                        name="paperCopySingleSlopeQty"
                        :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="max-width-100"
                        clearable
                        :disabled="isEdit"
                        v-if="!isEdit"
                      />
                      <div v-if="isEdit" disabled>
                        {{ form.singleSlopePaperSold || form.singleSlope }}
                      </div>
                    </td>
                    <td>
                      {{ projectStore.paperCopyStock.singleSlope.qty }}
                      <span v-if="form.singleSlopePaperSold && !isEdit">
                        (Left in Stock
                        {{
                          projectStore.paperCopyStock.singleSlope.qty - form.singleSlopePaperSold
                        }})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div
                v-if="fieldErrors.qtyFields"
                class="text-error text-body-2 mt-2"
                name="qtyFields"
                style="margin-left: 40%"
              >
                {{ fieldErrors.qtyFields }}
              </div>
            </v-sheet>
          </div>

          <div v-if="form.projectType !== 'paperCopy' && (form.projectType || isEdit)">
            <v-sheet class="page-section" elevation="1">
              <div class="section-header">Scope of Work</div>

              <div class="scope-table-wrapper">
                <table class="scope-table-v2">
                  <thead>
                    <tr>
                      <th class="scope-header">#</th>
                      <th
                        v-for="column in visibleScopeColumns"
                        :key="column.key"
                        class="scope-header"
                      >
                        {{ column.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in scopeOfWorkRows" :key="row.label">
                      <th class="scope-label">{{ row.label }}</th>
                      <td v-for="column in visibleScopeColumns" :key="column.key">
                        <div
                          v-if="row.key === 'Size'"
                          class="sow-input-container"
                          tabindex="0"
                          :name="`${column.key}${row.key}`"
                          :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                          @click="focusFirstInput('size', `${column.key}${row.key}`)"
                          @focusin="activeColumns[column.key] = true"
                        >
                          <input
                            v-model="sizeInputs[`${column.key}${row.key}`].l"
                            :name="`size-${column.key}${row.key}-l`"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? 'L' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                          <span class="sow-separator">{{
                            activeColumns[column.key] ? 'x' : ''
                          }}</span>
                          <input
                            v-model="sizeInputs[`${column.key}${row.key}`].w"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? 'W' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                          <span class="sow-separator">{{
                            activeColumns[column.key] ? 'x' : ''
                          }}</span>
                          <input
                            v-model="sizeInputs[`${column.key}${row.key}`].h"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? 'H' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                        </div>

                        <div
                          v-else-if="row.key === 'PostSpacing'"
                          class="sow-input-container"
                          tabindex="0"
                          :name="`${column.key}${row.key}`"
                          :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                          @click="focusFirstInput('postSpacing', `${column.key}${row.key}`)"
                          @focusin="activeColumns[column.key] = true"
                        >
                          <input
                            v-model="postSpacingInputs[`${column.key}${row.key}`].value"
                            :name="`postSpacing-${column.key}${row.key}`"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? '' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                          <span class="sow-separator">{{
                            activeColumns[column.key] ? "'" : ''
                          }}</span>
                        </div>

                        <div
                          v-else-if="row.key === 'PostSize'"
                          class="sow-input-container"
                          tabindex="0"
                          :name="`${column.key}${row.key}`"
                          :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                          @click="focusFirstInput('postSize', `${column.key}${row.key}`)"
                          @focusin="activeColumns[column.key] = true"
                        >
                          <input
                            v-model="postSizeInputs[`${column.key}${row.key}`].l"
                            :name="`postSize-${column.key}${row.key}-l`"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? 'L' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                          <span class="sow-separator">{{
                            activeColumns[column.key] ? 'x' : ''
                          }}</span>
                          <input
                            v-model="postSizeInputs[`${column.key}${row.key}`].w"
                            :name="`postSize-${column.key}${row.key}-w`"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? 'W' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                        </div>

                        <div
                          v-else-if="row.key === 'MainBldgPitch'"
                          class="sow-input-container"
                          tabindex="0"
                          :name="`${column.key}${row.key}`"
                          :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                          @click="focusFirstInput('mainBldgPitch', `${column.key}${row.key}`)"
                          @focusin="activeColumns[column.key] = true"
                        >
                          <input
                            v-model="mainBldgPitchInputs[`${column.key}${row.key}`].value"
                            :name="`mainBldgPitch-${column.key}${row.key}`"
                            type="number"
                            min="1"
                            class="sow-input"
                            :placeholder="activeColumns[column.key] ? '' : ''"
                            inputmode="numeric"
                            :disabled="shouldDisableField(`${column.key}${row.key}`)"
                            @click.stop
                          />
                          <span class="sow-separator">{{
                            activeColumns[column.key] ? '/12' : ''
                          }}</span>
                        </div>

                        <v-text-field
                          v-else
                          v-model="form[`${column.key}${row.key}`]"
                          :id="`${column.key}${row.key}`"
                          :name="`${column.key}${row.key}`"
                          dense
                          variant="outlined"
                          hide-details
                          class="scope-input"
                          :disabled="shouldDisableField(`${column.key}${row.key}`)"
                          :error-messages="fieldErrors[`${column.key}${row.key}`]"
                          :error="!!fieldErrors[`${column.key}${row.key}`]"
                          @focus="activeColumns[column.key] = true"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="fake-table-row mb-4" v-if="form.projectType === 'customPoleBarn'">
                <div class="scope-label overhang-label">Overhang</div>
                <div class="overhang-controls">
                  <v-radio-group
                    v-model="form.overhangType"
                    inline
                    hide-details
                    name="overhangType"
                    :disabled="shouldDisableField('overhangType')"
                    :error-messages="fieldErrors.overhangType"
                    :error="!!fieldErrors.overhangType"
                  >
                    <v-radio label="Standard" value="standard" />
                    <div class="d-flex align-items-center">
                      <v-radio label="Custom" value="custom" />
                      <v-text-field
                        v-if="form.overhangType === 'custom'"
                        v-model="form.overhangValue"
                        label="Custom Overhang"
                        dense
                        variant="outlined"
                        hide-details
                        name="overhangValue"
                        :disabled="shouldDisableField('overhangValue')"
                        :error-messages="fieldErrors.overhangValue"
                        :error="!!fieldErrors.overhangValue"
                        style="width: 170px; margin-left: 8px; margin-top: 2px; margin-bottom: 2px"
                      />
                    </div>
                  </v-radio-group>
                </div>
              </div>

              <hr class="section-divider" />

              <v-row>
                <v-col cols="12" md="3">
                  <v-radio-group
                    v-model="form.riskCategory"
                    row
                    label="Risk Category"
                    inline
                    name="riskCategory"
                    :disabled="shouldDisableField('riskCategory')"
                    :error-messages="fieldErrors.riskCategory"
                    :error="!!fieldErrors.riskCategory"
                  >
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
                    v-model="form.exposureCategory"
                    row
                    label="Exposure Category"
                    inline
                    name="exposureCategory"
                    :disabled="shouldDisableField('exposureCategory')"
                    :error-messages="fieldErrors.exposureCategory"
                    :error="!!fieldErrors.exposureCategory"
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
                    v-model="form.plywoodOnSiding"
                    row
                    label="Plywood On Siding"
                    :disabled="shouldDisableField('plywoodOnSiding')"
                    inline
                    name="plywoodOnSiding"
                    :error-messages="fieldErrors.plywoodOnSiding"
                    :error="!!fieldErrors.plywoodOnSiding"
                  >
                    <v-radio label="Yes" value="Yes" />
                    <v-radio label="No" value="No" />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="3">
                  <v-radio-group
                    v-model="form.plywoodOnRoof"
                    row
                    label="Plywood On Roof"
                    inline
                    name="plywoodOnRoof"
                    :disabled="shouldDisableField('plywoodOnRoof')"
                    :error-messages="fieldErrors.plywoodOnRoof"
                    :error="!!fieldErrors.plywoodOnRoof"
                  >
                    <v-radio label="Yes" value="Yes" />
                    <v-radio label="No" value="No" />
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-radio-group
                    v-model="form.studSpacing"
                    row
                    label="2 x 6 Stud Spacing"
                    inline
                    name="studSpacing"
                    v-if="form.projectType !== 'typicalOpbOnly'"
                    :disabled="shouldDisableField('studSpacing')"
                    :error-messages="fieldErrors.studSpacing"
                    :error="!!fieldErrors.studSpacing"
                  >
                    <v-radio label="16" value="16" class="mr-3 my-3" />
                    <v-radio label="24" value="24" class="mr-3 my-3" />
                    <div style="display: inline-flex; align-items: center">
                      <v-radio label="Custom" value="custom" />
                      <v-text-field
                        v-if="form.studSpacing === 'custom'"
                        v-model="form.studSpacingCustomValue"
                        label="Custom Stud Spacing"
                        dense
                        variant="outlined"
                        hide-details
                        name="studSpacingCustomValue"
                        :disabled="shouldDisableField('studSpacingCustomValue')"
                        :error-messages="fieldErrors.studSpacingCustomValue"
                        :error="!!fieldErrors.studSpacingCustomValue"
                        style="width: 200px; margin-left: 8px; margin-top: 2px; margin-bottom: 2px"
                      />
                    </div>
                  </v-radio-group>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="section-header mb-2" style="min-height: 24px"></div>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="windSpeedInput.value"
                        label="Wind Speed"
                        type="number"
                        min="1"
                        dense
                        variant="outlined"
                        name="windSpeed"
                        suffix="MPH"
                        :disabled="shouldDisableField('windSpeed')"
                        :error-messages="fieldErrors.windSpeed"
                        :error="!!fieldErrors.windSpeed"
                      />
                    </v-col>
                    <v-col cols="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="form.wetMapAndSeal"
                        label="Wet Stamp And Seal"
                        :disabled="shouldDisableField('wetMapAndSeal')"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <hr v-if="!shouldHideField('price')" class="section-divider" />
              <v-row v-if="!shouldHideField('price')" class="admin-pricing-field">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.price"
                    label="Project Pricing"
                    type="number"
                    step="0.01"
                    min="0"
                    dense
                    variant="outlined"
                    required
                    name="price"
                    hide-details
                    prepend-inner-icon="mdi-currency-usd"
                    :error-messages="fieldErrors.price"
                    :error="!!fieldErrors.price"
                  />
                </v-col>
              </v-row>
            </v-sheet>

            <v-sheet
              class="page-section"
              elevation="1"
              v-if="form.projectType === 'custom' || isEdit"
            >
              <div class="section-header">ADD-ONS</div>
              <div class="addons-table-wrapper">
                <table class="addons-table">
                  <thead>
                    <tr>
                      <th class="addons-header">Add-On</th>
                      <th
                        v-for="column in visibleAddonColumns"
                        :key="column.key"
                        class="addons-header"
                      >
                        {{ column.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="addon in addonsConfig" :key="addon.key">
                      <th class="addons-label">
                        <v-checkbox
                          v-model="form[addon.checkboxKey]"
                          :label="addon.label"
                          hide-details
                          :disabled="shouldDisableField(addon.checkboxKey)"
                        />
                      </th>
                      <td
                        v-for="column in visibleAddonColumns"
                        :key="column.key"
                        class="addons-cell"
                      >
                        <div v-if="addon.type === 'simple' && column.key === 'Opb'" class="na-text">
                          N/A
                        </div>
                        <div v-else-if="addon.type === 'simple'" class="addons-inputs">
                          <v-text-field
                            v-model="form[`${addon.key}${column.key}Qty`]"
                            :name="`${addon.key}${column.key}Qty`"
                            label="Quantity"
                            dense
                            variant="outlined"
                            hide-details
                            :disabled="
                              shouldDisableField(`${addon.key}${column.key}Qty`) ||
                              !form[addon.checkboxKey]
                            "
                            :error="!!fieldErrors[`${addon.key}${column.key}Qty`]"
                          />
                          <v-text-field
                            v-model="form[`${addon.key}${column.key}Size`]"
                            :name="`${addon.key}${column.key}Size`"
                            label="Size"
                            dense
                            variant="outlined"
                            hide-details
                            :disabled="
                              shouldDisableField(`${addon.key}${column.key}Size`) ||
                              !form[addon.checkboxKey]
                            "
                            :error="!!fieldErrors[`${addon.key}${column.key}Size`]"
                          />
                        </div>
                        <div v-else-if="addon.type === 'complex'" class="addons-inputs">
                          <v-text-field
                            v-model="form[`${addon.key}${column.key}Size`]"
                            :name="`${addon.key}${column.key}Size`"
                            label="Size"
                            dense
                            variant="outlined"
                            hide-details
                            :disabled="
                              shouldDisableField(`${addon.key}${column.key}Size`) ||
                              !form[addon.checkboxKey]
                            "
                            :error="!!fieldErrors[`${addon.key}${column.key}Size`]"
                          />
                          <v-text-field
                            v-model="form[`${addon.key}${column.key}Pitch`]"
                            :name="`${addon.key}${column.key}Pitch`"
                            label="Pitch"
                            dense
                            variant="outlined"
                            hide-details
                            :disabled="
                              shouldDisableField(`${addon.key}${column.key}Pitch`) ||
                              !form[addon.checkboxKey]
                            "
                            :error="!!fieldErrors[`${addon.key}${column.key}Pitch`]"
                          />
                          <div class="slab-section">
                            <div class="slab-label">Slab</div>
                            <v-radio-group
                              v-model="form[`${addon.key}${column.key}Slab`]"
                              inline
                              hide-details
                              :disabled="
                                shouldDisableField(`${addon.key}${column.key}Slab`) ||
                                !form[addon.checkboxKey]
                              "
                            >
                              <v-radio
                                label="Yes"
                                value="Yes"
                                :name="`${addon.key}${column.key}Slab`"
                                :disabled="!form[addon.checkboxKey]"
                                :error="!!fieldErrors[`${addon.key}${column.key}Slab`]"
                              />
                              <v-radio
                                label="No"
                                value="No"
                                :name="`${addon.key}${column.key}Slab`"
                                :disabled="!form[addon.checkboxKey]"
                                :error="!!fieldErrors[`${addon.key}${column.key}Slab`]"
                              />
                              <v-radio
                                label="N/A"
                                value="N/A"
                                :name="`${addon.key}${column.key}Slab`"
                                :disabled="!form[addon.checkboxKey]"
                                :error="!!fieldErrors[`${addon.key}${column.key}Slab`]"
                              />
                            </v-radio-group>
                          </div>
                          <v-text-field
                            v-model="form[`${addon.key}${column.key}PostSize`]"
                            :name="`${addon.key}${column.key}PostSize`"
                            label="Post Size"
                            dense
                            variant="outlined"
                            hide-details
                            :disabled="
                              shouldDisableField(`${addon.key}${column.key}PostSize`) ||
                              !form[addon.checkboxKey]
                            "
                            :error="!!fieldErrors[`${addon.key}${column.key}PostSize`]"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-sheet>
          </div>
          <div v-if="form.projectType || isEdit">
            <v-sheet class="page-section" elevation="1">
              <div class="section-header">Order Information & Signature</div>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.orderedBy"
                    :class="{ required: isRequired('orderedBy') }"
                    label="Ordered by"
                    dense
                    variant="outlined"
                    name="orderedBy"
                    :disabled="shouldDisableField('orderedBy')"
                    :error-messages="fieldErrors.orderedBy"
                    :error="!!fieldErrors.orderedBy"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.signature"
                    :class="{ required: isRequired('signature') }"
                    :disabled="shouldDisableField('signature')"
                    label="Signature"
                    dense
                    variant="outlined"
                    name="signature"
                    :error-messages="fieldErrors.signature"
                    :error="!!fieldErrors.signature"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.orderDate"
                    :class="{ required: isRequired('orderDate') }"
                    label="Order Date"
                    type="date"
                    dense
                    variant="outlined"
                    name="orderDate"
                    :disabled="shouldDisableField('orderDate')"
                    :error-messages="fieldErrors.orderDate"
                    :error="!!fieldErrors.orderDate"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.additionalInformation"
                    :class="{ required: isRequired('additionalInformation') }"
                    label="Additional Information/Notes"
                    rows="4"
                    dense
                    variant="outlined"
                    name="additionalInformation"
                    :disabled="shouldDisableField('additionalInformation')"
                    :error-messages="fieldErrors.additionalInformation"
                    :error="!!fieldErrors.additionalInformation"
                    auto-grow
                  />
                </v-col>
              </v-row>
            </v-sheet>

            <v-sheet class="page-section" elevation="1" v-if="form.projectType !== 'paperCopy'">
              <div class="upload-header-container mb-4">
                <div class="upload-title">Page 2 - Upload Sketch</div>
                <v-btn
                  v-if="form.driveFolder"
                  class="view-folder-btn"
                  prepend-icon="mdi-folder-open"
                  color="primary"
                  variant="outlined"
                  :href="form.driveFolder"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Folder
                </v-btn>
              </div>
              <v-file-input
                v-model="files"
                label="Upload Files"
                multiple
                show-size
                prepend-icon="mdi-upload"
                variant="outlined"
                :disabled="shouldDisableField('uploadSketch')"
                @change="handleFileUpload"
                hide-details
              />

              <!-- File Preview Area -->
              <div v-if="uploadedFiles.length > 0" class="file-preview-area mt-4">
                <div class="file-preview-grid">
                  <div v-for="file in uploadedFiles" :key="file.id" class="file-preview-card">
                    <div v-if="file.isImage" class="image-preview">
                      <img
                        :src="file.preview || file.url"
                        :alt="file.name"
                        class="thumbnail-image"
                      />
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        color="error"
                        class="remove-btn"
                        @click="removeFileById(file.id)"
                      />
                    </div>

                    <div v-else class="file-icon-preview">
                      <v-icon size="48" color="primary">mdi-file-document</v-icon>
                      <a :href="file.url" target="_blank" class="file-name-link">
                        <div class="file-name">{{ file.name }}</div>
                      </a>
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        color="error"
                        class="remove-btn"
                        @click="removeFileById(file.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-sheet>
          </div>
          <div
            class="text-center mb-4 d-flex ga-2 justify-center"
            v-if="form.projectType || isEdit"
          >
            <v-btn
              color="red darken-2"
              type="submit"
              size="large"
              class="px-10 py-4 text-white font-weight-bold"
              :loading="isSubmitting"
              :disabled="isSubmitting || shouldDisableField('submitbutton')"
              @click="handleSubmit"
              name="submitbutton"
            >
              {{
                isSubmitting
                  ? isEdit
                    ? 'Updating...'
                    : 'Submitting...'
                  : isEdit
                    ? 'Update Project'
                    : 'Submit Project'
              }}
            </v-btn>
            <v-btn
              v-if="errorMessage || successMessage"
              color="primary"
              type="submit"
              size="large"
              class="px-10 py-4 text-white font-weight-bold"
              @click="goToDashboard"
            >
              Back to Dashboard
            </v-btn>
          </div>

          <v-alert
            v-if="errorMessage"
            name="project-error"
            type="error"
            variant="tonal"
            class="mt-4"
            >{{ errorMessage }}</v-alert
          >
          <v-alert
            v-if="successMessage"
            name="project-success"
            type="success"
            variant="tonal"
            class="mt-4"
            >{{ successMessage }}</v-alert
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { STATUSES, BLANK_FORM_DATA, STATES } from '@/global'
import { API } from '@/services/apiService'
import { useSnackbar } from '@/composables/useSnackbar'
import { generateShortId } from '@/global'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const { showSnackbar } = useSnackbar()

const errorMessage = ref('')
const successMessage = ref('')
const uploadedFiles = ref([])
const existingImages = ref([])
const isEdit = ref(false)
const fieldErrors = ref({})
const isSubmitting = ref(false)
const files = ref([])
const requiredFields = ref(['clientName', 'siteAddress', 'city', 'state', 'zip'])
const projectNameError = ref('')

const form = reactive({ ...BLANK_FORM_DATA })

watch(
  () => form.projectType,
  () => {
    if (form.projectType === 'paperCopy') {
      requiredFields.value = ['clientName', 'siteAddress', 'city', 'state', 'zip']
    } else {
      requiredFields.value = [
        'clientName',
        'projectName',
        'siteAddress',
        'city',
        'state',
        'zip',
        'riskCategory',
        'exposureCategory',
        'plywoodOnSiding',
        'plywoodOnRoof',
        'windSpeed',
        'orderedBy',
        'signature',
        'orderDate',
      ]

      if (isAdmin.value) {
        requiredFields.value.push('price')
      }

      if (form.projectType !== 'typicalOpbOnly') {
        requiredFields.value.push('studSpacing')
      }
    }
  },
)

const isAdmin = computed(() => {
  return projectStore.user?.type === 'Admin' || projectStore.user?.isAdmin === true
})
const isRequired = (fieldName) => {
  return requiredFields.value.includes(fieldName)
}
// Employee field restrictions
const itemsToNotDisable = ['uploadSketch', 'submitbutton', 'status', 'additionalInformation']
const itemsToHide = ['price']

// Check if field should be disabled for employees
const shouldDisableField = (fieldName) => {
  if (form.projectType === 'paperCopy' && isEdit.value) return true
  if (isAdmin.value || !isEdit.value) return false
  return !itemsToNotDisable.includes(fieldName)
}

// Check if field should be hidden for employees
const shouldHideField = (fieldName) => {
  if (isAdmin.value || !isEdit.value) return false
  return itemsToHide.includes(fieldName)
}

const scopeColumns = [
  { key: 'opb', label: 'Open Pole Barn' },
  { key: 'epb', label: 'Enclosed Pole' },
  { key: 'pepb', label: 'Partially Enclosed Pole Barn' },
  { key: 'truss', label: 'Truss Only' },
]

// Add computed properties for conditional column display
const visibleScopeColumns = computed(() => {
  if (form.projectType === 'typicalOpbOnly') {
    return scopeColumns.filter((col) => col.key === 'opb')
  }
  return scopeColumns
})

// Add-ons configuration
const addonColumns = [
  { key: 'Opb', label: 'Open Pole Barn' },
  { key: 'Epb', label: 'Enclosed Pole' },
  { key: 'Pepb', label: 'Partially Enclosed Pole Barn' },
]

// Add computed property for visible addon columns
const visibleAddonColumns = computed(() => {
  if (form.projectType === 'typicalOpbOnly') {
    return addonColumns.filter((col) => col.key === 'Opb')
  }
  return addonColumns
})

const addonsConfig = [
  {
    key: 'addOnDoor',
    label: 'Doors',
    checkboxKey: 'addOnDoorSelected',
    type: 'simple',
  },
  {
    key: 'addOnWindow',
    label: 'Windows',
    checkboxKey: 'addOnWindowSelected',
    type: 'simple',
  },
  {
    key: 'addOnLeanTo',
    label: 'Lean-To',
    checkboxKey: 'addOnLeanToSelected',
    type: 'complex',
  },
]

const scopeOfWorkRows = [
  { key: 'Size', label: 'Size' },
  { key: 'PostSpacing', label: 'Post Spacing' },
  { key: 'PostSize', label: 'Post Size' },
  { key: 'MainBldgPitch', label: 'Main Bldg. Pitch' },
  { key: 'MetalRoofPanelGauge', label: 'Metal Roof Panel Gauge' },
  { key: 'ConnectSlab', label: 'Concrete Slab (Y/N)' },
]

const sizeInputs = reactive({
  opbSize: { l: '', w: '', h: '' },
  epbSize: { l: '', w: '', h: '' },
  pepbSize: { l: '', w: '', h: '' },
  trussSize: { l: '', w: '', h: '' },
})

const postSpacingInputs = reactive({
  opbPostSpacing: { value: '' },
  epbPostSpacing: { value: '' },
  pepbPostSpacing: { value: '' },
  trussPostSpacing: { value: '' },
})

const postSizeInputs = reactive({
  opbPostSize: { l: '', w: '' },
  epbPostSize: { l: '', w: '' },
  pepbPostSize: { l: '', w: '' },
  trussPostSize: { l: '', w: '' },
})

const mainBldgPitchInputs = reactive({
  opbMainBldgPitch: { value: '' },
  epbMainBldgPitch: { value: '' },
  pepbMainBldgPitch: { value: '' },
  trussMainBldgPitch: { value: '' },
})

const windSpeedInput = reactive({
  value: '',
})

const activeColumns = reactive({
  opb: false,
  epb: false,
  pepb: false,
  truss: false,
})

const columnHasData = (columnKey) => {
  return scopeOfWorkRows.some((row) => {
    const fieldName = `${columnKey}${row.key}`
    return form[fieldName] && form[fieldName].toString().trim() !== ''
  })
}

function handleFileUpload(event) {
  if (!event || !event.target || !event.target.files) return

  const filesArray = Array.from(event.target.files)

  filesArray.forEach((file) => {
    const fileObj = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      isImage: file.type.startsWith('image/'),
      preview: null,
      data: null,
      file: file,
      isNew: true,
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      fileObj.preview = e.target.result
      fileObj.data = e.target.result.split(',')[1]
      uploadedFiles.value.push(fileObj)
    }
    reader.readAsDataURL(file)
  })
}

function removeFileById(id) {
  const uploadedIndex = uploadedFiles.value.findIndex((f) => f.id === id)
  if (uploadedIndex !== -1) {
    uploadedFiles.value.splice(uploadedIndex, 1)
  }

  const existingIndex = existingImages.value.findIndex((f) => f.id === id)
  if (existingIndex !== -1) {
    existingImages.value.splice(existingIndex, 1)
  }
}

function validateProjectNameLength() {
  if (form.projectName && form.projectName.length > 25) {
    fieldErrors.value.projectName =
      'Maximum 25 characters allowed for project name. You can add more information in the notes section.'
  } else if (
    fieldErrors.value.projectName &&
    fieldErrors.value.projectName.includes('Maximum 25 characters')
  ) {
    // Clear the length error but keep other validation errors
    delete fieldErrors.value.projectName
  }
}

function goToDashboard() {
  router.push('/dashboard')
}

function validateRequiredFields() {
  fieldErrors.value = {}

  let hasErrors = false

  for (const field of requiredFields.value) {
    if (!form[field] || form[field].toString().trim() === '') {
      fieldErrors.value[field] = 'This field is required'
      hasErrors = true
    }
  }

  if (
    form.studSpacing === 'custom' &&
    (!form.studSpacingCustomValue || form.studSpacingCustomValue.trim() === '')
  ) {
    fieldErrors.value.studSpacingCustomValue = 'Please enter custom stud spacing value'
    hasErrors = true
  }

  if (form.overhangType === 'custom' && (!form.overhangValue || form.overhangValue.trim() === '')) {
    fieldErrors.value.overhangValue = 'Please enter custom overhang value'
    hasErrors = true
  }

  return hasErrors
}

function validateScopeOfWork() {
  const columnsToValidate =
    form.projectType === 'typicalOpbOnly' ? ['opb'] : ['opb', 'epb', 'pepb', 'truss']
  let hasErrors = false

  for (const column of columnsToValidate) {
    const scopeFields = [
      'Size',
      'PostSpacing',
      'PostSize',
      'MainBldgPitch',
      'MetalRoofPanelGauge',
      'ConnectSlab',
    ]

    let columnHasValue = false
    if (form.projectType === 'typicalOpbOnly') {
      for (const field of scopeFields) {
        const fieldName = `${column}${field}`
        if (!form[fieldName] || form[fieldName].toString().trim() === '') {
          fieldErrors.value[fieldName] = 'This field is required'
          hasErrors = true
        }
      }
    } else {
      for (const field of scopeFields) {
        const fieldName = `${column}${field}`
        if (form[fieldName] && form[fieldName].toString().trim() !== '') {
          columnHasValue = true
          break
        }
        if (field === 'Size') {
          let colSize = sizeInputs[column + 'Size']
          if (colSize.l || colSize.w || colSize.h) {
            columnHasValue = true
            break
          }
        }
        if (field === 'PostSize') {
          let colPostSize = postSizeInputs[column + 'PostSize']
          if (colPostSize.l || colPostSize.w) {
            columnHasValue = true
            break
          }
        }
      }

      if (columnHasValue) {
        for (const field of scopeFields) {
          const fieldName = `${column}${field}`
          if (!form[fieldName] || form[fieldName].toString().trim() === '') {
            fieldErrors.value[fieldName] = 'This field is required'
            hasErrors = true
          }

          if (field === 'Size') {
            let colSize = sizeInputs[column + 'Size']
            if (!colSize.l || !colSize.w || !colSize.h) {
              fieldErrors.value[fieldName] = 'This field is required'
              hasErrors = true
            }
          }

          if (field === 'PostSize') {
            let colPostSize = postSizeInputs[column + 'PostSize']
            if (!colPostSize.l || !colPostSize.w) {
              fieldErrors.value[fieldName] = 'This field is required'
              hasErrors = true
            }
          }
        }
      }
    }
  }

  console.info('hasErrors', fieldErrors)
  return hasErrors
}

function validateAddOns() {
  let hasErrors = false
  const columnsToValidate =
    form.projectType === 'typicalOpbOnly'
      ? addonColumns.filter((col) => col.key === 'Opb')
      : addonColumns

  for (const addon of addonsConfig) {
    if (form[addon.checkboxKey]) {
      for (const column of columnsToValidate) {
        const columnFields = getColumnFields(addon, column.key)

        if (columnFields.length === 0) continue

        const hasColumnData = columnFields.some(
          (field) => form[field] && form[field].toString().trim() !== '',
        )

        if (hasColumnData) {
          for (const field of columnFields) {
            if (!form[field] || form[field].toString().trim() === '') {
              fieldErrors.value[field] = `This field is required for ${addon.label}`
              hasErrors = true
            }
          }
        }
      }
    }
  }

  return hasErrors
}

function getColumnFields(addon, columnKey) {
  if (addon.type === 'simple') {
    if (columnKey === 'Opb') {
      return []
    }
    return [`${addon.key}${columnKey}Qty`, `${addon.key}${columnKey}Size`]
  } else if (addon.type === 'complex') {
    return [
      `${addon.key}${columnKey}Size`,
      `${addon.key}${columnKey}Pitch`,
      `${addon.key}${columnKey}Slab`,
      `${addon.key}${columnKey}PostSize`,
    ]
  }
  return []
}

async function handleSubmit() {
  if (form.projectType === 'paperCopy') {
    handleSubmitPaperCopy()
  } else {
    handleSubmitProject()
  }
}

async function updatePaperStock() {
  projectStore.setShowPaperCopyInfo(true)
}

async function handleSubmitProject() {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  const hasRequiredErrors = validateRequiredFields()
  const hasScopeErrors = validateScopeOfWork()
  const hasAddonErrors = validateAddOns()
  if (hasRequiredErrors || hasScopeErrors || hasAddonErrors) {
    scrollToFirstError()
    isSubmitting.value = false
    return
  }

  try {
    let sketchData = uploadedFiles.value
      .filter((file) => file.isNew)
      .map((file) => ({
        fileId: file.id,
        fileName: file.name,
        mimeType: file.mimeType,
        data: file.data,
      }))

    const formData = {
      ...form,
      sketchData,
      existingImages: existingImages.value,
    }

    console.info('formData', formData)

    if (isEdit.value) {
      let updatedProject = await API.updateProject(formData)
      projectStore.updateProject(formData.projectId, updatedProject)
      showSnackbar(`Project ${formData.projectId} updated successfully!`, 'success')
    } else {
      let newProject = await API.newProject(formData)
      delete newProject.sketchData
      projectStore.newProject(newProject)
      showSnackbar(`Project ${newProject.data.projectId} created successfully!`, 'success')
    }

    router.push('/dashboard')
  } catch (error) {
    console.error('Error submitting form:', error)
    fieldErrors.value = {}
    fieldErrors.value.submitbutton = 'Error'
    scrollToFirstError()
    errorMessage.value = 'An error occurred while submitting the form: ' + error.message
  } finally {
    isSubmitting.value = false
  }
}

async function handleSubmitPaperCopy() {
  let hasErrors = false
  fieldErrors.value = {}
  isSubmitting.value = true
  for (const field of requiredFields.value) {
    if (!form[field] || form[field].toString().trim() === '') {
      fieldErrors.value[field] = 'This field is required'
      hasErrors = true
    }
  }

  if (!form.opbPaperSold && !form.leanToPaperSold && !form.singleSlopePaperSold) {
    fieldErrors.value.opbPaperSold = 'Error'
    fieldErrors.value.qtyFields = 'Enter at least one quantity'
    hasErrors = true
  }
  if (hasErrors) {
    scrollToFirstError()
    isSubmitting.value = false
    return
  }

  const paperFormData = {}
  paperFormData.orderDate = form.orderDate
  paperFormData.projectType = form.projectType
  paperFormData.status = ''
  paperFormData.projectId = generateShortId('pc_')
  paperFormData.projectSubType = 'paperCopyRequest'
  paperFormData.projectType = 'paperCopy'
  paperFormData.orderDate = new Date().toISOString()

  for (let requiredField of requiredFields.value) {
    paperFormData[requiredField] = form[requiredField]
  }
  if (form.opbPaperSold) {
    paperFormData.opbPaperSold = form.opbPaperSold
  }
  if (form.leanToPaperSold) {
    paperFormData.leanToPaperSold = form.leanToPaperSold
  }
  if (form.singleSlopePaperSold) {
    paperFormData.singleSlopePaperSold = form.singleSlopePaperSold
  }

  try {
    projectStore.showPaperCopyStockWarning = true
    await API.newPaperCopyProject(paperFormData)
    projectStore.newPaperCopyProject({ data: paperFormData })
    showSnackbar(`Inventory Updated!`, 'success')
    router.push('/dashboard')
  } catch (error) {
    console.error('Error submitting paper copy form:', error)
    errorMessage.value = 'Error submitting paper copy form: ' + error.message
  } finally {
    isSubmitting.value = false
  }

  //check for low stock
}

function scrollToBottom() {
  nextTick(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  })
}

function scrollToFirstError() {
  const firstErrorField = Object.keys(fieldErrors.value)[0]
  if (firstErrorField) {
    let element = document.querySelector(`[name="${firstErrorField}"]`)
    if (!element) {
      element = document.querySelector(`[data-field="${firstErrorField}"]`)
    }

    if (!element) {
      element = document.querySelector(`input[name="${firstErrorField}"]`)
    }

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const inputElement = element.querySelector('input') || element
      inputElement.focus()
    }
  }
}

function parseLWH(val) {
  if (!val) return { l: '', w: '', h: '' }
  const match = val.match(/(\d+)\s*[xX*]\s*(\d+)\s*[xX*]\s*(\d+)/)
  if (match) {
    return { l: match[1], w: match[2], h: match[3] }
  }
  return { l: '', w: '', h: '' }
}

function parsePostSpacing(val) {
  if (!val) return { value: '' }
  const match = val.match(/(\d+)\s*'?/)
  if (match) {
    return { value: match[1] }
  }
  return { value: '' }
}

function parsePostSize(val) {
  if (!val) return { l: '', w: '' }
  const match = val.match(/(\d+)\s*[xX*]\s*(\d+)/)
  if (match) {
    return { l: match[1], w: match[2] }
  }
  return { l: '', w: '' }
}

function parseMainBldgPitch(val) {
  if (!val) return { value: '' }
  const match = val.match(/(\d+)\s*\/\s*12/)
  if (match) {
    return { value: match[1] }
  }
  return { value: '' }
}

function parseWindSpeed(val) {
  if (!val) return { value: '' }
  const match = val.match(/(\d+)\s*MPH/i)
  if (match) {
    return { value: match[1] }
  }
  return { value: '' }
}

function focusFirstInput(type, fieldName) {
  nextTick(() => {
    let inputElement = null

    switch (type) {
      case 'size':
        inputElement = document.querySelector(`[name="size-${fieldName}-l"]`)
        break
      case 'postSpacing':
        inputElement = document.querySelector(`[name="postSpacing-${fieldName}"]`)
        break
      case 'postSize':
        inputElement = document.querySelector(`[name="postSize-${fieldName}-h"]`)
        break
      case 'mainBldgPitch':
        inputElement = document.querySelector(`[name="mainBldgPitch-${fieldName}"]`)
        break
      case 'windSpeed':
        inputElement = document.querySelector(`[name="windSpeed-${fieldName}"]`)
        break
    }
    if (inputElement) {
      inputElement.focus()
      inputElement.select()
    }
  })
}

function loadProjectData() {
  const { startingProjectId, projectId: editingProjectId } = route.query

  if (startingProjectId || editingProjectId) {
    let startingProject = startingProjectId
      ? projectStore.projects.find((project) => project.data.projectId === startingProjectId)
      : null

    let editingProject = editingProjectId
      ? projectStore.projects.find((project) => project.data.projectId === editingProjectId)
      : null

    const projectInfo = startingProject || editingProject
    if (!projectInfo) {
      errorMessage.value = `Project ${startingProjectId || editingProjectId} not found`
      scrollToBottom()
      return
    }
    isEdit.value = true
    let editProject = projectInfo.data
    editProject.existingImages = projectInfo.images

    if (editProject) {
      try {
        Object.keys(editProject).forEach((key) => {
          if (key in form) {
            form[key] = editProject[key]
          }
        })
        Object.assign(form, editProject)

        existingImages.value = editProject.existingImages
        uploadedFiles.value = []
        if (Array.isArray(editProject.existingImages)) {
          editProject.existingImages.forEach((img) => {
            uploadedFiles.value.push({
              id: img.id || img.url + Math.random(),
              name: img.name || 'File',
              isImage: false,
              preview: null,
              url: img.url,
              file: null,
              existing: true,
            })
          })
        }
      } catch (error) {
        console.error('Error populating form data:', error)
        errorMessage.value = 'Error loading project data'
      }
    } else {
      errorMessage.value = 'Project not found'
    }
  } else {
    Object.keys(BLANK_FORM_DATA).forEach((key) => {
      if (key in form) {
        form[key] = BLANK_FORM_DATA[key]
      }
    })
  }
}

const sizeFields = ['opbSize', 'epbSize', 'pepbSize', 'trussSize']
const postSpacingFields = [
  'opbPostSpacing',
  'epbPostSpacing',
  'pepbPostSpacing',
  'trussPostSpacing',
]
const postSizeFields = ['opbPostSize', 'epbPostSize', 'pepbPostSize', 'trussPostSize']
const mainBldgPitchFields = [
  'opbMainBldgPitch',
  'epbMainBldgPitch',
  'pepbMainBldgPitch',
  'trussMainBldgPitch',
]

sizeFields.forEach((field) => {
  watch(
    () => sizeInputs[field],
    (newVal) => {
      const { l, w, h } = newVal
      if (l && w && h) {
        form[field] = `${l}x${w}x${h}`
      }
    },
    { deep: true },
  )

  watch(
    () => form[field],
    (newVal) => {
      const { l, w, h } = parseLWH(newVal)
      sizeInputs[field].l = l
      sizeInputs[field].w = w
      sizeInputs[field].h = h
    },
    { immediate: true },
  )
})

postSpacingFields.forEach((field) => {
  watch(
    () => postSpacingInputs[field],
    (newVal) => {
      const { value } = newVal
      if (value) {
        form[field] = `${value}'`
      } else {
        form[field] = ''
      }
    },
    { deep: true },
  )

  watch(
    () => form[field],
    (newVal) => {
      const { value } = parsePostSpacing(newVal)
      postSpacingInputs[field].value = value
    },
    { immediate: true },
  )
})

postSizeFields.forEach((field) => {
  watch(
    () => postSizeInputs[field],
    (newVal) => {
      const { l, w } = newVal
      if (l && w) {
        form[field] = `${l}x${w}`
      }
    },
    { deep: true },
  )

  watch(
    () => form[field],
    (newVal) => {
      const { l, w } = parsePostSize(newVal)
      postSizeInputs[field].l = l
      postSizeInputs[field].w = w
    },
    { immediate: true },
  )
})

mainBldgPitchFields.forEach((field) => {
  watch(
    () => mainBldgPitchInputs[field],
    (newVal) => {
      const { value } = newVal
      if (value) {
        form[field] = `${value}/12`
      } else {
        form[field] = ''
      }
    },
    { deep: true },
  )

  watch(
    () => form[field],
    (newVal) => {
      const { value } = parseMainBldgPitch(newVal)
      mainBldgPitchInputs[field].value = value
    },
    { immediate: true },
  )
})

watch(
  () => windSpeedInput,
  (newVal) => {
    const { value } = newVal
    if (value) {
      form.windSpeed = `${value} MPH`
    } else {
      form.windSpeed = ''
    }
  },
  { deep: true },
)

watch(
  () => form.windSpeed,
  (newVal) => {
    const { value } = parseWindSpeed(newVal)
    windSpeedInput.value = value
  },
  { immediate: true },
)

watch(
  () => form,
  () => {
    visibleScopeColumns.value.forEach((column) => {
      activeColumns[column.key] = columnHasData(column.key)
    })
  },
  { deep: true },
)

// Watch for scope of work changes and set default MetalRoofPanelGauge
watch(
  () => form,
  () => {
    const columns = ['opb', 'epb', 'pepb', 'truss']
    columns.forEach((columnKey) => {
      const gaugeField = `${columnKey}MetalRoofPanelGauge`

      if (columnHasData(columnKey)) {
        if (!form[gaugeField] || form[gaugeField].toString().trim() === '') {
          form[gaugeField] = '26g'
        }
      }
    })
  },
  { deep: true },
)

// Watch for projectType changes to update active columns
watch(
  () => form.projectType,
  () => {
    // Reset all active columns first
    Object.keys(activeColumns).forEach((key) => {
      activeColumns[key] = false
    })
    // Then set only visible columns
    visibleScopeColumns.value.forEach((column) => {
      activeColumns[column.key] = columnHasData(column.key)
    })
  },
)

onMounted(() => {
  loadProjectData()
  visibleScopeColumns.value.forEach((column) => {
    activeColumns[column.key] = columnHasData(column.key)
  })
})

watch(
  () => route.query.projectId,
  (newProjectId) => {
    if (newProjectId) {
      loadProjectData()
    }
  },
)
</script>

<style scoped>
.project-form-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8eafc 0%, #fbe9e7 100%);
}
.main-form-card {
  background: #f9f5f5;
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
  table-layout: fixed;
}

/* Fixed column widths for scope table */
.scope-table-v2 th:nth-child(1),
.scope-table-v2 td:nth-child(1) {
  width: 20%;
}

.scope-table-v2 th:nth-child(2),
.scope-table-v2 td:nth-child(2) {
  width: 20%;
}

.scope-table-v2 th:nth-child(3),
.scope-table-v2 td:nth-child(3) {
  width: 20%;
}

.scope-table-v2 th:nth-child(4),
.scope-table-v2 td:nth-child(4) {
  width: 20%;
}

.scope-table-v2 th:nth-child(5),
.scope-table-v2 td:nth-child(5) {
  width: 25%;
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
  min-width: 120px;
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

.upload-header-container {
  position: relative;
  text-align: center;
}

.view-folder-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.page-section {
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 16px;
  margin: 16px;
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
  min-height: 64px;
}
.scope-label.overhang-label {
  width: 19%;
  font-weight: 600;
  color: #b62025;
  background: #fff6f6;
  padding: 19px 10px;
  border-right: 1.5px solid #f2caca;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.overhang-controls {
  width: 80%;
  padding-left: 16px;
  display: flex;
  align-items: center;
}
.addons-table-wrapper {
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid #f2caca;
  padding: 0;
  overflow-x: auto;
}
.addons-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.addons-table th.addons-header {
  background: #ffeaea;
  color: #b62025;
  font-weight: 700;
  text-align: center;
  font-size: 1.05rem;
  padding: 10px 8px;
  border-bottom: 2px solid #f2caca;
}
.addons-table th.addons-label {
  background: #fff6f6;
  color: #b62025;
  font-weight: 600;
  text-align: left;
  font-size: 1rem;
  padding: 8px 10px;
  border-right: 1.5px solid #f2caca;
  min-width: 120px;
  vertical-align: top;
}
.addons-table td.addons-cell {
  background: #fff;
  padding: 8px;
  min-width: 140px;
  border-bottom: 1px solid #f2caca;
  vertical-align: top;
}
.addons-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.na-text {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 8px;
}
.slab-section {
  margin: 8px 0;
}
.slab-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #b62025;
  margin-bottom: 4px;
}
.section-divider {
  border: none;
  border-top: 1px solid #f2caca;
  margin: 16px 0;
}

/* File Preview Styles */
.file-preview-area {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #f2caca;
}

.file-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.file-preview-card {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.image-preview {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon-preview {
  position: relative;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f8f9fa;
}

.file-name {
  font-size: 0.8rem;
  text-align: center;
  margin-top: 8px;
  word-break: break-word;
  color: #666;
}

.file-name-link {
  text-decoration: none;
  color: inherit;
}

.file-name-link:hover {
  text-decoration: underline;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  height: 20px;
  width: 20px;
}

/* Chrome, Safari, Edge, Opera */
:deep(input[type='number'])::-webkit-outer-spin-button,
:deep(input[type='number'])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Make disabled text darker and more readable without changing borders */
:deep(.v-field--disabled) {
  color: #212529 !important;
  opacity: 0.8 !important;
  -webkit-text-fill-color: #212529 !important;
}

:deep(.v-selection-control--disabled) {
  color: #212529 !important;
  opacity: 0.7 !important;
  -webkit-text-fill-color: #212529 !important;
}
/* Size Input Container Styles */
.sow-input-container {
  display: flex;
  align-items: center;
  justify-content: start;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  padding: 0 6px;
  background: white;
  transition: all 0.2s ease;
  position: relative;
  height: 55px;
  box-sizing: border-box;
}

.sow-input-container:focus-within {
  border: 2px solid rgb(0, 0, 0);
}

.sow-input-container.error {
  border-color: rgb(211, 47, 47);
}

.sow-input-container.error:focus-within {
  border-color: rgb(211, 47, 47);
}

.sow-input {
  border: none;
  outline: none;
  background: transparent;
  width: 30px;
  text-align: center;
  font-size: 16px;
  padding: 0;
  margin: 0;
  color: rgba(0, 0, 0, 0.87);
  font-family: inherit;
  line-height: 1.5;
}

.sow-input::placeholder {
  color: rgba(0, 0, 0, 0.3);
  font-size: 16px;
}

.sow-separator {
  color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  margin: 0 4px;
  user-select: none;
  font-weight: 400;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  color: rgb(211, 47, 47);
  font-size: 12px;
  margin-top: 4px;
  font-weight: 400;
  line-height: 1.2;
}

/* Admin-only pricing field styling */
.admin-pricing-field {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px solid #ff9800;
  border-radius: 8px;
  margin: 0px 0;
}

.admin-pricing-field .v-text-field {
  background: white;
  border-radius: 4px;
}

/* Employee field restrictions styling */
:deep(.v-field--disabled) {
  background-color: #f2e9e9 !important;
  opacity: 0.7;
}

:deep(.v-field--disabled .v-field__input) {
  color: #666 !important;
}

:deep(.v-radio--disabled) {
  opacity: 0.7;
}

:deep(.v-checkbox--disabled) {
  opacity: 0.7;
}

:deep(.sow-input:disabled) {
  background-color: #f2e9e9;
  color: #666;
  cursor: not-allowed;
}

/* Red asterisk for required fields - use :deep to penetrate Vuetify component */
.required :deep(.v-field-label::after) {
  content: ' *';
  color: red;
  font-weight: bold;
}
</style>
