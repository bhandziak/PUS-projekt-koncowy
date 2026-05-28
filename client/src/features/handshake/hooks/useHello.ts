import { useState, useEffect } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import APIs from '../../../api/ApiURL';
import type { ProtocolResponse } from '../../../api/types/ProtocolResponse';
import type { HelloResponse} from '../types/HelloResponse';


export const useHello = () => {
  const { send } = useWebSocket(false);
  
  const [isHandshakeComplete, setIsHandshakeComplete] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const performHandshake = async () => {
      try {
        const response = await send<null, ProtocolResponse<HelloResponse>>(
          APIs.HELLO, 
          null
        );
        
        if (isMounted) {
          setIsHandshakeComplete(true);
          setServerMessage(response.payload?.data?.message || "Połączono.");
        }
      } catch (errPacket: any) {
        if (isMounted) {
          const backendMessage = errPacket?.error?.message || "Błąd podczas nawiązywania połączenia.";
          setError(backendMessage);
          setIsHandshakeComplete(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // set timeout to ensure this runs after any initial setup in the WebSocket hook
    const timeoutId = setTimeout(performHandshake, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [send]);

  return { isHandshakeComplete, serverMessage, error, isLoading };
};