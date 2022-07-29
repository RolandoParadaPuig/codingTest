import React, { useEffect, useState } from "react";
import {
  CheckSquareOutlined,
  BorderOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import {
  collection,
  getDocs,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  query,
  deleteDoc,
  where,
} from "firebase/firestore";
import app from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import "./task.css";
const db = getFirestore(app);
const auth = getAuth(app);

export const Task = (props) => {
  const userName = props.userName;
  const [titleArr, setTitleArr] = useState([]);
  const [tasks, setTasks] = useState({});
  const [task, setTask] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  let auxArr = [];
  let auxTasksArr = [];
  const onTaskChange = (e) => setTask(e.target.value);

  const delItem = async (element, tasksListTitle) => {
    const taskLstRef = doc(db, "user", userName, "taskList", tasksListTitle);
    await updateDoc(taskLstRef, {
      [element]: deleteField(),
    }).then(() => {});
  };
  const deleteTaskList = async (tasksListTitle) => {
    const delTaskListRef = doc(
      db,
      "user",
      userName,
      "taskList",
      tasksListTitle
    );
    await deleteDoc(delTaskListRef);
  };
  const aprooveTask = async (task, bool, tasksListTitle) => {
    const taskLstRef = doc(db, "user", userName, "taskList", tasksListTitle);
    setDoc(taskLstRef, { [task]: !bool }, { merge: true });
  };
  const q = query(collection(db, "user", userName, "taskList"));
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      auxArr.push(doc.id);
      auxTasksArr.push(doc);
    });
    setTitleArr(auxArr);
    setTasks(auxTasksArr);
    auxArr = [];
    auxTasksArr = [];
  });
  const sendTask = async (values) => {
    values.title = selectedTitle;
    console.log(task, selectedTitle);
    const taskRef = doc(db, "user", userName, "taskList", selectedTitle);
    await setDoc(
      taskRef,
      {
        [task]: false,
      },
      { merge: true }
    )
      .then(() => {})
      .catch((error) => {
        console.log("error");
      });
    message.success("Task Generated");
    setTask("");
    form.resetFields();
  };
  const addTask = (values) => {
    setSelectedTitle(values);
    setShowForm(!showForm);
  };
  const [form] = Form.useForm();
  useEffect(() => {
    console.log(tasks);
  }, [userName]);

  return (
    <div className="tasks__container">
      {titleArr.map((tasksTitle) => {
        return (
          <div
            key={titleArr.indexOf(tasksTitle) + 1}
            className="tasks__list_container"
          >
            <h3 className="tasks__list_title">
              {tasksTitle}{" "}
              <CloseOutlined
                onClick={() => {
                  deleteTaskList(tasksTitle);
                }}
              />
            </h3>
            {tasks.map((tasksList) => {
              return tasksList.id == tasksTitle ? (
                <ul key={`orderList-${tasksTitle}`}>
                  {Object.keys(tasksList.data()).map((element) => {
                    return (
                      <li
                        className="task__list__text"
                        key={`task${Object.keys(tasksList.data()).indexOf(
                          element
                        )}`}
                      >
                        <div>
                          {tasksList.data()[element] ? (
                            <CheckSquareOutlined
                              onClick={() => {
                                aprooveTask(
                                  element,
                                  tasksList.data()[element],
                                  tasksTitle
                                );
                              }}
                            />
                          ) : (
                            <BorderOutlined
                              onClick={() => {
                                aprooveTask(
                                  element,
                                  tasksList.data()[element],
                                  tasksTitle
                                );
                              }}
                            />
                          )}{" "}
                          {element}
                        </div>
                        <div className="task__list__del_item">
                          {" "}
                          <DeleteOutlined
                            onClick={() => {
                              delItem(element, tasksTitle);
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null;
            })}
            <Row justify="end">
              <Col xs={4}>
                <Button
                  type="link"
                  onClick={() => {
                    addTask(tasksTitle);
                  }}
                >
                  <PlusOutlined />
                </Button>
              </Col>
            </Row>
          </div>
        );
      })}
      {showForm ? (
        <div className={"add__task__form"} id={"addTaskForm"}>
          <h3>
            {selectedTitle}{" "}
            <CloseOutlined
              onClick={() => {
                addTask();
              }}
            />
          </h3>
          <Form onFinish={sendTask} form={form}>
            <Row>
              <Col xs={0}>
                <Form.Item name={"title"} value={selectedTitle}>
                  <Input value={selectedTitle} />
                </Form.Item>
              </Col>
              <Col xs={20}>
                <Form.Item
                  name={"task"}
                  value={task}
                  onChange={onTaskChange}
                  rules={[{ required: true, message: "Input your Task" }]}
                >
                  <Input size="small" />
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Button type="link" htmlType="submit">
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      ) : null}
    </div>
  );
};
