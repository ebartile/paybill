---
id: architecture
title: Architecture
---
# Introduction

Paybill has two main components: **Paybill Server** and **Paybill Client**.

### 1. Paybill Server  

Paybill server is a Node.js API application. Server is responsible for authentication, authorization, persisting application definitions, running queries, storing data source credentials securely and more. 

**Dependencies:**
- **PostgreSQL** - Paybill server persists data to a postgres database. 
- **SQLite** - Paybill server persists data to a sqlite database. 
    
### 2. Paybill Client  

Paybill client is a ReactJS and Alibaba Lowcode Engine application. Client is responsible for visually editing the applications, building & editing queries, rendering applications, executing events and their trigger, etc.

## Requirements

1. **Node version 18.18.2**
2. **npm version 9.8.1**
2. **pnpm version 10.13.1**