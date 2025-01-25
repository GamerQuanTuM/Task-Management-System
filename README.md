# Task Management Application

This is a full-stack task management application built with:

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and Redux
- **Backend**: NestJS with Prisma ORM

## Table of Contents
1. [Frontend Overview](#frontend-overview)
2. [API Overview](#api-overview)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Development](#development)

## Frontend Overview

The frontend is built using Next.js and includes the following key features:

- **Task List**: Displays tasks in a responsive grid layout
- **Task Management**:
  - Create new tasks
  - Update existing tasks
  - Delete tasks
  - View task details
- **Search Functionality**: Filter tasks by title
- **Pagination**: Load tasks in pages
- **Modals**:
  - Task Form Modal (Create/Update)
  - Delete Confirmation Modal
  - Task Details Modal
- **State Management**: Redux Toolkit for managing application state
- **UI Components**:
  - Animated components using Framer Motion
  - Responsive design with Tailwind CSS
  - Form validation with React Hook Form and Zod

## API Overview

The backend API is built with NestJS and provides the following endpoints:

### Task Endpoints
- `GET /tasks` - Get paginated list of tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Database
- Uses Prisma ORM with Mongodb
- Task model includes:
  - id: String (UUID)
  - title: String
  - description: String
  - status: Enum (PENDING, IN_PROGRESS, COMPLETED)
  - createdAt: DateTime
  - updatedAt: DateTime

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm
- Docker (optional, for database)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── app/            # Next.js pages
│   ├── components/     # Reusable components
│   ├── slices/         # Redux slices
│   ├── store/          # Redux store configuration
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
```

### API
```
api/
├── src/
│   ├── prisma/         # Prisma configuration
│   ├── test/           # Unit tests
│   └── *.ts            # Main application files
```

## Features

### Frontend Features
- Responsive design
- Form validation
- Real-time updates
- Smooth animations
- Error handling
- Loading states

### API Features
- RESTful endpoints
- Type-safe with TypeScript
- Database migrations
- Input validation
- Error handling
- Unit testing

## Development

### Running the Application
```bash
# Start both frontend and backend
pnpm dev
```

### Running Tests
```bash
# Run API tests
pnpm test:api
```

### Database Management
```bash
# Run database migrations
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate

# Open Prisma Studio
pnpm prisma studio
```

### Linting and Formatting
```bash
# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format
```

