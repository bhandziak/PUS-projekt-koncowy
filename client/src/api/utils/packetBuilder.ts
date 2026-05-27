import type { EndpointTemplate } from '../types/websocket';
import type { ProtocolRequestTemplate } from '../types/ProtocolRequestTemplate';

export const createWebSocketPacket = <T = any>(
  endpoint: EndpointTemplate,
  data: T | null = null,
  token: string | null = null
): ProtocolRequestTemplate<T> => {
  return {
    type: endpoint.type,
    payload: {
      action: endpoint.action,
      data: data,
    },
    token: token,
    meta: {
      version: "1.0.0",
      packet_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
  };
};