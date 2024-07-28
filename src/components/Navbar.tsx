"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"

export const Navbar = () => {
    const { data } = useSession()

    return(
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a className="text-xl font-bold mb-4 md:mb-0" href="/">Mystery Message</a>
                {
                    data ? (
                        <>
                            <span className="mr-4">Welcome {data.user.username}</span>
                            <Button className="w-full md:w-auto" onClick={() => signOut()}>Logout</Button>
                        </>
                    ): (
                        <Button asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                    )
                }
            </div>
        </nav>
    )
}