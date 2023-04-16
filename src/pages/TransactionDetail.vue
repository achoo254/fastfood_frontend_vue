<script setup lang="ts">
import _ from "lodash";
import fakerData from "../utils/faker";
import Button from "../base-components/Button";
import Tippy from "../base-components/Tippy";
import Table from "../base-components/Table";
import { computed, PropType } from 'vue';
import { IProduct } from '../models/interface/IProduct';
import { formatNumber } from '../utils/my-function';

const props = defineProps({
  transactionDetailModal:{
    type: Boolean,
    default: false,
  },
  products: {
    type: Object as PropType<IProduct[]>
  }
});
const emit = defineEmits(['transactionDetailModal']);
const transactionDetailModal = computed({
  get: () => props.transactionDetailModal,
  set: () => emit('transactionDetailModal'),
});
const products = computed(() => props.products as IProduct[]);
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Chi Tiết Giao Dịch</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button variant="primary" class="mr-2 shadow-md" @click='transactionDetailModal = false'> Quay lại </Button>
    </div>
  </div>
  <!-- BEGIN: Transaction Details -->
  <div class="grid grid-cols-11 gap-5 mt-5 intro-y">
    <div class="col-span-12">
      <div class="p-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <div class="text-base font-medium truncate">Chi tiết món ăn</div>
        </div>
        <div class="-mt-3 overflow-auto lg:overflow-visible">
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th class="whitespace-nowrap !py-5"> Món ăn </Table.Th>
                <Table.Th class="text-right whitespace-nowrap">
                  Đơn giá
                </Table.Th>
                <Table.Th class="text-right whitespace-nowrap"> Số lượng </Table.Th>
                <Table.Th class="text-right whitespace-nowrap">
                  Thành tiền
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr
                v-for="(item, index) in products"
                :key="index"
              >
                <Table.Td class="!py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 image-fit zoom-in">
                      <Tippy
                        as="img"
                        alt="Midone - HTML Admin Template"
                        class="border-2 border-white rounded-lg shadow-md"
                        :src="item.image"
                        :content="item.name"
                      />
                    </div>
                    <a href="" class="ml-4 font-medium whitespace-nowrap">
                      {{ item.name }}
                    </a>
                  </div>
                </Table.Td>
                <Table.Td class="text-right">
                  {{ formatNumber(item.price) }} đồng
                </Table.Td>
                <Table.Td class="text-right">{{ item.count }}</Table.Td>
                <Table.Td class="text-right">
                  {{ formatNumber(item.price * item.count) }} đồng
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Transaction Details -->
</template>
