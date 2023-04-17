<script setup lang='ts'>
  import { computed, onMounted, ref } from 'vue';
  import Button from '../../base-components/Button';
  import { FormInput } from '../../base-components/Form';
  import Lucide from '../../base-components/Lucide';
  import Tippy from '../../base-components/Tippy';
  import { Dialog } from '../../base-components/Headless';
  import Table from '../../base-components/Table';
  import { CategoryStore } from '../../stores/category-store';
  import { ICategory } from '../../models/interface/ICategory';

  const deleteConfirmationModal = ref(false);
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value;
  };
  const deleteButtonRef = ref(null);
  //dattqh
  const categoryStore = CategoryStore();
  const categories = computed(() => categoryStore.categories as ICategory[]);

  onMounted(async () => {
    await categoryStore.actionGetCategories();
  })
</script>

<template>
  <h2 class='mt-10 text-lg font-medium intro-y'>Danh Sách Danh Mục</h2>
  <div class='grid grid-cols-12 gap-6 mt-5'>
    <div
      class='flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap'
    >
      <Button variant='primary' class='mr-2 shadow-md'>
        Thêm mới danh mục
      </Button>
      <div class='hidden mx-auto md:block text-slate-500'>
        Tổng cộng 1000 danh mục
      </div>
      <div class='w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0'>
        <div class='relative w-56 text-slate-500'>
          <FormInput
            type='text'
            class='w-56 pr-10 !box'
            placeholder='Tìm kiếm...'
          />
          <Lucide
            icon='Search'
            class='absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3'
          />
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class='col-span-12 overflow-auto intro-y lg:overflow-visible'>
      <Table class='border-spacing-y-[10px] border-separate -mt-2'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th class='border-b-0 whitespace-nowrap'> ẢNH MÓN ĂN</Table.Th>
            <Table.Th class='border-b-0 whitespace-nowrap'>
              TÊN DANH MỤC
            </Table.Th>
            <Table.Th class='text-center border-b-0 whitespace-nowrap'>
              HÀNH ĐỘNG
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr
            v-for='item in categories'
            :key='item.id'
            class='intro-x'
          >
            <Table.Td
              class='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'
            >
              <div class='flex' v-if='item.products && item.products.length > 0'>
                <div class='w-10 h-10 image-fit zoom-in'>
                  <Tippy
                    as='img'
                    :alt='item.products[0].name'
                    class='rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]'
                    :src='item.products[0].image'
                    :content='item.products[0].name'
                  />
                </div>
                <div class='w-10 h-10 -ml-5 image-fit zoom-in' v-if='item.products && item.products.length > 1'>
                  <Tippy
                    as='img'
                    :alt='item.products[1].name'
                    class='rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]'
                    :src='item.products[1].image'
                    :content='item.products[1].name'
                  />
                </div>
                <div class='w-10 h-10 -ml-5 image-fit zoom-in' v-if='item.products && item.products.length > 2'>
                  <Tippy
                    as='img'
                    :alt='item.products[2].name'
                    class='rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]'
                    :src='item.products[2].image'
                    :content='item.products[2].name'
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
                Các món ăn: {{ item.products && item.products.length > 0 ? item.products.map(value => value.name) : 'Chưa có' }}
              </div>
            </Table.Td>
            <Table.Td
              class='first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400'
            >
              <div class='flex items-center justify-center'>
                <a class='flex items-center mr-3' href=''>
                  <Lucide icon='CheckSquare' class='w-4 h-4 mr-1' />
                  Sửa
                </a>
                <a
                  class='flex items-center text-danger'
                  href='#'
                  @click='
                    (event) => {
                      event.preventDefault();
                      setDeleteConfirmationModal(true);
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
  <!-- BEGIN: Delete Confirmation Modal -->
  <Dialog
    :open='deleteConfirmationModal'
    @close='
      () => {
        setDeleteConfirmationModal(false);
      }
    '
    :initialFocus='deleteButtonRef'
  >
    <Dialog.Panel>
      <div class='p-5 text-center'>
        <Lucide icon='XCircle' class='w-16 h-16 mx-auto mt-3 text-danger' />
        <div class='mt-5 text-3xl'>Are you sure?</div>
        <div class='mt-2 text-slate-500'>
          Do you really want to delete these records? <br />
          This process cannot be undone.
        </div>
      </div>
      <div class='px-5 pb-8 text-center'>
        <Button
          variant='outline-secondary'
          type='button'
          @click='
            () => {
              setDeleteConfirmationModal(false);
            }
          '
          class='w-24 mr-1'
        >
          Cancel
        </Button>
        <Button
          variant='danger'
          type='button'
          class='w-24'
          ref='deleteButtonRef'
        >
          Delete
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
