import { Check, Edit2, Plus, Trash2, X, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import type { Workspace } from '../../store/slices/workspaceSlice';
import {
  clearWorkspace,
  createWorkspace,
  deleteWorkspace,
  renameWorkspace,
  setActiveWorkspace
} from '../../store/slices/workspaceSlice';
import { Input } from '../ui/input';

export const WorkspaceTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { workspaces, activeWorkspaceId } = useAppSelector((state) => state.workspace);
  const { isDarkMode } = useDarkMode();

  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      dispatch(createWorkspace({ name: newWorkspaceName.trim() }));
      setNewWorkspaceName('');
      setIsCreating(false);
    }
  };

  const handleRenameWorkspace = (id: string) => {
    if (editingName.trim()) {
      dispatch(renameWorkspace({ id, name: editingName.trim() }));
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteWorkspace = (id: string) => {
    if (workspaces.length > 1 && window.confirm('Bu çalışma alanını silmek istediğinizden emin misiniz?')) {
      dispatch(deleteWorkspace(id));
    }
  };

  const handleClearWorkspace = (id: string) => {
    if (window.confirm('Bu çalışma alanındaki tüm çizimleri temizlemek istediğinizden emin misiniz?')) {
      dispatch(clearWorkspace(id));
    }
  };

  const startEditing = (workspace: Workspace) => {
    setEditingId(workspace.id);
    setEditingName(workspace.name);
  };

  return (
    <div className={`
      flex items-center gap-1 px-3 py-2 border-b
      ${isDarkMode
        ? 'bg-gray-900 border-gray-700'
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Existing Workspace Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto flex-1">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            onClick={() => dispatch(setActiveWorkspace(workspace.id))}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              cursor-pointer min-w-0 relative group
              ${workspace.id === activeWorkspaceId
                ? isDarkMode
                  ? 'bg-gray-700 text-white border-l-2 border-blue-400'
                  : 'bg-gray-100 text-gray-900 border-l-2 border-blue-500'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {editingId === workspace.id ? (
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameWorkspace(workspace.id);
                    if (e.key === 'Escape') {
                      setEditingId(null);
                      setEditingName('');
                    }
                  }}
                  onBlur={() => handleRenameWorkspace(workspace.id)}
                  className="h-7 text-sm min-w-[100px]"
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameWorkspace(workspace.id);
                  }}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(null);
                    setEditingName('');
                  }}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full min-w-0">
                <span className="truncate font-medium flex-1">
                  {workspace.name}
                </span>

                {/* Workspace Stats */}
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {workspace.nodes.length}N {workspace.edges.length}E
                </div>

                {workspace.id === activeWorkspaceId && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(workspace);
                      }}
                      className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      title="Yeniden adlandır"
                    >
                      <Edit2 size={12} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearWorkspace(workspace.id);
                      }}
                      className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      title="Temizle"
                    >
                      <Trash2 size={12} />
                    </button>

                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkspace(workspace.id);
                        }}
                        className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        title="Sil"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Workspace Creation */}
      {isCreating ? (
        <div className="flex items-center gap-2">
          <Input
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Çalışma alanı adı..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateWorkspace();
              if (e.key === 'Escape') {
                setIsCreating(false);
                setNewWorkspaceName('');
              }
            }}
            className="h-8 text-sm w-40"
            autoFocus
          />
          <button
            onClick={handleCreateWorkspace}
            className={`h-8 px-2 rounded-md transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Check size={14} />
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewWorkspaceName('');
            }}
            className={`h-8 px-2 rounded-md transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <XIcon size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className={`
            h-8 px-3 flex items-center gap-2 text-sm font-medium rounded-md transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${isDarkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 focus:ring-gray-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 focus:ring-gray-300'
            }
          `}
          title="Yeni çalışma alanı"
        >
          <Plus size={14} />
          <span>Yeni</span>
        </button>
      )}
    </div>
  );
};
