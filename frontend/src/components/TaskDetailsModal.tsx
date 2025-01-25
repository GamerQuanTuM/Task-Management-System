"use client";

import type { TaskFormData } from "@/types/modal";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskFormData;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Task Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p>{task.title}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p>{task.description}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p>{task.status}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
