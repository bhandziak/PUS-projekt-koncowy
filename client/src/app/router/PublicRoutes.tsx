import { Route } from "react-router-dom";
import { ROUTES } from "./routePaths";

// import LoginPage from "../../pages/public/LoginPage";
// import RegisterPage from "../../pages/public/RegisterPage";
import DefaultPage from "../../pages/public/error/DefaultPage";
import ForbiddenPage from "../../pages/public/error/ForbiddenPage";
import UnauthorizedPage from "../../pages/public/error/UnauthorizedPage";
import HomePage from "../../pages/public/HomePage";

const PublicRoutes = () => {
    return (
        <>
            {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> */}
            <Route path={ROUTES.HOME} element={<HomePage />} />

            { /* 404 page */}
            <Route path={ROUTES.NOT_FOUND} element={<DefaultPage />} />

            { /* 403 page */}
            <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />

            { /* 401 page */}
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        </>
    );
};

export default PublicRoutes;