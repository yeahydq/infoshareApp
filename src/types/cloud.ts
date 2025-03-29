export interface Response<T = any> {
  code: number
  message: string
  data?: T
  error?: any
}

export interface Order {
  _id: string
  userId: string
  courseId: string
  teacherId: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  amount: number
  createTime: Date
  payTime?: Date
  completeTime?: Date
  cancelTime?: Date
  cancelReason?: string
  hasReview: boolean
  reviewTime?: Date
}

export interface Review {
  _id: string
  orderId: string
  userId: string
  rating: number
  content: string
  images?: string[]
  isAnonymous: boolean
  createTime: Date
}

export interface Course {
  _id: string
  title: string
  description: string
  price: number
  rating: number
  reviewCount: number
  teacherId: string
  coverImage: string
  createTime: Date
}

export interface TimeSlot {
  startTime: string
  endTime: string
  date: string
}

export interface TimeSchedule {
  professionalId: string
  slots: TimeSlot[]
  updateTime: string
}

export interface Professional {
  _id: string
  name: string
  avatar: string
  description: string
  rating: number
  reviewCount: number
  createTime: Date
  professionalType: string
  professional_name: string
  telephone: string
  major: string
  professional_score: number
  salary: number
  salaryType: '次' | '天' | '小时'
  self_int: string
  sex: string
  university: string
  degree: string
  professional_course: string[]
  professional_trait: string[]
  photo: string
  trait: string
  images: string[]
  modifyTime: string
  timeSchedule?: TimeSchedule
}
