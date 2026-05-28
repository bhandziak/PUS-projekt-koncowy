export interface LoginResponse {
    user_id: string;
    username: string;
    access_token: string;
    refresh_token: string;
    // TODO - role
    // role: string;
}