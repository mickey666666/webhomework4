<template>
  <div class="todo-container">
    <h2>本周待办事项</h2>
    <div class="todo-list">
      <!-- 有待办时显示列表 -->
      <div 
        class="todo-item" 
        v-for="(item, index) in todoList" 
        :key="index"
        v-if="todoList.length > 0"
      >
        <span>{{ item }}</span>
        <button class="delete-btn" @click="deleteTodo(index)">删除</button>
      </div>
      <!-- 无待办时显示提示（和外观风格统一） -->
      <div class="empty-tip" v-else>
        已经没有待办事项啦～
      </div>
    </div>
    <div class="input-area">
      <input
        type="text"
        placeholder="请输入待办事项..."
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
      <button class="add-btn" @click="addTodo">添加</button>
    </div>
    <!-- 清空按钮：只有有待办时才显示 -->
    <button 
      class="clear-btn" 
      @click="clearAll" 
      v-if="todoList.length > 0"
    >
      清空所有
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 初始3条待办，避免空白
const todoList = ref(['去图书馆学习', '上羽毛球课', '会议室开会']);
const newTodo = ref('');

// 添加待办
const addTodo = () => {
  if (newTodo.value.trim()) {
    todoList.value.push(newTodo.value.trim());
    newTodo.value = '';
  }
};

// 删除单个待办
const deleteTodo = (index) => {
  todoList.value.splice(index, 1);
};

// 清空所有待办
const clearAll = () => {
  todoList.value = [];
};
</script>

<style scoped>
.todo-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.todo-list {
  margin-bottom: 20px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* 无待办提示：和待办项样式统一，不破坏外观 */
.empty-tip {
  text-align: center;
  padding: 30px 10px;
  background-color: #fff;
  border-radius: 4px;
  color: #666;
  font-size: 16px;
}

.input-area {
  display: flex;
  margin-bottom: 20px;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 2px solid #007bff;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.add-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.clear-btn {
  display: block;
  margin: 0 auto;
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>