import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FolderList } from "./components/FolderList";
import { DocumentList } from "./components/DocumentList";
import { DocumentDetailPage } from "./pages/DocumentDetailPage";
import { useParams } from "react-router-dom";
import { useFoldersQuery } from "./services/folderQueries";

function App() {
	return (
		<Router>
			<div className="flex">
				<div className="w-1/4 pr-4">
					<FolderList />
				</div>
				<div className="w-3/4">
					<Routes>
						<Route path="/folder/:folderId" element={<FolderDocumentsPage />} />
						<Route path="/document/:id" element={<DocumentDetailPage />} />
						<Route
							path="/"
							element={
								<div className="p-8 text-center text-gray-500">
									Select a folder to view documents
								</div>
							}
						/>
					</Routes>
				</div>
			</div>
		</Router>
	);
}

// Helper component to handle folder documents
function FolderDocumentsPage() {
	const { folderId } = useParams<{ folderId: string }>();
	const { data: folder } = useFoldersQuery(folderId || "");

	if (!folderId) {
		return <div className="p-4 text-red-500">Folder ID is required</div>;
	}

	return (
		<DocumentList
			folderId={folderId}
			folderName={folder?.name || "Loading..."}
		/>
	);
}

export default App;
