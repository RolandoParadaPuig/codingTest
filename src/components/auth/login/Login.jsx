import React from "react";
import { Button, Form, Input, Row, message, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import app from "../../../firebase/firebaseConfig";
const auth = getAuth(app);
const db = getFirestore(app);

export const Login = () => {
  // router navigation function
  const navigate = useNavigate();

  // login function
  const onLoginSucces = async (values) => {
    // login with browser session persistence
    await setPersistence(auth, browserSessionPersistence)
      .then(async () => {
        // firebase signin function
        await signInWithEmailAndPassword(auth, values.email, values.password)
          .then(async (userCredential) => {
            // Signed in
            // user document reference
            const q = query(
              collection(db, "user"),
              where("email", "==", values.email)
            );
            const user = userCredential.user;
            // reading the user doc
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // adding the userName to the corresponding current user
              auth.currentUser.displayName = doc.data().userName;
            });

            message.success("Welcome");
            navigate(`/`);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            message.error("Email or Password Incorrect");
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        message.error("Error");
      });
  };

  const onLoginFailed = (errorInfo) => {
    message.error("Enter your Email and Password");
  };

  return (
    // Login Form
    <Form onFinish={onLoginSucces} onFinishFailed={onLoginFailed}>
      <div className="auth__user_icon">
        <UserOutlined />
      </div>
      <Row justify="center">
        <Col xs={22} sm={20} md={12} lg={8} xl={6} className={"login__style"}>
          {/* email input */}
          <Form.Item
            name={"email"}
            id="email"
            label={<UserOutlined />}
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
          {/* password input */}
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
          {/* login button */}
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              login
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
