

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface TasksState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
}
