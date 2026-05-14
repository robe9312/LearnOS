import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    Google,
    GitHub,
    Resend({
      from: "noreply@tudominio.com",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id  // user_id real para FastAPI
      return session
    },
  },
})
