import { defineStore } from 'pinia';
import { ToasitfyMessage } from '../models/dto/ToasitfyMessageDto';
import { ref } from 'vue';

export const MyStore = defineStore('myStore', () => {
  const showMessage = ref<ToasitfyMessage>(new ToasitfyMessage());
  const token = ref('');
  const hasLogged = ref(false);
  function getToken(){
    token.value = localStorage.getItem('access_token') as string;
  }

  function removeToken(){
    localStorage.removeItem('access_token');
    token.value = '';
    hasLogged.value = false;
  }

  return{
    token,
    hasLogged,
    getToken,
    removeToken,
    showMessage,
  }
});
