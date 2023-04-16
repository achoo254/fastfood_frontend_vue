export class ToasitfyMessage {
  title = '';
  content = '';
  type = '';
  class = '';
  alert = {
    title: {
      error: 'Tải thất bại!',
      success: 'Tải thành công!',
      warning: 'Cảnh báo',
    },
    content: {
      error: 'Kiểm tra lại dữ liệu',
      success: 'Dữ liệu đã được tải',
      warning: 'Cảnh báo',
    },
    class: {
      success: 'success',
      danger: 'danger',
      warning: 'warning',
    },
  };
}
