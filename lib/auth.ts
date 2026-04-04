import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // เช็คว่ามี Admin ในระบบ DB แล้วหรือยัง
        const adminCount = await prisma.admin.count();

        if (adminCount === 0) {
          // ยังไม่มีแอดมินในฐานข้อมูล -> ใช้ค่า .env เป็นค่าเริ่มต้น
          const validUsername = process.env.ADMIN_USERNAME || 'admin';
          const validPassword = process.env.ADMIN_PASSWORD || 'secret123';
          if (credentials.username === validUsername && credentials.password === validPassword) {
            return { id: "1", name: credentials.username, role: "admin" }
          }
        } else {
          // ถ้ามีแอดมินในระบบแล้ว ให้ตรวจสอบกับฐานข้อมูล
          const adminFound = await prisma.admin.findUnique({
            where: { username: credentials.username }
          });

          // เช็คว่าเจอแอดมิน, รหัสถูกต้อง และสถานะเป็น active เท่านั้น
          if (adminFound && bcrypt.compareSync(credentials.password, adminFound.password)) {
            if (adminFound.status !== 'active') {
              throw new Error("บัญชีของคุณถูกระงับการใช้งาน");
            }
            return { id: adminFound.id, name: adminFound.username, role: adminFound.role }
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev"
}
