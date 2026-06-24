import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AddTaskModal from '@/components/AddTaskModal';
import TaskItem from '@/components/TaskItem';
import { supabase } from './lib/supabase';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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

  const addTask = async (taskTitle: string) => {
    const title = taskTitle.trim();

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

    await loadTasks();
    setIsAddModalVisible(false);
    Alert.alert('Task added', 'Your task was added successfully.');
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
    Alert.alert('Task deleted', 'Your task was deleted successfully.');
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      {tasks.map((item) => (
        <TaskItem
          key={item.id}
          item={item}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      ))}

      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => setIsAddModalVisible(true)}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={addTask}
      />
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
  floatingAddButton: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2E5BBA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 6,
  },
});
