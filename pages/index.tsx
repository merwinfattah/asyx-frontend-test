
import React, { useState, useEffect } from 'react';
import { Flex, Layout, Pagination, Button, Divider, List, Modal, Form, Input} from 'antd';
import axios from 'axios';
import {BsCheckLg} from 'react-icons/bs';

const { Header, Footer, Content } = Layout;

type Task = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',     // Vertically center the content
  justifyContent: 'center', // Horizontally center the content
  textAlign: 'center',
  color: '#fff',
  height: 64,
  padding: '15px',
  backgroundColor: '#7dbcea',
  gap: '5px',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: '100vh',
  color: '#fff',
  backgroundColor: '#108ee9',
  padding: '50px'
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};


export default function Home() {
  
const [taskList, setTaskList] = useState<Task[]>([]);
const [userIds, setUserIds] = useState<number[]>([]);
const [choseUser, setChoseUser] = useState<number>(1);
const [openModal, setModalOpen] = useState<boolean>(false);
const [editingTask, setEditingTask] = useState<any>(null);
const [editedTaskTitle, setEditedTaskTitle] = useState<string>('');
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const filteredTasks = taskList.filter((task) => task.userId === choseUser);
const startIdx = (currentPage - 1) * itemsPerPage;
const endIdx = startIdx + itemsPerPage;
const tasksToDisplay = filteredTasks.slice(startIdx, endIdx);


useEffect(()=>{
    const fetchDataTask = async () => {
      try {
        const tasks = await axios.get('https://jsonplaceholder.typicode.com/todos');
        const uniqueUserIds = new Set<number>();

        tasks.data.forEach((task : Task) => {
          uniqueUserIds.add(task.userId);
        })

        setUserIds(Array.from(uniqueUserIds));
        setTaskList(tasks.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDataTask();
},[]);

function handleChooseUser(id: number) {
    setChoseUser(id);
}

function handleDeleteTask(id: number) {
    const newTaskList = taskList.filter((task: Task) => task.id !== id);
    setTaskList(newTaskList);
}

function handleModalOpen() {
    setModalOpen(true);
}

function handleCancel() {
  setModalOpen(false);
};

function handleSubmit(values: any) {
  const largestId = Math.max(...taskList.map((task) => task.id));
  const newTask : Task = {
    userId: choseUser,
    id: largestId,
    title: values['Task Title'],
    completed: false
  }
  setTaskList((prev: Task[]) => [...prev, newTask]);
  setModalOpen(false);
}

const handleEditClick = (task: any) => {
  setEditingTask(task);
  setEditedTaskTitle(task?.title);
};

const handleEditSave = () => {
  // Find the task in the taskList and update its title
  const updatedTaskList = taskList.map((task) =>
    task.id === editingTask.id
      ? { ...task, title: editedTaskTitle }
      : task
  );

  // Update the taskList state with the edited task
  setTaskList(updatedTaskList);

  // Reset editing state
  setEditingTask(null);
  setEditedTaskTitle('');
};

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};


return (
  <main>
    <Layout>
      <Header style={headerStyle}>
        <p className={`hide-on-small`}>Choose User: </p>
        <Flex wrap="wrap" gap="small">
            {userIds.map((id: any) => (
              <Button key={id} onClick={()=>handleChooseUser(id)} type={id === choseUser? "primary" : "default"}>{id}</Button>
            ))}
        </Flex>
      </Header>
      <Content style={contentStyle}>
        <Divider orientation="center">User {`${choseUser}`} Tasks</Divider>
          <Button onClick={()=>handleModalOpen()} style={{marginBottom: '15px'}}>Add Task</Button>
          <List
          bordered
          dataSource={tasksToDisplay}
          renderItem={(item) => (
            <List.Item>
                {editingTask === item ? (
                  <div className={`flex items-center gap-5`}>
                    <input
                      type="text"
                      value={editedTaskTitle}
                      onChange={(e) => setEditedTaskTitle(e.target.value)}
                      className={`bg-transparent`}
                    />
                    <div className={`flex gap-4`}>
                      <Button onClick={handleEditSave}>Save</Button>
                      <Button onClick={() => handleEditClick(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    {item.title}
                    {item.completed ? <BsCheckLg /> : <></>}
                  </div>
                )}
                <div className={`flex gap-4 hide-on-small`}>
                  <Button onClick={() => handleEditClick(item)}>Edit</Button>
                  <Button onClick={()=>handleDeleteTask(item.id)}>Delete</Button>
                </div>
            </List.Item>
          )}
        />
      </Content>
      <Footer style={footerStyle}>
          <Pagination
            current={currentPage}
            total={filteredTasks.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
      </Footer>
      {openModal && (
      <Modal
        open={openModal}
        title="Add New Task"
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          style={{  padding: '10px', alignItems: 'center'}}
          onFinish={handleSubmit}
        >
          <Form.Item<'Text'>
            label="Task Title"
            name="Task Title"
            rules={[{ required: true, message: 'Please input your task title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Button htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>)}
    </Layout>
  </main>
)
}
