import React, { useContext, useEffect, useState } from 'react';
import { TodosContext } from './App';
import { Table, Button, Form, Container } from 'react-bootstrap';
import UseApi from './UseApi';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
    const { state, dispatch } = useContext(TodosContext);
    const [todoText, setTodoText] = useState('');
    const [editTodo, setEditTodo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const buttonTitle = editMode ? "Edit Todo" : "Add Todo";

    const endpoint = "http://localhost:3000/todos";
    const savedTodos = UseApi(endpoint);

    useEffect(() => {
        dispatch(getTodos(savedTodos))
    }, [savedTodos])

    //---------------Action creators-----------------------------
    const getTodos = (payload) => {
        return {
            type: 'get/getTodos',
            payload: payload
        }
    }

    const deleteTodo = (payload) => {
        return {
            type: 'delete/deleteTodo', //sliceName/actionName
            payload: payload
        }
    }

    const addTodo = (payload) => {
        return {
            type: 'add/addTodo',
            payload: payload
        }
    }

    const editTodoAction = (payload) => {
        console.log({ ...payload, text: todoText })
        return {
            type: 'edit/editTodoAction',
            payload: { ...payload, text: todoText }
        }
    }
    //-----------------end of action creators--------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await axios.patch(`${endpoint}/${editTodo.id}`,{text: todoText})
            dispatch(editTodoAction(editTodo))
            setEditMode(false);
            setEditTodo(null);
        } else {
            const newTodo = { id: uuidv4(), text: todoText }
            await axios.post(endpoint, newTodo);
            //dispatch(addTodo(todoText)); using in conjunction with old static data
            dispatch(addTodo(newTodo));
        }
        setTodoText('');
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="searchText">
                    <Form.Label>Enter To Do</Form.Label>
                    <Form.Control type="text" placeholder="Enter text"
                        onChange={(e) => setTodoText(e.target.value)}
                        value={todoText} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {buttonTitle}
                </Button>
            </Form>
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>To Do</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        state.todos?.map(todo => (
                            <tr key={todo.id}>
                                <td>{todo.text}</td>
                                <td>
                                    <Button variant="primary" onClick={() => {
                                        setTodoText(todo.text)
                                        setEditMode(true)
                                        setEditTodo(todo)
                                    }} >
                                        Edit
                                    </Button>
                                </td>
                                <td>
                                    {/* no longer using static data endpoint
                                    <Button variant="danger" onClick={() => dispatch(deleteTodo(todo))}>
                                        Delete
                                    </Button> */}
                                    <Button variant="danger" onClick={async () => {
                                        await axios.delete(`${endpoint}/${todo.id}`)
                                        dispatch(deleteTodo(todo))
                                    }}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </Container>
    );
}
export default TodoList;