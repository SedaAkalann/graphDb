import { Footer } from "./Footer";
import { Header } from "./Header";


interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col ">
      <Header />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};