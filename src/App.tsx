import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `HanzMusify - ${count}`;
  }, [count]);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1ed760] mb-4">HanzMusify</h1>
        <p className="text-[#b3b3b3] mb-6">Streaming Musik YouTube dengan Lirik</p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold py-2 px-6 rounded-full transition-all active:scale-95"
        >
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
