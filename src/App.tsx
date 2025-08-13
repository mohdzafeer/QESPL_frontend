import './App.css';
import './index.css'
import { AppRoutes } from '../src/routes/';
import store, { type RootState } from './store/store';
import { Provider, useSelector } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { disconnectSocket, initSocket} from './utils/socket';
import Notification from './components/Admin/component/Notification';
import { useEffect, useState } from 'react';



const AppContent: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  console.log(user, "user in app content", token, "token in app content");


  useEffect(() => {
    if (user?.id && token) {
      initSocket(user.id, token);
    }
    return () => {
      disconnectSocket(); // Cleanup on unmount
    };
  }, [user, token]);


  return (
    <div className="relative">
      {/* <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {isNotificationOpen ? 'Close Notifications' : 'Show Notifications'}
      </button> */}
      {isNotificationOpen && <Notification onClose={() => setIsNotificationOpen(false)} />}
      {/* <AppRoutes /> */}
      {/* <ToastContainer /> */}
    </div>
  );
};


function App() {
 




  return (
    <Provider store={store}>
      <AppRoutes />
      <AppContent />
      <ToastContainer />
    </Provider>
  );
}


export default App;

