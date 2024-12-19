TCIC.SDK.instance
  .promiseState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Already_Start)
  .then(() => {
    // 如果是学生，隐藏他的添加白板，选择白板权限
    if (TCIC.SDK.instance.isStudent()) {
      // 是否可以添加白板
      TCIC.SDK.instance.setFeatureAvailable("WhiteBoardList", true);
      // 是否展示翻页按钮
      TCIC.SDK.instance.setFeatureAvailable("WhiteBoardPPT", false);
      // 是否可以使用滚轮翻页
      TCIC.SDK.instance.setFeatureAvailable("WhiteBoardPPT.WheelPaging", false);
    }
  });

// 设置定时器铃声
TCIC.SDK.instance.promiseState('TStateComponentLoaded', true).then(() => {
  const timeTool = TCIC.SDK.instance.getComponent('timer-tool-component').getVueInstance();
  timeTool.setRing('http://localhost:3000/ring.mp3'); // 设置铃声， 生产环境请用 https 的链接
  timeTool.ringDuration = 10000; // 10s
});
