# FlowInquiry Client

[![Build status](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml/badge.svg)](https://github.com/flowinquiry/flowinquiry-frontend/actions/workflows/node.js.yml)
![License](https://img.shields.io/badge/License-AGPLv3-blue)

## What is FlowInquiry

FlowInquiry is a service designed to streamline the management of cases, tickets, and requests for teams handling both internal and external inquiries. It bridges communication gaps across teams and ensures timely resolution of customer or interdepartmental requests. By enabling organizations to define custom workflows with tailored Service Level Agreements (SLAs) for each state, FlowInquiry ensures teams can meet deadlines and respond promptly to requests. This structured approach enhances accountability, efficiency, and satisfaction for all parties involved, fostering smoother collaboration and better outcomes.

### Problems FlowInquiry Solves with Specific Use Cases

FlowInquiry addresses several challenges faced by organizations in managing cases, tickets, and team communication. Here are some specific use cases:

**On-Call System Management**
Managing incoming requests or incidents in an on-call system can be challenging with multiple shifts and team members. FlowInquiry streamlines the process by enforcing well-defined workflows with SLAs for escalation and resolution, reducing response times, avoiding missed escalations, and ensuring accountability.

**Case Management in CRM Applications**
FlowInquiry helps CRM teams manage customer cases like inquiries, complaints, and service requests by enabling custom workflows tailored to case types such as refunds or escalations. SLAs at each workflow stage ensure timely updates and resolutions, boosting customer satisfaction and loyalty.

**Team Communication and Collaboration**
FlowInquiry enhances communication across teams by providing a centralized platform to log, track, and route requests through clear workflows. This minimizes miscommunication, prevents delays, and aligns all stakeholders on priorities, even in large organizations.

**Service Request Tracking for IT Teams**
FlowInquiry automates IT service request workflows, such as software installation and access management, reducing bottlenecks caused by manual tracking. It ensures requests are assigned, processed, and resolved efficiently within SLA timelines.

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

This script generates environment variables, including BACK_END_URL, to establish the communication between the client and server. Example

```
BACK_END_URL=http://localhost:8080
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
