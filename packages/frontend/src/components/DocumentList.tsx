import { Link } from "@heroui/react"

export default function DocumentList() {
  // This would be replaced with actual data fetching logic
  const documents = [
    { id: 1, title: "Document 1", description: "Description 1" },
    { id: 2, title: "Document 2", description: "Description 2" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id} className="mb-4 p-4 border rounded">
            <Link href={`/document/${doc.id}`} className="text-xl text-blue-500 hover:underline">
              {doc.title}
            </Link>
            <p className="text-gray-600">{doc.description}</p>
          </li>
        ))}
      </ul>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">New Document</button>
    </div>
  )
}

