import { Route } from "react-router-dom";

import RequireAuth from "../../features/auth/context/RequireAuth";
import { ROUTES } from "./routePaths";
import PrivateLayout from "../../features/shared/components/PrivateLayout";
import ChatPage from "../../pages/private/ChatPage";


const PrivateRoutes = () => {
    return (
        <>
            <Route path="/">
                <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />}>
                    <Route element={<PrivateLayout />}>
                        <Route path={ROUTES.CHAT} element={<ChatPage />} />
                    </Route>
                </Route>
                <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
                    <Route element={<PrivateLayout />}>
                    </Route>
                </Route> 
            </Route>
        </>
    );
};

export default PrivateRoutes;