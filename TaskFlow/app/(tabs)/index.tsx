import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';
import { supabase } from './lib/supabase';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setTasks(data ?? []);
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const addTask = async () => {
    const title = task.trim();

    if (!title) {
      return;
    }

    const { error } = await supabase.from('tasks').insert({
      title,
      completed: false,
    });

    if (error) {
      console.log(error);
      return;
    }

    setTask('');
    await loadTasks();
  };

  const toggleTask = async (item: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      console.log(error);
      return;
    }

    await loadTasks();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.log(error);
      return;
    }

    await loadTasks();
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <TaskForm task={task} setTask={setTask} onAdd={addTask} />

      {tasks.map((item) => (
        <TaskItem
          key={item.id}
          item={item}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      ))}
    </View>
  );
}

// headerStyles is kept separate from the rest of the screen's styles —
// the header is a distinct visual region (title bar) that's a natural
// candidate to later become its own component or shared layout.
const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2A44',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
});
