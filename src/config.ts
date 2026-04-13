import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "weather-api",
  slug: "weather-api",
  description: "Current weather and 7-day forecast for any location. OpenMeteo-powered.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/weather",
      price: "$0.001",
      description: "Get current weather and forecast for a location",
      toolName: "data_get_weather",
      toolDescription: "Use this when you need current weather conditions or a 7-day forecast for any location. Provide latitude/longitude or city name. Returns temperature, humidity, wind, precipitation, and daily forecast. Do NOT use for currency conversion — use finance_convert_currency instead. Do NOT use for timezone info — use utility_convert_timezone instead.",
      inputSchema: {
        type: "object",
        properties: {
          latitude: { type: "number", description: "Latitude (-90 to 90)" },
          longitude: { type: "number", description: "Longitude (-180 to 180)" },
          city: { type: "string", description: "City name (alternative to lat/lon, uses geocoding)" },
        },
        required: [],
      },
    },
  ],
};
