
import React, { useState, useEffect } from 'react';
import { Flex, Layout, Pagination, Button, Divider, List} from 'antd';
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
  gap: '5px'
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
const [userIds, setUserIds] = useState<Number[]>([]);
const [choseUser, setChoseUser] = useState<Number>(1);

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

function handleChooseUser(id: Number) {
    setChoseUser(id);
}

return (
  <main>
    <Layout>
      <Header style={headerStyle}>
        <p>Choose User: </p>
        <Flex wrap="wrap" gap="small">
            {userIds.map((id: any) => (
              <Button key={id} onClick={()=>handleChooseUser(id)} type={`${id === choseUser? 'primary' : ''}`}>{id}</Button>
            ))}
        </Flex>
      </Header>
      <Content style={contentStyle}>
        <Divider orientation="center">User {`${choseUser}`} Tasks</Divider>
          <List
          bordered
          dataSource={taskList.filter((task: Task) => task.userId === choseUser).map((task: Task) => task)}
          renderItem={(item) => (
            <List.Item>
              <div className={`flex items-center gap-5`}>
                {item.title}
                {item.completed? <BsCheckLg/> : <></>}
              </div>
              <div className={`flex gap-4`}>
                <Button>Edit</Button>
                <Button>Delete</Button>
              </div>
            </List.Item>
          )}
        />
      </Content>
      <Footer style={footerStyle}></Footer>
    </Layout>
  </main>
)
}
