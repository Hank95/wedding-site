interface CountdownProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export function Countdown({ countdown }: CountdownProps) {
  return (
    <div className="flex justify-center space-x-8">
      {Object.entries(countdown).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <span className="text-5xl font-bold text-sage-700">{value}</span>
          <p className="text-xl text-sage-600 capitalize">{unit}</p>
        </div>
      ))}
    </div>
  );
}
