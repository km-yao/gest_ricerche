<script setup>
import { ref } from 'vue'
// Emits
defineEmits(['chiudi-finestra'])

// Props
const props = defineProps({
  testo: String
})

const json = ref('{}')

// onMounted
onMounted (() => {
  json.value = props.testo
})
</script>

<template>
  <div>
    <Textarea
      disabled
      :value="json"
      name="json-ricerca"
      fluid
    />

    <div style="display: flex; justify-content: center; margin-top: 8px">
      <Button
        label="Chiudi"
        icon="pi pi-times"
        icon-pos="left"
        outlined
        @click="$emit('chiudi-finestra')"
      />
    </div>
  </div>
</template>

<style scoped>
textarea {
  display: flex;
  resize: vertical;
  font-family: monospace, "Segoe UI", Arial, sans-serif;
  width: 100%;
  min-height: 300px;
}
</style>
