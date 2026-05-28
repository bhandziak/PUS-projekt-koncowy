import { useState, useContext } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import APIs from '../../../api/ApiURL';
import { AuthContext } from '../../../app/providers/AuthProvider';
import type { LoginRequest as FormLoginRequest } from '../dto/LoginRequest';
import type { LoginResponse } from '../dto/LoginResponse';
import type { ProtocolResponse } from '../../../api/types/ProtocolResponse';

export const useLogin = () => {
    const { send } = useWebSocket(false);
    const authContext = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (data: FormLoginRequest): Promise<LoginResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await send<FormLoginRequest, ProtocolResponse<LoginResponse>>(
                APIs.LOGIN, 
                data
            );
            
            const authData = response.payload?.data;

            if (!authData) {
                throw new Error("Serwer zwrócił pusty pakiet danych uwierzytelniających.");
            }

            if (authContext) {
                authContext.setAccessToken(authData.access_token);
                authContext.setRefreshToken(authData.refresh_token);
                authContext.setUser({
                    id: authData.user_id,
                    username: authData.username,
                    role: "USER", // TODO - backend musi zwracać rolę użytkownika
                });
            }

            return authData;
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Nieprawidłowa nazwa użytkownika lub hasło.";
            
            setError(backendMessage);
            throw errPacket;
            } finally {
            setIsLoading(false);
        }
    };

    return { loginUser, isLoading, error };
};