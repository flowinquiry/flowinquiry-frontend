# FlowInquiry Client

[![Build status](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml/badge.svg)](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml)

## Overview

FlowInquiry Client is the front-end application for the FlowInquiry platform, designed to provide an intuitive and user-friendly interface for managing workflows, team collaboration, and requests. Built with Next.js, it offers a seamless experience across devices, leveraging modern web technologies for performance and accessibility.

## Key Features

1. Customizable Workflows: Allows users to create, edit, and visualize workflows with ease.

2. Role-Based Access Control: Ensures secure and personalized access for users based on their roles.

3. Optimized Performance: Built with Next.js for server-side rendering (SSR) and static site generation (SSG), ensuring fast load times and a smooth user experience.

4. Integration with FlowInquiry Server: Communicates with the back-end via REST APIs for real-time data synchronization and updates.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Setup Instructions

1. Clone the repository:

```bash
git clone git@github.com:flowinquiry/flowinquiry-frontend.git
cd flowinquiry-frontend
```

2. Install dependencies

```bash
pnpm install
```

3. Configure application parameters

Set up the application environment variables by running the following script:

```bash
scripts/init_environments.sh
```

This script generates environment variables, including NEXT_PUBLIC_BACKEND_API, to establish the communication between the client and server. Example

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

4. Start the development server

```bash
pnpm dev
```

5. Access the application:
   Open your browser and navigate to http://localhost:3000.

## Related Information

- [FlowInquiry document](https://theflowinquiry.github.io/flowinquiry-docs): The centralized document for FlowInquiry products
- [FlowInquiry Server](https://github.com/flowinquiry/flowinquiry-server): Back-end services for FlowInquiry.
- [FlowInquiry Client](https://github.com/flowinquiry/flowinquiry-frontend): Front-end application.
- [FlowInquiry Ops](https://github.com/flowinquiry/flowinquiry-ops): Deployment and operational scripts.

## Discussions

For any inquiries about the project, including questions, proposals, or suggestions, please start a new discussion in the [Discussions](https://github.com/flowinquiry/flowinquiry-frontend/discussions) section. This is the best place to engage with the community and the FlowInquiry team

## License

This project is licensed under the [AGPLv3](LICENSE) License.
