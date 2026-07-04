import { useEffect, useState } from "react";

interface Props {
  frequency: number;
}

export default function PendulumAnimation({
  frequency,
}: Props) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let frame = 0;

    const interval = setInterval(() => {
      frame += 0.05;

      setAngle(
        Math.sin(
          frame *
            Math.max(
              frequency,
              0.5
            )
        ) * 40
      );
    }, 16);

    return () => clearInterval(interval);
  }, [frequency]);

  return (
    <div className="bg-card border rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        Live Pendulum
      </h2>

      <div className="h-[550px] flex justify-center items-start">

        <div className="relative">

          {/* Top Beam */}
          <div
            className="
              w-[300px]
              h-4
              rounded-md
              bg-slate-500
              mx-auto
            "
          />

          {/* Support Legs */}
          <div
            className="
              absolute
              left-6
              top-4
              w-2
              h-20
              bg-slate-600
            "
          />

          <div
            className="
              absolute
              right-6
              top-4
              w-2
              h-20
              bg-slate-600
            "
          />

          {/* Swing Arc */}
          <svg
            width="350"
            height="300"
            className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <path
              d="
                M 55 255
                A 120 120 0 0 1
                295 255
              "
              fill="none"
              stroke="#64748b"
              strokeDasharray="6 6"
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>

          {/* Pivot */}
          <div
            className="
              w-4
              h-4
              rounded-full
              bg-primary
              mx-auto
              mt-2
              relative
              z-10
            "
          />

          {/* Pendulum */}
          <div
            className="origin-top"
            style={{
              transform: `rotate(${angle}deg)`
            }}
          >
            {/* Rod */}
            <div
              className="
                w-[4px]
                h-[250px]
                bg-slate-700
                mx-auto
              "
            />

            {/* Bob */}
            <div
              className="
                w-14
                h-14
                rounded-full
                bg-primary
                -mt-2
                mx-auto
                shadow-xl
              "
            />
          </div>

        </div>

      </div>

    </div>
  );
}