import axios, { AxiosInstance } from 'axios';

export function apiClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: 'http://fastfood.hoandat.tech:8088',
    headers: { 'Content-Type': 'application/json', 'Token': 'Bearer ' + token},
    timeout: 20000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
