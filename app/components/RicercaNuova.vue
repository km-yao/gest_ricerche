<template>
  <div class="ricerca-nuova-container">
    <Form
      v-slot="$form"
      class="ricerca-nuova-form"
      :initial-values
      :resolver
      :validate-on-submit="true"
      @submit="onSubmitAction"
    >
      <!-- Tipo Ricerca -->
      <div class="ricerca-form-group">
        <label>Tipo Ricerca</label>
        <Select
          name="ric_tipo"
          option-label="descrizione"
          option-value="id"
          :options="listaTipiRicerca"
          placeholder="Seleziona Tipo Ricerca"
        />
        <Message
          v-if="$form.ric_tipo?.invalid"
          severity="error"
          size="small"
        >
          {{ $form.ric_tipo.error?.msg }}
        </Message>
      </div>

      <!-- Utente -->
      <div class="ricerca-form-group">
        <label>Utente</label>
        <Select
          name="ric_utente"
          option-label="nomeUtente"
          option-value="id"
          :options="listaUtenti"
          placeholder="Seleziona l'utente..."
        />
        <Message
          v-if="$form.ric_utente?.invalid"
          severity="error"
          size="small"
        >
          {{ $form.ric_utente.error?.msg }}
        </Message>
      </div>

      <!-- Nome Ricerca -->
      <div class="ricerca-form-group">
        <label for="ric_nome">Nome Ricerca</label>
        <InputText
          id="nome-ricerca"
          name="ric_nome"
          placeholder="Inserisci il nome della ricerca..."
        />
        <Message
          v-if="$form.ric_nome?.invalid"
          severity="error"
          size="small"
        >
          {{ $form.ric_nome.error?.msg }}
        </Message>
      </div>

      <!-- Json -->
      <div class="ricerca-form-group">
        <label>JSON</label>
        <Textarea name="ric_json" />
        <Message
          v-if="$form.ric_json?.invalid"
          severity="error"
          size="small"
        >
          {{ $form.ric_json.error?.msg }}
        </Message>
      </div>

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
          accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :max-file-size="12000000"
          @select="fileSelected($event)"
        >
          <template #empty>
            <span> Seleziona un file PDF o Excel </span>
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

      <!-- Pulsanti -->
      <div class="form-actions">
        <Button
          type="reset"
          icon="pi pi-eraser"
          icon-pos="left"
          outlined
        />
        <Button
          type="submit"
          icon="pi pi-cloud-upload"
          icon-pos="left"
          label="Salva"
        />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Emits
const emit = defineEmits(['salva-ricerca', 'annulla-finestra'])

// Props
const listaUtenti = ref([{ id: 0, nomeUtente: 'utente' }])
const listaTipiRicerca = ref([{ id: 0, descrizione: 'tipo' }])
const listaDocumenti = reactive([{}])
const initialValues = reactive({
  ric_tipo: 2,
  ric_utente: '',
  ric_nome: '',
  ric_json: '{\'nome\': \'\', \'sede\': \'\'}'
})

// onMounted
onMounted(async () => {
  try {
    const utenti = await getAllUtenti()
    listaUtenti.value = utenti

    const tipiRicerca = await getTipiRicerca()
    listaTipiRicerca.value = tipiRicerca
  } catch (error) {
    console.error('Errore durante l\'inizializzazione:', error)
  }
})

// func
function fileSelected(event) {
  const files = event.files
  listaDocumenti.value = files
}

const resolver = ({ values }) => {
  const errors = {}

  if (!values.ric_tipo) {
    errors.ric_tipo = [{ msg: 'Tipo non selezionato' }]
  }

  if (!values.ric_utente) {
    errors.ric_utente = [{ msg: 'Utente non selezionato' }]
  }

  if (!values.ric_nome) {
    errors.ric_nome = [{ msg: 'Nome della ricerca richiesto' }]
  }

  if (!values.ric_json) {
    errors.ric_json = [{ msg: 'Il Json non può essere vuoto' }]
  }

  return {
    values,
    errors
  }
}

const onSubmitAction = (target) => {
  if (target.valid) {
    const values = target.values
    emit('salva-ricerca', {
      target: {
        tipoRicerca: listaTipiRicerca.value.find(tr => tr.id == values.ric_tipo),
        utente: listaUtenti.value.find(ut => ut.id == values.ric_utente),
        nomeRicerca: values.ric_nome,
        jsonRicerca: values.ric_json
      },
      file: listaDocumenti.value ? listaDocumenti.value[0] : null
    })
  }
}
</script>

<style scoped>
.ricerca-nuova-container h4 {
  margin-bottom: 6px;
  text-align: center;
}

.ricerca-nuova-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.ricerca-nuova-form .ricerca-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ricerca-nuova-form textarea {
  resize: vertical;
  min-height: 80px;
  font-family: monospace, "Segoe UI", Arial, sans-serif;
}

.ricerca-nuova-form .form-actions {
  display: flex;
  gap: 12px;
  justify-content: right;
  margin-top: 10px;
}
</style>
