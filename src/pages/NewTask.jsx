import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header';
import './newTask.scss';
import { useNavigate } from 'react-router-dom';

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [limit, setLimit] = useState({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minutes: 0,
  });
  const [cookies] = useCookies();
  const navigation = useNavigate();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleLimitChange = (e) => {
    const { name, value } = e.target;
    setLimit((prevLimit) => ({
      ...prevLimit,
      [name]: value,
    }));
  };
  const handleSelectList = (id) => setSelectListId(id);
  const onCreateTask = () => {
    const limitDate = new Date(limit.year, limit.month - 1, limit.day, limit.hour, limit.minutes);
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: limitDate,
    };

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigation('/');
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, [cookies.token]);

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input type="text" onChange={handleTitleChange} className="new-task-title" />
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
          <textarea type="text" onChange={handleDetailChange} className="new-task-detail" />
          <br />
          <button
            type="button"
            className="new-task-button"
            onClick={async () => {
              await onCreateTask();
              console.log(limit);
            }}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
