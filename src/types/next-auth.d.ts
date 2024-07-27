//  Modifying interface user and interface session type in nextauth so that we can access user's propeties inside jwt and session callback

// By default user just contains, id, username, email and name. NextAuth doesn't allows accessing other properties/types by default

import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string
            isVerified?: boolean
            isAcceptingMessages?: boolean
            username?: string
        }
    }

    interface User {
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
}


// Alternative way of modifying module

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
}