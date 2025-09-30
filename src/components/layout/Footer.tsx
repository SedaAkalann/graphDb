export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 ">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>© 2025 Graph DB UI</span>
            {/* tarih dinamik olacak */}
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <span>Ready to query</span>
          </div>
          {/* <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span>Nodes:</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Edges:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Status:</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">Query Mode</span>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};