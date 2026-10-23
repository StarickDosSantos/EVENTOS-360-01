import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();

        try {
          // User.name → coluna "nome" | User.passwordHash → coluna "password"
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user?.passwordHash) {
            console.error("[auth] user not found:", email);
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!valid) {
            console.error("[auth] invalid password for:", email);
            return null;
          }

          if (user.role !== "ADMIN") {
            console.error("[auth] not admin:", email, user.role);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || "Administrador",
            role: "ADMIN",
          };
        } catch (e) {
          console.error("[auth] authorize error:", e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
