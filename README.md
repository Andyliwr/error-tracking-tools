# error-tracking-tools
小迪版错误跟踪工具

### query
```
{
  me { id, username }
  user(id: "2") {
    username
  }
  users {id, username}
  message(id: "1") {
    id,
    text,
    user {
      id,
      username
    }
  }
  messages {
    id,
    text,
    user {
      id,
      username
    }
  }
}
```

### mutation
```

```

### postgresql启动和停止
安装PostgreSQL
```
brew install postgresql
```
启动PostgreSQL
```
pg_ctl -D /usr/local/var/postgres start
```
登录PostgreSQL
```
psql
```
创建用户和表
```
➜  ~ psql
psql (11.1)
Type "help" for help.
andyliwr=# alter user postgres with password '123456';
ALTER ROLE
andyliwr=# create user test with password '123456';
CREATE ROLE
andyliwr=# drop database postgres;
DROP DATABASE
andyliwr=# create database test owner test;
CREATE DATABASE
andyliwr=# alter role test createdb;
ALTER ROLE
andyliwr=# \q
```
使用用户postgresql登录
```
psql -U postgres -d test
```
