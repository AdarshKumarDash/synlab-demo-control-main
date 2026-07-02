import type { SensorData } from "@/hooks/useSensors";

export function buildSensorContext(data: SensorData | null) {

  if (!data) {
    return `
Hardware Status: DISCONNECTED

No live sensor readings are currently available.
ESP32 is not connected or not responding.
`;
  }

  return `
Hardware Status: CONNECTED

Current SynLab Sensor Readings:

Temperature: ${data.temperature ?? "N/A"} °C
Humidity: ${data.humidity ?? "N/A"} %
Gas: ${data.gas ?? "N/A"}
Soil Moisture: ${data.soil ?? "N/A"}
Water Level: ${data.water ?? "N/A"}
Distance: ${data.distance ?? "N/A"} cm
Weight: ${data.weight ?? "N/A"} g
Emergency Status: ${data.emergency ? "ACTIVE" : "NORMAL"}
`;
}