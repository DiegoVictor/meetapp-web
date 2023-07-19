import styled, { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

export const Container = styled.div`
  background: linear-gradient(180deg, #22202c, #402845);
  min-height: 100vh;
`;

export const Theme = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;
    outline: 0px;
    padding: 0px;
  }

  *:focus {
    outline: 0px;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 14px 'Roboto', sans-serif;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button, .btn {
    align-items: center;
    background-color: #d44059;
    border: 0px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-weight: bold;
    padding: 12px 20px 12px 12px;

    > svg {
      margin-right: 5px;
    }

    &.unstyled {
      background-color: transparent;
      padding: 0px;
    }
  }

  input, textarea {
    background-color: rgba(0, 0, 0, 0.2);
    border: 0px;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.5);
    font-family: Roboto, sans-serif;
    font-size: 18px;
    line-height: 18px;
    height: 50px;
    margin-bottom: 10px;
    padding: 14px 20px;
    width: 100%;
  }

  textarea {
    height: auto;
    resize: none;
  }

  h2 {
    color: #fff;
    font-size: 32px;
    line-height: 37px;
  }
`;
