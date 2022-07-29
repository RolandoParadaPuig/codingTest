import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import app from "../../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
const db = getFirestore(app);

export const UserInfo = () => {
  const navigate = useNavigate();
  const onUserSelected = async (values) => {
    // adding the UserName to the new user
    await setDoc(doc(db, "user", values.userName), {
      userName: values.userName,
      email: auth.currentUser.email,
    }).then(() => {
      console.log("hello");
      message.success("Sucssessfully sign up");
      navigate(`/login`);
    });
  };

  const onFailedUserSelected = (errorInfo) => {
    message.error("You need to Set a User Name");
  };
  return (
    // UserName Setup form for the new users
    <Form onFinish={onUserSelected} onFinishFailed={onFailedUserSelected}>
      <Row justify="center">
        <Col span={24} className="user__info__label">
          <span>Select a User Name</span>
        </Col>
        <Col xs={22} sm={20} md={12} lg={8} xl={6} className={"login__style"}>
          <Form.Item
            name={"userName"}
            id="userName"
            rules={[
              {
                required: true,
                message: "Input between 3 and 15 characters",
                max: 15,
                min: 3,
              },
            ]}
          >
            <Input placeholder="User Name" />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Confirm
            </Button>{" "}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
