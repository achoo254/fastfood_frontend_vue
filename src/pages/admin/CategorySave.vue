<script setup lang='ts'>
  import Lucide from '../../base-components/Lucide/Lucide.vue';
  import {
    FormInput,
    FormInline,
    FormLabel,
    InputGroup,
  } from '../../base-components/Form';
  import { Dialog } from '../../base-components/Headless';
  import Button from '../../base-components/Button';
  import FormTextarea from '../../base-components/Form/FormTextarea.vue';
  import Table from '../../base-components/Table';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { IProduct } from '../../models/interface/IProduct';
  import { formatNumber, showToastMessage, tryCallRequest } from '../../utils/my-function';
  import { ICategory } from '../../models/interface/ICategory';
  import { CategoryStore } from '../../stores/category-store';
  import { useRoute } from 'vue-router';
  import Tippy from '../../base-components/Tippy';

  //dattqh
  const categoryStore = CategoryStore();
  const confirmSaveCategoryModal = ref(false);
  const confirmSaveCategoryRef = ref();
  const route = useRoute();
  const category_id = route.params ? route.params.category_id : '';
  const category = computed(() => categoryStore.category as ICategory);
  const formData = reactive({
    name_category: '',
    products: [] as IProduct[],
  });
  const formProduct = reactive({
    name: '',
    image: '',
    price: 50000,
    note: '',
  } as IProduct);

  function addProductToCategory() {
    //init value
    const itemProduct = {
      name: formProduct.name,
      image: formProduct.image,
      price: formProduct.price,
      note: formProduct.note,
      id_render: Math.random().toString(36).substr(2, 9),
    } as IProduct;
    //add to formdata
    formData.products.push(itemProduct);
    //reset value product
    formProduct.name = '';
    formProduct.image = '';
    formProduct.price = 50000;
    formProduct.note = '';
  }

  function deleteItemProduct(item: IProduct, index: number) {
    const findIndex = formData.products.findIndex((value, index1) => index1 === index);
    if (findIndex >= 0) {
      formData.products.splice(findIndex, 1);
    }
  }

  async function actionCreateCategory() {
    if (formData.name_category) {
      //init request
      const request = { name: formData.name_category, products: formData.products } as ICategory;
      //call request
      await tryCallRequest(async () => {
        await categoryStore.actionCreateCategory(request);
        //close modal success
        confirmSaveCategoryModal.value = false;
        //alert success
        showToastMessage();
        //reset value
        formData.name_category = '';
        formData.products = [];
      });
    }
  }

  async function actionUpdateCategory() {
    if (formData.name_category && category_id) {
      //init request
      const request = { id: category_id, name: formData.name_category, products: formData.products } as ICategory;
      //call request
      await tryCallRequest(async () => {
        await categoryStore.actionUpdateCategory(request);
        //close modal success
        confirmSaveCategoryModal.value = false;
        //alert success
        showToastMessage();
      });
    }
  }

  async function actionSaveCategory() {
    if (category_id) {
      await actionUpdateCategory();
    } else {
      await actionCreateCategory();
    }
  }

  onMounted(async () => {
    //Neu updated thi goi request find one
    if (category_id) {
      //init request
      await categoryStore.actionGetCategory(String(category_id));
      //set value to formdata
      formData.name_category = category.value.name;
      formData.products = category.value.products;
    }
  });
</script>

<template>
  <div class='flex items-center mt-8 intro-y'>
    <h2 class='mr-auto text-lg font-medium'>Quản Lý Danh Mục Chi Tiết</h2>
  </div>
  <div class='grid grid-cols-11 pb-20 mt-5 gap-x-6'>
    <div class='col-span-11 intro-y 2xl:col-span-7'>
      <!-- BEGIN: Category Information -->
      <div class='p-5 mt-5 intro-y box'>
        <div
          class='p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400'
        >
          <div
            class='flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400'
          >
            <Lucide icon='ChevronDown' class='w-4 h-4 mr-2' />
            Thông Tin Danh Mục
          </div>
          <div class='mt-5'>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Tên Danh Mục</div>
                    <div
                      class='ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md'>
                      Bắt Buộc
                    </div>
                  </div>
                  <div class='mt-3 text-xs leading-relaxed text-slate-500'>
                    Sau khi nhập tên Danh mục, tiếp tục điền thông tin bên dưới để cập nhật món ăn vào danh
                    mục này. Cuối cùng chọn "Xong và Lưu lại" để hoàn tất Danh Mục
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <FormInput
                  v-model='formData.name_category'
                  id='category-name'
                  type='text'
                  placeholder='Tên Danh Mục'
                />
              </div>
            </FormInline>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <div class='flex-1 w-full mt-3 xl:mt-0 xl:text-right'>
                <Button variant='primary' class='w-44' @click='confirmSaveCategoryModal = true'
                        :disabled='!formData.name_category'>
                  <Lucide icon='Plus' class='w-4 h-4 mr-2' />
                  Xong
                </Button>
              </div>
            </FormInline>
          </div>
        </div>
      </div>
      <!-- END: Category Information -->
      <!-- BEGIN: Product Information -->
      <div class='p-5 mt-5 intro-y box'>
        <div
          class='p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400'
        >
          <div
            class='flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400'
          >
            <Lucide icon='ChevronDown' class='w-4 h-4 mr-2' />
            Thông Tin Món Ăn
          </div>
          <div class='mt-5'>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Mô Tả</div>
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <FormTextarea
                  v-model='formProduct.note'
                  id='product-note'
                  type='text'
                  placeholder='Điền mô tả'
                />
              </div>
            </FormInline>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Món Ăn</div>
                  </div>
                  <div class='mt-3 text-xs leading-relaxed text-slate-500'>
                    Sau khi lưu thông tin, món ăn sẽ được hiển thị bảng bên cạnh
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <div class='grid-cols-4 gap-2 sm:grid'>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <FormInput v-model='formProduct.price' type='number' placeholder='Tiền' />
                  </InputGroup>
                  <FormInput
                    v-model='formProduct.name'
                    type='text'
                    class='mt-2 sm:mt-0'
                    placeholder='Tên món ăn'
                  />
                  <FormInput
                    v-model='formProduct.image'
                    type='text'
                    class='mt-2 sm:mt-0'
                    placeholder='Đường dẫn ảnh'
                  />
                  <Button variant='primary' class='mt-2 sm:mt-0' @click='addProductToCategory'
                          :disabled='formProduct.price <= 0 || !formProduct.name || !formProduct.image'>
                    Lưu món ăn
                  </Button>
                </div>
              </div>
            </FormInline>
          </div>
        </div>
      </div>
      <!-- END: Product Information -->
    </div>
    <div class='hidden col-span-4 intro-y 2xl:block' v-if='formData.products && formData.products.length > 0'>
      <div class='sticky top-0'>
        <div
          class='relative p-5 mt-8 border rounded-md bg-warning/20 dark:bg-darkmode-600 border-warning dark:border-0'
        >
          <!-- BEGIN: Data List -->
          <div class='col-span-12 overflow-auto intro-y lg:overflow-visible'>
            <Table class='border-spacing-y-[10px] border-separate -mt-2'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th class='border-b-0 whitespace-nowrap'>
                    ẢNH
                  </Table.Th>
                  <Table.Th class='border-b-0 whitespace-nowrap'>
                    TÊN MÓN ĂN
                  </Table.Th>
                  <Table.Th class='text-center border-b-0 whitespace-nowrap'>
                    HÀNH ĐỘNG
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr
                  v-for='(item, index) in formData.products'
                  :key='item.id_render'
                  class='intro-x'
                >
                  <Table.Td
                    class='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'
                  >
                    <div class='flex' v-if='item.image'>
                      <div class='w-10 h-10 image-fit zoom-in'>
                        <Tippy
                          as='img'
                          :alt='item.name'
                          class='rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]'
                          :src='item.image'
                          :content='item.name'
                        />
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td
                    class='first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'
                  >
                    <a href='' class='font-medium whitespace-nowrap'>
                      {{ item.name }}
                    </a>
                    <div class='text-slate-500 text-xs whitespace-nowrap mt-0.5'>
                      Giá: {{ formatNumber(item.price) }} Đồng
                    </div>
                  </Table.Td>
                  <Table.Td
                    class='first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400'
                  >
                    <div class='flex items-center justify-center'>
                      <a
                        class='flex items-center text-danger'
                        href='#'
                        @click='
                    (event) => {
                      event.preventDefault();
                      deleteItemProduct(item, index)
                    }
                  '
                      >
                        <Lucide icon='Trash2' class='w-4 h-4 mr-1' />
                        Xóa
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
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <Dialog :open='confirmSaveCategoryModal' @close='confirmSaveCategoryModal = false'
          :initialFocus='confirmSaveCategoryRef'>
    <Dialog.Panel>
      <div class='p-5 text-center'>
        <Lucide icon='AlertCircle' class='w-16 h-16 mx-auto mt-3 text-danger' />
        <div class='mt-5 text-3xl'>Bạn chắc chắn không?</div>
        <div class='mt-2 text-slate-500'>
          Bạn thực sự muốn lưu danh mục này? <br />
          Tiến trình này không thể quay lại.
        </div>
      </div>
      <div class='px-5 pb-8 text-center'>
        <Button type='button' variant='outline-secondary' @click='confirmSaveCategoryModal = false' class='w-24 mr-1'>
          Bỏ qua
        </Button>
        <Button type='button' variant='primary' class='w-24' ref='{confirmSaveCategoryRef}'
                @click='actionSaveCategory'>
          Lưu lại
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->
</template>

<style scoped>

</style>
