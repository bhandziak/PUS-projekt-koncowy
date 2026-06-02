import { useState, useCallback } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import APIs from '../../../api/ApiURL';
import type { SendMessageRequest, SendMessageResponse } from '../dto//SendMessageDto';

export const useChat = () => {
    const { send } = useWebSocket(true);

    const [isSending, setIsSending] = useState<boolean>(false);
    const [sendError, setSendError] = useState<string | null>(null);

    const sendMessage = useCallback(async (data: SendMessageRequest) => {
        setIsSending(true);
        setSendError(null);

        try {
            const response = await send<SendMessageRequest, any>(APIs.SEND_MESSAGE, data);
            
            return response?.status === 'OK';
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Nie udało się wysłać wiadomości.";
            
            setSendError(backendMessage);
            return false;
        } finally {
            setIsSending(false);
        }
    }, [send]);

    return { sendMessage, isSending, sendError };
};