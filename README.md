# MCP Agents Hub

The open-source ecosystem for building, discovering, and deploying Model Context Protocol servers and clients for enterprise environments.

## What is the Model Context Protocol?

The Model Context Protocol (MCP) is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. The architecture is straightforward: developers can either expose their data through MCP servers or build AI applications (MCP clients) that connect to these servers.

With MCP, AI systems can maintain context as they move between different tools and datasets, replacing today's fragmented integrations with a more sustainable architecture.

### Key Components
- **MCP Specification**: The open standard protocol definition that enables interoperability between servers and clients
- **MCP Servers**: Custom-built connectors that expose data sources, tools, and APIs to AI applications
- **MCP Clients**: AI-powered applications that connect to MCP servers to access contextual data and functionality

### MCP Servers and Clients Relationship

```mermaid
graph LR
    subgraph "Enterprise Data Sources"
        DS1[Internal Tools]
        DS2[Databases]
        DS3[GitHub/Git]
        DS4[Google Drive]
        DS5[Custom APIs]
    end

    subgraph "MCP Servers"
        S1[Internal Tools Server]
        S2[Database Server]
        S3[GitHub Server]
        S4[Google Drive Server]
        S5[Custom API Server]
    end

    subgraph "MCP Clients"
        C1[AI Assistants]
        C2[IDE Extensions]
        C3[Chat Applications]
        C4[Custom Tools]
    end

    DS1 --> S1
    DS2 --> S2
    DS3 --> S3
    DS4 --> S4
    DS5 --> S5

    S1 --> C1
    S1 --> C2
    S2 --> C1
    S2 --> C3
    S3 --> C2
    S3 --> C4
    S4 --> C1
    S4 --> C3
    S5 --> C4

    classDef dataSources fill:#6b7280,stroke:#6b7280,color:white;
    classDef servers fill:#3b82f6,stroke:#3b82f6,color:white;
    classDef clients fill:#0ea5e9,stroke:#0ea5e9,color:white;
    
    class DS1,DS2,DS3,DS4,DS5 dataSources;
    class S1,S2,S3,S4,S5 servers;
    class C1,C2,C3,C4 clients;
```

## Why MCP Agents Hub?

As the MCP ecosystem expands, organizations need a central hub to manage, discover, and share MCP resources. This marketplace serves as that hub, enabling enterprises to:
- Discover pre-built MCP servers for common enterprise systems
- Share custom MCP servers developed within their organization
- Learn best practices for building effective MCP connectors
- Deploy the entire marketplace on-premise for security and governance

### MCP Agents Hub Ecosystem

```mermaid
graph TD
    M[MCP Agents Hub]
    
    subgraph "Server Registry"
        S1[Published Servers]
        S2[Private Servers]
    end
    
    subgraph "Client Directory"
        C1[Published Clients]
        C2[Private Clients]
    end
    
    M --> S1
    M --> S2
    M --> C1
    M --> C2
    M --> M3[Developer Resources]
    
    classDef marketplace fill:#4f46e5,stroke:#4f46e5,color:white;
    classDef servers fill:#3b82f6,stroke:#3b82f6,color:white;
    classDef clients fill:#0ea5e9,stroke:#0ea5e9,color:white;
    
    class M,M3 marketplace;
    class S1,S2 servers;
    class C1,C2 clients;
```

## Features

- **Server Building**: Templates, examples, and best practices to accelerate MCP server development
- **Client Development**: Build AI applications that leverage the MCP protocol with standardized interfaces
- **Tool Discovery**: Find pre-built MCP servers for popular enterprise systems (Google Drive, Slack, GitHub, Git, Postgres, etc.)
- **Enterprise-Ready Deployment**: Deploy on-premise for enhanced security and compliance

## Technology Stack
- TypeScript
- React
- Vite
- Tailwind CSS
- Lucide React (for icons)

## Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Start the development server with `npm run dev`

## Available Scripts
- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build
- `lint`: Run ESLint
- `type-check`: Run TypeScript type checking

## Community

Join the open community to build the future of context-aware AI together. Whether you're an AI tool developer, an enterprise looking to leverage existing data, or an early adopter exploring the frontier, we invite you to contribute.

- MCP: [https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
- MCP Agents Hub [https://github.com/mcp-agents-ai/mcp-agents-hub](https://github.com/mcp-agents-ai/mcp-agents-hub)

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.
