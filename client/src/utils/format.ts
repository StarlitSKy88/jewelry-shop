// 格式化日期
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 格式化金额
export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

// 格式化手机号
export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 格式化数字（添加千分位）
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 格式化银行卡号
export const formatBankCard = (cardNo: string): string => {
  return cardNo.replace(/(\d{4})/g, '$1 ').trim();
};

// 格式化身份证号
export const formatIdCard = (idCard: string): string => {
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
};

// 格式化地址
export const formatAddress = (
  province: string,
  city: string,
  district: string,
  address: string
): string => {
  return `${province}${city}${district}${address}`;
}; 