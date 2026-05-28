import { useState } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import APIs from '../../../api/ApiURL';
import type { RegisterRequest } from '../dto/RegisterRequest';

export const useRegister = () => {
    const { send } = useWebSocket(false); 

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const registerUser = async (data: RegisterRequest) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
        await send(APIs.REGISTER, data);
        
        setIsSuccess(true);
        return true;
        } catch (errPacket: any) {
        const backendMessage = 
            errPacket?.error?.message || 
            "Nie udało się utworzyć konta. Spróbuj ponownie.";
        
        setError(backendMessage);
        return false;
        } finally {
        setIsLoading(false);
        }
    };

    return { registerUser, isLoading, error, isSuccess };
    };