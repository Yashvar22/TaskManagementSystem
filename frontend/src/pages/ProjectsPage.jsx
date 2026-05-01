import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Plus, FolderKanban, AlertTriangle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Project name is required';
    else if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';
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
      const res = await projectsAPI.create({ name: form.name.trim(), description: form.description.trim() });
      toast.success('Project created! 🎉');
      onCreated(res.data.data.project);
      setForm({ name: '', description: '' });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="label">Project Name <span className="text-danger">*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="e.g. E-Commerce Platform"
            autoFocus
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="label">Description <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
            placeholder="What is this project about?"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={16} /> Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await projectsAPI.getAll();
        setProjects(res.data.data.projects);
        setFiltered(res.data.data.projects);
      } catch {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    );
  }, [search, projects]);

  const handleCreated = (project) => {
    setProjects((p) => [project, ...p]);
  };

  if (loading) return <LoadingSpinner text="Loading projects..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            {projects.length} project{projects.length !== 1 ? 's' : ''} you're a member of
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <FolderKanban size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            {isAdmin
              ? "Create your first project and invite team members to get started."
              : "You haven't been added to any projects yet. Ask your admin to add you."}
          </p>
          {isAdmin && (
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus size={16} /> Create First Project
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <Search size={32} className="text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No projects match "{search}"</p>
          <button onClick={() => setSearch('')} className="btn-ghost btn-sm mt-2">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default ProjectsPage;
