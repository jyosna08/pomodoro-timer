import { useState, useRef, useEffect } from 'react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function App() {
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [mode, setMode] = useState('Focus');
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const timerRef = useRef(null);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const formattedTime = `${mins}:${secs}`;

  useEffect(() => {
    if (isRunning) {
      document.title = `${formattedTime} - ${mode}`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [isRunning, formattedTime, mode]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleStart() {
    if (isRunning || timerRef.current) return;
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsRunning(false);

          if (mode === 'Focus') {
            setSessions((c) => c + 1);
            setMode('Break');
            return BREAK_TIME;
          } else {
            setMode('Focus');
            return FOCUS_TIME;
          }
        }
        return s - 1;
      });
    }, 1000);
  }

  function handlePause() {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
  }

  function handleReset() {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    setMode('Focus');
    setSeconds(FOCUS_TIME);
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-md mx-auto p-5 bg-pink-100 border border-pink-200 text-center">
        <h1 className="text-lg font-bold text-gray-800 mb-2">Pomodoro Timer</h1>

        <p className="text-sm font-medium text-pink-700 mb-3">
          Mode: {mode}
        </p>

        <div className="text-5xl font-mono font-bold text-gray-900 my-6">
          {formattedTime}
        </div>

        <div className="flex justify-center gap-3 mb-5">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-1.5 text-sm"
          >
            Start
          </button>
          <button
            onClick={handlePause}
            className="bg-gray-700 hover:bg-gray-800 cursor-pointer text-white px-4 py-1.5 text-sm"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-1.5 text-sm"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-gray-700">
          Completed Focus Sessions: {sessions}
        </p>
      </div>
    </div>
  );
}