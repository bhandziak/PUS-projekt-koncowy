import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import AuthProvider from "../providers/AuthProvider";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
              {PublicRoutes()}
              {PrivateRoutes()}
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
