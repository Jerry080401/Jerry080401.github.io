---
title: HEXO_Deployment
date: 2024-05-15 15:22:23
tags: Jerry的HEXO分享
---

## 1.在GitHub建立新的repository
將資料庫命名為`username.github.io`,username記得改成自己的帳號喔。
![](repository.png)
像是這樣
## 2.將資料夾連到GitHub資料庫
在資料庫複製以下三行
```
git branch -M main
git remote add origin git@github.com:......
git push -u origin main
```
## 3.定義GitHub工作流程
輸入以下指令查詢Node,js版本號
```
node --version
```
開啟vscode
```
cd<HEXO所在的資料夾>
code .
```
