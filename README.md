# Weather API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://weather-api.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Current weather and 7-day forecast -- temperature, humidity, wind, precipitation. Any location worldwide. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "weather-api": {
      "url": "https://weather-api.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://weather-api.api.klymax402.com/api/weather" \
  -H "Content-Type: application/json" \
  -d '{}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `data_get_weather` | POST | `/api/weather` | $0.001 | Get current weather and forecast for a location |

### `data_get_weather`

Use this when you need current weather conditions or a 7-day forecast for any location. Returns weather data in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `latitude` | number | no | Latitude (-90 to 90) |
| `longitude` | number | no | Longitude (-180 to 180) |
| `city` | string | no | City name (alternative to lat/lon, uses geocoding) |

Example response:

```json
{"location":{"city":"Paris","country":"France","latitude":48.85,"longitude":2.35},"current":{"temperature":18.5,"humidity":62,"windSpeed":12,"precipitation":0,"weatherCode":"partly_cloudy"},"forecast":[{"date":"2026-04-14","tempMin":12,"tempMax":20,"precipitation":0.2}]}
```

**When to use**: travel planning, outdoor event scheduling, agriculture monitoring, logistics planning, and building weather-aware applications.

**Not for**: timezone info (use `utility_convert_timezone`), stock data (use `finance_get_stock_price`).

## Example agent prompts

- "Current weather conditions or a 7-day forecast for any location"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
