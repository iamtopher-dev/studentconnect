import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import RouteLoader from "./services/RouteLoader";

function App() {
    return (
        <BrowserRouter>
            <RouteLoader />
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
