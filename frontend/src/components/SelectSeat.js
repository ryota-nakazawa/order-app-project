import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectSeat.css';

const SelectSeat = ({ setSeatId }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // 半角数字のみを認める正規表現
      setInputValue(value);
      setErrorMessage('');
    } else {
      setErrorMessage('半角数字のみ入力してください');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === '') {
      setErrorMessage('席番号を入力してください');
      return;
    }
    setSeatId(inputValue);
    navigate('/');
  };

  return (
    <div className="select-seat-container">

      <form onSubmit={handleSubmit}>
        <label>席番号を入力してください</label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder=""
        />
        <button type="submit" className="confirm-button">確定</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SelectSeat;
