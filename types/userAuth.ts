export interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignupData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  agreeTerms: boolean
}

export interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export interface TestimonialProps {
  name: string
  role: string
  content: string
  rating: number
  image: string
}