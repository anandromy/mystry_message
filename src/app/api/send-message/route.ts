import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/model/user";
import { UserModel } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()
    try {
        const userExists = await UserModel.findOne({ 
            username
        })
        if(!userExists) {
            return Response.json({
                success: false,
                message: "Address not found"
            }, { status: 404 })
        }

        const isAccepting = userExists.isAcceptingMessages
        if(!isAccepting) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }

        userExists.messages.push(newMessage as Message)
        await userExists.save()
        return Response.json({
            success: true,
            message: 'Message sent successfully',
        }, { status: 201 })
    } catch (error) {
        console.error('Error adding message', error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}