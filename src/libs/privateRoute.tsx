import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { store } from "../store";

type PrivateRouteProps = {
  children: React.ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const isLoggedIn = store.getState().user.isLoggedIn;

  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
