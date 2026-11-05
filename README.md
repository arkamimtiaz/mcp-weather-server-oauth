# MCP Weather Server with OAuth 2.0 Authentication

A JavaScript-based Model Context Protocol (MCP) Weather Server integrated with a custom OAuth 2.0 Authorization Code Flow with PKCE (S256), JWT authentication, and scope-based authorization.

The project demonstrates how to build a secured MCP server and connect it with a custom authentication and authorization system.

## Key Features

- **MCP Server:** Built with Node.js, Express.js, and the official MCP SDK.
- **Weather Tool:** Retrieves current weather information for any supported city.
- **Open-Meteo API:** Uses geocoding and weather forecast APIs without requiring an API key.
- **OAuth 2.0 Authorization Code Flow:** Implements a custom authorization server.
- **PKCE (S256):** Validates the code verifier during token exchange.
- **JWT Authentication:** Issues and validates signed JWT access tokens.
- **Scope-Based Authorization:** Restricts access using the `weather:read` scope.
- **Role-Based Authorization:** Validates user roles before allowing protected tool execution.
- **User Interface:** React-based login and registration frontend.
- **Database:** MySQL for user accounts and OAuth client and authorization-code data.

## Tech Stack

| Category | Technologies |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | React.js, Vite |
| Database | MySQL |
| MCP | Model Context Protocol SDK |
| Authentication | OAuth 2.0, PKCE, JWT |
| Password Security | bcrypt |
| Weather API | Open-Meteo |
| Validation | Zod |
| HTTP Transport | Streamable HTTP |

## Project Architecture

The project consists of three main components:

1. **MCP Weather Server:** Exposes the `get_weather` tool through Streamable HTTP.
2. **OAuth Authentication Server:** Handles client registration, user authentication, authorization requests, and token issuance.
3. **React Frontend:** Provides login and registration interfaces for users.

## Authentication & Authorization Flow

The project implements an Authorization Code Flow with PKCE using the S256 challenge method.

1. An MCP client initiates the OAuth authorization process.
2. The authorization server validates the client ID, redirect URI, requested scope, and PKCE parameters.
3. The user is redirected to the React login interface.
4. After successful authentication, an authorization code is issued.
5. The client exchanges the authorization code and code verifier at the token endpoint.
6. The authorization server validates the PKCE challenge and issues a signed JWT access token.
7. The MCP client sends the access token using the Bearer authorization header.
8. The MCP server validates the JWT, scope, and user role before executing protected tools.

### Authorization Rules

- Required scope: `weather:read`
- Required role: `user`
- JWT algorithm: HS256
- Access token lifetime: 5 minutes
- PKCE method: S256

## Project Structure

```text
mcp-weather-server-oauth/
│
├── auth-server/
│   ├── backend/
│   │   ├── authorization/
│   │   ├── login/
│   │   ├── register/
│   │   ├── token/
│   │   ├── configdb.js
│   │   ├── server.js
│   │   └── package.json
│   │
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── Components/
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
│
├── mcp.js
├── package.json
├── package-lock.json
└── .gitignore
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/arkamimtiaz/mcp-weather-server-oauth.git
```

Navigate to the project:

```bash
cd mcp-weather-server-oauth
```

### 2. Install MCP Server Dependencies

```bash
npm install
```

### 3. Configure MCP Server Environment

Create a `.env` file in the project root:

```env
JWT_SECRET=your_shared_jwt_secret
```

Use a strong secret and keep it private.

### 4. Configure the OAuth Backend

Navigate to the backend:

```bash
cd auth-server/backend
npm install
```

Create a `.env` file inside `auth-server/backend/`:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_database_name

SESSION_SECRET=your_session_secret
JWT_SECRET=your_shared_jwt_secret
```

**Important:** Use the same `JWT_SECRET` in the MCP server and OAuth backend so that issued tokens can be verified.

Configure your MySQL database and create the required tables before starting the backend. Database schema must match the models used by the application.

Start the OAuth backend:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:3000
```

### 5. Start the React Frontend

Open another terminal:

```bash
cd auth-server/frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### 6. Start the MCP Weather Server

Open another terminal in the project root:

```bash
node mcp.js
```

The MCP server runs on:

```text
http://localhost:3001/api/mcp
```

## MCP Tool

### `get_weather`

Retrieves current weather information for a specified city.

**Input:**

```json
{
  "city": "Lahore"
}
```

**Example response:**

```json
{
  "city": "Lahore",
  "country": "Pakistan",
  "temperature": "32 °C",
  "humidity": "45%",
  "windSpeed": "12 km/h",
  "observedAt": "2026-11-06T10:00"
}
```

Weather values are illustrative; actual results depend on the API response.

## OAuth Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/.well-known/oauth-authorization-server` | Authorization server metadata |
| GET | `/.well-known/oauth-protected-resource` | Protected resource metadata |
| POST | `/api/oauth/register` | OAuth client registration |
| GET | `/api/authorize` | Authorization request |
| POST | `/api/oauth/token` | Authorization code exchange |

## Security Implementation

This project demonstrates several important security concepts:

- Password hashing using bcrypt.
- OAuth client validation.
- Redirect URI validation.
- Authorization scope validation.
- PKCE verification using SHA-256.
- Single-use authorization codes.
- JWT signature verification.
- JWT expiration validation.
- Bearer token authentication.
- Role and scope validation before protected tool execution.

## Learning Outcomes

Through this project, I explored and implemented:

- Building MCP servers using JavaScript and Node.js.
- Integrating external APIs with MCP tools.
- Working with Streamable HTTP transport.
- Understanding OAuth 2.0 Authorization Code Flow.
- Implementing PKCE authentication.
- Generating and validating JWT access tokens.
- Implementing scope-based and role-based authorization.
- Connecting React, Express, and MySQL.
- Securing protected MCP tool execution.

## Future Improvements

- Implement automated authentication and authorization tests.
- Improve OAuth metadata and interoperability.
- Add refresh token support.
- Implement production-ready HTTPS and secure cookie configuration.
- Improve deployment and logging.
- Explore advanced MCP server security and harness engineering.

## Author

**Arkam Imtiaz**

Junior Full Stack Developer

- GitHub: [@arkamimtiaz](https://github.com/arkamimtiaz)
- Project Repository: [MCP Weather Server with OAuth](https://github.com/arkamimtiaz/mcp-weather-server-oauth)

---

If you find this project useful, consider giving it a ⭐ on GitHub!

