export interface EmailDestination {
    name: string;
    email: string;
}

export interface Subscription {
    endpoint: string;
    expirationTime: number;
    keys: {
        p256dh: string;
        auth: string
    };
}
