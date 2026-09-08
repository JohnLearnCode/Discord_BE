# API Documentation

Base URL: `http://localhost:3000`

---

## Health

| Method | URL | Mô tả |
| ------ | --- | ------ |
| GET | http://localhost:3000/api/health | Kiểm tra server đang chạy |

---

## Auth

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| POST | http://localhost:3000/api/auth/register | Đăng ký tài khoản | Không |
| POST | http://localhost:3000/api/auth/login | Đăng nhập | Không |
| POST | http://localhost:3000/api/auth/refresh-token | Làm mới access token | Không |
| POST | http://localhost:3000/api/auth/change-password | Đổi mật khẩu | Bearer token |

### Request Body

**POST /api/auth/register**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**POST /api/auth/login**
```json
{
  "email": "string",
  "password": "string"
}
```

**POST /api/auth/refresh-token**
```json
{
  "refreshToken": "string"
}
```

**POST /api/auth/change-password**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

---

## Users

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/users | Lấy danh sách users | Không |
| GET | http://localhost:3000/api/users/:id | Lấy user theo id | Không |
| POST | http://localhost:3000/api/users | Tạo user mới | Không |
| PATCH | http://localhost:3000/api/users/:id | Cập nhật user | Không |
| DELETE | http://localhost:3000/api/users/:id | Xóa user | Không |

### Request Body

**POST /api/users**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "avatar": "string (optional)"
}
```

**PATCH /api/users/:id**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "avatar": "string (optional)"
}
```

---

## Servers

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/servers | Lấy danh sách servers | Không |
| GET | http://localhost:3000/api/servers/:id | Lấy server theo id | Không |
| POST | http://localhost:3000/api/servers | Tạo server mới | Không |
| PATCH | http://localhost:3000/api/servers/:id | Cập nhật server | Không |
| DELETE | http://localhost:3000/api/servers/:id | Xóa server | Không |

### Request Body

**POST /api/servers**
```json
{
  "name": "string",
  "ownerId": "string (ObjectId)",
  "iconUrl": "string (optional)"
}
```

**PATCH /api/servers/:id**
```json
{
  "name": "string (optional)",
  "iconUrl": "string (optional)",
  "memberIds": ["string (ObjectId)"],
  "channelIds": ["string (ObjectId)"],
  "catalogIds": ["string (ObjectId)"]
}
```

---

## Catalogs

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/catalogs | Lấy danh sách catalogs | Không |
| GET | http://localhost:3000/api/catalogs/:id | Lấy catalog theo id | Không |
| POST | http://localhost:3000/api/catalogs | Tạo catalog mới | Không |
| PATCH | http://localhost:3000/api/catalogs/:id | Cập nhật catalog | Không |
| DELETE | http://localhost:3000/api/catalogs/:id | Xóa catalog | Không |

### Request Body

**POST /api/catalogs**
```json
{
  "title": "string",
  "channelIds": ["string (ObjectId) (optional)"]
}
```

**PATCH /api/catalogs/:id**
```json
{
  "title": "string (optional)",
  "channelIds": ["string (ObjectId) (optional)"]
}
```

---

## Text Channels

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/text-channels | Lấy danh sách text channels | Không |
| GET | http://localhost:3000/api/text-channels/:id | Lấy text channel theo id | Không |
| POST | http://localhost:3000/api/text-channels | Tạo text channel mới | Không |
| PATCH | http://localhost:3000/api/text-channels/:id | Cập nhật text channel | Không |
| DELETE | http://localhost:3000/api/text-channels/:id | Xóa text channel | Không |

### Request Body

**POST /api/text-channels**
```json
{
  "title": "string"
}
```

**PATCH /api/text-channels/:id**
```json
{
  "title": "string (optional)"
}
```

---

## Voice Channels

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/voice-channels | Lấy danh sách voice channels | Không |
| GET | http://localhost:3000/api/voice-channels/:id | Lấy voice channel theo id | Không |
| POST | http://localhost:3000/api/voice-channels | Tạo voice channel mới | Không |
| PATCH | http://localhost:3000/api/voice-channels/:id | Cập nhật voice channel | Không |
| DELETE | http://localhost:3000/api/voice-channels/:id | Xóa voice channel | Không |

### Request Body

**POST /api/voice-channels**
```json
{
  "title": "string"
}
```

**PATCH /api/voice-channels/:id**
```json
{
  "title": "string (optional)"
}
```

---

## Messages P2P

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/messages-p2p | Lấy tất cả tin nhắn P2P | Không |
| GET | http://localhost:3000/api/messages-p2p/conversation?userId1=&userId2= | Lấy cuộc trò chuyện giữa 2 user | Không |
| GET | http://localhost:3000/api/messages-p2p/:id | Lấy tin nhắn theo id | Không |
| POST | http://localhost:3000/api/messages-p2p | Gửi tin nhắn P2P mới | Không |
| PATCH | http://localhost:3000/api/messages-p2p/:id | Cập nhật tin nhắn | Không |
| DELETE | http://localhost:3000/api/messages-p2p/:id | Xóa tin nhắn | Không |

### Request Body

**POST /api/messages-p2p**
```json
{
  "senderId": "string (ObjectId)",
  "receiverId": "string (ObjectId)",
  "message": "string (optional)",
  "imageMessage": "string (optional, url ảnh)"
}
```

**PATCH /api/messages-p2p/:id**
```json
{
  "message": "string (optional)",
  "imageMessage": "string (optional, url ảnh)"
}
```

---

## Messages Group

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/messages-group | Lấy tất cả tin nhắn group | Không |
| GET | http://localhost:3000/api/messages-group/channel/:channelId | Lấy tin nhắn theo channel | Không |
| GET | http://localhost:3000/api/messages-group/:id | Lấy tin nhắn theo id | Không |
| POST | http://localhost:3000/api/messages-group | Gửi tin nhắn group mới | Không |
| PATCH | http://localhost:3000/api/messages-group/:id | Cập nhật tin nhắn | Không |
| DELETE | http://localhost:3000/api/messages-group/:id | Xóa tin nhắn | Không |

### Request Body

**POST /api/messages-group**
```json
{
  "senderId": "string (ObjectId)",
  "channelId": "string (ObjectId)",
  "message": "string (optional)",
  "imageMessage": "string (optional, url ảnh)"
}
```

**PATCH /api/messages-group/:id**
```json
{
  "message": "string (optional)",
  "imageMessage": "string (optional, url ảnh)"
}
```

---

## Friendships

| Method | URL | Mô tả | Auth |
| ------ | --- | ------ | ---- |
| GET | http://localhost:3000/api/friendships | Lấy tất cả friendships | Không |
| GET | http://localhost:3000/api/friendships/user/:userId | Lấy friendships của một user | Không |
| GET | http://localhost:3000/api/friendships/:id | Lấy friendship theo id | Không |
| POST | http://localhost:3000/api/friendships | Gửi lời mời kết bạn | Không |
| PATCH | http://localhost:3000/api/friendships/:id | Chấp nhận / từ chối lời mời | Không |
| DELETE | http://localhost:3000/api/friendships/:id | Xóa friendship | Không |

### Request Body

**POST /api/friendships**
```json
{
  "senderId": "string (ObjectId)",
  "receiverId": "string (ObjectId)"
}
```

**PATCH /api/friendships/:id**
```json
{
  "status": "pending | accepted | rejected"
}
```
