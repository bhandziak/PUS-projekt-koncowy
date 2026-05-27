import APIs from '../ApiURL';

export const socket = new WebSocket(APIs.SERVER_URL);

socket.onopen = () => {
    console.log('Natywny WebSocket: Połączono pomyślnie z serwerem Spring!');
};

socket.onmessage = (event) => {
    try {
        const responseData = JSON.parse(event.data);
        console.log('Natywny WebSocket: Odebrano pakiet:', responseData);
    } catch (e) {
        console.log('Natywny WebSocket: Odebrano wiadomość tekstową:', event.data);
    }
};

socket.onerror = (error) => {
    console.error('Natywny WebSocket: Błąd połączenia:', error);
};

socket.onclose = () => {
    console.warn('Natywny WebSocket: Połączenie zostało zamknięte.');
};