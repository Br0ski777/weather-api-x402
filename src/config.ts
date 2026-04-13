import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "weather-api",
  slug: "weather-api",
  description: "Current weather and 7-day forecast -- temperature, humidity, wind, precipitation. Any location worldwide.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/weather",
      price: "$0.001",
      description: "Get current weather and forecast for a location",
      toolName: "data_get_weather",
      toolDescription: `Use this when you need current weather conditions or a 7-day forecast for any location. Returns weather data in JSON.

Returns: 1. current (temperature, humidity, windSpeed, windDirection, precipitation, weatherCode) 2. forecast array (7 days with tempMin, tempMax, precipitation, weatherCode) 3. location (city, country, latitude, longitude) 4. timezone.

Example output: {"location":{"city":"Paris","country":"France","latitude":48.85,"longitude":2.35},"current":{"temperature":18.5,"humidity":62,"windSpeed":12,"precipitation":0,"weatherCode":"partly_cloudy"},"forecast":[{"date":"2026-04-14","tempMin":12,"tempMax":20,"precipitation":0.2}]}

Use this FOR travel planning, outdoor event scheduling, agriculture monitoring, logistics planning, and building weather-aware applications.

Do NOT use for timezone info -- use utility_convert_timezone instead. Do NOT use for IP-based location -- use ip_lookup_geolocation instead. Do NOT use for stock data -- use finance_get_stock_price instead.`,
      inputSchema: {
        type: "object",
        properties: {
          latitude: { type: "number", description: "Latitude (-90 to 90)" },
          longitude: { type: "number", description: "Longitude (-180 to 180)" },
          city: { type: "string", description: "City name (alternative to lat/lon, uses geocoding)" },
        },
        required: [],
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "location": {
              "type": "object",
              "properties": {
                "latitude": {
                  "type": "number"
                },
                "longitude": {
                  "type": "number"
                },
                "name": {
                  "type": "string"
                },
                "timezone": {
                  "type": "string"
                }
              }
            },
            "current": {
              "type": "object",
              "properties": {
                "temperature": {
                  "type": "number",
                  "description": "Current temperature"
                },
                "humidity": {
                  "type": "number",
                  "description": "Relative humidity %"
                },
                "windSpeed": {
                  "type": "number",
                  "description": "Wind speed"
                },
                "condition": {
                  "type": "string",
                  "description": "Weather condition"
                }
              }
            },
            "forecast": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "date": {
                    "type": "string"
                  },
                  "tempMax": {
                    "type": "number"
                  },
                  "tempMin": {
                    "type": "number"
                  },
                  "precipitation": {
                    "type": "number"
                  },
                  "condition": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "required": [
            "location",
            "current"
          ]
        },
    },
  ],
};
