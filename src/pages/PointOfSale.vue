<script setup lang="ts">
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import Button from '../base-components/Button';
  import { FormInput, FormLabel, FormTextarea } from '../base-components/Form';
  import Lucide from '../base-components/Lucide';
  import { Dialog, Tab } from '../base-components/Headless';
  import { formatNumber, showToastMessage, tryCallRequest } from '../utils/my-function';
  import TomSelect from '../base-components/TomSelect/TomSelect.vue';
  import { EnumTable } from '../models/enum/EnumTable';
  import { CategoryStore } from '../stores/category-store';
  import { ICategory } from '../models/interface/ICategory';
  import { IProduct } from '../models/interface/IProduct';
  import { OrderStore } from '../stores/order-store';
  import { IOrder } from '../models/interface/IOrder';
  import { EnumOrder } from '../models/enum/EnumOrder';
  import { formatDate } from '../utils/helper';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import { AccountStore } from '../stores/account-store';
  import { IAccount } from '../models/interface/IAccount';

  dayjs.extend(utc);

  const newOrderModal = ref(false);
  const setNewOrderModal = (value: boolean) => {
    newOrderModal.value = value;
  };
  const addItemModal = ref(false);
  const setAddItemModal = (value: boolean) => {
    addItemModal.value = value;
  };
  const createTicketRef = ref(null);
  const addItemRef = ref(null);
  const deleteOrderModal = ref(false);
  const setDeleteOrderModal = (value: boolean) => {
    deleteOrderModal.value = value;
  };
  const successOrderModal = ref(false);
  const setSuccessOrderModal = (value: boolean) => {
    successOrderModal.value = value;
  };
  const deleteOrderRef = ref(null);
  //init value
  const accountStore = AccountStore();
  const categoryStore = CategoryStore();
  const orderStore = OrderStore();
  const account = computed(() => accountStore.account as IAccount);
  const categories = computed(() => categoryStore.categories as ICategory[]);
  const orderCreating = computed(() => orderStore.orderCreating as IOrder);
  const categorySelected = ref('');
  const products = ref<IProduct[]>([]);
  const productSelected = ref<IProduct>({ name: '', image: '', note: '', price: 0 } as IProduct);
  const updatedTicket = ref(false);
  const preNewOrder = ref(false);
  const tableData = Object.entries(EnumTable);

  const formDataOrder = reactive({
    table: EnumTable.A1,
    count_person: 0,
  });

  const formDataProduct = reactive({
    countProduct: 1,
  });

  function resetAllData() {
    //input form
    formDataOrder.table = EnumTable.A1;
    formDataOrder.count_person = 0;
    formDataProduct.countProduct = 1;
    //data form
    productSelected.value = { name: '', image: '', note: '', price: 0 } as IProduct;
    orderStore.resetOrderCreating();
    preNewOrder.value = false;
  }

  async function actionPreNewOrder() {
    if (!formDataOrder.table || formDataOrder.count_person <= 0) {
      showToastMessage('Số bàn hoặc số người không chính xác', true);
    } else {
      preNewOrder.value = true;
      //init request
      const request = {
        account: {username: account.value.username, fullname: account.value.fullname} as IAccount,
        table: formDataOrder.table,
        count_person: formDataOrder.count_person,
        status: EnumOrder.DANG_DAT,
        products: [] as IProduct[],
      } as IOrder;
      //call request
      await tryCallRequest(async () => {
        await orderStore.actionCreateOrder(request);
        //close modal
        setNewOrderModal(false);
      });
    }
  }

  function getProductSelected(product: IProduct, updated: boolean) {
    productSelected.value = product;
    updatedTicket.value = updated;
    if (!updated) {
      productSelected.value.id_render = Math.random().toString(36).substr(2, 9);
      formDataProduct.countProduct = 1;
    } else {
      formDataProduct.countProduct = product.count;
    }
    setAddItemModal(true);
  }

  function actionAddProductToOrder() {
    if (!preNewOrder.value) {
      showToastMessage('Vui lòng tạo đơn mới trước khi thêm món', true);
    } else {
      //neu khong phai updated ticket thi tao moi
      if (!updatedTicket.value) {
        //set count product
        productSelected.value.count = formDataProduct.countProduct;
        //create object product
        const newProduct = productSelected.value;
        //add object to order creating
        orderCreating.value.products.push(newProduct);
      } else {
        const findProduct = orderCreating.value.products.find(
          (value) => value.id_render === productSelected.value.id_render,
        );
        if (findProduct) {
          findProduct.count = formDataProduct.countProduct;
        }
      }
      //calculator total amount
      let total_amount = 0;
      for (const product of orderCreating.value.products) {
        total_amount += product.price * product.count;
      }
      orderCreating.value.total_amount = total_amount;
      //close modal
      setAddItemModal(false);
    }
  }

  async function actionCancelOrAcceptOrder(cancel: boolean) {
    if (orderCreating.value.id) {
      //init request
      orderCreating.value.status = cancel ? EnumOrder.DA_HUY : EnumOrder.THANH_CONG;
      //call request
      await tryCallRequest(async () => {
        await orderStore.actionUpdateOrder(orderCreating.value);
        //reset all data
        resetAllData();
        //close modal
        cancel ? setDeleteOrderModal(false) : setSuccessOrderModal(true);
      });
    }
  }

  watch(
    () => orderCreating.value.total_amount,
    (value) => {
      if (value > 0) {
        orderCreating.value.final_amount = value + (value * 10) / 100;
      }
    },
  );

  watch(
    () => categorySelected.value,
    (value) => {
      if (value) {
        //reset value
        products.value = [];
        //set new value
        for (const cate of categories.value) {
          if (cate.id === value) {
            products.value.push(...cate.products);
            break;
          }
        }
      }
    },
  );

  onMounted(async () => {
    await categoryStore.actionGetCategories();
    //default selected first
    if (categoryStore.categories.length > 0) {
      categorySelected.value = categoryStore.categories[0].id;
    }
  });
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Thực Đơn</h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button
        as="a"
        href="#"
        variant="primary"
        @click="(event: MouseEvent) => {
              event.preventDefault();
              setNewOrderModal(true);
            }"
        class="mr-2 shadow-md">
        Đặt hàng mới
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
    <!-- BEGIN: Item List -->
    <div class="col-span-12 intro-y lg:col-span-8">
      <div class="grid grid-cols-12 gap-5 mt-5">
        <div
          class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-3 box zoom-in" :class='{"bg-primary": cate.id === categorySelected}'
          v-for="cate in categories"
          :key="cate.id"
          @click="categorySelected = cate.id">
          <div class="text-base font-medium" :class='{"text-white": cate.id === categorySelected}'>{{ cate.name }}</div>
          <div class="text-slate-500" :class='{"text-white text-opacity-80 dark:text-slate-500": cate.id === categorySelected}'>{{ cate.products ? cate.products.length : 0 }} sản phẩm</div>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-5 pt-5 mt-5 border-t">
        <a
          v-for="(product, index) in products"
          :key="index"
          href="javascript:"
          @click="
            (event) => {
              event.preventDefault();
              getProductSelected(product, false);
            }
          "
          class="block col-span-12 intro-y sm:col-span-4 2xl:col-span-3">
          <div class="relative p-3 rounded-md box zoom-in">
            <div class="flex-none relative block before:block before:w-full before:pt-[100%]">
              <div class="absolute top-0 left-0 w-full h-full image-fit">
                <img alt="Midone Tailwind HTML Admin Template" class="rounded-md" :src="product.image" />
              </div>
            </div>
            <div class="block mt-3 font-medium text-center truncate">
              {{ product.name }}
            </div>
          </div>
        </a>
      </div>
    </div>
    <!-- END: Item List -->
    <!-- BEGIN: PRODUCT ITEM -->
    <Tab.Group class="col-span-12 lg:col-span-4" v-if="preNewOrder">
      <div class="pr-1 intro-y">
        <div class="p-2 box">
          <Tab.List variant="pills">
            <Tab>
              <Tab.Button as="button" class="w-full py-2"> Ticket</Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button as="button" class="w-full py-2"> Thông tin đơn</Tab.Button>
            </Tab>
          </Tab.List>
        </div>
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <div class="p-2 mt-5 box" v-if="orderCreating.products && orderCreating.products.length > 0">
            <a
              v-for="(product, index) in orderCreating.products"
              href="javascript:"
              :key="index"
              @click="(event: MouseEvent) => {
                      event.preventDefault();
                      getProductSelected(product, true);
                    }"
              class="flex items-center p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
              <div class="max-w-[50%] truncate mr-1">
                {{ product.name }}
              </div>
              <div class="text-slate-500">x {{ product.count }}</div>
              <Lucide icon="Edit" class="w-4 h-4 ml-2 text-slate-500" />
              <div class="ml-auto font-medium">{{ formatNumber(product.price) }} đồng</div>
            </a>
          </div>
          <div class="p-5 mt-5 box" v-if="orderCreating.final_amount > 0">
            <div class="flex">
              <div class="mr-auto">Tạm tính</div>
              <div class="font-medium">{{ formatNumber(orderCreating.total_amount) }} đồng</div>
            </div>
            <div class="flex mt-4">
              <div class="mr-auto">Thuế VAT</div>
              <div class="font-medium">10%</div>
            </div>
            <div class="flex pt-4 mt-4 border-t border-slate-200/60 dark:border-darkmode-400">
              <div class="mr-auto text-base font-medium">Tổng cộng</div>
              <div class="text-base font-medium">{{ formatNumber(orderCreating.final_amount) }} đồng</div>
            </div>
          </div>
          <div class="flex mt-5">
            <Button
              variant="danger"
              class="w-32 border-slate-300 dark:border-darkmode-400"
              @click="setDeleteOrderModal(true)">
              Hủy đơn hàng
            </Button>
            <Button
              v-if='orderCreating.final_amount > 0'
              variant="primary"
              class="w-32 ml-auto shadow-md"
              @click="actionCancelOrAcceptOrder(false)">
              Thanh toán
            </Button>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div class="p-5 mt-5 box">
            <div class="flex items-center pb-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">Thời gian tạo đơn</div>
                <div class="mt-1">{{ formatDate(orderCreating.created, 'DD-MM-YYYY hh:mm:ss A') }}</div>
              </div>
              <Lucide icon="Clock" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">Số lượng khách</div>
                <div class="mt-1">{{ orderCreating.count_person }}</div>
              </div>
              <Lucide icon="Users" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div class="flex items-center pt-5">
              <div>
                <div class="text-slate-500">Số bàn</div>
                <div class="mt-1">{{ orderCreating.table }}</div>
              </div>
              <Lucide icon="Mic" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    <!-- END: PRODUCT ITEM -->
  </div>
  <!-- BEGIN: New Order Modal -->
  <Dialog
    :open="newOrderModal"
    @close="
      () => {
        setNewOrderModal(false);
      }
    "
    :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Đơn hàng mới</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-2">Số bàn</FormLabel>
          <div class="mt-2">
            <TomSelect
              v-model="formDataOrder.table"
              :options="{
                placeholder: 'Chọn số bàn khách ngồi',
              }"
              class="w-full">
              <option :value="table[0]" v-for="table in tableData" :key="table[0]">{{ table[1] }}</option>
            </TomSelect>
          </div>
        </div>
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-3">Số lượng khách</FormLabel>
          <FormInput
            id="pos-form-3"
            v-model="formDataOrder.count_person"
            type="number"
            class="flex-1"
            placeholder="Số lượng khách" />
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setNewOrderModal(false);
            }
          "
          class="w-32 mr-1">
          Bỏ qua
        </Button>
        <Button variant="primary" type="button" class="w-32" ref="createTicketRef" @click="actionPreNewOrder">
          Tạo đơn
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: New Order Modal -->
  <!-- BEGIN: Add Item Modal -->
  <Dialog
    :open="addItemModal"
    @clsoe="
      () => {
        setAddItemModal(false);
      }
    "
    :initialFocus="addItemRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          {{ productSelected.name }}
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-4" class="form-label"> Số lượng</FormLabel>
          <div class="flex flex-1">
            <Button
              type="button"
              @click="
                formDataProduct.countProduct =
                  formDataProduct.countProduct - 1 <= 0 ? 0 : formDataProduct.countProduct - 1
              "
              class="w-12 mr-1 border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500">
              -
            </Button>
            <FormInput
              id="pos-form-4"
              type="number"
              class="w-24 text-center"
              placeholder="số lượng"
              v-model="formDataProduct.countProduct" />
            <Button
              type="button"
              @click="formDataProduct.countProduct = formDataProduct.countProduct + 1"
              class="w-12 ml-1 border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500">
              +
            </Button>
          </div>
        </div>
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-5">Ghi chú</FormLabel>
          <FormTextarea
            id="pos-form-5"
            placeholder="Ghi chú món ăn"
            v-model="productSelected.note"
            readonly></FormTextarea>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setAddItemModal(false);
            }
          "
          class="w-24 mr-1">
          Bỏ qua
        </Button>
        <Button variant="primary" type="button" class="w-24" ref="addItemRef" @click="actionAddProductToOrder">
          Cập nhật
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Add Item Modal -->
  <!-- BEGIN: Modal Delete order Content -->
  <Dialog
    :open="deleteOrderModal"
    @close="
      () => {
        setDeleteOrderModal(false);
      }
    "
    :initialFocus="deleteOrderRef">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Bạn chắc chắn không?</div>
        <div class="mt-2 text-slate-500">
          Bạn thật sự muốn hủy bỏ đơn hàng này? <br />
          Hành động này không thể khôi phục lại.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          type="button"
          variant="outline-secondary"
          @click="
            () => {
              setDeleteOrderModal(false);
            }
          "
          class="w-24 mr-1">
          Bỏ qua
        </Button>
        <Button type="button" variant="danger" class="w-24" ref="{deleteButtonRef}" @click="actionCancelOrAcceptOrder(true)">
          Hủy đơn</Button
        >
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Delete order Content -->
  <!-- BEGIN: Modal Content -->
  <Dialog
    :open="successOrderModal"
    @close="
      () => {
        setSuccessOrderModal(false);
      }
    ">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Đơn hàng đã hoàn thành!</div>
        <div class="mt-2 text-slate-500">Nhân viên lưu ý hướng dẫn khách hàng nhận thực đơn!</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          type="button"
          variant="primary"
          @click="
            () => {
              setSuccessOrderModal(false);
            }
          "
          class="w-24">
          Đã hiểu
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->
</template>
