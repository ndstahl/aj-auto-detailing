import { Resend } from 'resend'

// Only instantiate Resend if we have a valid API key
const API_KEY = process.env.RESEND_API_KEY
const hasValidKey = API_KEY && API_KEY.startsWith('re_')

export const resend = hasValidKey
  ? new Resend(API_KEY)
  : {
      emails: {
        send: async () => {
          console.warn('Resend API key not configured - email not sent')
          return { id: 'mock-id' }
        }
      }
    } as any

export const AJ_EMAIL = 'ajautodetailing2003@gmail.com'
