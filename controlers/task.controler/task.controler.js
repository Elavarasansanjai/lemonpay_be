const TaskModel = require("../../models/task/task.model");

const getAllTasks = async (req, res) => {
  try {
    let { filterBy, pageNumber, pageLimit } = req.body;
    // if (!filterBy || !pageNumber || !pageLimit) {
    //   return res.status(200).json({ msg: "bad gateway!", code: 400 });
    // }

    const user = req.user;
    const getTask = await TaskModel.find({ createdBy: user?._id });
    return res.status(200).json({ msg: "", code: 200, data: getTask });
  } catch (err) {
    return res.status(200).json({ msg: "Internal Server Error!", code: 200 });
  }
};

const createTask = async (req, res) => {
  try {
    const { taskName, description, dueDate } = req.body;
    const user = req.user;
    if (!taskName || !description || !dueDate) {
      return res.status(200).json({ msg: "Invalid Request!", code: 400 });
    }

    const createTask = await TaskModel.create({
      taskName,
      description,
      dueDate,
      createdBy: user?._id,
      createdAt: new Date(),
    });

    return res.status(200).json({ msg: "Task Add success!", code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal Server Error!", code: 500 });
  }
};

const editeTask = async (req, res) => {
  try {
    const { taskName, description, dueDate, taskId } = req.body;
    const user = req.user;

    if (!taskName || !description || !dueDate || !taskId) {
      return res.status(200).json({ msg: "Invalid Request!", code: 400 });
    }

    let getTask = await TaskModel.findById({ _id: taskId });

    if (!getTask) {
      return res.status(200).json({ msg: "Task Not Found!", code: 400 });
    }

    getTask.taskName = taskName;
    getTask.description = description;
    getTask.dueDate = dueDate;
    await getTask.save();

    return res.status(200).json({ msg: "Task Edite success!", code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal Server Error!", code: 500 });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    if (taskId) {
      return res.status(200).json({ msg: "Bad Gateway!", code: 400 });
    }
    const checkTask = await TaskModel.findById({ _id: taskId });
    if (!checkTask) {
      return res.status(200).json({ code: 400, msg: "Task Not Found!" });
    }
    let deleteTaskItem = await TaskModel.findByIdAndDelete({ _id: taskId });
    return res
      .status(200)
      .json({ msg: "Task Deleted Successfully!", code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal Server Error!", code: 500 });
  }
};

module.exports = { createTask, editeTask, deleteTask, getAllTasks };
