// 验证邮箱
export const isEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// 验证手机号
export const isPhone = (phone: string): boolean => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};

// 验证密码（至少8位，包含大小写字母和数字）
export const isPassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

// 验证身份证号
export const isIdCard = (idCard: string): boolean => {
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return regex.test(idCard);
};

// 验证银行卡号
export const isBankCard = (cardNo: string): boolean => {
  const regex = /^[1-9]\d{9,29}$/;
  return regex.test(cardNo.replace(/\s/g, ''));
};

// 验证URL
export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 验证金额
export const isPrice = (price: string): boolean => {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(price);
};

// 验证中文姓名
export const isChineseName = (name: string): boolean => {
  const regex = /^[\u4e00-\u9fa5]{2,}$/;
  return regex.test(name);
};

// 验证邮政编码
export const isPostalCode = (code: string): boolean => {
  const regex = /^[1-9]\d{5}$/;
  return regex.test(code);
};

// 验证IP地址
export const isIpAddress = (ip: string): boolean => {
  const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!regex.test(ip)) return false;
  const parts = ip.split('.');
  return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
};

// 验证MAC地址
export const isMacAddress = (mac: string): boolean => {
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(mac);
}; 