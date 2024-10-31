// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 使用 JSON 中间件处理请求体
app.use(express.json());

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/todo-helper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// 定义任务模型
const TaskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Task = mongoose.model('Task', TaskSchema);

// 获取所有任务的 API
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// 创建新任务的 API
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// 更新任务的 API
app.put('/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

// 删除任务的 API
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// 启动服务器
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
