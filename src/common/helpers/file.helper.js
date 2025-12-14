import fs from "fs";
import path from "path";
import slugify from "slugify";
import { UPLOAD_CONFIG } from "../constants/app.constant.js";

/**
 * File Helper Functions
 */
export const fileHelper = {
  /**
   * Lưu file ảnh
   * @param {Object} file - File object 
   * @returns {string} Tên file đã lưu
   */
  saveImage: (file) => {
    const uploadDir = path.join(process.cwd(), UPLOAD_CONFIG.UPLOAD_DIR);

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Lấy từ tên file gốc
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext);
    
    // Tạo tên file: timestamp_slugified-name.extension
    const timestamp = new Date().getTime();
    const slugifiedName = slugify(nameWithoutExt, { lower: true, strict: true });
    const fileName = `${timestamp}_${slugifiedName}${ext}`;

    const filePath = path.join(uploadDir, fileName);

    // Lưu file
    fs.writeFileSync(filePath, file.buffer, "binary");

    console.log(`Image saved successfully: ${fileName}`);

    return fileName;
  },

  /**
   * Xóa file
   * @param {string} fileName - Tên file cần xóa
   * @returns {boolean} True nếu xóa thành công
   */
  deleteFile: (fileName) => {
    try {
      const filePath = path.join(process.cwd(), UPLOAD_CONFIG.UPLOAD_DIR, fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${fileName}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting file ${fileName}:`, error);
      return false;
    }
  },

  /**
   * Kiểm tra file type có hợp lệ không
   * @param {string} mimetype - MIME type của file
   * @returns {boolean} True nếu hợp lệ
   */
  isValidFileType: (mimetype) => {
    return UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(mimetype);
  },

  /**
   * Kiểm tra file size có hợp lệ không
   * @param {number} size - File size in bytes
   * @returns {boolean} True nếu hợp lệ
   */
  isValidFileSize: (size) => {
    return size <= UPLOAD_CONFIG.MAX_FILE_SIZE;
  },
};

