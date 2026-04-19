import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

async function geocode(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
  const data = await resp.json() as any;
  if (data.results?.length) {
    return { lat: data.results[0].latitude, lon: data.results[0].longitude, name: data.results[0].name };
  }
  return null;
}

export function registerRoutes(app: Hono) {
  app.post("/api/weather", async (c) => {
    await tryRequirePayment(0.001);
    const body = await c.req.json().catch(() => ({}));
    let lat = body.latitude;
    let lon = body.longitude;
    let locationName = "";

    if (body.city) {
      const geo = await geocode(body.city);
      if (!geo) return c.json({ error: `City not found: ${body.city}` }, 400);
      lat = geo.lat;
      lon = geo.lon;
      locationName = geo.name;
    }

    if (lat === undefined || lon === undefined)
      return c.json({ error: "Provide latitude+longitude or city name" }, 400);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`;

    const resp = await fetch(url);
    const data = await resp.json() as any;

    if (data.error) return c.json({ error: data.reason || "Weather API error" }, 500);

    const weatherCodes: Record<number, string> = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
      55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 80: "Slight showers",
      81: "Moderate showers", 82: "Violent showers", 95: "Thunderstorm",
    };

    const current = data.current || {};
    const daily = data.daily || {};

    const forecast = (daily.time || []).map((date: string, i: number) => ({
      date,
      tempMax: daily.temperature_2m_max?.[i],
      tempMin: daily.temperature_2m_min?.[i],
      precipitation: daily.precipitation_sum?.[i],
      condition: weatherCodes[daily.weather_code?.[i]] || "Unknown",
    }));

    return c.json({
      location: { latitude: lat, longitude: lon, name: locationName || undefined, timezone: data.timezone },
      current: {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        condition: weatherCodes[current.weather_code] || "Unknown",
      },
      forecast,
    });
  });
}
