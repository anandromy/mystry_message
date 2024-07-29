"use client"

import { MessageCard } from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/user"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export default function DashboardPage (){
    const [ messages, setMessages ] = useState<Message[]>([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ isSwitchLoading, setIsSwitchLoading ] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data } = useSession()
    const { watch, setValue, register, handleSubmit } = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema)
    })

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-messages`)
            setValue("acceptMessages", response.data.isAcceptingMessages as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message || "Failed to fetch message settings",
            })

        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast("Refreshed Messages", {
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message ?? "Failed to fetch messages"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages, toast])

    useEffect(() => {
        if (!data || !data.user) return;

        fetchMessages()
        fetchAcceptMessage()
    }, [data, setValue, toast, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post(`/api/accept-messages`, {
                acceptMessages: !acceptMessages
            })
            setValue("acceptMessages", !acceptMessages)
            toast(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message || 'Failed to update message settings'
            })
        }
    }

    if(!data || !data.user) {
        return <div></div>
    }
    
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${data.user.username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("URL Copied!", {
            description: "Profile URL has been copied to clipboard"
        })
    }
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>
            <div className="mb-4">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator />
            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault()
                    fetchMessages(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ): (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                             key={message._id as string}
                             message={message}
                             onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ): (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}