# OMS (Order Management System)

This is a desktop application built with React, TypeScript, Material-UI, and Electron, designed to manage orders, customers, products, suppliers, drivers, and routes. It provides a robust and responsive interface for efficient business operations.

## Features

*   **Dashboard:** Overview of key business metrics.
*   **Customer Management:** Add, view, edit, and delete customer information.
*   **Product Management:** Manage product inventory, descriptions, and pricing.
*   **Order Management:** Create and track customer and supplier orders.
*   **Supplier Management:** Handle supplier details and related orders.
*   **Driver & Route Management:** Assign drivers to routes and optimize delivery schedules.
*   **Payment & Receipts:** Record and track payments and receipts.
*   **Dynamic Workspaces:** Tab-based interface allowing multiple active views simultaneously.
*   **Responsive Design:** Adapts to various screen sizes, including a collapsible sidebar and scrollable tab headers.
*   **Internationalization (i18n):** Support for multiple languages (currently English and Greek).
*   **Form Validation:** Robust form validation using Zod.
*   **Local Storage Persistence:** Drafts and certain settings are saved locally.

## Technologies Used

*   **Frontend:** React, TypeScript, Material-UI (MUI), Tailwind CSS
*   **State Management:** Zustand
*   **Routing:** React Router
*   **Internationalization:** i18next, react-i18next
*   **Form Validation:** Zod
*   **Drag and Drop:** @dnd-kit
*   **Desktop Framework:** Electron
*   **Build Tool:** Vite

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kostasbel96/OrderManagementSystemUI.git
    cd project-react
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

To run the application in development mode (both web and Electron desktop app):

```bash
npm run dev
# or
yarn dev
```

This will start the Vite development server and then launch the Electron application.

### Building for Production

To build the web application and then package it into an executable desktop application:

```bash
npm run desktop
# or
yarn desktop
```

The executable will be generated in the `release` directory.

## Login Credentials

To access the application, please use the following credentials:

*   **Username:** `admin`
*   **Password:** `admin123`

## Project Structure

*   `src/`: Contains all the source code for the React application.
    *   `components/`: Reusable UI components.
    *   `contexts/`: React Contexts for global state management (e.g., AuthContext, TabContext).
    *   `hooks/`: Custom React Hooks for reusable logic.
    *   `i18n/`: Internationalization configuration and translation files.
    *   `services/`: API client functions for interacting with the backend.
    *   `store/`: Zustand stores for global UI state.
    *   `types/`: TypeScript type definitions.
*   `electron/`: Contains the Electron main process code.

