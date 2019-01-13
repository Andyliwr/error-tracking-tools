# error-tracking-tools
小迪版错误跟踪工具

[调试地址](http://localhost:4000/graphql)
[学习文档](https://www.robinwieruch.de/graphql-apollo-server-tutorial/)
[sequelize文档](https://github.com/demopark/sequelize-docs-Zh-CN/blob/76b940a8a6/querying.md)

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
mutation {
  createMessage(text: "") {
    id,
    text
  }
}
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

### 心得体会
1. models定义的是数据以什么样的格式存储到数据库中，schema定义的是客户端能查到怎样格式的数据，并非数据库中的所有字段客户端都能查到，比如password
2. validate的机制是graphql的一大优势，graphql会将数据库存储时发生的错误、用户主动抛出的错误、或者程序执行的错误都格式化成JSON格式返回给客户端，这就方便客户端对各种错误做出响应
3. schema中返回类型只支持一个值，如果返回的是多个值，需要重新定义一个type来包含这些值
4. 你可在resolve中通过对me的判断控制用户的权限，而可以使用resolver middleware --- graphql-resolvers
5. graphql的权限认证有三种，第一种是Authorization base resolver protect(判断用户是否已经登录)，另一种是Permission base resolver protect(判断用户是否是数据的创建者)，还有一种是Role base resolver protect(基于角色的权限判断)
6. Graphql的时间采用时间戳的形式展示，但是存入数据库的形式还是日期对象
7. Graphql中创建分页的方式有两种，第一种：offset/limit-based，offset表示从何处开始查找数据，limit表示此次查找最多查找多少个。这种方式有两个缺陷，一个是当offset越来越大的时候查找数据所需要的时间也会越来越多，其次是在查找数据的同时删除offset之前的数据，会使得查询的结果混乱。另一种实现分页的方式是cursor-based，区别只是将offset换成了列表元素的id，称之为cursor，我们可以使用列表元素的createdAt作为cursor
