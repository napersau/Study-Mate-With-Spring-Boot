import { useRoutes } from "react-router-dom";
import routes from "./routes";
import './App.css';

function App() {
  const element = useRoutes(routes);

  return (
    <div className="min-h-screen bg-gray-50">
      {element}
    </div>
  );
}

export default App;