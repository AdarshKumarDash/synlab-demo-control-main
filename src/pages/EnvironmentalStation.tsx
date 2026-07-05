import { useEffect, useState } from "react";
import { MapPin, CloudSun, Wind, Sun } from "lucide-react";
import { fetchWeather } from "@/lib/weather";
import { fetchLocation } from "@/lib/location";
import { fetchAQI } from "@/lib/airQuality";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchForecast } from "@/lib/forecast";
import EnvironmentalGraph from "@/components/EnvironmentalGraph";

export default function EnvironmentalStation() {
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();

  const [temperature, setTemperature] = useState<number>();

  const [humidity, setHumidity] = useState<number>();

  const [windSpeed, setWindSpeed] = useState<number>();

  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState<any>(null);
  const [aqi, setAqi] = useState<number>();
  const [rain, setRain] = useState<number>();

  const [uvIndex, setUvIndex] = useState<number>();
  const environmentScore = Math.max(
    0,
    100 - (aqi ?? 0) / 5 - (uvIndex ?? 0) * 3,
  );

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

  useEffect(() => {
    if (!lat || !lon) return;

    fetchForecast(lat, lon).then((data) => {
      setForecast(data.daily);
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

  const getRiskLevel = () => {
    if ((temperature ?? 0) > 38 || (uvIndex ?? 0) > 8 || (aqi ?? 0) > 150) {
      return {
        level: "HIGH",
        color: "text-red-500",
      };
    }

    if ((temperature ?? 0) > 30 || (uvIndex ?? 0) > 5 || (aqi ?? 0) > 80) {
      return {
        level: "MODERATE",
        color: "text-yellow-500",
      };
    }

    return {
      level: "LOW",
      color: "text-green-500",
    };
  };

  const risk = getRiskLevel();

  const getEnvironmentStatus = () => {
    if ((aqi ?? 0) > 150 || (uvIndex ?? 0) > 8)
      return {
        text: "Environmental Alert",
        color: "bg-red-500/15 text-red-600",
      };

    if ((aqi ?? 0) > 80 || (uvIndex ?? 0) > 5)
      return {
        text: "Moderate Conditions",
        color: "bg-yellow-500/15 text-yellow-600",
      };

    return {
      text: "Safe Environmental Conditions",
      color: "bg-green-500/15 text-green-600",
    };
  };

  const status = getEnvironmentStatus();
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
          Live GPS • Weather • AQI • Forecast • Environmental Intelligence
        </p>
        <div className="mt-4">
          <div className="text-sm text-muted-foreground">
            Environmental Health Score
          </div>

          <div className="text-4xl font-bold">
            {environmentScore.toFixed(0)}/100
          </div>
        </div>
      </div>

      <div
        className={`
    rounded-3xl
    p-4
    font-semibold
    text-center
    ${status.color}
  `}
      >
        {status.text}
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

      <div className="rounded-3xl border bg-card p-3 overflow-hidden">
        <iframe
          title="map"
          width="100%"
          height="250"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://maps.google.com/maps?q=${lat},${lon}&z=13&output=embed`}
        />
      </div>

      {/* Weather Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-5">Environmental Summary</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-muted/30">
            <p className="text-muted-foreground">Air Quality</p>

            <h3 className="text-xl font-bold">
              {aqi && aqi < 50
                ? "Excellent"
                : aqi && aqi < 100
                  ? "Moderate"
                  : "Poor"}
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            <p className="text-muted-foreground">UV Exposure</p>

            <h3 className="text-xl font-bold">
              {uvIndex && uvIndex < 3
                ? "Low"
                : uvIndex && uvIndex < 6
                  ? "Moderate"
                  : "High"}
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            <p className="text-muted-foreground">Weather</p>

            <h3 className="text-xl font-bold">
              {(rain ?? 0) > 0 ? "Rain Expected" : "Clear Conditions"}
            </h3>
          </div>
        </div>
      </div>

      {/* 5 Day Weather Forecast */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-6">5-Day Weather Forecast</h2>

        {forecast && (
          <div className="grid md:grid-cols-5 gap-4">
            {forecast.time.slice(0, 5).map((day: string, index: number) => (
              <div
                key={index}
                className="
              p-4
              rounded-2xl
              border
              bg-muted/20
              hover:scale-105
              transition-all
              text-center
            "
              >
                <p className="font-semibold">
                  {new Date(day).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>

                <div className="text-3xl my-3">☀️</div>

                <p className="text-lg font-bold">
                  {forecast.temperature_2m_max[index]}°
                </p>

                <p className="text-sm text-muted-foreground">
                  {forecast.temperature_2m_min[index]}°
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Environmental Trends */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-4">Environmental Trends</h2>

        <EnvironmentalGraph />
      </div>

      {/* Environmental Risk Assessment */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-4">
          Environmental Risk Assessment
        </h2>

        <div className={`text-4xl font-bold ${risk.color}`}>{risk.level}</div>

        <p className="text-muted-foreground mt-3">
          Based on weather, UV exposure, and air quality conditions.
        </p>
      </div>

      {/* AI Environmental Analysis */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-4">AI Environmental Analysis</h2>

        <p className="leading-7">
          {aqi && aqi < 50
            ? "Air quality is excellent. "
            : "Air quality requires monitoring. "}
          {(uvIndex ?? 0) > 6
            ? "UV exposure is high. "
            : "UV exposure remains within safe limits. "}
          {(rain ?? 0) > 0
            ? "Rainfall activity has been detected. "
            : "No significant rainfall is expected. "}
          Environmental conditions are suitable for field observations.
        </p>
      </div>

      {/* Suggested Experiments */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-4">Suggested Experiments</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-muted/30">
            ☀ UV Radiation Observation
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            🌱 Plant Growth Monitoring
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            🌧 Rainfall Pattern Analysis
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            🌫 Air Quality Investigation
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-2xl font-bold mb-4">Smart Recommendations</h2>

        <div className="space-y-3">
          {(uvIndex ?? 0) > 6 && (
            <div className="p-3 rounded-xl bg-yellow-500/10">
              High UV detected. Sunscreen recommended.
            </div>
          )}

          {(aqi ?? 0) > 100 && (
            <div className="p-3 rounded-xl bg-red-500/10">
              Air quality is poor. Limit outdoor activity.
            </div>
          )}

          {(rain ?? 0) > 0 && (
            <div className="p-3 rounded-xl bg-blue-500/10">
              Rainfall detected. Carry rain protection.
            </div>
          )}

          {(windSpeed ?? 0) > 25 && (
            <div className="p-3 rounded-xl bg-cyan-500/10">
              Strong winds expected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
