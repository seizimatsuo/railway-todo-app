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
  const [limitYear, setLimitYear] = useState(0);
  const [limitMonth, setLimitMonth] = useState(0);
  const [limitDay, setLimitDay] = useState(0);
  const [limitHour, setLimitHour] = useState(0);
  const [limitMinutes, setLimitMinutes] = useState(0);
  const [limitSeconds, setLimitSeconds] = useState(0);
  const [limit, setLimit] = useState(
    new Date(limitYear, limitMonth, limitDay, limitHour, limitMinutes, limitSeconds)
  );
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done');
  const handleLimitChange = () => {
    setLimit(new Date(limitYear, limitMonth - 1, limitDay, limitHour, limitMinutes, limitSeconds));
  };
  const handleLimitYearChange = (e) => {
    setLimitYear(e.target.value);
    handleLimitChange();
  };
  const handleLimitMonthChange = (e) => {
    setLimitMonth(e.target.value);
    handleLimitChange();
  };
  const handleLimitDayChange = (e) => {
    setLimitDay(e.target.value);
    handleLimitChange();
  };
  const handleLimitHourChange = (e) => {
    setLimitHour(e.target.value);
    handleLimitChange();
  };
  const handleLimitMinutesChange = (e) => {
    setLimitMinutes(e.target.value);
    handleLimitChange();
  };
  const handleLimitSecondsChange = (e) => {
    setLimitSeconds(e.target.value);
    handleLimitChange();
  };
  const onUpdateTask = () => {
    console.log(isDone);
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: limit,
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
        setLimitYear(limitDate.getFullYear());
        setLimitMonth(limitDate.getMonth() + 1);
        setLimitDay(limitDate.getDate());
        setLimitHour(limitDate.getHours());
        setLimitMinutes(limitDate.getMinutes());
        setLimitSeconds(limitDate.getSeconds());
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
            onChange={handleLimitYearChange}
            value={limitYear}
            className="new-task-limit"
          />
          <label>年</label>
          <input
            type="text"
            onChange={handleLimitMonthChange}
            value={limitMonth}
            className="new-task-limit"
          />
          <label>月</label>
          <input
            type="text"
            onChange={handleLimitDayChange}
            value={limitDay}
            className="new-task-limit"
          />
          <label>日</label>
          <input
            type="text"
            onChange={handleLimitHourChange}
            value={limitHour}
            className="new-task-limit"
          />
          <label>時</label>
          <input
            type="text"
            onChange={handleLimitMinutesChange}
            value={limitMinutes}
            className="new-task-limit"
          />
          <label>分</label>
          <input
            type="text"
            onChange={handleLimitSecondsChange}
            value={limitSeconds}
            className="new-task-limit"
          />
          <label>秒</label>
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
              await handleLimitChange();
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
