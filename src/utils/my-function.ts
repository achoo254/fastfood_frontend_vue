import { ToasitfyMessage } from '../models/dto/ToasitfyMessageDto';
import { MyStore } from '../stores/my-store';

export async function tryCallRequest(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e: any) {
    if (getNestedPropValue(e, 'response.data.detail')) {
      showToastMessage(e.response.data.detail, true);
    } else {
      showToastMessage(undefined, true);
    }
  }
}

export function getNestedPropValue(obj: any, propPath: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  const propNames = propPath.split('.');
  let nestedObj = obj;

  for (const propName of propNames) {
    // eslint-disable-next-line no-prototype-builtins
    if (nestedObj.hasOwnProperty(propName)) {
      nestedObj = nestedObj[propName];
      // eslint-disable-next-line no-prototype-builtins
    } else if (Array.isArray(nestedObj) && nestedObj.length > 0 && nestedObj[0].hasOwnProperty(propName)) {
      nestedObj = nestedObj[0][propName];
    } else {
      return undefined;
    }
  }

  return nestedObj;
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    // Chuyển đổi số thành chuỗi và chèn dấu phẩy sau mỗi 3 số
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    // Trả về số ban đầu nếu không cần chèn dấu phẩy
    return num.toString();
  }
}

export function showToastMessage(content?: string, error?: boolean) {
  //init value
  const message = new ToasitfyMessage();
  const myStore = MyStore();
  //Set giá trị thông báo
  if (error) {
    message.title = 'Tải thất bại';
    message.content = content ? content : message.alert.content.error;
    message.type = message.alert.class.danger;
    message.class = 'error';
  } else {
    message.title = 'Tải thành công';
    message.content = content ? content : message.alert.content.success;
    message.type = message.alert.class.success;
    message.class = 'success';
  }
  myStore.showMessage = message;
}

export function handleExceptionError(e: any) {
  if (getNestedPropValue(e, 'response.data.detail')) {
    showToastMessage(e.response.data.detail, true);
  } else {
    showToastMessage(undefined, true);
  }
}
