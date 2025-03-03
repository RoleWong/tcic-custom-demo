
TCIC.SDK.instance
.promiseState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Already_Start)
.then(() => {
  const teduBoard = TCIC.SDK.instance.getBoard();
  /* 生成板书图片
  * https://doc.qcloudtiw.com/web/official/TEduBoard.html#addSnapshotMark
  */
  TCIC.SDK.instance.setFeatureAvailable('WhiteBoardSnapShot', true);
  TCIC.SDK.instance.on(TCIC.TMainEvent.Before_Leave, () => {
    teduBoard.addSnapshotMark();
  });
  window.onbeforeunload = () => {
    teduBoard.addSnapshotMark();
  };
});
  