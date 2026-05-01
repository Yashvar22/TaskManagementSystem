import { useNavigate } from 'react-router-dom';
import { Users, Calendar, ArrowRight, Clock } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const memberCount = project.members?.length || 0;
  const created = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Generate a consistent gradient based on project name
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-violet-500 to-pink-600',
    'from-amber-500 to-orange-600',
  ];
  const gradientIndex =
    project.name.charCodeAt(0) % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      className="card-hover cursor-pointer group animate-fade-in overflow-hidden"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      {/* Color header strip */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Project initial avatar */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shadow-sm`}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <ArrowRight
            size={16}
            className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
          />
        </div>

        {/* Title & description */}
        <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
          {project.description || 'No description provided'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Users size={13} />
            <span>
              {memberCount} member{memberCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock size={12} />
            <span>{created}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
