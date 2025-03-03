TCIC.SDK.instance
  .promiseState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Already_Start)
  .then(() => {
    TCIC.SDK.instance.showMessageBox('温馨提示', '点击返回小程序上一页', ['确定','取消'] , () => {
      window.wx.miniProgram.navigateBack({
        delta: 1
      });
    })
  });
