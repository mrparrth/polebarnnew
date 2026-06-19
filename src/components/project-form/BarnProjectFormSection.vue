<template>
    <div>
        <!-- Scope of Work Section -->
        <v-sheet class="page-section">
            <div class="section-header">Scope of Work</div>

            <div class="scope-table-wrapper">
                <table class="scope-table-v2">
                    <thead>
                        <tr>
                            <th class="scope-header">#</th>
                            <th v-for="column in visibleScopeColumns" :key="column.key" class="scope-header">
                                {{ column.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in scopeOfWorkRows" :key="row.label">
                            <th class="scope-label">{{ row.label }}</th>
                            <td v-for="column in visibleScopeColumns" :key="column.key">
                                <div v-if="row.key === 'Size'" class="sow-input-container" tabindex="0"
                                    :name="`${column.key}${row.key}`"
                                    :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                                    @click="focusFirstInput('size', `${column.key}${row.key}`)"
                                    @focusin="activeColumns[column.key] = true">
                                    <input v-model="sizeInputs[`${column.key}${row.key}`].w" type="number" min="1"
                                        class="sow-input" :placeholder="activeColumns[column.key] ? 'W' : ''"
                                        inputmode="numeric" :disabled="shouldDisableField(`${column.key}${row.key}`)"
                                        @click.stop />

                                    <span class="sow-separator">{{
                                        activeColumns[column.key] ? 'x' : ''
                                        }}</span>
                                    <input v-model="sizeInputs[`${column.key}${row.key}`].l"
                                        :name="`size-${column.key}${row.key}-l`" type="number" min="1" class="sow-input"
                                        :placeholder="activeColumns[column.key] ? 'L' : ''" inputmode="numeric"
                                        :disabled="shouldDisableField(`${column.key}${row.key}`)" @click.stop />

                                    <span class="sow-separator">{{
                                        activeColumns[column.key] ? 'x' : ''
                                        }}</span>
                                    <input v-model="sizeInputs[`${column.key}${row.key}`].h" type="number" min="1"
                                        class="sow-input" :placeholder="activeColumns[column.key] ? 'H' : ''"
                                        inputmode="numeric" :disabled="shouldDisableField(`${column.key}${row.key}`)"
                                        @click.stop />
                                </div>

                                <div v-else-if="row.key === 'PostSpacing'" class="sow-input-container" tabindex="0"
                                    :name="`${column.key}${row.key}`"
                                    :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                                    @click="focusFirstInput('postSpacing', `${column.key}${row.key}`)"
                                    @focusin="activeColumns[column.key] = true">
                                    <input v-model="postSpacingInputs[`${column.key}${row.key}`].value"
                                        :name="`postSpacing-${column.key}${row.key}`" type="number" min="1"
                                        class="sow-input" :placeholder="activeColumns[column.key] ? '' : ''"
                                        inputmode="numeric" :disabled="shouldDisableField(`${column.key}${row.key}`)"
                                        @click.stop />
                                    <span class="sow-separator">{{
                                        activeColumns[column.key] ? "'" : ''
                                        }}</span>
                                </div>
                                <v-select v-else-if="row.key === 'PostSize'" v-model="form[`${column.key}${row.key}`]"
                                    :name="`${column.key}${row.key}`" :items="['6x6', '8x8', 'Custom']"
                                    variant="outlined" density="compact" class="sow-select"
                                    :disabled="shouldDisableField(`${column.key}${row.key}`)"
                                    :error="!!fieldErrors[`${column.key}${row.key}`]" hide-details clearable />

                                <div v-else-if="row.key === 'MainBldgPitch'" class="sow-input-container" tabindex="0"
                                    :name="`${column.key}${row.key}`"
                                    :class="{ error: !!fieldErrors[`${column.key}${row.key}`] }"
                                    @click="focusFirstInput('mainBldgPitch', `${column.key}${row.key}`)"
                                    @focusin="activeColumns[column.key] = true">
                                    <input v-model="mainBldgPitchInputs[`${column.key}${row.key}`].value"
                                        :name="`mainBldgPitch-${column.key}${row.key}`" type="number" min="1"
                                        class="sow-input" :placeholder="activeColumns[column.key] ? '' : ''"
                                        inputmode="numeric" :disabled="shouldDisableField(`${column.key}${row.key}`)"
                                        @click.stop />
                                    <span class="sow-separator">{{
                                        activeColumns[column.key] ? '/12' : ''
                                        }}</span>
                                </div>

                                <v-text-field v-else v-model="form[`${column.key}${row.key}`]"
                                    :id="`${column.key}${row.key}`" :name="`${column.key}${row.key}`" dense
                                    variant="outlined" hide-details class="scope-input"
                                    :disabled="shouldDisableField(`${column.key}${row.key}`)"
                                    :error-messages="fieldErrors[`${column.key}${row.key}`]"
                                    :error="!!fieldErrors[`${column.key}${row.key}`]"
                                    @focus="activeColumns[column.key] = true" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="fake-table-row mb-4" v-if="form.projectType === 'customPoleBarn'">
                <div class="scope-label overhang-label">Overhang</div>
                <div class="overhang-controls">
                    <v-radio-group v-model="form.overhangType" inline hide-details name="overhangType"
                        :disabled="shouldDisableField('overhangType')" :error-messages="fieldErrors.overhangType"
                        :error="!!fieldErrors.overhangType">
                        <v-radio label="Standard" value="standard" />
                        <div class="d-flex align-items-center">
                            <v-radio label="Custom" value="custom" />
                            <v-text-field v-if="form.overhangType === 'custom'" v-model="form.overhangValue"
                                label="Custom Overhang" dense variant="outlined" hide-details name="overhangValue"
                                :disabled="shouldDisableField('overhangValue')"
                                :error-messages="fieldErrors.overhangValue" :error="!!fieldErrors.overhangValue"
                                style="width: 170px; margin-left: 8px; margin-top: 2px; margin-bottom: 2px" />
                        </div>
                    </v-radio-group>
                </div>
            </div>

            <hr class="section-divider" />

            <v-row>
                <v-col cols="12" md="3">
                    <v-radio-group v-model="form.riskCategory" row label="Risk Category" inline name="riskCategory"
                        :disabled="shouldDisableField('riskCategory')" :error-messages="fieldErrors.riskCategory"
                        :error="!!fieldErrors.riskCategory">
                        <v-radio v-for="n in [1, 2, 3, 4]" :key="n" :label="n.toString()" :value="n.toString()" />
                    </v-radio-group>
                </v-col>
                <v-col cols="12" md="3">
                    <v-radio-group v-model="form.exposureCategory" row label="Exposure Category" inline
                        name="exposureCategory" :disabled="shouldDisableField('exposureCategory')"
                        :error-messages="fieldErrors.exposureCategory" :error="!!fieldErrors.exposureCategory">
                        <v-radio v-for="cat in ['A', 'B', 'C', 'D']" :key="cat" :label="cat" :value="cat" />
                    </v-radio-group>
                </v-col>
                <v-col cols="12" md="3">
                    <v-radio-group v-model="form.plywoodOnSiding" row label="Plywood On Siding"
                        :disabled="shouldDisableField('plywoodOnSiding')" inline name="plywoodOnSiding"
                        :error-messages="fieldErrors.plywoodOnSiding" :error="!!fieldErrors.plywoodOnSiding">
                        <v-radio label="Yes" value="Yes" />
                        <v-radio label="No" value="No" />
                    </v-radio-group>
                </v-col>
                <v-col cols="12" md="3">
                    <v-radio-group v-model="form.plywoodOnRoof" row label="Plywood On Roof" inline name="plywoodOnRoof"
                        :disabled="shouldDisableField('plywoodOnRoof')" :error-messages="fieldErrors.plywoodOnRoof"
                        :error="!!fieldErrors.plywoodOnRoof">
                        <v-radio label="Yes" value="Yes" />
                        <v-radio label="No" value="No" />
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-radio-group v-model="form.studSpacing" row label="2 x 6 Stud Spacing" inline name="studSpacing"
                        v-if="!['standardOpb', 'standardLeanTo'].includes(form.projectType)"
                        :disabled="shouldDisableField('studSpacing')" :error-messages="fieldErrors.studSpacing"
                        :error="!!fieldErrors.studSpacing">
                        <v-radio label="16" value="16" class="mr-3 my-3" />
                        <v-radio label="24" value="24" class="mr-3 my-3" />
                        <div style="display: inline-flex; align-items: center">
                            <v-radio label="Custom" value="custom" />
                            <v-text-field v-if="form.studSpacing === 'custom'" v-model="form.studSpacingCustomValue"
                                label="Custom Stud Spacing" dense variant="outlined" hide-details
                                name="studSpacingCustomValue" :disabled="shouldDisableField('studSpacingCustomValue')"
                                :error-messages="fieldErrors.studSpacingCustomValue"
                                :error="!!fieldErrors.studSpacingCustomValue"
                                style="width: 200px; margin-left: 8px; margin-top: 2px; margin-bottom: 2px" />
                        </div>
                    </v-radio-group>
                </v-col>

                <v-col cols="12" md="6">
                    <div class="section-header mb-2" style="min-height: 24px"></div>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="windSpeedInput.value" label="Wind Speed" type="number" min="1" dense
                                variant="outlined" name="windSpeed" suffix="MPH"
                                :disabled="shouldDisableField('windSpeed')" :error-messages="fieldErrors.windSpeed"
                                :error="!!fieldErrors.windSpeed" />
                        </v-col>
                        <v-col cols="6" class="d-flex align-center">
                            <v-checkbox v-model="form.wetMapAndSeal" label="Wet Stamp And Seal"
                                :disabled="shouldDisableField('wetMapAndSeal')" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <hr v-if="!shouldHideField('price')" class="section-divider" />
            <v-row v-if="!shouldHideField('price')" class="admin-pricing-field">
                <v-col cols="12" md="4">
                    <v-text-field v-model="form.price" label="Project Pricing" type="number" step="0.01" min="0" dense
                        variant="outlined" required name="price" hide-details prepend-inner-icon="mdi-currency-usd"
                        :error-messages="fieldErrors.price" :error="!!fieldErrors.price" />
                </v-col>
            </v-row>
        </v-sheet>

        <!-- Add-Ons Section -->
        <v-sheet class="page-section" v-if="form.projectType === 'customPoleBarn' || !isNewProject">
            <div class="section-header">ADD-ONS</div>
            <div class="addons-table-wrapper">
                <table class="addons-table">
                    <thead>
                        <tr>
                            <th class="addons-header">Add-On</th>
                            <th v-for="column in visibleAddonColumns" :key="column.key" class="addons-header">
                                {{ column.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="addon in addonsConfig" :key="addon.key">
                            <th class="addons-label">
                                <v-checkbox v-model="form[addon.checkboxKey]" :label="addon.label" hide-details
                                    :disabled="shouldDisableField(addon.checkboxKey)" />
                            </th>
                            <td v-for="column in visibleAddonColumns" :key="column.key" class="addons-cell">
                                <div v-if="addon.type === 'simple' && column.key === 'Opb'" class="na-text">
                                    N/A
                                </div>
                                <div v-else-if="addon.type === 'simple'" class="addons-inputs">
                                    <v-text-field v-model="form[`${addon.key}${column.key}Qty`]"
                                        :name="`${addon.key}${column.key}Qty`" label="Quantity" dense variant="outlined"
                                        hide-details :disabled="shouldDisableField(`${addon.key}${column.key}Qty`) ||
                                            !form[addon.checkboxKey]
                                            " :error="!!fieldErrors[`${addon.key}${column.key}Qty`]" />
                                    <v-text-field v-model="form[`${addon.key}${column.key}Size`]"
                                        :name="`${addon.key}${column.key}Size`" label="Size" dense variant="outlined"
                                        hide-details :disabled="shouldDisableField(`${addon.key}${column.key}Size`) ||
                                            !form[addon.checkboxKey]
                                            " :error="!!fieldErrors[`${addon.key}${column.key}Size`]" />
                                </div>
                                <div v-else-if="addon.type === 'complex'" class="addons-inputs">
                                    <v-text-field v-model="form[`${addon.key}${column.key}Size`]"
                                        :name="`${addon.key}${column.key}Size`" label="Size" dense variant="outlined"
                                        hide-details :disabled="shouldDisableField(`${addon.key}${column.key}Size`) ||
                                            !form[addon.checkboxKey]
                                            " :error="!!fieldErrors[`${addon.key}${column.key}Size`]" />
                                    <v-text-field v-model="form[`${addon.key}${column.key}Pitch`]"
                                        :name="`${addon.key}${column.key}Pitch`" label="Pitch" dense variant="outlined"
                                        hide-details :disabled="shouldDisableField(`${addon.key}${column.key}Pitch`) ||
                                            !form[addon.checkboxKey]
                                            " :error="!!fieldErrors[`${addon.key}${column.key}Pitch`]" />
                                    <div class="slab-section">
                                        <div class="slab-label">Slab</div>
                                        <v-radio-group v-model="form[`${addon.key}${column.key}Slab`]" inline
                                            hide-details :disabled="shouldDisableField(`${addon.key}${column.key}Slab`) ||
                                                !form[addon.checkboxKey]
                                                ">
                                            <v-radio label="Yes" value="Yes" :name="`${addon.key}${column.key}Slab`"
                                                :disabled="!form[addon.checkboxKey]"
                                                :error="!!fieldErrors[`${addon.key}${column.key}Slab`]" />
                                            <v-radio label="No" value="No" :name="`${addon.key}${column.key}Slab`"
                                                :disabled="!form[addon.checkboxKey]"
                                                :error="!!fieldErrors[`${addon.key}${column.key}Slab`]" />
                                            <v-radio label="N/A" value="N/A" :name="`${addon.key}${column.key}Slab`"
                                                :disabled="!form[addon.checkboxKey]"
                                                :error="!!fieldErrors[`${addon.key}${column.key}Slab`]" />
                                        </v-radio-group>
                                    </div>
                                    <v-text-field v-model="form[`${addon.key}${column.key}PostSize`]"
                                        :name="`${addon.key}${column.key}PostSize`" label="Post Size" dense
                                        variant="outlined" hide-details :disabled="shouldDisableField(`${addon.key}${column.key}PostSize`) ||
                                            !form[addon.checkboxKey]
                                            " :error="!!fieldErrors[`${addon.key}${column.key}PostSize`]" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </v-sheet>

        <!-- Upload Sketch Section -->
        <ProjectSketchUpload />
    </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useBarnProjectState } from './useBarnProjectState'
import ProjectSketchUpload from './ProjectSketchUpload.vue'

// Import external styles to keep SFC line count minimal
import './BarnProjectFormSection.css'

// Inject formContext
const {
    form,
    fieldErrors,
    isNewProject,
    shouldDisableField,
    shouldHideField
} = inject('formContext')

const scopeColumns = [
    { key: 'opb', label: 'Open Pole Barn' },
    { key: 'epb', label: 'Enclosed Pole' },
    { key: 'pepb', label: 'Partially Enclosed Pole Barn' },
    { key: 'truss', label: 'Truss Only' },
]

const visibleScopeColumns = computed(() => {
    if (form.projectType === 'standardOpb') {
        return scopeColumns.filter((col) => col.key === 'opb').map((col) => ({ ...col, label: 'Standard OPB' }))
    }
    if (form.projectType === 'standardSingleSlope') {
        return scopeColumns.filter((col) => col.key === 'opb').map((col) => ({ ...col, label: 'Standard Single Slope' }))
    }
    if (form.projectType === 'standardLeanTo') {
        return scopeColumns.filter((col) => col.key === 'pepb').map((col) => ({ ...col, label: 'Standard Lean To' }))
    }
    return scopeColumns
})

const addonColumns = [
    { key: 'Opb', label: 'Open Pole Barn' },
    { key: 'Epb', label: 'Enclosed Pole' },
    { key: 'Pepb', label: 'Partially Enclosed Pole Barn' },
]

const visibleAddonColumns = computed(() => {
    if (['standardOpb', 'standardSingleSlope'].includes(form.projectType)) {
        return addonColumns.filter((col) => col.key === 'Opb')
    }
    if (form.projectType === 'standardLeanTo') {
        return addonColumns.filter((col) => col.key === 'Pepb')
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

// Extract SOW state, parsers and watchers via composable
const {
    sizeInputs,
    postSpacingInputs,
    mainBldgPitchInputs,
    windSpeedInput,
    activeColumns,
    scopeOfWorkRows,
    focusFirstInput
} = useBarnProjectState(form, visibleScopeColumns)

// Expose inputs so the parent validation can query them
defineExpose({
    sizeInputs
})
</script>
