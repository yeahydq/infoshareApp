import axios from 'axios';
import tcb from '@cloudbase/node-sdk';

/**
 * 云存储控制器
 * 提供云存储相关API，包括获取预签名URL等功能
 */

// 初始化云环境配置
const CLOUD_ENV_ID = process.env.TCB_ENV_ID || '';
const SECRET_ID = process.env.TCB_SECRET_ID || '';
const SECRET_KEY = process.env.TCB_SECRET_KEY || '';

// 检查必要的配置
const checkRequiredConfig = () => {
  if (!CLOUD_ENV_ID) {
    console.error('环境ID未配置，请在环境变量中设置TCB_ENV_ID');
  }
  if (!SECRET_ID) {
    console.error('密钥ID未配置，请在环境变量中设置TCB_SECRET_ID');
  }
  if (!SECRET_KEY) {
    console.error('密钥未配置，请在环境变量中设置TCB_SECRET_KEY');
  }
  
  return CLOUD_ENV_ID && SECRET_ID && SECRET_KEY;
};

/**
 * 记录权限信息，用于调试
 */
const logPermissionInfo = () => {
  // 记录权限信息但不泄露敏感信息
  const redactedSecretId = SECRET_ID ? SECRET_ID.substring(0, 4) + '****' : 'Not Set';
  const redactedSecretKey = SECRET_KEY ? '********' : 'Not Set';
  
  console.log('云环境配置信息:');
  console.log(`- 环境ID: ${CLOUD_ENV_ID || 'Not Set'}`);
  console.log(`- 密钥ID: ${redactedSecretId}`);
  console.log(`- 密钥: ${redactedSecretKey}`);
};

/**
 * 获取预签名URL
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getSignedUrl = async (req, res) => {
  try {
    const { url } = req.body;
    
    // 清理URL，去除可能的空白字符
    const cleanUrl = url ? url.trim() : '';
    
    console.log('请求获取预签名URL:', cleanUrl);
    
    // 参数验证
    if (!cleanUrl) {
      return res.status(400).json({
        code: 400,
        message: '缺少url参数'
      });
    }
    
    // 检查必要配置
    if (!checkRequiredConfig()) {
      return res.status(500).json({
        code: 500,
        message: '云环境配置不完整，请检查后端配置'
      });
    }
    
    // 记录权限信息
    logPermissionInfo();
    
    try {
      console.log('尝试使用cloudbase SDK获取临时URL');
      
      // 直接使用官方SDK初始化方式
      const app = tcb.init({
        secretId: SECRET_ID,
        secretKey: SECRET_KEY,
        env: CLOUD_ENV_ID
      });
      
      // 直接获取临时文件URL，无需自己解析cloud://格式
      const result = await app.getTempFileURL({
        fileList: [cleanUrl]
      });
      
      console.log('获取临时URL结果:', result);
      
      // 检查返回结果中是否有文件列表
      if (result.fileList && result.fileList.length > 0) {
        const fileInfo = result.fileList[0];
        
        // 检查是否有临时URL
        if (fileInfo.tempFileURL) {
          return res.json({
            code: 0,
            data: {
              url: fileInfo.tempFileURL,
              fileID: fileInfo.fileID,
              maxAge: fileInfo.maxAge || 7200000 // 默认2小时有效期
            },
            message: '获取临时URL成功'
          });
        }
      }
      
      // 如果没有找到临时URL，抛出错误
      throw new Error('获取临时URL失败，返回结果不包含有效的URL');
    } catch (error) {
      console.error('获取临时URL失败:', error);
      
      // 在无法获取临时URL时返回错误
      return res.status(500).json({
        code: 500,
        message: '获取临时URL失败: ' + (error.message || '未知错误')
      });
    }
  } catch (error) {
    console.error('获取签名URL失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取签名URL失败: ' + (error.message || '未知错误')
    });
  }
};

/**
 * 测试云存储访问权限
 * 验证是否能够访问指定的云存储文件
 */
exports.testCloudAccess = async (req, res) => {
  try {
    const { url } = req.body;
    
    // 清理URL，去除可能的空白字符
    const cleanUrl = url ? url.trim() : '';
    
    if (!cleanUrl) {
      return res.status(400).json({
        code: 400,
        message: '缺少url参数'
      });
    }
    
    console.log('测试云存储访问权限:', cleanUrl);
    
    // 检查必要配置
    if (!checkRequiredConfig()) {
      return res.status(500).json({
        code: 500,
        message: '云环境配置不完整，请检查后端配置'
      });
    }
    
    // 记录环境信息
    console.log('测试环境信息:');
    console.log(`- Node.js版本: ${process.version}`);
    console.log(`- 操作系统: ${process.platform} ${process.arch}`);
    
    // 构建测试结果
    const results = {
      fileID: cleanUrl,
      signedAccess: {
        success: false,
        url: '',
        error: null
      }
    };
    
    // 测试获取临时URL
    try {
      console.log('尝试获取临时URL');
      
      // 初始化云开发SDK
      const app = tcb.init({
        secretId: SECRET_ID,
        secretKey: SECRET_KEY,
        env: CLOUD_ENV_ID
      });
      
      // 获取临时文件URL
      const result = await app.getTempFileURL({
        fileList: [cleanUrl]
      });
      
      console.log('获取临时URL结果:', result);
      
      if (result.fileList && result.fileList.length > 0) {
        const fileInfo = result.fileList[0];
        
        if (fileInfo.tempFileURL) {
          results.signedAccess.success = true;
          results.signedAccess.url = fileInfo.tempFileURL;
          
          // 测试临时URL是否可访问
          try {
            await axios.head(fileInfo.tempFileURL, { timeout: 5000 });
          } catch (error) {
            results.signedAccess.error = {
              message: '临时URL请求失败: ' + error.message,
              status: error.response?.status
            };
          }
        } else {
          results.signedAccess.error = {
            message: '获取的临时URL为空'
          };
        }
      } else {
        results.signedAccess.error = {
          message: '没有获取到文件信息'
        };
      }
    } catch (error) {
      results.signedAccess.success = false;
      results.signedAccess.error = {
        message: error.message
      };
    }
    
    // 返回测试结果
    return res.json({
      code: 0,
      data: results
    });
  } catch (error) {
    console.error('测试云存储访问失败:', error);
    return res.status(500).json({
      code: 500,
      message: '测试云存储访问失败: ' + (error.message || '未知错误')
    });
  }
}; 