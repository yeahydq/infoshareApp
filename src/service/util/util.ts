function getTime(): string {
  const timestamp = Math.floor(Date.now() / 1000)
  console.log('当前时间戳为：' + timestamp)
  const n = timestamp * 1000
  const date = new Date(n)
  const Y = date.getFullYear()
  const M =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString()
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString()
  const nowTime = `${Y}-${M}-${D}`
  return nowTime
}

export { getTime }
