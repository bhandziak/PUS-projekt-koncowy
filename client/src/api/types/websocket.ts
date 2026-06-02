export type Action = 'login' | 'register' | 'hello' | 'refresh_token' | 'create' | 'delete' | 'list_updated' | 'join' | 'leave' | 'list' | 'send' | 'new_message';
export type PacketType = 'HANDSHAKE' | 'AUTH' | 'ROOM' | 'CHAT';

export interface EndpointTemplate {
  type: PacketType;
  action: Action;
}