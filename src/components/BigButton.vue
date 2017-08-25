<template>
  <q-btn big flat class="big-button"
    :disabled="disabled"
    :color="color"
    @click="$emit('click', $event)"
    >
    <q-icon :name="icon"></q-icon>
  </q-btn>
</template>

<script>
import { QBtn, QIcon } from 'quasar'

export default {
  name: 'big-button',

  components: { QBtn, QIcon },

  props: {
    icon: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    color: { type: String, default: 'primary' }
  }
}
</script>

<style scoped>
.big-button {
  padding-left: 18px !important;
}
</style>
