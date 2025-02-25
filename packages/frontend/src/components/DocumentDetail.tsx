
import type React from "react"

import { useState } from "react"

export default function DocumentDetail({ id }: { id: string }) {
  const [document, setDocument] = useState({
    id,
    title: "Sample Document",
    description: "This is a sample document",
    versions: [
      { id: 1, filename: "document_v1.pdf", uploadedAt: "2023-05-20T12:00:00Z" },
      { id: 2, filename: "document_v2.pdf", uploadedAt: "2023-05-21T14:30:00Z" },
    ],
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const filename = `${id}_${file.name}`
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const blob = await response.json()
      console.log("File uploaded:", blob.url)

      // Update the document state with the new version
      setDocument((prevDoc) => ({
        ...prevDoc,
        versions: [{ id: Date.now(), filename: file.name, uploadedAt: new Date().toISOString() }, ...prevDoc.versions],
      }))
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      <p className="text-gray-600 mb-4">{document.description}</p>

      <h2 className="text-2xl font-bold mb-2">Versions</h2>
      <ul className="mb-4">
        {document.versions.map((version, index) => (
          <li key={version.id} className="mb-2">
            <span className={index === 0 ? "font-bold" : ""}>
              {version.filename} (Uploaded: {new Date(version.uploadedAt).toLocaleString()})
            </span>
            <button className="ml-2 text-blue-500 hover:underline">Download</button>
          </li>
        ))}
      </ul>

      <div>
        <h3 className="text-xl font-bold mb-2">Upload New Version</h3>
        <input type="file" onChange={handleFileUpload} className="mb-2" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </div>
    </div>
  )
}

