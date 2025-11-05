<script setup>
const items = ref([
  {
    label: 'Ricerche',
    icon: 'pi pi-search',
    url: '/'
  },
  {
    label: 'Documenti',
    icon: 'pi pi-file',
    url: '/documenti'
  }
])

const checkDark = document.documentElement.classList.contains('dark')
const isDark = ref(checkDark)

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark')
  isDark.value = isDark.value ? false : true
}
</script>

<template>
  <Menubar :model="items">
    <template #start>
      <div
        style="display: inline-flex; gap: 12px; align-items: center;"
      >
        <i
          class="pi pi-paperclip"
          style="padding: 8px; color: var(--p-primary-color); font-size: larger;"
        />
        <span style="font-size: 1.25em;">Gestione Ricerche</span>
      </div>
    </template>

    <template #item="{ item }">
      <NuxtLink :to="item.url">
        <div style="display: flex; flex: 1; gap: 8px; padding: 6px">
          <h5>{{ item.label }}</h5>
          <i :class="item.icon" />
        </div>
      </NuxtLink>
    </template>
    <template #end>
      <Button
        :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
        severity="secondary"
        size="small"
        @click="toggleDarkMode()"
      />
    </template>
  </Menubar>

  <!-- /pages/index.vue -->
  <NuxtPage />

  <Divider align="right">
    <i class="pi pi-arrow-down" />
  </Divider>

  <div class="">
    <Fieldset>
      <p>
        Built with Nuxt, PrimeVue (Nora) • © {{ new Date().getFullYear() }}
      </p>
    </Fieldset>
  </div>
</template>

<style scoped>
.p-divider {
  --d-spazio: 22px;
  width: --calc(100% - var(--d-spazio));
  margin: 0 var(--d-spazio);
}

.p-fieldset {
  margin: 18px;
}

.p-fieldset p {
  font-size: small;
  opacity: 0.77;
}

.p-menubar {
  padding: 3px;
  border-width: 0 0 1px;
  border-radius: 0;
  position: sticky;
  top: 0;
  z-index: 1050;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.125s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.3rem);
}
</style>
