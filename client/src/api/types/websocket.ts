export type Action = 'login' | 'register' | 'hello' | 'refresh_token';
export type PacketType = 'HANDSHAKE' | 'AUTH';

export interface EndpointTemplate {
  type: PacketType;
  action: Action;
}