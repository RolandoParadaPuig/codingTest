import React from "react";
import { Button, Checkbox, Form, Input, Row, message, Col } from "antd";
import { UserAddOutlined, LockOutlined } from "@ant-design/icons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

export const Signup = (props) => {
  // react hook passed with props to used on this component
  const setNewUserEmail = props.setNewUserEmail;
  // ract router navigation function
  const navigate = useNavigate();

  // sign up async function
  const onSignupSuccess = async (values) => {
    // async auth sign up from firebase auth
    await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // seting the state with the email given by the user
        setNewUserEmail(user.email);
        message.success("successfully signed up " + user.email);
        // navigation to set the user UserName
        navigate(`/login/userInfo`);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const onSignUpFailed = (errorInfo) => {
    message.error("Email/Password Incorrect");
  };
  return (
    // Sign Up Form
    <Form onFinish={onSignupSuccess} onFinishFailed={onSignUpFailed}>
      <div className="auth__user_icon">
        <UserAddOutlined />
      </div>
      <Row justify="center">
        <Col xs={22} sm={20} md={12} lg={8} xl={6} className={"login__style"}>
          {/* email input */}
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
          {/* password Input */}
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
          {/* sign up button */}
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
