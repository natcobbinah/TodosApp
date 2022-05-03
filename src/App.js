import React, { useReducer } from 'react';
import './App.css';
import TodoList from './TodoList';
import { v4 as uuidv4 } from 'uuid';

//data fetched from apiEndpoint- [no more using static data]
/* const todosInitialState = {
  todos: [
    { id: 1, text: 'finishing writing hooks chapter' },
    { id: 2, text: 'play with the kids' },
    { id: 3, text: 'read bible' },
  ]
} */

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'get/getTodos':
      return {...state,todos: action.payload}
    case 'delete/deleteTodo':
      const filteredTodoState = state.todos.filter(todo => todo.id !== action.payload.id)
      return { ...state, todos: filteredTodoState }
    case 'add/addTodo':
      //const newTodo = {id: uuidv4(), text: action.payload}; this functionality is now
                //handled in handleSubmit in todoList 
      //const addedTodos = [...state.todos, newTodo]  {thus we now have}
      const addedTodos = [...state.todos, action.payload]
      return {...state, todos: addedTodos}
    case 'edit/editTodoAction':
      const updatedTodo = {...action.payload}
      const updatedTodoIndex = state.todos.findIndex(todo => todo.id === action.payload.id)
      const updatedTodos = [
        ...state.todos.slice(0,updatedTodoIndex),
        updatedTodo,
        ...state.todos.slice(updatedTodoIndex + 1)
      ];
      return {...state, todos: updatedTodos}
    default:
      //return todosInitialState;
      return state;
  }
}

export const TodosContext = React.createContext();

function App() {

  //no more using staticData for initialization
  //const [state, dispatch] = useReducer(todosReducer, todosInitialState); 

  const [state, dispatch] = useReducer(todosReducer, []);

  return (
    <TodosContext.Provider value={{ state, dispatch }}>
      <TodoList />
    </TodosContext.Provider>
  );
}

export default App;
