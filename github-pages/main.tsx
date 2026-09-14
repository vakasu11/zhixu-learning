import React from "react";
import ReactDOM from "react-dom/client";
import { StudyWorkspace } from "@/components/study-workspace";
import "@/app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StudyWorkspace />
  </React.StrictMode>,
);
