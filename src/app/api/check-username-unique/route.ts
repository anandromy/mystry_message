import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        // Extracting query params
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate queryParam with zod
        const { success, data, error } = UsernameQuerySchema.safeParse(queryParam)
        if(!success) {
            const userNameErrors = error.format().username?._errors || []
            return Response.json({
                success: false,
                message: userNameErrors?.length > 0 ? 
                    userNameErrors.join(', ')
                    : 'Invalid query parameters'

            }, { status: 400 })
        }

        const existingVerifiedUser = await UserModel.findOne({
            username: data.username,
            isVerified: true
        })
        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        } else {
            return Response.json({
                success: true,
                message: "Username is unique"
            }, { status: 200 })
        }
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}