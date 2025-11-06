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
      Documenti
      <i class="pi pi-file" />
    </h1>

    <Card>
      <template #title>
        <div class="search-section">
          <!-- <InputText
            v-model="query"
            class="ricerca-barra"
            type="search"
            placeholder="Cerca ..."
            size="small"
            @keyup.enter="cerca"
          /> -->
          <Button
            icon="pi pi-refresh"
            icon-pos="left"
            label="Ricarica"
            @click="cerca"
          />
        </div>
      </template>

      <template #empty>
        <div style="display: flex; justify-content: center; font-size: xx-large; margin: 3rem">
          <h1>Tabella vuota</h1>
        </div>
      </template>

      <template #content>
        <div class="input-container">
          <TreeTable
            :value="files"
            size="small"
            :paginator="true"
            :rows="6"
            removable-sort
            scrollable
            scroll-height="450px"
            class="results-section"
            :resizable-columns="true"
            show-gridlines
          >
            <template #header>
              <h4>File</h4>
            </template>

            <Column
              field="name"
              header="Nome"
              frozen
            />
            <Column
              field="timestamp"
              header="Timestamp"
              sortable
            />
            <Column
              field="contentType"
              header="Tipo"
            >
              <template #body="slotProps">
                <div
                  class=""
                  style="display: flex;"
                  @mouseenter="mostraPopover($event, slotProps.node)"
                  @mouseleave="nascondiPopover"
                >
                  <Badge
                    :value="slotProps.node.data.contentType.label"
                    :severity="slotProps.node.data.contentType.severity"
                    size="large"
                  />
                </div>
              </template>
            </Column>
            <Column
              field="size"
              header="Dimensione"
              sortable
            />
            <!-- File -->
            <Column
              field="file"
              header="File"
              style="min-width: 140px;"
            >
              <template #body="slotProps">
                <div style="display: flex; width: 100%; justify-content: center;">
                  <Button
                    type="button"
                    label="Scarica"
                    icon="pi pi-download"
                    icon-pos="left"
                    severity="secondary"
                    rounded
                    size="small"
                    @click="downloadFile(slotProps.node.key)"
                  />
                </div>
              </template>
            </Column>
            <!-- Cancella ricerca -->
            <!-- Column style="width: 5rem">
              <template #body="slotProps">
                <div style="display: flex; width: 100%; justify-content: center;">
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    size="small"
                    @click="cancellaRicerca(slotProps.node.key)"
                  />
                </div>
              </template>
            </Column -->
          </TreeTable>

          <Popover
            ref="popover_toggle"
            append-to="self"
            @hide="nascondiPopover"
          >
            <div>
              <Image
                v-if="!isLoading"
                id="popover-img"
                v-model:src="popover_image_src"
                alt="Anteprima"
                :width="popover_image_width"
              />
              <div v-show="isLoading">
                <i
                  class="pi pi-spinner-dotted pi-spin"
                  style="font-size: 3rem;"
                />
              </div>
            </div>
          </Popover>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([])
const toast = useToast()

const popover_toggle = ref()
const popover_image_default = '/91.gif'
const popover_image_src = ref(popover_image_default)
const popover_image_width = ref(64)

const isLoading = ref(true)

const mostraPopover = (event, node) => {
  popover_image_width.value = 64

  isLoading.value = true
  popover_toggle.value.hide()

  setAnteprimaPopover(node.key)
  popover_toggle.value.show(event)
}

const nascondiPopover = () => {
  if (popover_toggle.value) {
    popover_toggle.value.hide()
    popover_image_src.value = popover_image_default
  }
}

async function cerca() {
  try {
    const lista = await getAllDocumenti()
    if (lista.error) throw new Error(lista.error)

    files.value = _toTreeTableNode(lista)
  } catch (error) {
    toast.add({
      group: 'tr',
      severity: 'error',
      summary: 'Errore',
      detail: 'Cerca: ' + error.message,
      life: 6000
    })
  }
}

async function setAnteprimaPopover(id) {
  try {
    const anteprima = await getAnteprima(id)
    if (anteprima.error) throw new Error(anteprima.error)

    popover_image_src.value = 'data:image/png;base64,' + anteprima.anteprimaData
    popover_image_width.value = 200
    isLoading.value = false
    await nextTick()
  } catch (error) {
    toast.add({
      group: 'tr',
      severity: 'error',
      summary: 'Errore',
      detail: 'Anteprima: ' + error.message,
      life: 6000
    })
  }
}

async function downloadFile(id) {
  try {
    const file = await getBase64File(id)
    if (file.error) throw new Error(file.error)

    const file_name = file.name
    const file_data = file.fileData

    const linkS = `data:application/octet-stream;base64,${file_data}`
    const downlLink = document.createElement('a')
    downlLink.href = linkS
    downlLink.download = file_name
    downlLink.click()

    toast.add({
      group: 'br',
      severity: 'info',
      summary: 'Download',
      detail: 'Download del file ' + file_name,
      life: 3000
    })
  } catch (error) {
    toast.add({
      group: 'tr',
      severity: 'error',
      summary: 'Errore',
      detail: 'Download: ' + error.message,
      life: 6000
    })
  }
}

function _toTreeTableNode(dati) {
  const nextNodes = []

  dati.forEach((element) => {
    nextNodes.push({
      key: element.id,
      data: {
        name: element.name,
        // contentType: element.contentType,
        contentType: _contentBadge(element.contentType),
        // size: element.size,
        size: _suffixSize(element.size),
        timestamp: element.timestamp
      }
    })
  })

  return nextNodes
}

function _contentBadge(type) {
  if (type.includes('pdf')) {
    return {
      label: 'pdf',
      severity: 'danger'
    }
  } else if (type.includes('sheet') || type.includes('excel')) {
    return {
      label: 'excel',
      severity: 'success'
    }
  }

  return {
    label: 'file',
    severity: 'secondary'
  }
}

function _suffixSize(size) {
  let suffix = 'b' // bytes
  if (size > 1024) { // Kb
    size /= 1024
    suffix = 'Kb'
  }
  if (size > 1024) { // Mb
    size /= 1024
    suffix = 'Mb'
  }
  return `${size.toFixed(2)}${suffix}`
}

// onMounted
onMounted(() => {
  cerca()
})
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
