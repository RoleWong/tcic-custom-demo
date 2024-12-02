console.log("whiteBoardAuth: debugjs");
TCIC.SDK.instance
  .promiseState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Already_Start)
  .then(() => {
    console.log("whiteBoardAuth: class already started");
    // 如果是学生，隐藏他的添加白板，选择白板权限
    if (TCIC.SDK.instance.isStudent()) {
      TCIC.SDK.instance.setFeatureAvailable("WhiteBoardList", false);
      TCIC.SDK.instance.setFeatureAvailable("WhiteBoardPPT", false);
    }
  });
