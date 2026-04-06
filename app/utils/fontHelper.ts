/**
 * ตรวจสอบว่าข้อความมีภาษาไทยหรือไม่
 * @param text ข้อความที่ต้องการตรวจสอบ
 * @returns boolean true หากมีภาษาไทย
 */
export const isThai = (text?: string): boolean => {
  if (!text) return false;
  const thaiRegex = /[ก-ฮ]/;
  return thaiRegex.test(text);
};

/**
 * เลือกฟอนต์ที่เหมาะสมตามภาษา
 * @param text ข้อความที่ต้องการเลือกฟอนต์
 * @param scriptFont ฟอนต์ตัวเขียนสำหรับภาษาอังกฤษ
 * @param fallbackFont ฟอนต์สำหรับภาษาไทย
 */
export const getFontFamily = (text?: string, scriptFont: string = 'var(--script-font, "Parisienne", cursive)', fallbackFont: string = '"Prompt", sans-serif'): string => {
  return isThai(text) ? fallbackFont : `${scriptFont}, ${fallbackFont}`;
};
