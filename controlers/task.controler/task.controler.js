const TaskModel = require("../../models/task/task.model");

const getAllTasks = async (req, res) => {
  try {
    let { filterBy, pageNumber = 1, pageLimit = 10 } = req.body;

    const user = req.user;
    const page = parseInt(pageNumber);
    const limit = parseInt(pageLimit);
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalTasks = await TaskModel.countDocuments({ createdBy: user?._id });

    // Get paginated tasks using aggregation
    const getTask = await TaskModel.aggregate([
      {
        $match: { createdBy: user?._id },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalPages = Math.ceil(totalTasks / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      msg: "",
      code: 200,
      data: {
        getTask,
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error!", code: 500 });
  }
};

const createTask = async (req, res) => {
  try {
    const { taskName, description, dueDate } = req.body;
    const user = req.user;
    if (!taskName || !description || !dueDate) {
      return res.status(200).json({ msg: "Invalid Request!", code: 400 });
    }

    const checkTaskName = await TaskModel.findOne({ taskName: taskName });
    if (checkTaskName) {
      return res
        .status(200)
        .json({ msg: "Task Already Registered!", code: 400 });
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
    if (!taskId) {
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
