import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

// Custom types for User and Session
import { Session } from "next-auth";

export interface CustomUser {
  email: string;
  name:string;
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
      },

      async authorize(credentials){
        const email = "vivek@gmail.com";
        const password = "vivek123";
        const name ='vivek'
        if (credentials?.email === email && credentials?.password === password) {
          const secret = process.env.AUTH_SECRET || "your-secret-key";
          const jwtToken = jwt.sign({ email }, secret, { expiresIn: "1h" });
          return { email,name, token: jwtToken }; 
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ user, token }: { user: CustomUser | undefined; token: any }) {
      if (user) {
        token.email = user.email;
        token.token = user.token;
        token.name = user.name
      }
      return token;
    },

    // Callback to handle the session when it's created or fetched
    async session({ session, token }: { session: CustomSession; token:any }) {
      session.user = { email: token.email,name:token.name, token: token.token };
      return session;
    },
  },
});
