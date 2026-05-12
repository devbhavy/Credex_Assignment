import { BrowserRouter, Route, Routes } from "react-router"
import Landing from "./pages/Landing"
import CreateAudit from "./pages/CreateAudit"
import ViewAudit from "./pages/ViewAudit"


export default function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/audit/create" element={<CreateAudit />} />
          <Route path="/audit/:token" element={<ViewAudit />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}