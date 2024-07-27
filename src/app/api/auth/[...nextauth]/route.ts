import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// Need to be named handler as per next auth specifications

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }