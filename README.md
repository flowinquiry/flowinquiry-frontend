# FlowInquiry Client

[![Build status](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml/badge.svg)](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml)
![License](https://img.shields.io/badge/License-AGPLv3-blue)

## What is FlowInquiry

FlowInquiry is a free, open-source solution that embraces transparency as an alternative to Jira, ServiceNow, and Zendesk. Designed for managing cases, tickets, and requests, it streamlines communication, ensures timely resolutions, and supports customizable workflows with SLAs. By eliminating vendor lock-in and costly subscriptions, FlowInquiry enhances efficiency, accountability, and collaboration for teams handling internal and external inquiries.

![FlowInquiry](assets/flowinquiry_slide.gif)

### Problems FlowInquiry Solves with Specific Use Cases

FlowInquiry addresses several challenges faced by organizations in managing cases, tickets, and team communication. Here are some specific use cases:

- **On-Call System Management** In an on-call system, teams often face challenges in managing incoming requests or incidents, particularly when multiple shifts or team members are involved. FlowInquiry ensures that each request follows a well-defined workflow, with SLAs for escalation and resolution. This helps reduce response times, avoids missed escalations, and provides clear accountability for handling incidents.

- **Case Management in CRM Applications** CRM applications often struggle to manage customer cases effectively, especially when handling inquiries, complaints, or service requests. FlowInquiry enables teams to define custom workflows tailored to specific case types, such as refunds, escalations, or product inquiries. SLAs for each workflow stage ensure customers receive timely updates and resolutions, enhancing customer satisfaction and loyalty.

- **Team Communication and Collaboration** Effective communication within and across teams can be difficult in large organizations, especially when requests involve multiple departments or external stakeholders. FlowInquiry acts as a centralized platform where requests are logged, tracked, and routed through clearly defined workflows. This reduces miscommunication, prevents delays, and ensures all parties are aligned on priorities.

- **Service Request Tracking for IT Teams** IT teams managing internal service requests often encounter bottlenecks due to unclear processes or manual tracking. FlowInquiry allows IT departments to automate workflows for common requests such as software installation, access management, or issue resolution. The system ensures each request is assigned, processed, and resolved within agreed SLAs.

- **Project management** Teams can use FlowInquiry as a project management tool to create, assign, and prioritize tasks, track progress with workflows, and ensure timely completion with SLAs and automation. Its collaboration features, real-time updates, and integration capabilities streamline workflows and boost productivity.

By tailoring workflows to these and other scenarios, FlowInquiry empowers teams to streamline operations, meet deadlines, and deliver exceptional service to both internal and external stakeholders.

## Intro

FlowInquiry Frontend is a Next.js application that offers a streamlined interface for managing workflows and team requests. It integrates with the FlowInquiry backend, powered by Spring Boot, to provide real-time workflow tracking, request management, and dynamic query support. Built with React, TailwindCSS, and shadcn components, it delivers a modern, responsive, and customizable user experience. Authentication is handled via next-auth, ensuring secure access to user-specific data and role-based permissions

## Built With

<div style="display: flex; justify-content: left; gap: 20px; align-items: center;">
    <img src="assets/nextjs.svg"  alt="NextJS" width="80" height="80"  title="Used as the primary framework to structure the application, managing routing and integrating client-side rendering powered by React.js. Next.js facilitates seamless communication with the FlowInquiry back-end via REST APIs, ensuring a smooth data exchange and interactive user experience">
    <img src="assets/tailwind-css.svg"  alt="Tailwindcss" width="80" height="80"  title="Used in combination with ShadCN and FlowInquiry's custom components to deliver flexible layouts and customizable themes">
    <img src="assets/shadcn-ui.svg"  alt="Shadcn" width="80" height="80"  title="Serves as the foundation of the FlowInquiry UI, providing a consistent and accessible design system. All FlowInquiry components are built on top of ShadCN, ensuring a cohesive and extensible user interface across the application">
</div>

FlowInquiry integrates various open-source components, including Recharts and Xyflow for charts and graphs, Zod for schema validation, and TipTap for rich text editing. We deeply appreciate the open-source community's contributions and acknowledge all the libraries and tools we use on our tribute [page](https://docs.flowinquiry.io/about)

## Getting Started

To have the FlowInquiry front-end up and running, please follow the [Getting Started](https://docs.flowinquiry.io/developer_guides/frontend/getting_started) guide

## Deploy FlowInquiry

To ensure a smooth deployment process, we provide detailed guidelines for deploying FlowInquiry in various environments. These instructions cover setup steps, configuration details, and best practices for deploying the service effectively. You can find the deployment documentation [here](https://docs.flowinquiry.io/developer_guides/deployment)

## License

This project is licensed under the [AGPLv3](LICENSE) License.
