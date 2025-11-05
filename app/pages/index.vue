<!-- eslint-disable vue/no-multiple-template-root -->
<script setup>
import FinestraJson from '~/components/FinestraJson.vue'
import RicercaNuova from '~/components/RicercaNuova.vue'

import { ref } from 'vue'

const query = ref('')
const ricerche = ref([])
const isNuovaRicercaVisibile = ref(false)
const isJsonVisible = ref(false)
const finestraJsonTesto = ref('')

const toast = useToast()
const confirm = useConfirm()

async function cerca() {
  if (query.value != '') {
    const r = await getRicercheBySubstring(query.value)
    if (r.error) {
      ricerche.value = []
      return
    }
    ricerche.value = _ricercheToTreeTableNode(r)
    console.log(ricerche.value)
  } else {
    ricerche.value = []
  }
}

// conversione degli oggetti dal server
// a oggetti per la tabella
function _ricercheToTreeTableNode(dati) {
  const nextNodes = []

  dati.forEach((element) => {
    nextNodes.push({
      key: element.id,
      data: {
        nome: element.nomeRicerca,
        // tipo: element.tipoRicerca,
        tipo: _tipoBadge(element.tipoRicerca),
        utente: element.utente,
        json: JSON.stringify(
          JSON.parse(element.jsonRicerca.replace(/'/g, '"')),
          null,
          2
        ),
        file: element.documento
      }
    })
  })

  return nextNodes
}

function _tipoBadge(tipo) {
  if (tipo == 'generica') {
    return {
      label: 'Generica',
      severity: 'info'
    }
  } else if (tipo == 'complessa') {
    return {
      label: 'Complessa',
      severity: 'warning'
    }
  } else if (tipo == 'per nome') {
    return {
      label: 'Per Nome',
      severity: 'success'
    }
  }

  return {
    label: 'tipo',
    severity: 'secondary'
  }
}

async function salvaRicerca({ target, file }) {
  // target { tipoRicerca, utente, nomeRicerca, jsonRicerca }
  if (
    target.tipoRicerca != ''
    && target.nomeRicerca != ''
    && target.jsonRicerca != ''
  ) {
    const response = await saveRicerca(target, file)
    if (response.error) {
      toast.add({
        group: 'tr',
        severity: 'error',
        summary: 'Errore nel salvataggio',
        detail: JSON.stringify(response, null, 2),
        life: 6000
      })
      return
    }

    ricerche.value.push(_ricercheToTreeTableNode([response])[0])

    isNuovaRicercaVisibile.value = false

    toast.add({
      group: 'tr',
      severity: 'success',
      summary: 'Ricerca salvata',
      detail: 'Nuova ricerca salvata con successo',
      life: 3500
    })
  }
}

async function cancellaRicerca(id) {
  const ricerca_id = id
  const ricerca_nome = ricerche.value.find(r => r.key == ricerca_id).data.nome

  confirm.require({
    group: 'elimina-ricerca',
    header: 'Elimina ricerca',
    message: 'Vuoi cancellare la ricerca ' + ricerca_nome + '?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Annulla',
      severity: 'secondary',
      text: true
    },
    acceptProps: {
      label: 'Elimina',
      severity: 'danger'
    },
    accept: async () => {
      const response = await deleteRicerca(ricerca_id)
      if (response.status > 400) {
        toast.add({
          group: 'tr',
          severity: 'error',
          summary: 'Errore nell\'eliminazione di ' + ricerca_nome,
          detail: JSON.stringify(response, null, 2),
          life: 6000
        })
        return
      }

      ricerche.value = ricerche.value.filter(r => r.key != ricerca_id)
      toast.add({
        group: 'tr',
        severity: 'success',
        summary: 'Eliminazione',
        detail: 'Eliminazione della ricerca riuscita',
        life: 3000
      })
    },
    reject: () => {}
  })
}

async function downloadFile(id) {
  const file = await getFilePerRicerca(id)
  if (file != null) {
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
  }
}

function mostraNuovaRicerca() {
  isNuovaRicercaVisibile.value = isNuovaRicercaVisibile.value ? false : true
}

function mostraFinestraJson(btn) {
  if (isJsonVisible.value == false) {
    const ricerca_id = parseInt(btn.currentTarget.id.split('-')[1])
    finestraJsonTesto.value = ricerche.value.find(r => r.key == ricerca_id).data.json
    isJsonVisible.value = true
  } else {
    isJsonVisible.value = false
    finestraJsonTesto.value = ''
  }
}
</script>

<template>
  <div id="app-div">
    <Toast
      position="top-right"
      group="tr"
    />
    <Toast
      position="bottom-right"
      group="br"
    />
    <Dialog
      v-model:visible="isNuovaRicercaVisibile"
      modal
      :style="{ width: '30rem' }"
      header="Nuova Ricerca"
    >
      <ricerca-nuova
        @salva-ricerca="salvaRicerca"
        @annulla-finestra="isNuovaRicercaVisibile = false"
      />
    </Dialog>

    <Dialog
      v-model:visible="isJsonVisible"
      modal
      :style="{ width: '35rem' }"
      header="Json"
    >
      <FinestraJson
        :testo="finestraJsonTesto"
        @chiudi-finestra="mostraFinestraJson()"
      />
    </Dialog>

    <ConfirmDialog group="elimina-ricerca" />

    <h1 style="display:flex; flex:1; justify-self: center; gap: 16px; font-size: 3em; margin: 16px">
      Ricerche
      <i class="pi pi-search" />
    </h1>

    <Card>
      <template #title>
        <div class="search-section">
          <InputText
            v-model="query"
            class="ricerca-barra"
            type="search"
            placeholder="Cerca ..."
            size="small"
            @keyup.enter="cerca"
          />
          <Button
            icon="pi pi-search"
            icon-pos="left"
            label="Cerca"
            @click="cerca"
          />

          <Button
            icon="pi pi-folder-plus"
            icon-pos="left"
            label="Nuova Ricerca"
            outlined
            @click="mostraNuovaRicerca"
          />
        </div>
      </template>

      <template #content>
        <div class="input-container">
          <TreeTable
            :value="ricerche"
            size="small"
            :paginator="true"
            :rows="6"
            removable-sort
            scrollable
            scroll-height="450px"
            class="results-section"
            :resizable-columns="true"
            show-gridlines
            :virtual-scroller-options="{ itemSize: 20 }"
          >
            <template #header>
              <h4>Ricerche</h4>
            </template>

            <template #empty>
              <div style="display: flex; justify-content: center; font-size: xx-large; margin: 3rem">
                <h1>Tabella vuota</h1>
              </div>
            </template>

            <Column
              field="nome"
              header="Nome"
              frozen
            />
            <Column
              field="tipo"
              header="Tipo"
              sortable
            >
              <template #body="slotProps">
                <Badge
                  :value="slotProps.node.data.tipo.label"
                  :severity="slotProps.node.data.tipo.severity"
                />
              </template>
            </Column>
            <Column
              field="utente"
              header="Utente"
              sortable
            />
            <!-- Json -->
            <Column
              field="json"
              header="Json Ricerca"
            >
              <template #body="slotProps">
                <div style="display: flex; width: 100%; justify-content: center;">
                  <Button
                    :id="'btn-' + slotProps.node.key"
                    type="button"
                    icon="pi pi-search"
                    icon-pos="left"
                    label="JSON"
                    severity="contrast"
                    rounded
                    size="small"
                    @click="mostraFinestraJson"
                  />
                </div>
              </template>
            </Column>

            <!-- File -->
            <Column
              field="file"
              header="File"
              style="min-width: 140px;"
            >
              <template #body="slotProps">
                <div style="display: flex; width: 100%; justify-content: center;">
                  <div
                    v-if="slotProps.node.data.file"
                    style="display: flex; flex: 1; gap: 8px; align-items: center"
                  >
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
                    <span>{{ slotProps.node.data.file }}</span>
                  </div>
                </div>
              </template>
            </Column>
            <!-- Cancella ricerca -->
            <Column style="width: 5rem">
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
            </Column>
          </TreeTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
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
