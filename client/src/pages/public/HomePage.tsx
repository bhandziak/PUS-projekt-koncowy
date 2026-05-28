import { useWebSocket } from '../../api/hooks/useWebSocket';
import APIs from '../../api/ApiURL';

export default function HomePage() {
    const { send } = useWebSocket(false); 


    const handleSendHello = async () => {
      try {
        const response = await send(APIs.HELLO, null);

        const successTime = new Date().toLocaleTimeString();
            
        console.log(`[${successTime}] SUKCES od serwera: ${response.payload?.data?.message}`)
      

      } catch (errorPacket: any) {
        const errorTime = new Date().toLocaleTimeString();
        const errorInfo = errorPacket.error;
        console.error(`[${errorTime}] BŁĄD od serwera: ${errorInfo?.message || 'Nieznany błąd'}`);
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 text-center">

          <button
            onClick={handleSendHello}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Wyślij APIs.HELLO
          </button>


        </div>
      </div>
    );
}