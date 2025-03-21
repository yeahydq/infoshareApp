// 全局要用的类型放到这里

declare global {
  type IResData<T> = {
    code: number
    msg: string
    data: T
  }

  // uni.uploadFile文件上传参数
  type IUniUploadFileOptions = {
    file?: File
    files?: UniApp.UploadFileOptionFiles[]
    filePath?: string
    name?: string
    formData?: any
  }

  type IUserInfo = {
    nickName?: string
    avatarUrl?: string
    /** 微信的 openid，非微信没有这个字段 */
    openid?: string
    token?: string
    id?: string
    manager?: boolean
    phone?: string
    address?: string
    email?: string
  }

  type ITeacher = {
    teacherName: string
    telephone: string
    major: string
    teacherScore: string
    salary: string
    remark: string
    sex: string
    university: string
    degree: string
    teachCourse: string[]
    teachTrait: string[]
    photo: string
    trait: string
    images: { url: string }[]
  }

  type IStudent = {
    name: string
    telephone: string
    course: string
    grade: string[]
    basic: string
    trait_limit: string
    sex: string
    frequency: string
    salary: string
    addressName: string
    studentTrait: string[]
    teacherTrait: string[]
    addressDetail: string
    latitude: string
    longitude: string
    remark: string
    courseEnglish: string
  }
}

export {} // 防止模块污染
