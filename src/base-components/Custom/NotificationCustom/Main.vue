<template>
  <div></div>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { createToast, withProps, clearToasts } from 'mosha-vue-toastify';
  import 'mosha-vue-toastify/dist/style.css';
  import CustomNotification from './CustomNotification.vue';
  import { MyStore } from '../../../stores/my-store';
  import { ToasitfyMessage } from '../../../models/dto/ToasitfyMessageDto';

  export default defineComponent({
    name: 'NotificationToastify',
    setup() {
      const myStore = MyStore();
      watch(
        () => myStore.showMessage,
        (val: ToasitfyMessage) => {
          if (!val) return;
          clearToasts();
          createToast(
            withProps(CustomNotification, {
              title: val.title,
              content: val.content,
              classAlert: val.class,
            }),
            {
              timeout: val.type === 'danger' ? 5000 : 3000,
              type: val.type as any,
              toastBackgroundColor: '#28334E',
              showIcon: false,
              hideProgressBar: true,
              swipeClose: true,
            },
          );
        },
      );

      return {};
    },
  });
</script>
