import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { HashRouter } from 'react-router-dom';
import store from './store';
import { Provider as StoreProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            autoHideDuration={3000}
          >
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
