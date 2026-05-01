import { Calendar, User, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  todo: { label: 'Todo', className: 'badge-todo' },
  'in-progress': { label: 'In Progress', className: 'badge-in-progress' },
  done: { label: 'Done', className: 'badge-done' },
};

const TaskCard = ({ task, onStatusChange, onDelete, isDragging }) => {
  const { isAdmin, user } = useAuth();
  const isOverdue = task.isOverdue || (
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'done'
  );

  const isAssigned = task.assignedTo?._id === user?._id;
  const canUpdateStatus = isAdmin || isAssigned;
  const canDelete = isAdmin;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getNextStatus = (current) => {
    const order = ['todo', 'in-progress', 'done'];
    const idx = order.indexOf(current);
    return order[idx + 1] || null;
  };

  return (
    <div
      className={`${isOverdue ? 'kanban-task-overdue' : 'kanban-task'} ${
        isDragging ? 'opacity-50 rotate-1 scale-105' : ''
      } group transition-all duration-200`}
    >
      {/* Overdue banner */}
      {isOverdue && (
        <div className="flex items-center gap-1.5 text-danger text-xs font-medium mb-2.5 bg-danger/5 -mx-4 -mt-4 px-4 pt-3 pb-2 rounded-t-lg border-b border-danger/10">
          <AlertTriangle size={12} />
          Overdue
        </div>
      )}

      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-sm mb-1.5 line-clamp-2 leading-tight">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={statusConfig[task.status]?.className || 'badge'}>
          {statusConfig[task.status]?.label}
        </span>
        {canUpdateStatus && getNextStatus(task.status) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task._id, getNextStatus(task.status));
            }}
            className="text-xs text-primary hover:underline font-medium"
          >
            → Mark {statusConfig[getNextStatus(task.status)]?.label}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Assignee */}
          {task.assignedTo ? (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-[9px] font-bold">
                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="truncate max-w-[80px]">
                {task.assignedTo.name?.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <User size={12} />
              Unassigned
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-danger' : 'text-gray-400'
              }`}
            >
              <Calendar size={11} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Delete */}
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-danger hover:bg-danger/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
