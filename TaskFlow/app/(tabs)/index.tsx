import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
    await loadTasks();
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

    loadTasks();
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {tasks.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.taskRow}
          activeOpacity={0.7}
          onPress={() => toggleTask(item)}
          onLongPress={() => deleteTask(item.id)}>
          <MaterialIcons
            name={item.completed ? 'check-box' : 'check-box-outline-blank'}
            size={20}
            color="#5A6472"
          />
          <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
            {item.title}
          </Text>
        </TouchableOpacity>
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
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 15,
  },
  completedTaskText: {
    color: '#7A8492',
    textDecorationLine: 'line-through',
  },
});
