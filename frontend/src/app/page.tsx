"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/slices/tasks";
import type { RootState } from "@/store";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TaskFormModal from "@/components/TaskFormModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import TaskDetailsModal from "@/components/TaskDetailsModal";

// Define the Zod schema
const taskSchema = z.object({
  id: z.string().optional(), // Optional for create mode
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

// Infer the type from the schema
type TaskFormData = z.infer<typeof taskSchema>;

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasksReducer
  );

  const [page, setPage] = useState(1);
  const limit = 8;
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task: TaskFormData) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Task details modal state
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);

  // React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema), // Integrate Zod validation
    defaultValues: {
      id: "",
      title: "",
      description: "",
      status: "PENDING",
    },
  });

  useEffect(() => {
    dispatch(fetchTasks({ page, limit }));
  }, [page, dispatch]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  // Open modal in create mode
  const openCreateModal = () => {
    setModalMode("create");
    reset({ id: "", title: "", description: "", status: "PENDING" });
    setIsModalOpen(true);
  };

  // Open modal in update mode
  const openUpdateModal = (task: TaskFormData) => {
    setModalMode("update");
    reset(task); // Prefill the form with the task data
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const onSubmit = async (data: TaskFormData) => {
    const { id, ...taskData } = data;
    if (modalMode === "create") {
      await dispatch(createTask(taskData));
    } else {
      if (id) {
        await dispatch(updateTask({ id, taskData }));
      }
    }

    closeModal();
    dispatch(fetchTasks({ page, limit })); // Refresh the task list
  };

  // Open delete confirmation modal
  const openDeleteModal = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete));
      closeDeleteModal();
      dispatch(fetchTasks({ page, limit })); // Refresh the task list
    }
  };

  // Open task details modal
  const openTaskDetailsModal = (task: TaskFormData) => {
    setSelectedTask(task);
    setIsTaskDetailsModalOpen(true);
  };

  // Close task details modal
  const closeTaskDetailsModal = () => {
    setIsTaskDetailsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Task List
        </h1>

        {/* Search and Add Task */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Add Task
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* No tasks found message */}
            {filteredTasks.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                <p className="text-xl">No tasks found.</p>
              </div>
            ) : (
              <>
                {/* Grid layout with 4 tasks per row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold mb-2 text-gray-800">
                            {task.title}
                          </h2>
                          <p className="text-gray-600 mb-4">{task.description}</p>
                          <span
                            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                              task.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={() => openTaskDetailsModal(task)}
                            className="p-2 text-gray-500 hover:text-green-500 transition-colors duration-300"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openUpdateModal(task)}
                            className="p-2 text-gray-500 hover:text-blue-500 transition-colors duration-300"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(task.id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-blue-600"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">Page {page}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={filteredTasks.length < limit}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-blue-600"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Create/Update Task Modal */}
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mode={modalMode}
          onSubmit={onSubmit}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />

        {/* Task Details Modal */}
        {isTaskDetailsModalOpen && selectedTask && (
          <TaskDetailsModal
            isOpen={isTaskDetailsModalOpen}
            onClose={closeTaskDetailsModal}
            task={selectedTask}
          />
        )}
      </div>
    </div>
  );
};

export default Home;