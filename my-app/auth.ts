import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Custom types for User and Session
import { Session } from "next-auth";
import axios from "axios";
import { BACKEND_URL } from "./routes_";

export interface CustomUser {
  email: string;
  name?: string;
  token: string;
}

export interface CustomSession extends Session {
  user: CustomUser;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    jwt: true,
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: 'Name', type: 'text' },
      },

      async authorize(credentials) {
        try {
          // Send credentials to backend API
          const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
            email: credentials?.email,
            password: credentials?.password,
            name: credentials?.name || undefined,
          });
      
          console.log(res.data);
      
          const { id, name, email, token } = res.data.user;
      
          // Clean the token to remove "Bearer " prefix if it's present
          const cleanToken = token?.replace('Bearer ', '') || ''; // Ensure token is not undefined
      
          return { id, name, email, token: cleanToken };
      
        } catch (error: any) {
          console.error("Error during authentication:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Authentication failed.");
        }
      }
      
    }),
  ],

  callbacks: {
    async jwt({ user, token }: { user: CustomUser | undefined; token: any }) {
      if (user) {
        token.email = user.email;
        token.token = user.token || '';  // Ensure token is not undefined
      }
      return token;
    },
  
    async session({ session, token }: { session: CustomSession; token: any }) {
      session.user = { email: token.email,token: token.token };
      return session;
    },
  }
  
});
