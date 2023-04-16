<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import Lucide from '../base-components/Lucide';
  import Table from '../base-components/Table';
  import TransactionDetail from './TransactionDetail.vue';
  import { OrderStore } from '../stores/order-store';
  import { IOrder } from '../models/interface/IOrder';
  import { formatDate } from '../utils/helper';
  import { EnumOrder } from '../models/enum/EnumOrder';
  import { formatNumber } from '../utils/my-function';
  import { IProduct } from '../models/interface/IProduct';

  const transactionDetailModal = ref(false);
  const setTransactionDetailModal = (value: boolean) => {
    transactionDetailModal.value = value;
  };
  //init value
  const orderStore = OrderStore();
  const orders = computed(() => orderStore.orders as IOrder[]);
  const orderSelected = ref<IOrder>({products: [] as IProduct[]} as IOrder);

  onMounted(async () => {
    await orderStore.actionGetOrders();
  });
</script>

<template>
  <div v-if="!transactionDetailModal">
    <h2 class="mt-10 text-lg font-medium intro-y">Danh Sách Giao Dịch</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <!-- BEGIN: Data List -->
      <div class="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
        <Table class="border-spacing-y-[10px] border-separate -mt-2">
          <Table.Thead>
            <Table.Tr>
              <Table.Th class="border-b-0 whitespace-nowrap"> MÃ HÓA ĐƠN</Table.Th>
              <Table.Th class="border-b-0 whitespace-nowrap"> NHÂN VIÊN PHỤC VỤ </Table.Th>
              <Table.Th class="text-center border-b-0 whitespace-nowrap"> TRẠNG THÁI </Table.Th>
              <Table.Th class="border-b-0 whitespace-nowrap"> NGÀY TẠO</Table.Th>
              <Table.Th class="text-right border-b-0 whitespace-nowrap">
                <div class="pr-16">TỔNG GIAO DỊCH</div>
              </Table.Th>
              <Table.Th class="text-center border-b-0 whitespace-nowrap"> HÀNH ĐỘNG </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-for="item in orders" :key="item.id" class="intro-x">
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md w-40 !py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <a href="" class="underline decoration-dotted whitespace-nowrap">
                  {{ item.id }}
                </a>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <a href="" class="font-medium whitespace-nowrap">
                  {{ item.account.fullname }}
                </a>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  Bàn phục vụ: {{ item.table }}; Khách: {{ item.count_person }} người
                </div>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <div
                  :class="{
                    'flex items-center justify-center whitespace-nowrap': true,
                    'text-secondary': item.status === EnumOrder.DANG_DAT,
                    'text-success': item.status === EnumOrder.THANH_CONG,
                    'text-danger': item.status === EnumOrder.DA_HUY,
                  }">
                  <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                  {{ item.status }}
                </div>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {{ formatDate(item.created, 'DD-MM-YYYY hh:mm:ss A') }}
                </div>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md w-40 text-right bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <div class="pr-16">{{ item.final_amount ? formatNumber(item.final_amount) : 0 }} đồng</div>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                <div class="flex items-center justify-center">
                  <a
                    class="flex items-center mr-5 text-primary whitespace-nowrap"
                    href="javascript:"
                    @click="orderSelected = item; setTransactionDetailModal(true)">
                    <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />
                    Xem chi tiết
                  </a>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <!-- END: Data List -->
    </div>
  </div>
  <div v-else>
    <transaction-detail
      :transaction-detail-modal="transactionDetailModal"
      :products='orderSelected.products'
      @transaction-detail-modal="transactionDetailModal = false" />
  </div>
</template>
