### 低代码课堂自定义 DEMO


- [学生白板权限控制](./demos/whiteBoardAuth)
- [自定义定时器铃声](./demos/whiteBoardAuth)
- [下课前 5 分钟弹窗提醒](./demos/endTimeModal)
- [小程序 webview 返回上一页](./demos/mp-navback)

### 本地调试

```
pnpm i

cd ./demos/SOME_DEMO

pnpm dev

```
在上课地址query 后面添加`&debugjs=http://localhost:3000/debug.js`，如果有 css, 再拼接`&debugcss=http://localhost:3000/debug.css`