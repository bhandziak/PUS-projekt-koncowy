import type { Action, PacketType } from "./websocket";

export interface ProtocolRequestTemplate<T = any> {
  type: PacketType;
  payload: {
    action: Action;
    data: T | null;
  };
  token: string | null;
  meta: {
    version: string;
    packet_id: string;
    timestamp: string;
  };
}