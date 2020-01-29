const mongoose = require("mongoose");

const connectionEntity = require("./repo");

const addConnection = async (req, res) => {

    const { to, who } = req.body;

    await isConnected( who, to );

    const result = connectionEntity.addConnections({ who, to });

    res.send(200, {
        result
    });
}

const isConnected = async (who, to) => {

    const checkConnection = await connectionEntity.findConnectionCountByUsers( who, to );
    if (checkConnection > 0) {
       throw console.error("Already connected");
    }
    
};

module.exports = {
    addConnection,
    isConnected
}