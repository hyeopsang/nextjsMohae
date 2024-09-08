import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      user_id: string
      user_nickname: string
    }
  }
}
