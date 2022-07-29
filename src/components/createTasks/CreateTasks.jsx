import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  BorderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row } from "antd";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import app from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
const db = getFirestore(app);
const auth = getAuth(app);
import "./createTask.css";

export const CreateTasks = (props) => {
  const setCreateNewTask = props.setCreateNewTask;
  const [option, setOption] = useState([]);
  const [task, setTask] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const delItem = (index) => {
    setOption(option.filter((item) => item != option[index]));
  };
  const addNewTask = (task) => {
    if (task != "") {
      setOption([...option, task]);
      setTask("");
      form.resetFields();
    }
  };

  const addingTask = (e) => setTask(e.target.value);
  const onTitleChange = (e) => setTaskTitle(e.target.value);
  const generateNewTaskList = async (values) => {
    console.log(values);
    const userName = auth.currentUser.displayName;
    const taskRef = doc(db, "user", userName, "taskList", values.taskTitle);
    option.length != 0
      ? option.map(async (taskElem) => {
          await setDoc(
            taskRef,
            {
              [taskElem]: false,
            },
            { merge: true }
          )
            .then(() => {})
            .catch((error) => {
              console.log("error");
            });
          message.success("Task List Generated");
          setCreateNewTask(false);
        })
      : message.error("Add at least one task");
  };
  const initValues = {
    taskTitle: taskTitle,
  };
  const [form] = Form.useForm();
  useEffect(() => {}, [task]);
  return (
    <Row justify="center" className="create__task__container">
      <Col xs={22}>
        <Form
          form={form}
          onFinish={generateNewTaskList}
          initialValues={initValues}
        >
          <div>
            <h3 className="create__task__title">Create Task List</h3>
          </div>
          <Form.Item
            name={"taskTitle"}
            rules={[{ required: true, message: "Input your Task List Title" }]}
          >
            <Input
              placeholder="Task Title"
              value={taskTitle}
              onChange={onTitleChange}
            />
          </Form.Item>

          <ul>
            {option.map((task) => {
              return (
                <li key={option.indexOf(task) + 1}>
                  <div className="task__list__item">
                    <div>
                      <BorderOutlined /> {task}
                    </div>
                    <div className="task__list__del_item">
                      <DeleteOutlined
                        onClick={() => {
                          delItem(option.indexOf(task));
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Form.Item name={"newTask"}>
            <Input placeholder="New task" value={task} onChange={addingTask} />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              onClick={() => {
                addNewTask(task);
              }}
            >
              add Task
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              create Task List
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
