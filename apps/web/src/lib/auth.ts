import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

async function ensureAdminUser() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = env;

  const hashedEnvPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existingUser) {
    return prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: "Pizzamahn Admin",
        hashedPassword: hashedEnvPassword,
        role: "ADMIN",
      },
    });
  }

  if (!existingUser.hashedPassword) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        hashedPassword: hashedEnvPassword,
        role: "ADMIN",
      },
    });
  }

  const passwordMatchesEnv = await bcrypt.compare(
    ADMIN_PASSWORD,
    existingUser.hashedPassword,
  );

  if (!passwordMatchesEnv) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        hashedPassword: hashedEnvPassword,
        role: "ADMIN",
      },
    });
  }

  if (existingUser.role !== "ADMIN") {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: { role: "ADMIN" },
    });
  }

  return existingUser;
}

export const authConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database",
  },
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const { ADMIN_EMAIL } = env;
        if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          throw new Error("Invalid credentials.");
        }

        const adminUser = await ensureAdminUser();

        const isValid = await bcrypt.compare(
          password,
          adminUser.hashedPassword ?? "",
        );

        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

