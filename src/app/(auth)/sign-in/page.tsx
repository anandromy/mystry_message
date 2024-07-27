"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export default function SignInPage() {
    const { data: session } = useSession()
    if(session) {
        return (
            <>
                Signed in as {session.user.username}
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return(
        <>
            <p>Not signed in</p>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}