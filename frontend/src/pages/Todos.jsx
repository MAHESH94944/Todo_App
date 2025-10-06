import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { todos } from "../api/api";

const Navbar = ({ onLogout, user }) => (
  <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
        TA
      </div>
      <div>
        <div className="text-xl font-semibold">Todo App</div>
        <div className="text-sm opacity-80">Organize your day</div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-sm opacity-90">{user?.username}</div>
      <button
        onClick={onLogout}
        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm"
      >
        Logout
      </button>
    </div>
  </header>
);

const TodoForm = ({ onCreate, editing, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(editing?.title || "");
  const [description, setDescription] = useState(editing?.description || "");

  useEffect(() => {
    setTitle(editing?.title || "");
    setDescription(editing?.description || "");
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title) return;
    if (editing) await onUpdate(editing._id, { title, description });
    else await onCreate({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="What do you want to do?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const TodoItem = ({ todo, onEdit, onDelete, onToggle }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm flex items-start justify-between">
    <div>
      <div
        className={`font-medium ${
          todo.completed ? "line-through text-slate-400" : ""
        }`}
      >
        {todo.title}
      </div>
      {todo.description && (
        <div className="text-sm text-slate-500">{todo.description}</div>
      )}
    </div>
    <div className="flex gap-2 items-center">
      <button
        onClick={() => onToggle(todo)}
        className={`px-2 py-1 rounded text-sm ${
          todo.completed ? "bg-yellow-400" : "bg-green-500 text-white"
        }`}
      >
        {todo.completed ? "Undo" : "Done"}
      </button>
      <button
        onClick={() => onEdit(todo)}
        className="px-2 py-1 border rounded text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(todo)}
        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
      >
        Delete
      </button>
    </div>
  </div>
);

const TodoList = ({ items, onEdit, onDelete, onToggle }) => (
  <div className="space-y-3">
    {items.length === 0 && (
      <div className="text-center text-slate-500">No todos yet</div>
    )}
    {items.map((t) => (
      <TodoItem
        key={t._id}
        todo={t}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
      />
    ))}
  </div>
);

const Todos = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await todos.list();
      setItems(res.todos || []);
    } catch (err) {
      setError(err?.body?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return; // wait until authenticated
    load();
  }, [user]);

  const create = async (payload) => {
    await todos.create(payload);
    await load();
  };

  const update = async (id, payload) => {
    await todos.update(id, payload);
    setEditing(null);
    await load();
  };

  const remove = async (todo) => {
    if (!confirm("Delete this todo?")) return;
    await todos.remove(todo._id);
    await load();
  };

  const toggle = async (todo) => {
    await todos.update(todo._id, { completed: !todo.completed });
    await load();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={logout} user={user} />
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white/95 p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-3 text-indigo-700">Quick Add</h3>
              <TodoForm
                onCreate={create}
                editing={editing}
                onUpdate={update}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white/95 p-6 rounded-xl shadow space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-indigo-700">Your Todos</h3>
                <button onClick={load} className="text-sm text-indigo-600">
                  Refresh
                </button>
              </div>
              {error && <div className="text-red-600">{error}</div>}
              {loading ? (
                <div>Loading...</div>
              ) : (
                <TodoList
                  items={items}
                  onEdit={setEditing}
                  onDelete={remove}
                  onToggle={toggle}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todos;
