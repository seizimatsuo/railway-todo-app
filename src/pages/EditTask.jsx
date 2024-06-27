import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { url } from '../const';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './editTask.scss';

export const EditTask = () => {
  const navigation = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [limit, setLimit] = useState({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minutes: 0,
  });
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done');
  const handleLimitChange = (e) => {
    const { name, value } = e.target;
    setLimit((prevLimit) => ({
      ...prevLimit,
      [name]: value,
    }));
  };
  const onUpdateTask = () => {
    console.log(isDone);
    const limitDate = new Date(limit.year, limit.month - 1, limit.day, limit.hour, limit.minutes);
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: limitDate,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigation('/');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigation('/');
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setIsDone(task.done);
        const limitDate = new Date(task.limit);
        setLimit({
          year: limitDate.getFullYear(),
          month: limitDate.getMonth() + 1,
          day: limitDate.getDate(),
          hour: limitDate.getHours(),
          minutes: limitDate.getMinutes(),
          seconds: limitDate.getSeconds(),
        });
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, [cookies.token, listId, taskId]);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>期限</label>
          <br />
          <input
            type="text"
            name="year"
            onChange={handleLimitChange}
            value={limit.year}
            className="new-task-limit"
          />
          <label>年</label>
          <input
            type="text"
            name="month"
            onChange={handleLimitChange}
            value={limit.month}
            className="new-task-limit"
          />
          <label>月</label>
          <input
            type="text"
            name="day"
            onChange={handleLimitChange}
            value={limit.day}
            className="new-task-limit"
          />
          <label>日</label>
          <input
            type="text"
            name="hour"
            onChange={handleLimitChange}
            value={limit.hour}
            className="new-task-limit"
          />
          <label>時</label>
          <input
            type="text"
            name="minutes"
            onChange={handleLimitChange}
            value={limit.minutes}
            className="new-task-limit"
          />
          <label>分</label>
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button type="button" className="delete-task-button" onClick={onDeleteTask}>
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={async () => {
              await onUpdateTask();
              console.log(limit);
            }}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
