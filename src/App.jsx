import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import MenuBar from "./components/MenuBar";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import Locations from "./components/Locations";
import LandingPage from "./components/LandingPage";
import Preview from "./components/Preview";
import AskGPT from "./components/AskGPT";
import PageNotFound from "./components/PageNotFound"; // Import your custom 404 component
import "./App.css";

function App() {
  const pages = [
    { path: "/", component: <LandingPage /> },
    { path: "/Projects", component: <Projects /> },
    { path: "/Project/:projectId", component: <Locations /> },
    { path: "/Project/Preview/:projectId", component: <Preview /> },
    { path: "*", component: <PageNotFound /> },
  ];

  return (
    <Router>
      <MenuBar />

      <Box sx={{ padding: 2 }}>
        <Routes>
          {pages.map((page, index) => (
            <Route key={index} path={page.path} element={page.component} />
          ))}
        </Routes>
      </Box>

      <AskGPT />

      <Box sx={{ width: "100%", position: "relative", left: 0 }}>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
