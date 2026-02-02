<!-- eslint-disable @stylistic/padded-blocks -->
<template>
  <div id="app-div">
    <Toast
      position="bottom-right"
      group="br"
    />

    <Toast
      position="top-right"
      group="tr"
    />

    <ConfirmDialog group="elimina" />

    <h1 style="display:flex; flex:1; justify-self: center; gap: 16px; justify-self: center; font-size: 3em; margin: 16px">
      Excel
      <i class="pi pi-file-excel" />
    </h1>

    <Card>
      <template #title>
        <Form
          v-slot="$form"
          class="ricerca-nuova-form"
          :validate-on-submit="true"
          @submit="onSubmitExcelAction"
        >
          <!-- File Upload -->
          <div class="ricerca-form-group">
            <label>File</label>
            <FileUpload
              id="input_file"
              name="ric_file"
              choose-label="Carica un file"
              cancel-label="Elimina"
              :show-upload-button="false"
              :multiple="false"
              :auto="true"
              custom-upload
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :max-file-size="12000000"
              @select="fileSelected($event)"
            >
              <template #empty>
                <span> Seleziona un file Excel </span>
              </template>
            </FileUpload>

            <Message
              v-if="$form.ric_file?.invalid"
              severity="error"
              size="small"
            >
              {{ $form.ric_file.error?.msg }}
            </Message>
          </div>

          <Button
            type="submit"
            icon="pi pi-refresh"
            icon-pos="left"
            label="Procedi"
          />
        </Form>

        <div class="search-section">
          <!-- <InputText
            v-model="query"
            class="ricerca-barra"
            type="search"
            placeholder="Cerca ..."
            size="small"
            @keyup.enter="cerca"
          /> -->
        </div>
      </template>

      <template #empty>
        <div style="display: flex; justify-content: center; font-size: xx-large; margin: 3rem">
          <h1>Tabella vuota</h1>
        </div>
      </template>

      <template #content>
        <div class="input-container">
          <DataTable
            size="small"
            scrollable
            scroll-height="80vh"
            :show-gridlines="true"
            :value="valoriTabella"
          >
            <template #empty>
              <div style="display: flex; justify-content: center; font-size: xx-large; margin: 3rem">
                <h1>carica un file</h1>
              </div>
            </template>

            <Column
              v-for="col in colonneTabella"
              :key="col.field"
              :field="col.field"
              :header="col.header"
            >
              <template #body="slotProps">
                <Textarea
                  :id="(col.key)+(slotProps.data.key)"
                  v-model="slotProps.data[col.field]"
                  rows="2"
                  cols="16"
                  style="font-size: x-small;"
                  @input="salvaCelleModificate"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>

      <template #footer>
        <Button
          icon="pi pi-download"
          icon-pos="right"
          label="Export"
          @click="onExportExcelAction"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { read, utils, writeFileXLSX } from 'xlsx'
import { read, utils, writeFileXLSX } from '@redoper1/xlsx-js-style'

const listaDocumenti = reactive([{}])

const colonneTabella = ref([])
const valoriTabella = ref([])

let excelWorkbook = null
let excelWorkSheet = null
let excelFileName = ''
let excelStartingCell = { c: '', r: 0 }

const listaCelleModificate = new Map()

// func
function fileSelected(event) {
  const files = event.files
  listaDocumenti.value = files
  excelFileName = listaDocumenti.value[0].name
}

const onSubmitExcelAction = (target) => {
  if (target.valid) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(listaDocumenti.value[0])
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      excelWorkbook = read(data, { type: 'array', cellStyles: true, xlfn: true, bookDeps: true })
      excelWorkSheet = excelWorkbook.Sheets[excelWorkbook.SheetNames[5]]
      // console.log(excelWorkSheet)

      const f = excelWorkSheet['!autofilter'].ref.split(':')[0]
      excelStartingCell = {
        c: f[0],
        r: parseInt(f.split(f[0])[1]) + 1
      }

      _createHeader(excelWorkSheet)
      _createValues(excelWorkSheet)
    }
  }
}

function _createHeader(sheet) {
  let columnInfo = excelStartingCell.c
  const headers = utils.sheet_to_json(sheet, { header: 1 })[1]
  colonneTabella.value = []

  headers.forEach((h) => {
    colonneTabella.value.push (
      {
        field: h.toLowerCase().replaceAll(' ', '_'),
        header: h,
        key: columnInfo
      }
    )

    columnInfo = _incrementChar(columnInfo)
  })
}

function _createValues(sheet) {
  let rowInfo = excelStartingCell.r

  const rows = utils.sheet_to_json(sheet, { header: 1 }).slice(2)

  valoriTabella.value = []
  rows.forEach((r) => {
    // const cellColumn = startingCell.c
    const oggettoTabella = { key: rowInfo }
    for (let i = 0; i < r.length; i++) {
      const headerField = colonneTabella.value[i].field
      oggettoTabella[headerField] = r[i]
    }
    valoriTabella.value.push(oggettoTabella)
    rowInfo++
  })
}

function _incrementChar(char) {
  const charCode = char.charCodeAt(0)
  const newChar = String.fromCharCode(charCode + 1)
  return newChar
}

function salvaCelleModificate(event) {
  const targetId = event.target.id
  const targetValue = event.target.value

  listaCelleModificate.set(targetId, targetValue)
}

function onExportExcelAction() {
  console.log(listaCelleModificate)

  listaCelleModificate.forEach((valore, origine) => {
    excelWorkSheet[origine].v = valore
    excelWorkSheet[origine].w = valore
    excelWorkSheet[origine].h = valore
    excelWorkSheet[origine].r = undefined
    // excelWorkSheet[origine].t = 's'
    excelWorkSheet[origine].t = (Number.isNaN(parseFloat(valore)) ? 's' : 'n')
  })

  // excelWorkbook.Sheets[excelWorkbook.SheetNames[5]] = excelWorkSheet
  console.log(excelWorkSheet)
  const wbout = writeFileXLSX(excelWorkbook, 'export-' + excelFileName, { bookType: 'xlsx', type: 'array', cellStyles: true, bookVBA: true, compression: true })
  console.log(wbout)
}
</script>

<style>
.input-container {
  padding: 0px 28px;
  margin-top: 8px;
}

.search-section {
  display: flex;
  gap: 16px;
  margin: 0 16px 28px;
  justify-content: center;
}

.ricerca-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ricerca-barra {
  flex: 1;
  min-width: 220px;
}

.results-section {
  min-height: 500px;
}

#app-div {
  margin: 20px auto;
  padding: 18px 40px;
}

.p-card {
  border-color: var(--p-primary-contrast-color);
}
</style>
