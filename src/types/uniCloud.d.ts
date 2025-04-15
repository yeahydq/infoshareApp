declare namespace uniCloud {
  interface UploadFileResult {
    fileID: string
    statusCode: number
  }

  function uploadFile(options: { cloudPath: string; filePath: string }): Promise<UploadFileResult>
}
