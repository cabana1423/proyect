const express=require("express");
var router = express.Router();
const notification=require("../notification.js");

router.get("/one_user",function(req,res){
    var params =req.body;
    res.json("sending notification one user");
    const data={
        tokenId:"dgaXNSziPK8:APA91bH1CiMXFj83ypi-YvS_3hDs5Mh_H8ReaYsu_WxH_ooDw7_pRUj16Fo_RVDDOB69qT_9wfUP9rfSm_Qi9gZvto801oO7m1Cdd-CePfmfNe2-JaSuN2uKtBqo6hKB4fzbsvSMC4s7",
        titulo:"haber",
        mensaje:"adarle atomos"
    }
    notification.sendPushToOneUser(data);
});

router.get("/Topic",function(req,res){
    var params =req.body;
    res.send("sending notification to a topic");
    const data={
        topic:"test",
        titulo:params.title,
        mensaje:params.msg
    }
    notification.sendPushTotopic(data);
});

module.exports = router;
