import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { combineReducers, createStore} from 'redux'
import { Component } from 'react'
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return({
                id: action.id,
                text: action.text,
                complited: false
            });
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return{
                ...state, 
                complited: !state.complited
            }
        default:
            return state;
    }
}

const todos = (state = [], action) => {
   switch (action.type) {
       case 'ADD_TODO':
        return [
            ...state,
            todo(undefined, action)
        ];
        case 'TOGGLE_TODO':
            return state.map(t => 
                todo(t, action)
            );
    default: 
        return state;
   }
}

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter( t => !t.complited);
        case 'SHOW_COMPLITED':
            return todos.filter( t => t.complited);
    }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default: 
            return state;
    }
}

const FilterLink = ({
    children, 
    filter,
    currentFilter
}) => {
    if (filter === currentFilter) {
        return <span>{children}</span>
    }

    return (
        <a href='#'
            onClick={e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                })
            }}>
            {children}
        </a>
    )
}
let nextTodoId = 0;
class TodoApp extends Component {
    render(){
        const {
            todos,
            visibilityFilter
        } = this.props;
        const visibleTodos = getVisibleTodos(todos, visibilityFilter)
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId++
                    });
                    this.input.value = '';
                }}>
                    Add todo
                </button>
                <ul>
                    {visibleTodos.map(todo =>
                        <li key={todo.id}
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                })
                            }}
                            style={{
                                textDecoration: 
                                    todo.complited ?
                                    'line-through' :
                                    'none'
                            }}
                            >
                            {todo.text}
                        </li>
                    )}
                </ul>
                <p>
                    Show:
                    <FilterLink
                        filter='SHOW_ALL'
                        currentFilter={visibilityFilter}>
                        All
                    </FilterLink>
                    {' '}
                    <FilterLink
                    filter='SHOW_ACTIVE'
                        currentFilter={visibilityFilter}>
                        Active
                    </FilterLink>
                    {' '}
                    <FilterLink
                    filter='SHOW_COMPLITED'
                        currentFilter={visibilityFilter}>
                        Complited
                    </FilterLink>
                </p>
            </div>
        )
    };
}

const todoApp = combineReducers({
    todos,
    visibilityFilter
});
const store = createStore(todoApp);
const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()}/>, 
        document.getElementById('root')
    );
}

store.subscribe(render);
render();
serviceWorker.unregister();
