import React, { useEffect, useState } from "react";
import app from "../../firebase/firebaseConfig";
import { Button, Col, Layout, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getAuth } from "firebase/auth";
import "./dashboard.css";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { Task } from "../task/Task";
import { CreateTasks } from "../createTasks/CreateTasks";
const db = getFirestore(app);
const auth = getAuth(app);
const { Header, Footer, Sider, Content } = Layout;
export const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [createNewTask, setCreateNewTask] = useState(false);
  const getLogedUser = async () => {
    const q = query(
      collection(db, "user"),
      where("email", "==", auth.currentUser.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      auth.currentUser.displayName = doc.data().userName;
      setUserName(doc.data().userName);
    });
  };
  getLogedUser();

  const createTask = () => {
    setCreateNewTask(!createNewTask);
  };

  useEffect(() => {}, [userName]);
  return (
    <Layout className="layout">
      {/* Header of the app */}
      <Header>
        <Row justify="space-between">
          {/* state used to render the user name on the title of the app */}
          <Col xs={20}>
            <h1 className="task__list__title">
              <span className="task__list__media">{userName}'s </span> Task List
            </h1>
          </Col>
          <Col xs={2}>
            <Button onClick={createTask} type="link" size="large">
              <PlusOutlined />
            </Button>
          </Col>
        </Row>
      </Header>

      {/* Main content of the app */}
      <Content>
        <div className="dashboard__content__container">
          {/* render the task Components or the create task form*/}
          {createNewTask ? (
            <CreateTasks setCreateNewTask={setCreateNewTask} />
          ) : userName == auth.currentUser.displayName ? (
            <Task userName={userName} />
          ) : null}
        </div>
      </Content>

      {/* footer of the app, My LinkedIn profile */}
      <Footer>
        <Row>
          <Col>
            <span>
              <span className="task__list__media">Task List</span> created by{" "}
            </span>
            <a
              href="https://www.linkedin.com/in/rolando-parada-puig/"
              target="_blank"
            >
              Rolando Parada Puig
            </a>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};
