import { useEffect, useState } from "react";
import { MapPin, CloudSun, Wind, Sun } from "lucide-react";
import { fetchWeather } from "@/lib/weather";
import { fetchLocation } from "@/lib/location";
import { fetchAQI } from "@/lib/airQuality";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function EnvironmentalStation() {
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();

  const [temperature, setTemperature] = useState<number>();

  const [humidity, setHumidity] = useState<number>();

  const [windSpeed, setWindSpeed] = useState<number>();

  const [city, setCity] = useState("");
  const [aqi, setAqi] = useState<number>();
  const [rain, setRain] = useState<number>();

  const [uvIndex, setUvIndex] = useState<number>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      (err) => {
        console.error(err);
      },
    );
  }, []);

  useEffect(() => {
    if (!lat || !lon) return;

    fetchWeather(lat, lon).then((data) => {
      setTemperature(data.current.temperature_2m);

      setHumidity(data.current.relative_humidity_2m);

      setWindSpeed(data.current.wind_speed_10m);

      setRain(data.current.precipitation);

      setUvIndex(data.current.uv_index);
    });
  }, [lat, lon]);

  useEffect(() => {
    if (!lat || !lon) return;

    fetchLocation(lat, lon).then((data) => {
      const place =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "Unknown";

      setCity(place);
    });
  }, [lat, lon]);

  useEffect(() => {
    if (!lat || !lon) return;

    fetchAQI(lat, lon).then((data) => {
      setAqi(data.current.us_aqi);
    });
  }, [lat, lon]);

  const getAQIColor = () => {
    if (!aqi) return "text-gray-500";

    if (aqi <= 50) return "text-green-500";

    if (aqi <= 100) return "text-yellow-500";

    if (aqi <= 150) return "text-orange-500";

    if (aqi <= 200) return "text-red-500";

    return "text-purple-700";
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-5 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/control-panel")}
          className="
    flex items-center gap-3
    px-5 py-3
    rounded-2xl
    bg-card
    border
    shadow-sm
    hover:shadow-lg
    hover:scale-105
    transition-all
  "
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Control Panel</span>
        </button>
      </div>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Environmental Station</h1>

        <p className="text-muted-foreground mt-2">
          Live GPS • Weather • Air Quality Monitoring
        </p>
      </div>

      {/* Location Hero */}
      <div className="rounded-3xl border bg-card p-5 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <MapPin className="w-8 h-8 text-primary" />

          <div>
            <h2 className="text-3xl font-bold">{city || "Locating..."}</h2>

            <p className="text-muted-foreground">
              Environmental Monitoring Zone
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-muted/30">
            Latitude:
            <div className="text-xl font-bold">{lat?.toFixed(5) ?? "--"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            Longitude:
            <div className="text-xl font-bold">{lon?.toFixed(5) ?? "--"}</div>
          </div>
        </div>
      </div>

      {/* Weather Cards */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl border bg-card">
          <CloudSun className="w-10 h-10 mb-4 text-yellow-500" />

          <p className="text-muted-foreground">Temperature</p>

          <h2 className="text-2xl font-bold">{temperature ?? "--"}°</h2>
        </div>

        <div className="p-6 rounded-3xl border bg-card">
          <Wind className="w-10 h-10 mb-4 text-blue-500" />

          <p className="text-muted-foreground">Humidity</p>

          <h2 className="text-2xl font-bold">{humidity ?? "--"}%</h2>
        </div>

        <div className="p-6 rounded-3xl border bg-card">
          <Wind className="w-10 h-10 mb-4 text-cyan-500" />

          <p className="text-muted-foreground">Wind Speed</p>

          <h2 className="text-2xl font-bold">{windSpeed ?? "--"}</h2>
        </div>

        <div className="p-6 rounded-3xl border bg-card">
          <Sun className="w-10 h-10 mb-4 text-orange-500" />

          <p className="text-muted-foreground">Rainfall</p>

          <h2 className="text-2xl font-bold">{rain ?? "--"}</h2>
        </div>
      </div>

      {/* AQI Section */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-6">Air Quality Index</h2>

        <div className={`text-2xl font-bold mb-4 ${getAQIColor()}`}>
          {aqi ?? "--"}
        </div>

        <div className="h-6 rounded-full overflow-hidden flex">
          <div className="bg-green-500 flex-1" />
          <div className="bg-yellow-400 flex-1" />
          <div className="bg-orange-500 flex-1" />
          <div className="bg-red-500 flex-1" />
          <div className="bg-purple-700 flex-1" />
        </div>

        <div className="flex justify-between text-xs mt-2">
          <span>Good</span>
          <span>Moderate</span>
          <span>Unhealthy</span>
          <span>Very Bad</span>
          <span>Hazardous</span>
        </div>
      </div>
    </div>
  );
}
