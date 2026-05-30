const STYLES = {
    send: 'color: #0004ff; font-weight: bold; background: #1a1a1a; padding: 2px 5px; border-radius: 3px; border-left: 3px solid #0004ff;',
    receiveSuccess: 'color: #00ffaa; font-weight: bold; background: #1a1a1a; padding: 2px 5px; border-radius: 3px; border-left: 3px solid #00ffaa;',
    receiveFail: 'color: #ff3333; font-weight: bold; background: #2a1111; padding: 2px 5px; border-radius: 3px; border-left: 3px solid #ff3333;',
    broadcast: 'color: #ffbb00; font-weight: bold; background: #1a1a1a; padding: 2px 5px; border-radius: 3px; border-left: 3px solid #ffbb00;',
    auth: 'color: #00efff; font-weight: bold; background: #0c2533; padding: 2px 5px; border-radius: 3px; border-left: 3px solid #00efff;'
};

export const wsLogger = {
    send: (actionName: string, packet: any) => {
        console.log(`%c[WS SEND] ${actionName}`, STYLES.send, packet);
    },

    receiveSuccess: (actionName: string, packetId: string, response: any) => {
        console.log(`%c[WS RECEIVE OK] ${actionName} (${packetId.slice(0, 8)}...)`, STYLES.receiveSuccess, response);
    },

    receiveFail: (actionName: string, packetId: string, errorResponse: any) => {
        console.log(`%c[WS RECEIVE FAIL] ${actionName} (${packetId.slice(0, 8)}...)`, STYLES.receiveFail, errorResponse);
    },

    broadcast: (type: string, payload: any) => {
        console.log(`%c[WS BCAST] ${type}`, STYLES.broadcast, payload);
    },

    sendRefresh: (packet: any) => {
        console.log(`%c[WS AUTH] REFRESH TOKEN REQUEST`, STYLES.auth, packet);
    }
};