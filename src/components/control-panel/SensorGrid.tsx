import {
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Radar,
  Microscope,
} from "lucide-react";
import { useSensors } from "@/hooks/useSensors";

type SensorStatus = "active" | "inactive" | "not-connected";

interface Sensor {
  id: string;
  name: string;
  icon: React.ElementType;
  status: SensorStatus;
  value: string;
  colorClass: string;
  bgColorClass: string;
}

const getStatusLabel = (status: SensorStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "not-connected":
      return "Not Connected";
  }
};

const getStatusClass = (status: SensorStatus) => {
  switch (status) {
    case "active":
      return "status-active";
    case "inactive":
      return "status-inactive";
    case "not-connected":
      return "bg-destructive/50";
  }
};

const SensorGrid = () => {
  const { data, online } = useSensors();

  const sensors: Sensor[] = [
    {
      id: "temperature",
      name: "Temperature (DHT11)",
      icon: Thermometer,
      status: data?.temperature !== undefined ? "active" : online ? "inactive" : "not-connected",
      value: data?.temperature !== undefined ? `${data.temperature} °C` : "—",
      colorClass: "text-sensor-temperature",
      bgColorClass: "bg-sensor-temperature/10",
    },
    {
      id: "humidity",
      name: "Humidity (DHT11)",
      icon: Droplets,
      status: data?.humidity !== undefined ? "active" : online ? "inactive" : "not-connected",
      value: data?.humidity !== undefined ? `${data.humidity} %` : "—",
      colorClass: "text-sensor-humidity",
      bgColorClass: "bg-sensor-humidity/10",
    },
    {
      id: "gas",
      name: "Gas / AQI (MQ135)",
      icon: Wind,
      status: data?.gas !== undefined ? "active" : online ? "inactive" : "not-connected",
      value: data?.gas !== undefined ? `${data.gas}` : "—",
      colorClass: "text-sensor-gas",
      bgColorClass: "bg-sensor-gas/10",
    },
    {
      id: "water",
      name: "Water Level",
      icon: Waves,
      status: data?.water !== undefined ? "active" : online ? "inactive" : "not-connected",
      value: data?.water !== undefined ? `${data.water}` : "—",
      colorClass: "text-sensor-water",
      bgColorClass: "bg-sensor-water/10",
    },
    {
      id: "distance",
      name: "Ultrasonic Distance",
      icon: Radar,
      status: data?.distance !== undefined ? "active" : online ? "inactive" : "not-connected",
      value: data?.distance !== undefined ? `${data.distance} cm` : "—",
      colorClass: "text-sensor-distance",
      bgColorClass: "bg-sensor-distance/10",
    },
    {
      id: "microscope",
      name: "USB Microscope",
      icon: Microscope,
      status: online ? "active" : "not-connected",
      value: online ? "Connected" : "—",
      colorClass: "text-sensor-microscope",
      bgColorClass: "bg-sensor-microscope/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-foreground">
          System Sensor Overview
        </h2>
        <span className="text-sm text-muted-foreground">
          {online ? "Live data from ESP32" : "ESP32 not connected"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor, index) => (
          <div
            key={sensor.id}
            className="sensor-card group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className={`w-12 h-12 rounded-xl ${sensor.bgColorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <sensor.icon className={`w-6 h-6 ${sensor.colorClass}`} />
            </div>

            <h3 className="font-medium text-foreground mb-1">
              {sensor.name}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <span className={`status-dot ${getStatusClass(sensor.status)}`} />
              <span className="text-sm text-muted-foreground">
                {getStatusLabel(sensor.status)}
              </span>
            </div>

            <div className="h-8 flex items-center justify-center rounded-lg bg-muted/50 border border-border/50">
              <span className="text-lg font-mono text-muted-foreground">
                {sensor.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorGrid;
