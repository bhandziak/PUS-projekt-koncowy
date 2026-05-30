import { useContext, useCallback } from 'react';
import { AuthContext } from '../../../app/providers/AuthProvider';
import { createWebSocketPacket } from '../../../api/utils/packetBuilder';
import { socket, registerPendingRequest } from '../../../api/websocket/client';
import APIs from '../../../api/ApiURL';

let refreshInProgressPromise: Promise<string> | null = null;

export const useRefreshToken = () => {
  const authContext = useContext(AuthContext);
  const refreshToken = authContext?.refreshToken;
  const accessToken = authContext?.accessToken;

  const refresh = useCallback((): Promise<string> => {
    // if refresh is already in progress, return the existing promise
    if (refreshInProgressPromise) {
      return refreshInProgressPromise;
    }

    // if there is no refresh token
    if (!refreshToken) {
      if (authContext) authContext.logout();
      return Promise.reject(new Error("Brak tokenu odświeżania (refresh_token)."));
    }

    // refresh token logic
    refreshInProgressPromise = new Promise<string>((resolve, reject) => {
      const refreshPacket = createWebSocketPacket(
        APIs.REFRESH_TOKEN,
        { refreshToken: refreshToken },
        accessToken
      );

      if (socket && socket.readyState === WebSocket.OPEN) {
        registerPendingRequest(refreshPacket.meta.packet_id, {
          resolve: (response) => {
            if (response.status === 'OK') {
              const newTokens = response.payload?.data;
              
              if (authContext) {
                authContext.setAccessToken(newTokens.access_token);
                authContext.setRefreshToken(newTokens.refresh_token);
              }
              resolve(newTokens.access_token);
            } else {
              // logout user if refresh fails
              if (authContext) authContext.logout();
              reject(response);
            }
          },
          reject 
        });

        socket.send(JSON.stringify(refreshPacket));
        console.log("WebSocket: Sent refresh token request.", refreshPacket);
      } else {
        reject(new Error("WebSocket jest zamknięty. Nie można odświeżyć sesji."));
      }
    }).finally(() => {
      refreshInProgressPromise = null;
    });

    return refreshInProgressPromise;
  }, [refreshToken, accessToken, authContext]);

  return { refresh };
};