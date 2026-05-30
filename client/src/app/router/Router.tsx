import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import AuthProvider from "../providers/AuthProvider";
import RoomProvider from "../providers/RoomProvider";
import ChatProvider from "../providers/ChatProvider";
import { Outlet } from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
              {PublicRoutes()}
              <Route element={
                <RoomProvider>
                  <ChatProvider>
                  <Outlet />
                  </ChatProvider>
                </RoomProvider>
                }>
                {PrivateRoutes()}
            </Route>
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
