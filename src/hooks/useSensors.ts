import { useEffect, useState } from "react";
import { fetchSensorData } from "@/lib/api";

/* ================= TYPES ================= */
export interface SensorData {
  temperature?: number;
  humidity?: number;
  gas?: number;
  soil?: number;
  water?: number;
  distance?: number;
  weight?: number;
  emergency: boolean;
}

/* ================= HOOK ================= */
export function useSensors() {
  const [data, setData] = useState<SensorData | null>(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const result = await fetchSensorData();
        if (!mounted) return;

        setData({
          temperature: result.temperature ?? undefined,
          humidity: result.humidity ?? undefined,
          gas: result.gas ?? 0,
          soil: result.soil ?? 0,
          water: result.water ?? 0,
          distance: result.distance ?? -1,
          weight: result.weight ?? 0,
          emergency: result.emergency ?? false,
        });

        setOnline(true);
      } catch {
        if (!mounted) return;
        setOnline(false);
      }
    };

    poll(); // instant first fetch
    const interval = setInterval(poll, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, online };
}
