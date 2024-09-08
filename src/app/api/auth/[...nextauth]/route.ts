import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user_id: { label: "아이디", type: "text" },
        user_password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.user_id || !credentials?.user_password) {
          return null;
        }
      
        try {
          const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/userdata`, {
            params: {
              user_id: credentials.user_id,
              user_password: credentials.user_password
            }
          });

          const user = response.data;
      
          if (response.status === 200 && user && !user.error) {
            return user;
          } else {
            console.log("Authentication failed:", user.error || "Unknown error");
            return null;
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };
