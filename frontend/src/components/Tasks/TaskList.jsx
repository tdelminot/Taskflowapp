import TaskCard from './TaskCard';

export default function TaskList({ tasks, onUpdate }) {
    if (!tasks || tasks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#718096', background: 'white', borderRadius: '12px' }}>
                No tasks yet. Create your first task!
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
            ))}
        </div>
    );
}