import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { createGlobalLogic } from "./logic/global";
import { createI18nService } from './i18n/i18n';

test('renders version and connection info when not connected', () => {
  const i18n = createI18nService("Japanese");
  const globalLogic = createGlobalLogic(i18n);
  jest.spyOn(globalLogic,"connect").mockImplementation(() => {});
  render(<App globalLogic={globalLogic}/>);
  const cs = screen.getByText("メインサーバー: 接続中...");
  const ver = screen.getByText(/Version/);
  expect(cs).toBeInTheDocument();
  expect(ver).toBeInTheDocument();
});
