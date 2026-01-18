
import { AppRouter } from './router';
import { UserProvider } from '../shared/UserContext';

function App() {
    return (
        <UserProvider>
            <AppRouter />
        </UserProvider>
    );
}

export default App;
