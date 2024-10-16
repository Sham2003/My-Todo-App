
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCRIZkCbqObgO5Wb1KmoIu1yx9hKvHL7kc",
  authDomain: "my-todo-app-auth.firebaseapp.com",
  projectId: "my-todo-app-auth",
  storageBucket: "my-todo-app-auth.appspot.com",
  messagingSenderId: "532472796202",
  appId: "1:532472796202:web:07c88a455f27eff062df53",
  measurementId: "G-KPX4NHP2L8"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { auth };
