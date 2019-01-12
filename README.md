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
