import { useState } from 'react';
import { useWebSocket } from '../../api/hooks/useWebSocket';
import APIs from '../../api/ApiURL';

export default function HomePage() {
  const { send } = useWebSocket(false); 
  
  const [logs, setLogs] = useState<string[]>([]);

  const handleSendHello = () => {
    const timestamp = new Date().toLocaleTimeString();
    
    const payloadData = null;

    send(APIs.HELLO, payloadData);

    setLogs((prev) => [
      ...prev, 
      `[${timestamp}] Wysłano akcję '${APIs.HELLO.action}' (${APIs.HELLO.type})`
    ]);
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