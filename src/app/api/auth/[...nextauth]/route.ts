import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
          console.log("Credentials missing");
          return null;
        }
      
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/userdata?user_id=${credentials.user_id}&user_password=${credentials.user_password}`);
          const user = await res.json();
      
          console.log("API response:", user); 
      
          if (res.ok && user && !user.error) {
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
