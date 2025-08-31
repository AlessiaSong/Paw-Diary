// 前端配置文件
// 统一管理API地址和端口

const config = {
    // 开发环境配置
    development: {
        API_BASE_URL: 'http://127.0.0.1:5001',
        // 可以添加其他开发环境配置
    },
    
    // 生产环境配置
    production: {
        API_BASE_URL: 'http://18.140.54.37:5001',
        // 可以添加其他生产环境配置
    }
};

// 根据当前环境选择配置
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// 导出配置
export const API_BASE_URL = currentConfig.API_BASE_URL;

// 导出完整的配置对象
export default currentConfig; 