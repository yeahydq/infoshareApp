import express from 'express'
import { getSignedUrl, testCloudAccess } from '../controllers/cloudController'

const router = express.Router()

/**
 * @api {post} /api/cloud/getSignedUrl 获取云存储文件的预签名URL
 * @apiName GetSignedUrl
 * @apiGroup Cloud
 * @apiVersion 1.0.0
 *
 * @apiParam {String} url 云存储文件路径，格式为cloud://envid.bucket/path
 *
 * @apiSuccess {Number} code 状态码，0表示成功
 * @apiSuccess {Object} data 返回数据
 * @apiSuccess {String} data.url 预签名URL
 * @apiSuccess {Boolean} data.isTestUrl 是否为测试URL
 *
 * @apiError {Number} code 错误码
 * @apiError {String} message 错误信息
 */
router.post('/getSignedUrl', getSignedUrl)

/**
 * @api {post} /api/cloud/testAccess 测试云存储访问权限
 * @apiName TestCloudAccess
 * @apiGroup Cloud
 * @apiVersion 1.0.0
 *
 * @apiParam {String} url 云存储文件路径，格式为cloud://envid.bucket/path
 *
 * @apiSuccess {Number} code 状态码，0表示成功
 * @apiSuccess {Object} data 返回数据
 * @apiSuccess {Object} data.parseResult 解析结果
 * @apiSuccess {Object} data.directAccess 直接访问测试结果
 * @apiSuccess {Object} data.signedAccess 签名访问测试结果
 *
 * @apiError {Number} code 错误码
 * @apiError {String} message 错误信息
 */
router.post('/testAccess', testCloudAccess)

export default router
