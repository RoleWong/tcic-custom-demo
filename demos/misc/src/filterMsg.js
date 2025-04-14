// 整体控制
TCIC.SDK.instance.setState(TCIC.TMainState.Join_Quit_Tips, false); 

// 根据 userId精确控制
TCIC.SDK.instance.setMemberJoinExitRoomInfoFilter(function (msg) {
    console.log('filterMsg', msg);
    // return true 表示过滤掉进房消息
    return true;
});
