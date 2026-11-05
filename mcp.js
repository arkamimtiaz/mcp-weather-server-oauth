import "dotenv/config";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express  from "express";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());

function createMcpServer (verify) {
  const server = new McpServer({
    name : "main-server",
    version : "1.0.0"
  })

  
const WEATHER_SCOPE = "weather:read";
server.registerTool(
  "get_weather",
  {
    description: "Get the current weather for a city.",
    inputSchema: {
      city: z.string().min(1).describe("City name, e.g. Lahore"),
    },
  },
  async ({ city }) => {      
  if (
  !verify ||
  typeof verify.scope !== "string" ||
  !verify.scope.split(" ").includes(WEATHER_SCOPE)
  )  {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Access denied: weather:read scope required",
          },
        ],
      };
    }
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Geocoding API request failed");
      }

      const geoData = await geoResponse.json();
      const place = geoData.results?.[0];

      if (!place) {
        return {
          isError: true,
          content: [
            { type: "text", text: `City not found: ${city}` },
          ],
        };
      }

      const params = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
      });

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`
      );

      if (!weatherResponse.ok) {
        throw new Error("Weather API request failed");
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              city: place.name,
              country: place.country,
              temperature: `${current.temperature_2m} °C`,
              humidity: `${current.relative_humidity_2m}%`,
              windSpeed: `${current.wind_speed_10m} km/h`,
              observedAt: current.time,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Weather request failed: ${error.message}`,
          },
        ],
      };
    }
  }
);
  return server;
}



app.post("/api/mcp", async (req, res) => {
  const method = req.body?.method;

  // Public MCP initialization and tool discovery
  if (
    method === "initialize" ||
    method === "notifications/initialized" ||
    method === "tools/list"
  ) {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    try {
      await server.connect(transport);
      return await transport.handleRequest(req, res, req.body);
    } catch (error) {

      if (!res.headersSent) {
        return res.status(500).json({ error: error.message });
      }
    } finally {
      await transport.close();
      await server.close();
    }

    return;
  }

  // Authentication
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401)
      .set(
        "WWW-Authenticate",
        'Bearer resource_metadata="http://localhost:3001/.well-known/oauth-protected-resource"'
      )
      .json({ error: "Bearer token required" });
  }

  const accessToken = authHeader.slice(7).trim();

  let verify;

  try {
    verify = jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }

  // Scope validation
  if (
    typeof verify.scope !== "string" ||
    !verify.scope.split(" ").includes("weather:read")
  ) {
    return res.status(403).json({ error: "Invalid scope" });
  }

  // Role validation
  if (verify.role !== "user") {
    return res.status(403).json({
      error: "Role is not matched"
    });
  }

  // Authenticated MCP server
  const server = createMcpServer(verify);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {

    if (!res.headersSent) {
      return res.status(500).json({
        error: error.message
      });
    }
  } finally {
    await transport.close();
    await server.close();
  }
});

app.get("/api/mcp", (req, res) => {
  res.status(405).send("Method Not Allowed");
});

app.delete("/api/mcp", (req, res) => {
  res.status(405).send("Method Not Allowed");
});

app.get("/.well-known/oauth-protected-resource", (req, res) => {
    return res.status.apply(200).json({
      resource: "http://localhost:3001/api/mcp",
      authorization_servers: [
            "http://localhost:3000"
      ],
      scopes_supported: ["weather:read"],
      bearer_methods_supported: ["header"]
    })
})

app.listen(3001, () => {
    console.log("server is running on port 3001")
})

