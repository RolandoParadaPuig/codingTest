import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const AuthLoader = () => (
  <div className="auth-loader">
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: "4em",
          }}
          spin
        />
      }
    />{" "}
  </div>
);
