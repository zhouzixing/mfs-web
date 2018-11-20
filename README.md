<h1 align="center">mfs-web(微联管理后台)</h1>

<div align="center">

中台前端构架。
![输入图片说明](https://images.gitee.com/uploads/images/2018/1119/104226_e4e191e5_421395.jpeg "1.jpg")
![输入图片说明](https://images.gitee.com/uploads/images/2018/1119/104245_2037ad77_421395.png "2.png")

</div>


## 特性

- :gem: **优雅美观**：基于 Ant Design 体系精心设计
- :triangular_ruler: **常见设计模式**：提炼自中后台应用的典型页面和场景
- :rocket: **最新技术栈**：使用 React/umi/dva/antd 等前端前沿技术开发
- :iphone: **响应式**：针对不同屏幕大小设计
- :art: **主题**：可配置的主题满足多样化的品牌诉求
- :globe_with_meridians: **国际化**：内建业界通用的国际化方案
- :gear: **最佳实践**：良好的工程实践助您持续产出高质量代码
- :1234: **Mock 数据**：实用的本地数据调试方案
- :white_check_mark: **UI 测试**：自动化测试保障前端产品质量

## 模板

```
- 运营管理
  - 运营首页
  - 设备管理
  - 队伍管理
  - 权限管理
  - 用户反馈
- 结果
  - 成功页
  - 失败页
- 异常
  - 403 无权限
  - 404 找不到
  - 500 服务器出错
- 帐户
  - 登录
  - 注册
  - 注册成功
```

## 使用

### 使用命令行
```bash
$ git clone https://gitee.com/azfn-yf-mfs/mfs-web.git --depth=1
$ cd mfs-web
$ npm install
$ npm start         # 访问 http://localhost:8000
```

### 使用 docker

```bash
// dev 
$ npm run docker:dev

// build 
$ npm run docker:build


// production dev 
$ npm run docker-prod:dev

// production build 
$ npm run docker-prod:build
```

更多信息请参考 [使用文档](http://pro.ant.design/docs/getting-started)。

## 支持环境

现代浏览器及 IE11。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 :ku_sunny:：

- 通过 [Issue](https://gitee.com/azfn-yf-mfs/mfs-web/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://gitee.com/azfn-yf-mfs/mfs-web/pulls) 改进 Pro 的代码。
