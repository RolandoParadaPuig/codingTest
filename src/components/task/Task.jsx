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
import { AuthLoader } from "../AuthLoader";
const db = getFirestore(app);
const auth = getAuth(app);

export const Task = (props) => {
  // userName passed for props
  const userName = props.userName;
  // all the used react state hooks
  const [titleArr, setTitleArr] = useState([]);
  const [tasks, setTasks] = useState({});
  const [task, setTask] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  // aux arrays
  let auxArr = [];
  let auxTasksArr = [];

  // funtion to delete tasks from the task list on firestore
  const delItem = async (element, tasksListTitle) => {
    // document reference
    const taskLstRef = doc(db, "user", userName, "taskList", tasksListTitle);

    // delete field async call
    await updateDoc(taskLstRef, {
      [element]: deleteField(),
    }).then(() => {});
  };

  // funtion to delete Task list document on firestore
  const deleteTaskList = async (tasksListTitle) => {
    // document reference
    const delTaskListRef = doc(
      db,
      "user",
      userName,
      "taskList",
      tasksListTitle
    );
    // delete document async call
    await deleteDoc(delTaskListRef);
  };

  // function to change the task status
  const aprooveTask = async (task, bool, tasksListTitle) => {
    // task list document reference
    const taskLstRef = doc(db, "user", userName, "taskList", tasksListTitle);
    // async change of the task status
    await setDoc(taskLstRef, { [task]: !bool }, { merge: true });
  };

  // task list colection reference
  const q = query(collection(db, "user", userName, "taskList"));
  // real time listening for changes on the colection to render the tasks status/delet etc.
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

  // function to generate new Tasks on the selected task List
  const sendTask = async (values) => {
    values.title = selectedTitle;
    console.log(task, selectedTitle);
    // task List document reference
    const taskRef = doc(db, "user", userName, "taskList", selectedTitle);
    // async update of the task list document to storage new tasks
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

  // function te set the task state with the user input char
  const onTaskChange = (e) => setTask(e.target.value);
  // function to open/close the form modal to add tasks
  const addTask = (values) => {
    setSelectedTitle(values);
    setShowForm(!showForm);
  };
  const [form] = Form.useForm();
  useEffect(() => {
    console.log(tasks);
  }, [userName]);

  return (
    // Dinamic Render of the Tasks Lists depending of the information stored on the firestore database
    <div className="tasks__container">
      {/* rendering the components depending on the information stored on titleArr */}
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
            {/* once rendered the main blocks the app renders the list of tasks with the information stored on the tasks state */}
            {tasks.map((tasksList) => {
              {
                /* ternary operator used to ensure the app renders only the information it needs */
              }
              return tasksList.id == tasksTitle ? (
                <ul key={`orderList-${tasksTitle}`}>
                  {/* rendering each task element */}
                  {Object.keys(tasksList.data()).map((element) => {
                    return (
                      <li
                        className="task__list__text"
                        key={`task${Object.keys(tasksList.data()).indexOf(
                          element
                        )}`}
                      >
                        <div>
                          {/* rendering the checked/non checked icon depending if the task is completed or not */}
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
                          {/* render of the task */}
                          {element}
                        </div>
                        <div className="task__list__del_item">
                          {" "}
                          {/* delet button to delete the task the user whants */}
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
                {/* Open the form "modal" to acces the form for adding more tasks */}
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
      {/* form Modal to add more tasks to the selected task list */}
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
