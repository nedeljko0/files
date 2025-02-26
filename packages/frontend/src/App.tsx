import { FolderList } from "./components/FolderList";

function App() {
	return (
		<div className="flex">
			<div className="w-1/4 pr-4">
				<FolderList />
			</div>
			<div className="w-3/4"></div>
		</div>
	);
}

export default App;
