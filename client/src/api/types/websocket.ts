export type Action = 'login' | 'register' | 'hello';
export type PacketType = 'HANDSHAKE' | 'AUTH';

export interface EndpointTemplate {
  type: PacketType;
  action: Action;
}