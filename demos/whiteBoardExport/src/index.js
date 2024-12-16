TCIC.SDK.instance
  .promiseState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Already_Start)
  .then(() => {
    /* 生成板书图片
    * https://doc.qcloudtiw.com/web/official/TEduBoard.html#addSnapshotMark
    */
    const teduBoard = TCIC.SDK.instance.getBoard();
    const TEduBoard = window.TEduBoard;
    teduBoard.on(TEduBoard.EVENT.TEB_ADDBOARD, () => {
      teduBoard.addSnapshotMark();
    });
    teduBoard.on(TEduBoard.EVENT.TEB_DELETEBOARD, () => {
      teduBoard.addSnapshotMark();
    });
    teduBoard.on(TEduBoard.EVENT.TEB_GOTOBOARD, () => {
      teduBoard.addSnapshotMark();
    });
  });
