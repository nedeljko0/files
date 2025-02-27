import { useParams, useNavigate } from "react-router-dom";
import { DocumentDetail } from "../components/document/DocumentDetail";

export function DocumentDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	if (!id) {
		return <div className="p-4 text-red-500">Document ID is required</div>;
	}

	const handleDelete = () => {
		// Navigate back to the folder view after deletion
		navigate(-1);
	};

	return (
		<div className="container mx-auto p-4">
			<DocumentDetail documentId={id} onDelete={handleDelete} />
		</div>
	);
}
