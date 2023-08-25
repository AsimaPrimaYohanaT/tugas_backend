const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi =  require('joi');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
const { md } = require('node-forge');


class _user{
    login(data){
        const schema = Joi.object({
            name: Joi.string(),
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
            query: `SELECT * FROM users WHERE name = ? AND password = ?`,
            params: [data.name,md5(data.password)]
        }

        return mysql.query(sql.query, sql.params)
            .then(userData=>{
                if (userData.length === 0) {
                    return {
                      status: false,
                      code: 401, // Unauthorized
                      error: 'Invalid credentials',
                    };
                  }
          
                  // User authenticated successfully
                  const user = userData[0];
                  const token = generateAuthToken(user);
          
                  return {
                    status: true,
                    data: {
                        user,
                      token, // Include the generated JWT token in the response
                    },
                  };
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
    addTask(data, authToken) {
        try {
          var token = authToken.split(' ')[1];
            
            //verifikasi
            jwt.verify(token, 'your-secret-key', function(err, decoded){
                if(err){
                    // Token salah
                    return userErrorResponse("Token tidak valid", rest)
                }else {
                    // Token benar
                    console.log("hore")
                }
            });
          const schema = Joi.object({
            description: Joi.string(),
          }).options({
            abortEarly: false,
          });
          const validation = schema.validate(data);
          if (validation.error) {
            const errorDetails = validation.error.details.map((detail) => {
              detail.message;
            });
    
            return {
              status: false,
              code: 422,
              error: errorDetails.join(', '),
            };
          }
          const parsedToken = parseJwt(authToken)
          console.log('ini gan',parsedToken)
          const uId = parsedToken.userId
    
          const sql = {
            query: 'INSERT INTO todo (userId, description) VALUES (?, ?)',
            params: [uId, data.description],
          };
    
          return mysql
            .query(sql.query, sql.params)
            .then((insertedData) => {
              if (insertedData.affectedRows > 0) {
                return {
                  status: true,
                  data: 'Task added successfully',
                };
              } else {
                return {
                  status: false,
                  code: 500, // Internal Server Error
                  error: 'Failed to add task',
                };
              }
            })
            .catch((error) => {
              if (debug) {
                console.error('addTask Error: ', error);
              }
    
              return {
                status: false,
                error,
              };
            });
        } catch (error) {
          console.error('Token verification error:', error);
          return {
            status: false,
            code: 401,
            error: 'Authentication failed. Invalid or expired token.',
          };
        }
      }

      getTask(authToken) {
        try {
          var token = authToken.split(' ')[1];
            
            //verifikasi
            jwt.verify(token, 'your-secret-key', function(err, decoded){
                if(err){
                    // Token salah
                    return userErrorResponse("Token tidak valid", rest)
                }else {
                    // Token benar
                    console.log("hore")
                }
            });
  
          const parsedToken = parseJwt(authToken)
          const uId = parsedToken.userId
    
          const sql = {
            query: 'SELECT * FROM todo WHERE userId = ?',
            params: [uId],
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
        } catch (error) {
          // Token verification failed, indicating authentication failure
          console.error('Token verification error:', error);
          return {
            status: false,
            code: 401, // Unauthorized
            error: 'Authentication failed. Invalid or expired token.',
          };
        }
      }

      updateTask(data, authToken) {
        try {
          var token = authToken.split(' ')[1];
            
            //verifikasi
            jwt.verify(token, 'your-secret-key', function(err, decoded){
                if(err){
                    // Token salah
                    return userErrorResponse("Token tidak valid", rest)
                }else {
                    // Token benar
                    console.log("hore")
                }
            });
          const schema = Joi.object({
            description: Joi.string(),
            id: Joi.string()
          }).options({
            abortEarly: false,
          });
          const validation = schema.validate(data);
          if (validation.error) {
            const errorDetails = validation.error.details.map((detail) => {
              detail.message;
            });
    
            return {
              status: false,
              code: 422,
              error: errorDetails.join(', '),
            };
          }
          const parsedToken = parseJwt(authToken)
          console.log('ini gan',parsedToken)
          const uId = parsedToken.userId
    
          const sql = {
            query: 'UPDATE todo SET description = ? WHERE id = ? AND userId =?',
            params: [data.description,data.id,uId],
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
        } catch (error) {
          console.error('Token verification error:', error);
          return {
            status: false,
            code: 401,
            error: 'Authentication failed. Invalid or expired token.',
          };
        }
      }
      

      deleteTask(data, authToken) {

        try {
          var token = authToken.split(' ')[1];
            
            //verifikasi
            jwt.verify(token, 'your-secret-key', function(err, decoded){
                if(err){
                    // Token salah
                    return userErrorResponse("Token tidak valid", rest)
                }else {
                    // Token benar
                    console.log("hore")
                }
            });
          const schema = Joi.object({
            id: Joi.string()
          }).options({
            abortEarly: false,
          });
          const validation = schema.validate(data);
          if (validation.error) {
            const errorDetails = validation.error.details.map((detail) => {
              detail.message;
            });
    
            return {
              status: false,
              code: 422,
              error: errorDetails.join(', '),
            };
          }
          const parsedToken = parseJwt(authToken)
          console.log('ini gan',parsedToken)
          const uId = parsedToken.userId
    
          const sql = {
            query: `DELETE FROM todo WHERE id = ? AND userId = ?;`,
            params: [data.id,uId]
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
        } catch (error) {
          // Token verification failed, indicating authentication failure
          console.error('Token verification error:', error);
          return {
            status: false,
            code: 401, // Unauthorized
            error: 'Authentication failed. Invalid or expired token.',
          };
        }
    }

    deleteUser(data) {
        const schema = Joi.object({
          name: Joi.string()
        }).options({
          abortEarly: false,
        });
        const validation = schema.validate(data);
        if (validation.error) {
          const errorDetails = validation.error.details.map((detail) => {
            detail.message;
          });
  
          return {
            status: false,
            code: 422,
            error: errorDetails.join(', '),
          };
        }
  
        const sql = {
          query: 'DELETE FROM users WHERE name = ?',
          params: [data.name],
        };
  
        return mysql.query(sql.query, sql.params)
            .then(data => {
                if (data.affectedRows === 0) {
                    return {
                        status: false,
                        code: 404,
                        error: 'user not found'
                    };
                }

                return {
                    status: true,
                    message: 'user deleted successfully'
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('delete user Error: ', error);
                }

                return {
                    status: false,
                    error
                };
            });
      
    }

    deleteTask(data, authToken) {

      try {
        var token = authToken.split(' ')[1];
          
          //verifikasi
          jwt.verify(token, 'your-secret-key', function(err, decoded){
              if(err){
                  // Token salah
                  return userErrorResponse("Token tidak valid", rest)
              }else {
                  // Token benar
                  console.log("hore")
              }
          });
        const schema = Joi.object({
          id: Joi.string()
        }).options({
          abortEarly: false,
        });
        const validation = schema.validate(data);
        if (validation.error) {
          const errorDetails = validation.error.details.map((detail) => {
            detail.message;
          });
  
          return {
            status: false,
            code: 422,
            error: errorDetails.join(', '),
          };
        }
        const parsedToken = parseJwt(authToken)
        console.log('ini gan',parsedToken)
        const uId = parsedToken.userId
  
        const sql = {
          query: `DELETE FROM todo WHERE id = ? AND userId = ?;`,
          params: [data.id,uId]
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
      } catch (error) {
        // Token verification failed, indicating authentication failure
        console.error('Token verification error:', error);
        return {
          status: false,
          code: 401, // Unauthorized
          error: 'Authentication failed. Invalid or expired token.',
        };
      }
  }
}


function parseJwt(token) {
  const base64Payload = token.split('.')[1];
  const payload = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payload.toString());
}

function generateAuthToken(user) {
    const payload = {
      // You can include user-specific data in the payload
      userId: user.id,
      username: user.name,
    };
  
    // Sign the token with a secret key
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' }); // Adjust the expiration time as needed
  
    return token;
  }
  

module.exports = new _user();
