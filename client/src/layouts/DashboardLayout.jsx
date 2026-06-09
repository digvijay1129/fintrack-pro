import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";

function DashboardLayout({ children }) {
  return (
    <div
      style={{ display: "flex" }}
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
      "
    >
      <Sidebar />

      <main
        className="
          flex-1
          min-h-screen
          bg-slate-50
          text-slate-900
          dark:bg-slate-900
          dark:text-white
        "
      >
        <Navbar />

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;