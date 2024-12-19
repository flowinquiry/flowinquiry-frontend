# FlowInquiry Client

[![Build status](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml/badge.svg)](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml)

## What is FlowInquiry

FlowInquiry is a service designed to streamline the management of cases, tickets, and requests for teams handling both internal and external inquiries. It bridges communication gaps across teams and ensures timely resolution of customer or interdepartmental requests. By enabling organizations to define custom workflows with tailored Service Level Agreements (SLAs) for each state, FlowInquiry ensures teams can meet deadlines and respond promptly to requests. This structured approach enhances accountability, efficiency, and satisfaction for all parties involved, fostering smoother collaboration and better outcomes.

### Problems FlowInquiry Solves with Specific Use Cases

FlowInquiry addresses several challenges faced by organizations in managing cases, tickets, and team communication. Here are some specific use cases:

**On-Call System Management**
In an on-call system, teams often face challenges in managing incoming requests or incidents, particularly when multiple shifts or team members are involved. FlowInquiry ensures that each request follows a well-defined workflow, with SLAs for escalation and resolution. This helps reduce response times, avoids missed escalations, and provides clear accountability for handling incidents.

**Case Management in CRM Applications**
CRM applications often struggle to manage customer cases effectively, especially when handling inquiries, complaints, or service requests. FlowInquiry enables teams to define custom workflows tailored to specific case types, such as refunds, escalations, or product inquiries. SLAs for each workflow stage ensure customers receive timely updates and resolutions, enhancing customer satisfaction and loyalty.

**Team Communication and Collaboration**
Effective communication within and across teams can be difficult in large organizations, especially when requests involve multiple departments or external stakeholders. FlowInquiry acts as a centralized platform where requests are logged, tracked, and routed through clearly defined workflows. This reduces miscommunication, prevents delays, and ensures all parties are aligned on priorities.

**Service Request Tracking for IT Teams**
IT teams managing internal service requests often encounter bottlenecks due to unclear processes or manual tracking. FlowInquiry allows IT departments to automate workflows for common requests such as software installation, access management, or issue resolution. The system ensures each request is assigned, processed, and resolved within agreed SLAs.

By tailoring workflows to these and other scenarios, FlowInquiry empowers teams to streamline operations, meet deadlines, and deliver exceptional service to both internal and external stakeholders.

### Screenshots

<table>
  <tr>
    <td style="padding: 10px; text-align: center;">
      <a href="assets/team_dashboard.png">
        <img src="assets/team_dashboard_thumbnail.png" alt="Team Dashboard">
      </a>
    </td>
    <td style="padding: 10px; text-align: center;">
      <a href="assets/team_members.png">
        <img src="assets/team_members_thumbnail.png" alt="Team Members">
      </a>
    </td>
    <td style="padding: 10px; text-align: center;">
      <a href="assets/ticket_view.png">
        <img src="assets/ticket_view_thumbnail.png" alt="Ticket View">
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding: 10px; text-align: center;">
      <a href="assets/user_view.png">
        <img src="assets/user_view_thumbnail.png" alt="User View">
      </a>
    </td>
    <td style="padding: 10px; text-align: center;">
      <a href="assets/workflow_customization.png">
        <img src="assets/workflow_customization_thumbnail.png" alt="Workflow Customization">
      </a>
    </td>
    <td style="padding: 10px; text-align: center;">
      <a href="assets/workspace_dashboard.png">
        <img src="assets/workspace_dashboard_thumbnail.png" alt="Workspace Dashboard">
      </a>
    </td>
  </tr>
</table>

## FlowInquiry Front-end

### Technologies

**Next.js:** Used as the primary framework to structure the application, managing routing and integrating client-side rendering powered by React.js. Next.js facilitates seamless communication with the FlowInquiry back-end via REST APIs, ensuring a smooth data exchange and interactive user experience.

**TailwindCSS:** Used in combination with ShadCN and FlowInquiry's custom components to deliver flexible layouts and customizable themes.

**ShadCN:** Serves as the foundation of the FlowInquiry UI, providing a consistent and accessible design system. All FlowInquiry components are built on top of ShadCN, ensuring a cohesive and extensible user interface across the application.

**Recharts:** Used to visually represent data in the FlowInquiry. It supports various chart types, including pie charts, timelines, bar charts, and more, enabling dynamic and interactive data visualization for users.

**@xyflow/react:** Utilized for visualizing and editing workflows within FlowInquiry. It provides a dynamic and interactive interface for designing and reviewing workflow structures, making workflow management intuitive and efficient.

And Many More: FlowInquiry leverages various open-source components, including tools like Zod for schema validation and TipTap for rich text editing. We deeply value the contributions of the open-source community and list all the amazing libraries and tools we utilize on our tribute [page](https://docs.flowinquiry.io/about)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) 20+
- [pnpm](https://pnpm.io/)

### Setup Instructions

**1. Clone the repository:**

```bash
git clone git@github.com:flowinquiry/flowinquiry-frontend.git
cd flowinquiry-frontend
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure application parameters**

Set up the application environment variables by running the following script:

```bash
scripts/init_environments.sh
```

This script generates environment variables, including NEXT_PUBLIC_BACKEND_API, to establish the communication between the client and server. Example

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

We recommend running the `scripts/all.sh` script, as it streamlines the process by checking your environment settings and performing all necessary configurations, removing the need to execute multiple scripts manually.

**4. Start the development server**

```bash
pnpm dev
```

**5. Access the application:**
   Open your browser and navigate to http://localhost:3000.

## Deploy FlowInquiry

To ensure a smooth deployment process, we provide detailed guidelines for deploying FlowInquiry in various environments. These instructions cover setup steps, configuration details, and best practices for deploying the service effectively. You can find the deployment documentation [here](https://docs.flowinquiry.io/developer_guides/deployment)

## Related Information

- [FlowInquiry document](https://docs.flowinquiry.io): The centralized document for FlowInquiry products
- [FlowInquiry Server](https://github.com/flowinquiry/flowinquiry-server): Back-end services for FlowInquiry.
- [FlowInquiry Client](https://github.com/flowinquiry/flowinquiry-frontend): Front-end application.
- [FlowInquiry Ops](https://github.com/flowinquiry/flowinquiry-ops): Deployment and operational scripts.

## Discussions

For any inquiries about the project, including questions, proposals, or suggestions, please start a new discussion in the [Discussions](https://github.com/flowinquiry/flowinquiry-frontend/discussions) section. This is the best place to engage with the community and the FlowInquiry team

## License

This project is licensed under the [AGPLv3](LICENSE) License.
