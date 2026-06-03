import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";

function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main
        className="
    flex-1
    bg-slate-50
    min-h-screen
  "
      >
        <Navbar />

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;