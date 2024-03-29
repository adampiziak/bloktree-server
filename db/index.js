const mysql = require('mysql')
const user = require('../user')

const db = mysql.createConnection({ //Connect to Mysql database
  host: '127.0.0.1',
  user: 'root',
  password: 'marsisaredplanet',
  database: 'bloktree'
})

db.connect((err)=> {
  if (err) console.error(err)
  console.log('Database connection established')
})

module.exports = {
  project: {
    create (project, callback) {
      const CREATE_PROJECT = "INSERT INTO projects (account_id, name, color) VALUES (?, ?, ?)"
      db.query(CREATE_PROJECT, [user.id, project.name, project.color], (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    },
    edit (edit, callback) {
      const EDIT_PROJECT = 'UPDATE projects SET name = ?, SET color = ? WHERE id = ? AND account_id = ?'
      db.query(EDIT_PROJECT, [edit.name, edit.color, edit.id, user.id], (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    },
    delete (id, callback) {
      const DELETE_PROJECT = 'DELETE FROM projects WHERE id = ? and account_id = ?'
      db.query(DELETE_PROJECT, [id, user.id], (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    },
    getAll (callback) {
      const GET_ALL_PROJECTS = 'SELECT * FROM projects WHERE account_id = ?'
      db.query(GET_ALL_PROJECTS, [user.id], (err, projects) => {
        if (err) {
          callback(err)
        } else {
          callback(null, projects)
        }
      })
    }
  },

  task: {
    makeGroup (id, callback) {
      const MAKE_GROUP = 'UPDATE tasks SET mode = 1 WHERE id = ? AND accountId = ?'
      db.query(MAKE_GROUP, [id, user.id], (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null, true)
        }
      })
    }
  },
  getUsers: (callback) => {
    db.query('SELECT * FROM users', (err, users) => {
      if (err) callback(err)
      let all = []
      for (i in users) {
        let user = {
          'id': users[i].id,
          'name': users[i].username,
          'password': users[i].password
        }
        all.push(user)
      }
      callback(null, all)
    })
  },
  createUser: (username, password, callback) => {
    db.query('INSERT INTO users (username, password) VALUES (?,?)', [username, password], (err) => {
      if (err) {
        callback(err, false)
      } else {
        callback(null, true)
      }
    })
  },
  getUser: (username, callback) => {
    db.query('SELECT * FROM users WHERE username = ?', username, (err, user) => {
      if (err) callback(err)

      if (user.length > 0)
        callback(null, user[0])
      else
        callback(null, false)
    });
  },
  deleteUser: (id, callback) => {
    const DELETE_USER = 'DELETE FROM users WHERE id = ?'
    db.query(DELETE_USER, id, (err) => {
      if (err) callback(err)
      callback(null, true)
    })
  },
  createTask(task, callback) {
    const CREATE_TASK = 'INSERT INTO tasks (name, parent, project, mode, priority, accountId) values (?, ?, ?, ?, ?, ?)'
    const data = [ task.name,
                   task.parent,
                   task.project,
                   task.mode,
                   task.priority,
                   user.id ]
    console.log(data)
    db.query(CREATE_TASK, data, (err) => {
      console.log(err)
      if (err)
        callback(err, false)
      else
        callback(null, true)
    })
  },
  editTask(task, callback) {
    const EDIT_TASK = 'UPDATE tasks SET name = ?, parent = ?, project = ?, mode = ?, priority = ? WHERE id = ?'
    console.log(task.priority)
    const data = [
      task.name,
      task.parent,
      task.project,
      task.mode,
      task.priority,
      task.id
    ]
    db.query(EDIT_TASK, data, (err) => {
      if (err) callback(err, false)
      callback(null, true)
    })
  },
  deleteTask(taskId, callback) {
    const data = [taskId, user.id]
    const DELETE_TASK = 'DELETE FROM tasks WHERE id = ? AND accountId = ?'
    db.query(DELETE_TASK, data, (err) => {
      if (err) callback(err, false)
      callback(null, true)
    })
  },
  getAllTasks (callback) {
    const userId = user.id
    const GET_ALL_TASKS = 'SELECT * FROM tasks WHERE accountId = ?'
    db.query(GET_ALL_TASKS, userId, (err, tasks) => {
      if (err) callback(err)
      else callback(null, tasks)
    })
  }
}
