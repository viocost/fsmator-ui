interface StateDisplayProps {
  stateValue: any;
  context: any;
  isHalted: boolean;
}

export default function StateDisplay({ stateValue, context, isHalted }: StateDisplayProps) {
  const formatStateValue = (state: any): string => {
    if (typeof state === 'string') return state;
    if (typeof state === 'object' && state !== null) {
      return JSON.stringify(state, null, 2);
    }
    return String(state);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Current State</h2>
      
      <div className="space-y-4">
        {/* State Badge */}
        <div className="flex items-center gap-3">
          <span className="text-slate-600 dark:text-slate-400 font-medium">State:</span>
          <span className={`px-4 py-2 rounded-full font-bold text-sm ${
            isHalted 
              ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-2 border-red-500'
              : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-2 border-green-500'
          }`}>
            {formatStateValue(stateValue)}
          </span>
          {isHalted && (
            <span className="text-xs text-red-500 dark:text-red-400 font-semibold">HALTED</span>
          )}
        </div>

        {/* Context */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-300 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Context:</h3>
          <pre className="text-xs text-slate-600 dark:text-slate-400 font-mono overflow-auto max-h-48">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
