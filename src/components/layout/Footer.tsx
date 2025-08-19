export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 flex-shrink-0">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2025 Graph DB UI</span>
            <span className="text-gray-400">|</span>
            <span>Ready to query</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span>Nodes:</span>
              <span className="font-medium text-indigo-600">0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Edges:</span>
              <span className="font-medium text-emerald-600">0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Status:</span>
              <span className="font-medium text-amber-600">Query Mode</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};