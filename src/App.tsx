import './App.css';
import './index.css'
import { AppRoutes } from '../src/routes/';
import store from './store/store';
import { Provider } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
      <ToastContainer />
    </Provider>
  );
}

export default App;