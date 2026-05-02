import DocumentsPage from "../pages/DocumentsPage";
{/* <Route path="/app/documents" element={<DocumentsPage />} />; */}
import Dashboard from "@/pages/Dashboard";
import NotesPage from "@/pages/NotesPage";

export const appRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "notes",
    element: <NotesPage />,
  },
  {
    path:"documents",
    element:<DocumentsPage />
  }
];
