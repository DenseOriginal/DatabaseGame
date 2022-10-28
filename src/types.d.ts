export interface User {
    id: number;
    name: string;
}

export interface LogOptions {
    userId: number;
    data?: string | number;
    gameId?: string;
}