import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/apiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Mystry Message | Verification Code",
            react: VerificationEmail({ username, otp: verifyCode })
        })
        return { success: true, message: "Verification email sent successfully" }
    } catch (emailError) {
        console.log("Error sending verification email", emailError)
        return { success: false, message: "Failed to send verfication email"}
    }
}


