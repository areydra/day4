import React, { useState } from "react";
import { Spinner } from "reactstrap";

function App() {
  const [todolists, setTodoLists] = useState([]);
  const [cachetodolists, setCacheTodoLists] = useState([]);
  const [todolist, setTodoList] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEdit, setSelectedEdit] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const createTodoList = () => {
    setLoading(true);
    setTimeout(() => {
      setTodoLists([
        ...todolists,
        {
          id: Date.now(),
          name: todolist,
          category: category.toLowerCase(),
          status: "process"
        }
      ]);
      setCategory("");
      setTodoList("");
      setLoading(false);
    }, 1000);
  };

  const handleDelete = id => {
    let filtered = todolists.filter(todo => todo.id !== id);
    setTodoLists(filtered);
  };

  const handleFinish = async todo => {
    let todos = {
      id: todo.id,
      name: todo.name,
      category: todo.category,
      status: "finish"
    };
    let filtered = todolists.filter(todol => todol.id !== todo.id);
    setTodoLists([...filtered, todos]);
  };

  const handleFilter = () => {
    setLoadingFilter(true);

    setTimeout(() => {
      let filtered = todolists.filter(todol => {
        if (selectedStatus.length && selectedCategory.length) {
          return (
            todol.status === selectedStatus &&
            todol.category === selectedCategory
          );
        } else {
          return (
            todol.status === selectedStatus ||
            todol.category === selectedCategory
          );
        }
      });
      if (filtered.length) {
        setCacheTodoLists(todolists);
        setTodoLists(filtered);
        setLoadingFilter(false);
      } else {
        setNotFound(true);
        setLoadingFilter(false);
      }
    }, 1000);
  };

  const handleClearFilter = () => {
    if (notFound) {
      setNotFound(false);
    } else {
      setCacheTodoLists([]);
      setTodoLists(cachetodolists);
    }
  };

  const handleEditTodoList = () => {
    if (!todolist.length && !category.length) {
      return false;
    } else {
      setLoading(true);
      setTimeout(() => {
        let filtered = todolists.filter(
          todol => todol.id !== selectedEdit[0].id
        );
        let editTodo = [
          {
            id: selectedEdit[0].id,
            name: todolist.length ? todolist : selectedEdit[0].name,
            category: category.length ? category : selectedEdit[0].category,
            status: selectedEdit[0].status
          }
        ];
        setTodoLists([...filtered, ...editTodo]);
        setCategory("");
        setTodoList("");
        setSelectedEdit([]);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div>
      <div className="row" style={{ margin: "0 auto" }}>
        <div className="col-3">
          <div className="row">
            <div className="col-12 mt-3">
              {selectedEdit.length ? (
                <h4>Edit your {selectedEdit[0].name}</h4>
              ) : (
                <h4>Create your list</h4>
              )}
            </div>
            <div className="col-12 mt-3">
              <input
                type="text"
                placeholder={
                  selectedEdit.length ? selectedEdit[0].name : "title"
                }
                value={todolist}
                onChange={event => setTodoList(event.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-12 mt-3">
              <input
                type="text"
                placeholder={
                  selectedEdit.length ? selectedEdit[0].category : "category"
                }
                value={category}
                className="form-control"
                onChange={event => setCategory(event.target.value)}
              />
            </div>
          </div>
          {selectedEdit.length ? (
            <div className="row">
              <div className="col-6 mt-3">
                <button
                  type="submit"
                  onClick={() => setSelectedEdit([])}
                  className="btn btn-danger form-control"
                >
                  Cancel
                </button>
              </div>
              <div className="col-6 mt-3">
                <button
                  type="submit"
                  onClick={() => handleEditTodoList()}
                  className="btn btn-success form-control"
                >
                  Edit
                  {loading ? (
                    <Spinner
                      color="primary"
                      size="sm"
                      style={{ marginLeft: 10 }}
                    />
                  ) : null}
                </button>
              </div>
            </div>
          ) : (
            <div className="col-12 mt-3">
              <button
                type="submit"
                onClick={() => createTodoList()}
                className="btn btn-success form-control"
              >
                Create
                {loading ? (
                  <Spinner
                    color="primary"
                    size="sm"
                    style={{ marginLeft: 10 }}
                  />
                ) : null}
              </button>
            </div>
          )}

          <div className="row">
            <div className="col-12 mt-3">
              <h4>Filter list</h4>
            </div>
            <div className="col-12 mt-3">
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">category</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={event => setSelectedCategory(event.target.value)}
                >
                  <option value={false} hidden>
                    Choose category
                  </option>
                  {!notFound
                    ? todolists.length
                      ? todolists.map(todolist => (
                          <option
                            value={todolist.category}
                            key={todolist.category}
                          >
                            {todolist.category}
                          </option>
                        ))
                      : cachetodolists.map(todolist => (
                          <option
                            value={todolist.category}
                            key={todolist.category}
                          >
                            {todolist.category}
                          </option>
                        ))
                    : null}{" "}
                </select>
              </div>{" "}
            </div>
            <div className="col-12 mt-1">
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Status</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={event => setSelectedStatus(event.target.value)}
                >
                  <option value={false} hidden>
                    Choose status
                  </option>
                  {!notFound ? (
                    <React.Fragment>
                      {" "}
                      <option value="process">Process</option>
                      <option value="finish">Finish</option>
                    </React.Fragment>
                  ) : null}
                </select>
              </div>{" "}
              <div className="col-12 mt-3">
                <button
                  type="submit"
                  onClick={() => handleFilter()}
                  className="btn btn-success form-control"
                >
                  Filter
                  {loadingFilter ? (
                    <Spinner
                      color="primary"
                      size="sm"
                      style={{ marginLeft: 10 }}
                    />
                  ) : null}
                </button>
              </div>
              <div className="col-12 mt-3">
                <button
                  type="submit"
                  onClick={() => handleClearFilter()}
                  className="btn btn-danger form-control"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3>Your Lists</h3>
            </div>
            <div className="col-md-12">
              <div className="row">
                {notFound ? (
                  <p>Data NotFound</p>
                ) : todolists.length ? (
                  todolists.map(todo => (
                    <div class="col-3">
                      <div class="card">
                        <div class="card-body">
                          <h5 class="card-title text-center">{todo.name}</h5>
                          <p
                            class="card-text text-right"
                            style={{ fontSize: 10 }}
                          >
                            status : {todo.status}
                          </p>
                          <p
                            class="card-text text-right"
                            style={{ fontSize: 10 }}
                          >
                            category : {todo.category}
                          </p>
                          <div className="row">
                            <div className="col-4">
                              <button
                                className="btn btn-primary"
                                onClick={() => handleFinish(todo)}
                              >
                                Finish
                              </button>
                            </div>
                            <div className="col-4">
                              <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedEdit([todo])}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="col-12 mt-1">
                              <button
                                className="btn btn-danger form-control"
                                onClick={() => handleDelete(todo.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
