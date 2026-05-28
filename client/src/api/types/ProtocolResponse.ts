export interface ProtocolResponse<T = any> {
  type: string;
  status: 'OK' | 'FAIL';
  payload: {
    action: string;
    data: T;
  };
  error: {
    code: string;
    message: string;
  } | null;
  meta: {
    version: string;
    packet_id: string;
    timestamp: number;
  };
}