# initTestData 云函数使用说明

这个云函数用于生成并导入测试数据，包括专业人士信息、时间安排和日期索引数据。由于数据量较大，函数已优化为支持断点续传式导入，以避免云函数执行超时。

## 功能说明

- 生成专业人士测试数据（姓名、专业类型、评分等）
- 生成专业人士的可用时间安排数据
- 生成专业人士的日期索引数据（用于按日期快速查询）
- 支持清理测试数据
- 支持断点续传功能，避免云函数执行超时

## 超时配置

云函数已配置为最大超时时间20秒（默认为3秒）并分配512MB内存，配置在`config.json`文件中：

```json
{
  "permissions": {
    "openapi": []
  },
  "timeout": 20,
  "envVariables": {},
  "vpc": false,
  "memorySize": 512
}
```

> **注意**: 如果配置未生效，仍然出现3秒超时的情况，请尝试以下解决方案：
>
> 1. 在微信开发者工具中，重新上传并部署云函数（包括config.json文件）
> 2. 在云开发控制台中手动调整云函数超时时间设置
> 3. 代码已优化为在严格的3秒超时限制下也能正常工作，使用断点续传功能

## 数据生成顺序

云函数会按照以下顺序生成和导入数据：

1. 首先导入专业人士数据
2. 然后导入时间安排数据
3. 最后导入专业人士日期索引数据

**重要**：由于数据量大，专业人士日期索引数据会在时间安排数据导入完成后才开始导入。如果运行了数据导入但没有看到专业人士日期索引数据，请确保使用断点续传功能完成整个导入过程。

## 参数说明

- `action`: 操作类型，可选值 'init'（初始化）或 'clear'（清理）
- `collection`: 操作的集合，可选值 'all'（所有）、'professionals'（专业人士）或 'timeSchedules'（时间安排）
- `timeScheduleBatch`: 时间安排数据的起始批次（断点续传用）
- `dateIndexBatch`: 日期索引数据的起始批次（断点续传用）

## 基本用法

```javascript
// 初始化所有测试数据
wx.cloud
  .callFunction({
    name: 'initTestData',
    data: {
      action: 'init',
      collection: 'all',
    },
  })
  .then((res) => {
    console.log(res.result)
  })

// 清理所有测试数据
wx.cloud
  .callFunction({
    name: 'initTestData',
    data: {
      action: 'clear',
      collection: 'all',
    },
  })
  .then((res) => {
    console.log(res.result)
  })
```

## 使用断点续传功能

当数据量较大时，云函数可能会在执行过程中超时。这时，您可以使用以下代码自动处理断点续传逻辑：

```javascript
// 辅助函数：处理断点续传逻辑
function handleContinue(result) {
  // 如果导入已完成或发生错误，直接返回结果
  if (!result || !result.success || result.completed === true) {
    return Promise.resolve(result)
  }

  // 如果需要继续导入，构造参数进行下一次调用
  console.log(`继续导入数据: ${result.progress}`)
  const callParams = {
    action: result.action,
    collection: result.collection,
    timeScheduleBatch: result.nextTimeScheduleBatch,
    dateIndexBatch: result.nextDateIndexBatch,
  }

  // 调用云函数并递归处理结果
  return wx.cloud
    .callFunction({
      name: 'initTestData',
      data: callParams,
    })
    .then((res) => handleContinue(res.result))
}

// 开始初始化测试数据，自动处理断点续传
wx.cloud
  .callFunction({
    name: 'initTestData',
    data: {
      action: 'init',
      collection: 'all',
    },
  })
  .then((res) => {
    return handleContinue(res.result)
  })
  .then((finalResult) => {
    console.log('所有数据导入完成', finalResult)
  })
  .catch((err) => {
    console.error('导入过程出错', err)
  })
```

## 验证数据导入

导入完成后，可以检查数据是否成功导入所有集合：

```javascript
// 检查专业人士数据
db.collection('professionals')
  .where({ isTestData: true })
  .count()
  .then((res) => console.log('专业人士数:', res.total))

// 检查时间安排数据
db.collection('timeSchedules')
  .where({ isTestData: true })
  .count()
  .then((res) => console.log('时间安排数:', res.total))

// 检查专业人士日期索引数据
db.collection('professionalDateIndex')
  .where({ isTestData: true })
  .count()
  .then((res) => console.log('日期索引数:', res.total))
```

## 常见错误处理

如果遇到以下错误：

```
{"errorCode":-1,"errorMessage":"Invoking task timed out after 3 seconds","statusCode":433}
```

这意味着云函数仍在使用默认的3秒超时设置。此时您可以：

1. 确保已重新部署云函数和config.json配置文件
2. 在云开发控制台检查云函数配置
3. 继续使用断点续传功能，代码已优化为在短时间内返回结果

## 提示

1. 断点续传功能在初始化时间安排和日期索引数据时都会启用
2. 减小了每批处理的数据量，从20条降为10条，以确保更多数据能在超时前导入
3. 检查超时的频率已增加，每2批数据检查一次是否接近超时
4. 日期索引数据会在时间安排数据全部导入完成后才开始导入
5. 请确保在导入数据前有足够的云环境资源配额
6. 部署后请重新上传并部署云函数，确保配置生效
