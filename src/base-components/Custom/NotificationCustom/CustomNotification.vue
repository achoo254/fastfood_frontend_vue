<template>
  <div class="flex">
    <span class="px-4 py-2">
      <i v-if="classAlert === 'success'" data-lucide="check-circle" class="w-5 h-5 text-success"></i>
      <i v-else data-lucide="alert-circle" class="w-5 h-5 text-danger"></i>
    </span>
    <div class="d-flex">
      <h2 class="text-lg font-bold text-slate-300">{{ title }}</h2>
      <div>
        <p class="font-bold text-slate-500">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, onMounted } from 'vue';
  import { createIcons, icons } from 'lucide';

  export default defineComponent({
    name: 'CustomNotification',
    props: {
      title: { type: String },
      content: { type: String },
      classAlert: { type: String },
    },
    setup() {
      const showHide = ref(false);

      function showMessage() {
        showHide.value = !showHide.value;
      }

      onMounted(() => {
        createIcons({
          icons,
          attrs: {
            'stroke-width': 1.5,
          },
          nameAttr: 'data-lucide',
        });
      });
      return {
        showMessage,
        showHide,
      };
    },
  });
</script>

<style></style>
