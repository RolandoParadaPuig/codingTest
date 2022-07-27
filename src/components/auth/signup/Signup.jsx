import React from "react";
import { Button, Checkbox, Form, Input, Row, message, Col } from "antd";
import { UserAddOutlined, LockOutlined } from "@ant-design/icons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../../../firebase/firebaseConfig";
const auth = getAuth(app);
export const Signup = () => {
  const onSignupSuccess = async (values) => {
    await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        message.success("successfully signed up");
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.message);
        // ..
      });
  };

  const onSignUpFailed = (errorInfo) => {
    message.error("Email/Password Incorrect");
  };
  return (
    <Form onFinish={onSignupSuccess} onFinishFailed={onSignUpFailed}>
      <div className="auth__user_icon">
        <UserAddOutlined />
      </div>
      <Row justify="center">
        <Col xs={22} sm={20} md={12} lg={8} xl={6} className={"login__style"}>
          <Form.Item
            name={"email"}
            id="email"
            label={<UserAddOutlined />}
            rules={[
              {
                required: true,
                message: "Enter your Email",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name={"password"}
            label={<LockOutlined />}
            id="password"
            rules={[
              {
                required: true,
                message: "Enter your Password",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
