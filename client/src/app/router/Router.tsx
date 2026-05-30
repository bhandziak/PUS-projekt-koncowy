import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import AuthProvider from "../providers/AuthProvider";
import RoomProvider from "../providers/RoomProvider";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoomProvider>
          <Routes>
              {PublicRoutes()}
                {PrivateRoutes()}
          </Routes>
        </RoomProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
