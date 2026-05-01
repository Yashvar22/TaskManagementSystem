import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { projectsAPI, tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Plus,
  UserPlus,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  Calendar,
} from 'lucide-react';

// ─── Column config ────────────────────────────────────────────────
const COLUMNS = [
  {
    id: 'todo',
    label: 'Todo',
    icon: ListTodo,
    headerColor: 'border-t-info',
    countColor: 'bg-info/10 text-info',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    icon: Clock,
    headerColor: 'border-t-warning',
    countColor: 'bg-warning/10 text-warning',
  },
  {
    id: 'done',
    label: 'Done',
    icon: CheckCircle2,
    headerColor: 'border-t-success',
    countColor: 'bg-success/10 text-success',
  },
];

// ─── Create Task Modal ────────────────────────────────────────────
const CreateTaskModal = ({ isOpen, onClose, projectId, members, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'todo',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        projectId,
        status: form.status,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      };
      const res = await tasksAPI.create(payload);
      toast.success('Task created!');
      onCreated(res.data.data.task);
      setForm({ title: '', description: '', assignedTo: '', status: 'todo', dueDate: '' });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="label">Task Title <span className="text-danger">*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g. Design the landing page"
            autoFocus
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label className="label">Description <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
            placeholder="Add more details about the task..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="input">
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Due Date <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="input pl-9"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Plus size={16} /> Create Task</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Add Member Modal ─────────────────────────────────────────────
const AddMemberModal = ({ isOpen, onClose, projectId, onAdded }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    try {
      const res = await projectsAPI.addMember(projectId, email.trim());
      toast.success('Member added!');
      onAdded(res.data.data.project);
      setEmail('');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500">
          Enter the email address of the user you want to add to this project.
          They must already have a registered account.
        </p>
        <div className="form-group">
          <label className="label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className={`input ${error ? 'input-error' : ''}`}
            placeholder="member@company.com"
            autoFocus
          />
          {error && <p className="error-text">{error}</p>}
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><UserPlus size={16} /> Add Member</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Kanban Column ────────────────────────────────────────────────
const KanbanColumn = ({ column, tasks, onStatusChange, onDelete }) => {
  const { icon: Icon, label, headerColor, countColor } = column;

  return (
    <div className={`flex flex-col bg-gray-50 rounded-xl border-2 border-gray-200 border-t-4 ${headerColor} min-h-[400px] flex-1`}>
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-700 text-sm">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${countColor}`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-primary/5' : ''
            }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-24 text-gray-400 text-xs gap-1">
                <Icon size={20} className="opacity-30" />
                <span>No tasks</span>
              </div>
            )}

            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                  >
                    <TaskCard
                      task={task}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────
const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        projectsAPI.getById(id),
        tasksAPI.getByProject(id),
      ]);
      setProject(projRes.data.data.project);
      setTasks(taskRes.data.data.tasks);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load project';
      toast.error(msg);
      if (err.response?.status === 403 || err.response?.status === 404) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  // Drag-and-drop handler
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await tasksAPI.update(draggableId, { status: newStatus });
      toast.success(`Moved to ${COLUMNS.find((c) => c.id === newStatus)?.label}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      // Revert
      setTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? { ...t, status: source.droppableId } : t))
      );
    }
  };

  // Quick status change from card button
  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      toast.success(`Status updated to ${COLUMNS.find((c) => c.id === newStatus)?.label}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      fetchData();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await tasksAPI.delete(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleMemberAdded = (updatedProject) => {
    setProject(updatedProject);
  };

  if (loading) return <LoadingSpinner text="Loading project..." />;
  if (!project) return null;

  const overdueCount = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button + Header */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="page-title">{project.name}</h1>
            {project.description && (
              <p className="page-subtitle mt-1 max-w-xl">{project.description}</p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {isAdmin && (
              <>
                <button onClick={() => setShowAddMember(true)} className="btn-secondary">
                  <UserPlus size={15} /> Add Member
                </button>
                <button onClick={() => setShowCreateTask(true)} className="btn-primary">
                  <Plus size={15} /> New Task
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Project meta */}
      <div className="flex flex-wrap gap-4">
        {/* Members */}
        <div className="card px-4 py-3 flex items-center gap-3">
          <Users size={16} className="text-gray-400" />
          <div className="flex -space-x-2">
            {project.members?.slice(0, 5).map((m) => (
              <div
                key={m._id}
                title={`${m.name} (${m.role})`}
                className="w-7 h-7 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center"
              >
                <span className="text-primary text-[10px] font-bold">
                  {m.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {project.members?.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-gray-500 text-[10px] font-bold">
                  +{project.members.length - 5}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {project.members?.length} member{project.members?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Task counts */}
        <div className="card px-4 py-3 flex items-center gap-3 text-sm text-gray-600">
          <ListTodo size={16} className="text-gray-400" />
          <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Overdue alert */}
        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 bg-danger/10 text-danger rounded-xl text-sm font-medium border border-danger/20">
            <AlertTriangle size={15} />
            {overdueCount} overdue task{overdueCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <div key={col.id} className="min-w-[280px] flex-1">
              <KanbanColumn
                column={col}
                tasks={tasksByStatus[col.id] || []}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Members section */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-primary" />
          <h2 className="font-semibold text-gray-900">Team Members</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {project.members?.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">
                  {member.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                <p className="text-xs text-gray-500 truncate">{member.email}</p>
              </div>
              <span className={member.role === 'admin' ? 'badge-admin' : 'badge-member'}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        projectId={id}
        members={project.members || []}
        onCreated={handleTaskCreated}
      />
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        projectId={id}
        onAdded={handleMemberAdded}
      />
    </div>
  );
};

export default ProjectDetailsPage;
