# error-tracking-tools
小迪版错误跟踪工具

### 安装项目依赖
```
pip install flask-sqlalchemy
```

### 运行程序
在 Linux and Mac 下：
```
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run
```
在 Windows 下，使用 set 代替 export ：
```
set FLASK_APP=flaskr
set FLASK_ENV=development
flask run
```
在 Windows PowerShell 下，使用 $env: 代替 export ：
```
$env:FLASK_APP = "flaskr"
$env:FLASK_ENV = "development"
flask run
```
### 初始化数据库
```
flask init-db
```
