import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowedEmail, voterRole } from "@/lib/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // บังคับให้เลือกบัญชีทุกครั้ง กันกรณีเครื่องที่ล็อกอินบัญชีส่วนตัวค้างไว้
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  pages: { signIn: "/", error: "/denied" },
  callbacks: {
    // ด่านแรก: ปฏิเสธทุกบัญชีที่ไม่ใช่ @bumail.net / @bu.ac.th
    async signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      if (!email || profile?.email_verified !== true) return false;
      return isAllowedEmail(email);
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.email = session.user.email.toLowerCase();
        (session.user as { role?: string }).role = voterRole(session.user.email);
      }
      return session;
    },
  },
});
