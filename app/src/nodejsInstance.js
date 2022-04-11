require('dotenv').config()

const nodejs_connection = 'http://' + process.env.REACT_APP_NODEJS_HOST + ":" + process.env.REACT_APP_NODEJS_PORT

export default nodejs_connection;