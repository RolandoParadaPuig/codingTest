import { Tabs } from "antd";
import React from "react";
import { Login } from "../login/Login";
import { Signup } from "../signup/Signup";

import "./authBody.css";
const { TabPane } = Tabs;
export const AuthBody = () => {
  return (
    <Tabs defaultActiveKey="1" centered className="auth__tabs">
      <TabPane tab="Login" key="1">
        <Login />
      </TabPane>
      <TabPane tab="Sign Up" key="2">
        <Signup />
      </TabPane>
    </Tabs>
  );
};
