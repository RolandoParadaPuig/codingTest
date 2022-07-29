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
  // react hooks to set states
  const [option, setOption] = useState([]);
  const [task, setTask] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  // delete function for the user to delete tasks
  const delItem = (index) => {
    setOption(option.filter((item) => item != option[index]));
  };
  // add function for the user to input new tasks
  const addNewTask = (task) => {
    if (task != "") {
      setOption([...option, task]);
      setTask("");
      form.resetFields();
    }
  };
  // function to set the states needed
  const addingTask = (e) => setTask(e.target.value);
  const onTitleChange = (e) => setTaskTitle(e.target.value);

  // funtion to store the new tasks list
  const generateNewTaskList = async (values) => {
    console.log(values);
    const userName = auth.currentUser.displayName;
    // task list reference
    const taskRef = doc(db, "user", userName, "taskList", values.taskTitle);
    // dinamic storage of the tasks
    option.length != 0
      ? // individualy storage the tasks
        option.map(async (taskElem) => {
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
        })
      : message.error("Add at least one task");
    setCreateNewTask(false);
    message.success("Task List Generated");
  };
  // form initail values
  const initValues = {
    taskTitle: taskTitle,
  };
  const [form] = Form.useForm();
  useEffect(() => {}, [task]);
  return (
    // New Task List creation form
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
          {/* task List title input */}
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
          {/* rendering the tasks selected by the user */}
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
          {/* tasks input */}
          <Form.Item name={"newTask"}>
            <Input placeholder="New task" value={task} onChange={addingTask} />
          </Form.Item>
          {/* adding new tasks to the options arr */}
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
          {/* create task list button */}
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
