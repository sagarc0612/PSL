const connectionRepo = require("./repo");

const addConnection = async (req, res) => {
    try {

        const { to, who } = req.body;

        await isConnected(who, to);

        const result = connectionRepo.addConnections({ who, to });

        res.send(200, {
            success: true,
            result,
            message: "Add Connection Successfull"
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

const isConnected = async (who, to) => {
    try {
        const checkConnection = await connectionRepo.findConnectionCountByUsers(who, to);
        if (checkConnection > 0) {
            res.send({ message :"Already connected" });
        }
        else {
            res.send(200,{checkConnection, message :"Already connected" });
        }
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
};

module.exports = {
    addConnection,
    isConnected
}