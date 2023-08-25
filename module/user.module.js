const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi =  require('joi');

class _user{
    add(data){
        const schema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            password: Joi.string()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(data)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }

        // Insert data to database
        const sql = {
            query: `INSERT INTO users (name, email, password) VALUES (?,?,?)`,
            params: [data.name,data.email,data.password]
        }

        return mysql.query(sql.query, sql.params)
            .then(data=>{
                return {
                    status: true,
                    data
                }
            })
            .catch(error =>{
                if (debug){
                    console.error('add user Error: ', error)
                }

                return{
                    status: false,
                    error
                }
            })
    }

    get(taskId) {
        // Fetch task by taskId from the database
        const sql = {
            query: `SELECT * FROM task WHERE id = ?`,
            params: [taskId]
        };

        return mysql.query(sql.query, sql.params)
            .then(data => {
                if (data.length === 0) {
                    return {
                        status: false,
                        code: 404,
                        error: 'Task not found'
                    };
                }

                return {
                    status: true,
                    data: data[0]
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('get task Error: ', error);
                }

                return {
                    status: false,
                    error
                };
            });
    }

    update(newData) {
        // Validate data
        const schema = Joi.object({
            item: Joi.string(),
            id: Joi.number()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(newData)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }

        const sql = {
            query: `UPDATE task SET items = ? WHERE id = ?`,
            params: [newData.item, newData.id]
        };

        return mysql.query(sql.query, sql.params)
            .then(data => {
                if (data.affectedRows === 0) {
                    return {
                        status: false,
                        code: 404,
                        error: 'Task not found'
                    };
                }

                return {
                    status: true,
                    message: 'Task updated successfully'
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('update task Error: ', error);
                }

                return {
                    status: false,
                    error
                };
            });
    }

    delete(taskId) {
        // Delete the task from the database
        const sql = {
            query: `DELETE FROM task WHERE id = ?`,
            params: [taskId]
        };

        return mysql.query(sql.query, sql.params)
            .then(data => {
                if (data.affectedRows === 0) {
                    return {
                        status: false,
                        code: 404,
                        error: 'Task not found'
                    };
                }

                return {
                    status: true,
                    message: 'Task deleted successfully'
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('delete task Error: ', error);
                }

                return {
                    status: false,
                    error
                };
            });
    }
}

module.exports = new _user();
